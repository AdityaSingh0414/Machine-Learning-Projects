import joblib
import os

def load_model(model_path):
    """Loads a trained model from a pickle file."""
    return joblib.load(model_path)

def load_scaler(scaler_path):
    """Loads a fitted scaler from a pickle file."""
    return joblib.load(scaler_path)

def load_columns(columns_path):
    """Loads the expected feature columns from a pickle file."""
    return joblib.load(columns_path)

def get_asset_paths(base_dir):
    """Returns absolute paths for all model assets."""
    return {
        'model': os.path.join(base_dir, 'models', 'heart_model.pkl'),
        'scaler': os.path.join(base_dir, 'models', 'scaler.pkl'),
        'columns': os.path.join(base_dir, 'models', 'columns.pkl')
    }
