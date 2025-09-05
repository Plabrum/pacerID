from pathlib import Path

import tensorflow as tf

# model_dir and candidate names
model_dir = Path("api/classifier/models")
possible_names = ["final_model_20250903_225035"]

# Find the first matching file with .keras suffix
model_path = None
for name in possible_names:
    candidate = model_dir / f"{name}.keras"
    if candidate.exists():
        model_path = candidate
        break

if not model_path:
    raise FileNotFoundError(
        f"No .keras model found in {model_dir} with names {possible_names}"
    )

print(f"Loading model from: {model_path}")
model = tf.keras.models.load_model(model_path)

# Convert to TFLite
converter = tf.lite.TFLiteConverter.from_keras_model(model)
# Optional: enable basic optimization (reduces size and speeds up inference)
converter.optimizations = [tf.lite.Optimize.DEFAULT]

tflite_model = converter.convert()

# Write output next to the .keras file
out_path = model_path.with_suffix(".tflite")
out_path.write_bytes(tflite_model)

print(
    f"✅ Wrote TFLite model to: {out_path} (size: {out_path.stat().st_size / 1e6:.2f} MB)"
)
