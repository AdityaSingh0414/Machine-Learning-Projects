import os
import sys

# Add the project root to sys.path to allow absolute imports if needed
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.utils import load_model, load_scaler, load_columns, get_asset_paths
from src.data_preprocessing import preprocess_features

def predict_heart_disease(input_data, base_dir):
    """
    Main inference function.
    Args:
        input_data (dict): Dictionary of feature values.
        base_dir (str): Project root directory.
    Returns:
        dict: Prediction results including class and probability.
    """
    # Get asset paths
    paths = get_asset_paths(base_dir)
    
    # Load assets
    try:
        model = load_model(paths['model'])
        scaler = load_scaler(paths['scaler'])
        expected_columns = load_columns(paths['columns'])
    except Exception as e:
        return {"error": f"Failed to load models: {str(e)}"}
    
    # Preprocess input
    try:
        df_processed = preprocess_features(input_data, expected_columns)
        
        # Scale numerical features
        # Note: The scaler was trained on specific columns. 
        # We must ensure we only scale what's expected.
        features_scaled = scaler.transform(df_processed)
        
        # Predict
        prediction = model.predict(features_scaled)[0]
        probability = model.predict_proba(features_scaled)[0][1]
        
        return {
            "prediction": int(prediction),
            "probability": float(probability),
            "risk_level": "High" if prediction == 1 else "Low"
        }
    except Exception as e:
        return {"error": f"Prediction failed: {str(e)}"}

if __name__ == "__main__":
    # Example usage for testing
    test_input = {
        'Age': 40, 'Sex': 'M', 'ChestPainType': 'ATA', 'RestingBP': 140,
        'Cholesterol': 289, 'FastingBS': 0, 'RestingECG': 'Normal',
        'MaxHR': 172, 'ExerciseAngina': 'N', 'Oldpeak': 0.0, 'ST_Slope': 'Up'
    }
    project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    print(predict_heart_disease(test_input, project_root))
