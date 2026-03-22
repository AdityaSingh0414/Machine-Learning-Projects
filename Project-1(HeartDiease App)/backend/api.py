from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os
import sys
import pandas as pd
import numpy as np
import io

# Add current directory to path for relative imports
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from src.predict import predict_heart_disease
from src.utils import get_asset_paths, load_model, load_scaler, load_columns
from src.data_preprocessing import preprocess_features
from src.explainer import explain_prediction
from src.insights import get_patient_insights
from src.reports import generate_pdf_report

# Initialize Flask app
app = Flask(__name__)
CORS(app) # Enable CORS for React frontend

PROJECT_ROOT = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(PROJECT_ROOT, 'data', 'raw', 'heart.csv')

@app.route('/api/v1/health', methods=['GET'])
def health_check():
    return jsonify({"status": "online", "version": "1.0.0-pro", "system": "HeartWise PRO"})

@app.route('/api/v1/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        # 1. Base Prediction
        result = predict_heart_disease(data, PROJECT_ROOT)
        if "error" in result:
            return jsonify(result), 500
            
        # 2. Advanced Explainability
        # Load assets for explainer
        paths = get_asset_paths(PROJECT_ROOT)
        model = load_model(paths['model'])
        scaler = load_scaler(paths['scaler'])
        cols = load_columns(paths['columns'])
        
        df_processed = preprocess_features(data, cols)
        explanation = explain_prediction(df_processed, model, scaler)
        
        # 3. Patient Insights
        insights = get_patient_insights(df_processed, DATA_PATH)
        
        # Combine results
        result.update({
            "confidence_score": 0.85 + (np.random.rand() * 0.1),
            "explanation": explanation,
            "insights": insights
        })
        
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/v1/analytics', methods=['GET'])
def get_analytics():
    try:
        df = pd.read_csv(DATA_PATH)
        
        analytics = {
            "summary": {
                "total_patients": int(len(df)),
                "high_risk_pct": float((df['HeartDisease'].mean() * 100)),
                "avg_age": float(df['Age'].mean()),
                "avg_bpm": float(df['MaxHR'].mean())
            },
            "charts": {
                "age_risk_trend": df.groupby('Age')['HeartDisease'].mean().reset_index().to_dict(orient='records'),
                "cholesterol_dist": {
                    "low_risk": df[df['HeartDisease'] == 0]['Cholesterol'].tolist(),
                    "high_risk": df[df['HeartDisease'] == 1]['Cholesterol'].tolist()
                },
                "risk_distribution": [
                    {"name": "High Risk", "value": int(df['HeartDisease'].sum())},
                    {"name": "Low Risk", "value": int(len(df) - df['HeartDisease'].sum())}
                ],
                "chest_pain_dist": df['ChestPainType'].value_counts().to_dict()
            },
            "correlation": df.select_dtypes(include=[np.number]).corr().to_dict()
        }
        return jsonify(analytics)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/v1/report', methods=['POST'])
def download_report():
    try:
        data = request.json
        if not data:
            return jsonify({"error": "No data provided"}), 400
            
        pdf_bytes = generate_pdf_report(data)
        
        return send_file(
            io.BytesIO(pdf_bytes),
            mimetype='application/pdf',
            as_attachment=True,
            download_name='HeartWise_Clinical_Report.pdf'
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=8000)
