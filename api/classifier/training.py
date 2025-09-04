import argparse
import datetime
import json
from pathlib import Path

import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers


def parse_arguments():
    """Parse command line arguments."""
    parser = argparse.ArgumentParser(description="Train pacemaker classifier")
    parser.add_argument(
        "--input",
        type=str,
        default="api/classifier/datasets/kaggle",
        help="Path to dataset directory containing Train/ and Test/ folders",
    )
    parser.add_argument(
        "--output",
        type=str,
        default="api/classifier/models",
        help="Path to save trained models",
    )
    parser.add_argument(
        "--epochs", type=int, default=30, help="Number of training epochs"
    )
    parser.add_argument(
        "--batch-size", type=int, default=16, help="Batch size for training"
    )
    parser.add_argument(
        "--learning-rate",
        type=float,
        default=0.0005,
        help="Initial learning rate",
    )
    return parser.parse_args()


def load_data(data_dir, batch_size=16, img_size=(224, 224)):
    """Load and prepare datasets from directory."""
    data_path = Path(data_dir)

    # Check if Train/Test subdirectories exist
    if (data_path / "Train").exists():
        train_dir = data_path / "Train"
        test_dir = data_path / "Test"
    else:
        # Assume the provided path IS the training directory
        train_dir = data_path
        test_dir = data_path  # Will use validation split for testing

    print(f"Loading data from: {train_dir}")

    # Create training dataset with validation split
    train_ds = keras.utils.image_dataset_from_directory(
        train_dir,
        validation_split=0.2,
        subset="training",
        seed=42,
        image_size=img_size,
        batch_size=batch_size,
        label_mode="categorical",
    )

    val_ds = keras.utils.image_dataset_from_directory(
        train_dir,
        validation_split=0.2,
        subset="validation",
        seed=42,
        image_size=img_size,
        batch_size=batch_size,
        label_mode="categorical",
    )

    # Get class names and count
    class_names = train_ds.class_names
    num_classes = len(class_names)

    print(
        f"Found {num_classes} classes: {class_names[:5]}{'...' if num_classes > 5 else ''}"
    )

    # Optimize performance
    AUTOTUNE = tf.data.AUTOTUNE
    train_ds = train_ds.cache().prefetch(buffer_size=AUTOTUNE)
    val_ds = val_ds.cache().prefetch(buffer_size=AUTOTUNE)

    return train_ds, val_ds, class_names, num_classes


def create_model(num_classes, input_shape=(224, 224, 3)):
    """Create a simple transfer learning model using MobileNetV2."""
    # Load pre-trained MobileNetV2
    base_model = keras.applications.MobileNetV2(
        input_shape=input_shape,
        include_top=False,
        weights="imagenet",
        pooling="avg",
    )

    # Freeze base model
    base_model.trainable = False

    # Create model
    inputs = keras.Input(shape=input_shape)

    # Preprocess input for MobileNetV2
    x = keras.applications.mobilenet_v2.preprocess_input(inputs)

    # Pass through base model
    x = base_model(x, training=False)

    # Add classification head
    x = layers.Dropout(0.5)(x)
    x = layers.Dense(128, activation="relu")(x)
    x = layers.Dropout(0.5)(x)
    outputs = layers.Dense(num_classes, activation="softmax")(x)

    model = keras.Model(inputs, outputs)

    return model, base_model


def add_augmentation(train_ds):
    """Add data augmentation to training dataset."""
    augmentation = keras.Sequential(
        [
            layers.RandomFlip("horizontal"),
            layers.RandomRotation(0.15),
            layers.RandomZoom(0.15),
            layers.RandomContrast(0.15),
        ]
    )

    train_ds = train_ds.map(
        lambda x, y: (augmentation(x, training=True), y),
        num_parallel_calls=tf.data.AUTOTUNE,
    )

    return train_ds


def train_model(model, train_ds, val_ds, epochs, learning_rate, output_dir):
    """Train the model with callbacks."""
    # Create output directory
    output_path = Path(output_dir)
    output_path.mkdir(parents=True, exist_ok=True)

    # Generate timestamp for file names
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")

    # Compile model
    model.compile(
        optimizer=keras.optimizers.Adam(learning_rate=learning_rate),
        loss="categorical_crossentropy",
        metrics=["accuracy"],
    )

    # Setup callbacks
    callbacks = [
        keras.callbacks.ModelCheckpoint(
            output_path / f"best_model_{timestamp}.keras",
            monitor="val_accuracy",
            save_best_only=True,
            verbose=1,
        ),
        keras.callbacks.EarlyStopping(
            monitor="val_accuracy",
            patience=10,
            restore_best_weights=True,
            verbose=1,
        ),
        keras.callbacks.ReduceLROnPlateau(
            monitor="val_loss", factor=0.5, patience=5, min_lr=1e-6, verbose=1
        ),
        keras.callbacks.CSVLogger(
            output_path / f"training_log_{timestamp}.csv"
        ),
    ]

    # Train model
    print("\nStarting training...")
    history = model.fit(
        train_ds,
        validation_data=val_ds,
        epochs=epochs,
        callbacks=callbacks,
        verbose=1,
    )

    return history, timestamp


def fine_tune_model(
    model, base_model, train_ds, val_ds, epochs, output_dir, timestamp
):
    """Fine-tune the model by unfreezing top layers."""
    print("\nStarting fine-tuning phase...")

    # Unfreeze the top layers of base model
    base_model.trainable = True

    # Freeze all but the last 30 layers
    for layer in base_model.layers[:-30]:
        layer.trainable = False

    # Recompile with lower learning rate
    model.compile(
        optimizer=keras.optimizers.Adam(learning_rate=1e-5),
        loss="categorical_crossentropy",
        metrics=["accuracy"],
    )

    output_path = Path(output_dir)

    # Continue training
    callbacks = [
        keras.callbacks.ModelCheckpoint(
            output_path / f"best_model_finetuned_{timestamp}.keras",
            monitor="val_accuracy",
            save_best_only=True,
            verbose=1,
        ),
        keras.callbacks.EarlyStopping(
            monitor="val_accuracy",
            patience=5,
            restore_best_weights=True,
            verbose=1,
        ),
        keras.callbacks.CSVLogger(
            output_path / f"finetuning_log_{timestamp}.csv"
        ),
    ]

    history_ft = model.fit(
        train_ds,
        validation_data=val_ds,
        epochs=epochs // 3,  # Fine-tune for 1/3 of original epochs
        callbacks=callbacks,
        verbose=1,
    )

    return history_ft


def save_results(
    model, class_names, history, history_ft, output_dir, timestamp
):
    """Save final model and training results."""
    output_path = Path(output_dir)

    # Save final model
    final_path = output_path / f"final_model_{timestamp}.keras"
    model.save(final_path)
    print(f"\nFinal model saved to: {final_path}")

    # Save class names
    class_path = output_path / f"classes_{timestamp}.json"
    with open(class_path, "w") as f:
        json.dump(
            {
                "classes": class_names,
                "num_classes": len(class_names),
                "class_to_idx": {name: i for i, name in enumerate(class_names)},
                "idx_to_class": {i: name for i, name in enumerate(class_names)},
            },
            f,
            indent=2,
        )
    print(f"Class names saved to: {class_path}")

    # Calculate best accuracy
    all_val_acc = history.history.get("val_accuracy", [])
    if history_ft:
        all_val_acc.extend(history_ft.history.get("val_accuracy", []))
    best_accuracy = max(all_val_acc) if all_val_acc else 0

    # Save summary
    summary_path = output_path / f"summary_{timestamp}.txt"
    with open(summary_path, "w") as f:
        f.write(f"Training Summary\n")
        f.write(f"================\n")
        f.write(f"Timestamp: {timestamp}\n")
        f.write(f"Number of classes: {len(class_names)}\n")
        f.write(f"Best validation accuracy: {best_accuracy:.4f}\n")
        f.write(f"Final model: final_model_{timestamp}.keras\n")
    print(f"Summary saved to: {summary_path}")

    return best_accuracy


def main():
    """Main training pipeline."""
    # Parse arguments
    args = parse_arguments()

    # Check device being used
    print("\n" + "=" * 50)
    print("Device Configuration")
    print("=" * 50)
    if tf.config.list_physical_devices("GPU"):
        print(f"Using GPU: {tf.config.list_physical_devices('GPU')}")
    else:
        print("Using CPU (no GPU detected)")
        print("For M2 Mac acceleration, ensure you have:")
        print("  1. tensorflow-macos (pip install tensorflow-macos)")
        print("  2. tensorflow-metal (pip install tensorflow-metal)")
    print("=" * 50)

    print("=" * 50)
    print("Pacemaker Classifier Training")
    print("=" * 50)
    print(f"Input directory: {args.input}")
    print(f"Output directory: {args.output}")
    print(f"Epochs: {args.epochs}")
    print(f"Batch size: {args.batch_size}")
    print(f"Learning rate: {args.learning_rate}")
    print("=" * 50)

    # Load data
    print("\n1. Loading data...")
    train_ds, val_ds, class_names, num_classes = load_data(
        args.input, batch_size=args.batch_size
    )

    # Add augmentation
    print("\n2. Adding data augmentation...")
    train_ds = add_augmentation(train_ds)

    # Create model
    print("\n3. Creating model...")
    model, base_model = create_model(num_classes)
    print(f"Model created with {model.count_params():,} parameters")

    # Initial training
    print("\n4. Training model...")
    history, timestamp = train_model(
        model,
        train_ds,
        val_ds,
        epochs=args.epochs,
        learning_rate=args.learning_rate,
        output_dir=args.output,
    )

    # Fine-tuning
    print("\n5. Fine-tuning model...")
    history_ft = fine_tune_model(
        model,
        base_model,
        train_ds,
        val_ds,
        epochs=args.epochs,
        output_dir=args.output,
        timestamp=timestamp,
    )

    # Save results
    print("\n6. Saving results...")
    best_accuracy = save_results(
        model,
        class_names,
        history,
        history_ft,
        output_dir=args.output,
        timestamp=timestamp,
    )

    print("\n" + "=" * 50)
    print("Training Complete!")
    print(f"Best validation accuracy: {best_accuracy:.2%}")
    print(f"All files saved to: {args.output}")
    print("=" * 50)


if __name__ == "__main__":
    main()
