# api/classifier/pacemaker_classifier.py
import io
from pathlib import Path
from typing import List

import numpy as np
from PIL import Image
from tflite_runtime.interpreter import Interpreter

from api.types import ClassScore


# ---- Load the newest .tflite once (warm start) ----
def _find_tflite_model() -> Path:
    model_dir = Path("api/classifier/models")
    # prefer your explicit name if present
    preferred = model_dir / "final_model_20250903_225035.tflite"
    if preferred.exists():
        return preferred

    candidates = sorted(model_dir.glob("*.tflite"))
    if not candidates:
        raise FileNotFoundError(f"No .tflite model found in {model_dir}")
    return candidates[-1]


def _load_interpreter() -> Interpreter:
    model_path = _find_tflite_model()
    print(f"Loading TFLite model from: {model_path}")
    interp = Interpreter(model_path=str(model_path))
    interp.allocate_tensors()
    return interp


_INTERP = _load_interpreter()

_IN = _INTERP.get_input_details()[0]
_OUT = _INTERP.get_output_details()[0]

_IN_IDX = _IN["index"]
_OUT_IDX = _OUT["index"]

_IN_DTYPE = _IN["dtype"]
_OUT_DTYPE = _OUT["dtype"]

_IN_SCALE, _IN_ZP = _IN.get("quantization", (0.0, 0))
_OUT_SCALE, _OUT_ZP = _OUT.get("quantization", (0.0, 0))


def _mobilenet_v2_preprocess(x: np.ndarray) -> np.ndarray:
    # maps RGB [0,255] -> [-1,1], like keras.applications.mobilenet_v2.preprocess_input
    return (x / 127.5) - 1.0


def _quantize_if_needed(x_float: np.ndarray) -> np.ndarray:
    # If the model expects float32, just return float32
    if _IN_DTYPE == np.float32 or _IN_SCALE == 0.0:
        return x_float.astype(np.float32)

    # Otherwise: q = x/scale + zero_point
    q = np.round(x_float / _IN_SCALE + _IN_ZP)
    info = np.iinfo(_IN_DTYPE) if np.issubdtype(_IN_DTYPE, np.integer) else None
    if info is not None:
        q = np.clip(q, info.min, info.max)
        q = q.astype(_IN_DTYPE)
    else:
        q = q.astype(_IN_DTYPE)
    return q


def _dequantize_if_needed(y_raw: np.ndarray) -> np.ndarray:
    if _OUT_DTYPE == np.float32 or _OUT_SCALE == 0.0:
        return y_raw.astype(np.float32)
    return (y_raw.astype(np.float32) - _OUT_ZP) * _OUT_SCALE


class PacemakerClassifier:
    """Classifier using a pre-loaded TFLite interpreter."""

    @classmethod
    def classify(
        cls, img_bytes: bytes, threshold: float = 0.01
    ) -> List[ClassScore]:
        # Load & preprocess image
        img = Image.open(io.BytesIO(img_bytes))
        if img.mode != "RGB":
            img = img.convert("RGB")
        img = img.resize((224, 224))

        x = np.asarray(img, dtype=np.float32)  # [H,W,C], 0..255
        x = _mobilenet_v2_preprocess(x)  # [-1,1]
        x = np.expand_dims(x, 0)  # [1,224,224,3]

        x_in = _quantize_if_needed(x)

        # Inference
        _INTERP.set_tensor(_IN_IDX, x_in)
        _INTERP.invoke()
        y = _INTERP.get_tensor(_OUT_IDX)[0]

        # Postprocess
        preds = _dequantize_if_needed(y)  # float32 scores
        results = [
            ClassScore(class_id=int(i), score=float(s))
            for i, s in enumerate(preds)
            if s >= threshold
        ]
        results.sort(key=lambda z: z.score, reverse=True)
        return results
