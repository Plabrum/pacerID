"""
Pacemaker classifier service optimized for AWS Lambda.
Loads model on import to take advantage of Lambda container reuse.
"""

import io
from pathlib import Path
from typing import List

import numpy as np
from PIL import Image
from tensorflow import keras

from api.types import ClassScore


# Load model at module import time for Lambda optimization
def _load_model():
    """Load the trained model."""
    model_dir = Path("api/classifier/models")
    possible_names = [
        "final_model_20250903_225035.keras",
        "best_model_20250903_225035.keras",
        "best_model_finetuned_20250903_225035.keras",
    ]

    model_path = None
    for name in possible_names:
        path = model_dir / name
        if path.exists():
            model_path = path
            break

    if model_path is None:
        # Find any .keras file in the directory
        keras_files = sorted(model_dir.glob("*.keras"))
        if keras_files:
            model_path = keras_files[-1]  # Use most recent
        else:
            raise FileNotFoundError(f"No model found in {model_dir}")

    print(f"Loading model from: {model_path}")
    return keras.models.load_model(model_path)


# Load model once at import time
_MODEL = _load_model()


class PacemakerClassifier:
    """Static classifier using pre-loaded model for Lambda efficiency."""

    @classmethod
    def classify(
        cls, img_bytes: bytes, threshold: float = 0.01
    ) -> List[ClassScore]:
        """
        Classify a pacemaker image.

        Args:
            img_bytes: Raw image bytes
            threshold: Minimum confidence score to include (default 0.01 = 1%)

        Returns:
            List of ClassScore objects sorted by confidence
        """
        # Preprocess image
        img = Image.open(io.BytesIO(img_bytes))

        # Convert to RGB if needed
        if img.mode != "RGB":
            img = img.convert("RGB")

        # Resize to 224x224
        img = img.resize((224, 224))

        # Convert to array and add batch dimension
        img_array = np.array(img, dtype=np.float32)
        img_array = np.expand_dims(img_array, axis=0)

        # Apply MobileNetV2 preprocessing
        img_array = keras.applications.mobilenet_v2.preprocess_input(img_array)

        # Get predictions using the pre-loaded model
        predictions = _MODEL.predict(img_array, verbose=0)[0]

        # Create ClassScore objects for predictions above threshold
        results = []
        for idx, score in enumerate(predictions):
            if score >= threshold:
                results.append(
                    ClassScore(class_id=int(idx), score=float(score))
                )

        # Sort by score descending
        results.sort(key=lambda x: x.score, reverse=True)

        return results
