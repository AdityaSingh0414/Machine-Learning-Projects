from flask import Flask, request, jsonify, render_template, send_file
import json
import os
import pickle
import numpy as np
import pandas as pd

app = Flask(__name__)

# ------------------------------
#  LOAD THE PICKLE MODEL
# ------------------------------
with open("model.pkl", "rb") as f:
    model = pickle.load(f)

# ------------------------------
#  GLOBAL VARIABLES FOR ANALYTICS
# ------------------------------
# Default empty lists (or load real values later)
labels = []
counts = []
confidences = []


# ------------------------------
#  HOME PAGE
# ------------------------------
@app.route("/")
def home():
    return render_template("index.html")


# ------------------------------
#  ANALYTICS PAGE
# ------------------------------
@app.route("/analytics")
def analytics():

    # Prediction analytics data
    labels = ["rice", "wheat", "maize"]
    counts = [10, 7, 4]
    confidences = [92, 88, 75, 96, 84]

    # Dataset analytics data
    dataset_columns = ["N", "P", "K", "temperature", "humidity", "ph", "rainfall"]
    dataset_summary = {
        "N": {"mean": 60, "min": 10, "max": 120, "std": 20},
        "P": {"mean": 55, "min": 5, "max": 110, "std": 18},
        "K": {"mean": 40, "min": 4, "max": 100, "std": 15},
        "temperature": {"mean": 25, "min": 10, "max": 35, "std": 5},
        "humidity": {"mean": 80, "min": 30, "max": 95, "std": 12},
        "ph": {"mean": 6.5, "min": 4, "max": 8.5, "std": 0.9},
        "rainfall": {"mean": 100, "min": 20, "max": 250, "std": 40},
    }

    return render_template(
        "analytics.html",
        labels=labels,
        counts=counts,
        confidences=confidences,
        dataset_columns=dataset_columns,
        dataset_summary=dataset_summary
    )



# ------------------------------
#  DATASET PAGE
# ------------------------------
@app.route("/dataset")
def dataset_page():
    df = pd.read_csv("Crop_recommendation.csv")
    return render_template("dataset.html",
                           columns=df.columns,
                           data=df.values.tolist())


@app.route("/download_dataset")
def download_dataset():
    return send_file("Crop_recommendation.csv", as_attachment=True)


# ------------------------------
#  HISTORY PAGE
# ------------------------------
@app.route("/history")
def history_page():
    if os.path.exists("history.json"):
        with open("history.json", "r") as f:
            data = json.load(f)
    else:
        data = []
    return render_template("history.html", history=data)


@app.route("/download_history")
def download_history():
    if os.path.exists("history.json"):
        return send_file("history.json", as_attachment=True)
    else:
        return "No history available", 404


# ------------------------------
#  PREDICTION FUNCTION
# ------------------------------
@app.route("/predict", methods=["POST"])
def predict():
    # Get data from form
    N = float(request.form['N'])
    P = float(request.form['P'])
    K = float(request.form['K'])
    temperature = float(request.form['temperature'])
    humidity = float(request.form['humidity'])
    ph = float(request.form['ph'])
    rainfall = float(request.form['rainfall'])

    # Convert to correct ML input format
    features = np.array([[N, P, K, temperature, humidity, ph, rainfall]])

    # Make prediction
    result = model.predict(features)[0]

    # Save to history.json
    entry = {
        "N": N,
        "P": P,
        "K": K,
        "temperature": temperature,
        "humidity": humidity,
        "ph": ph,
        "rainfall": rainfall,
        "prediction": result
    }



    # Append history
    if os.path.exists("history.json"):
        with open("history.json", "r") as f:
            history_data = json.load(f)
    else:
        history_data = []

    history_data.append(entry)

    with open("history.json", "w") as f:
        json.dump(history_data, f, indent=4)

    return render_template("index.html",
                           prediction_text=f"Recommended Crop: {result}")


# ------------------------------
#  RUN FLASK
# ------------------------------
if __name__ == "__main__":
    app.run(debug=True)
