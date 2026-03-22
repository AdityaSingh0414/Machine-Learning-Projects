from flask import Flask, render_template, request, jsonify
import os
import sys

# Add project root to path for imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from src.predict import predict_heart_disease

import pandas as pd
import numpy as np

app = Flask(__name__)

# Base directory for finding models/ assets
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

@app.route('/')
def home():
    """Renders the landing page."""
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    """Handles heart disease prediction requests."""
    try:
        data = request.json
        if not data:
            return jsonify({"error": "No data provided"}), 400
        result = predict_heart_disease(data, PROJECT_ROOT)
        if "error" in result:
            return jsonify(result), 500
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/analytics-data')
def analytics_data():
    """Provides summary statistics for the dashboard and analytics."""
    try:
        df = pd.read_csv(os.path.join(PROJECT_ROOT, 'data', 'raw', 'heart.csv'))
        
        # Summary Stats
        stats = {
            "total_samples": int(len(df)),
            "mean_age": float(df['Age'].mean()),
            "high_risk_count": int(len(df[df['HeartDisease'] == 1])),
            "avg_max_hr": float(df['MaxHR'].mean()),
            # Data for distributions
            "age_distribution": df['Age'].tolist(),
            "cholesterol_by_risk": {
                "low": df[df['HeartDisease'] == 0]['Cholesterol'].tolist(),
                "high": df[df['HeartDisease'] == 1]['Cholesterol'].tolist()
            },
            # Correlation matrix (numeric only)
            "correlation_matrix": df.select_dtypes(include=[np.number]).corr().to_dict()
        }
        return jsonify(stats)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/raw-data')
def raw_data():
    """Provides the full dataset for the data table."""
    try:
        df = pd.read_csv(os.path.join(PROJECT_ROOT, 'data', 'raw', 'heart.csv'))
        # Return first 100 rows for performance in table
        return jsonify(df.head(100).to_dict(orient='records'))
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Running on port 5000 by default
    app.run(debug=True, port=5000)
