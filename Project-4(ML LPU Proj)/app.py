from flask import Flask, render_template, request, jsonify, send_from_directory
import joblib
import numpy as np
from datetime import datetime
import pandas as pd
import os

# ==============================
# Paths
# ==============================
DATASET_PATH = "J:\\Machine Learning Projects\\Project-4(ML LPU Proj)\\dstrIPC_2013.csv"
HISTORY_PATH = "prediction_history.csv"
REPORT_DIR = "static/reports"
REPORT_FILE = "Crime_Analysis.pdf"

# ==============================
# Load Dataset
# ==============================
df = pd.read_csv(DATASET_PATH)

# ==============================
# Load or Create History File
# ==============================
if os.path.exists(HISTORY_PATH):
    history_df = pd.read_csv(HISTORY_PATH)
else:
    history_df = pd.DataFrame(columns=["time", "prediction", "risk"])

# ==============================
# Flask App
# ==============================
app = Flask(__name__)

# ==============================
# Load ML Artifacts
# ==============================
model = joblib.load("crime_model.joblib")
scaler = joblib.load("crime_scaler.joblib")
model_columns = joblib.load("crime_columns.joblib")

# ==============================
# Routes
# ==============================
@app.route("/")
def dashboard():
    return render_template("dashboard.html")


@app.route("/report")
def report():
    return render_template("report.html")




@app.route("/download-report")
def download_report():
    return send_from_directory(
        directory="static/reports",
        path="AI_Crime_Analytics_Report.pdf",
        as_attachment=True
    )



@app.route("/dataset")
def dataset():
    data = df.head(50).to_dict(orient="records")
    return render_template(
        "dataset.html",
        data=data,
        columns=df.columns.tolist(),
        total_rows=len(df),
        total_cols=len(df.columns)
    )


@app.route("/history")
def history():
    history_data = history_df.sort_index(ascending=False).to_dict(orient="records")
    return render_template("history.html", history=history_data)


@app.route("/insights")
def insights():
    model_metrics = {
        "Linear Regression": {"r2": 0.62, "rmse": 8200},
        "Lasso Regression": {"r2": 0.60, "rmse": 8500},
        "Ridge Regression": {"r2": 0.64, "rmse": 8000},
        "Decision Tree": {"r2": 0.71, "rmse": 6900},
        "Random Forest": {"r2": 0.83, "rmse": 5100}
    }
    return render_template("insights.html", metrics=model_metrics)


@app.route("/about")
def about():
    return render_template("about.html")


@app.route("/predict", methods=["POST"])
def predict():
    global history_df

    data = request.json
    input_data = np.zeros(len(model_columns))

    for i, col in enumerate(model_columns):
        if "STATE" in col.upper():
            input_data[i] = data["state"]
        elif "DISTRICT" in col.upper():
            input_data[i] = data["district"]
        elif "POPULATION" in col.upper():
            input_data[i] = data["population"]
        elif "POLICE" in col.upper():
            input_data[i] = data["police"]
        else:
            input_data[i] = data["urban"]

    # Predict
    pred = model.predict(scaler.transform([input_data]))[0]

    # Risk logic
    if pred < 5000:
        risk = "Low"
    elif pred < 20000:
        risk = "Medium"
    else:
        risk = "High"

    record = {
        "time": datetime.now().strftime("%d-%m-%Y %H:%M:%S"),
        "prediction": round(pred, 2),
        "risk": risk
    }

    # Save history
    history_df = pd.concat([history_df, pd.DataFrame([record])], ignore_index=True)
    history_df.to_csv(HISTORY_PATH, index=False)

    return jsonify(record)

# ==============================
# Run App
# ==============================
if __name__ == "__main__":
    app.run(debug=True)
