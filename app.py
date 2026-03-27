import streamlit as st
import pandas as pd
import joblib

from src.data_preprocessing import preprocess_pipeline, scale_features
from src.model_training import get_models, train_all_models
from src.evaluation import evaluate, get_best_model

from sklearn.model_selection import train_test_split

st.set_page_config(page_title="SmartPredict AI", layout="wide")

st.title("🚀 SmartPredict AI - End to End ML System")

file = st.file_uploader("Upload CSV Dataset", type=["csv"])

if file:
    df = pd.read_csv(file)

    st.subheader("📊 Dataset Preview")
    st.dataframe(df.head())

    target = st.selectbox("Select Target Column", df.columns)

    if st.button("Run Full ML Pipeline"):

        # Preprocess
        df = preprocess_pipeline(df)

        X = df.drop(columns=[target])
        y = df[target]

        # Detect task
        task = "classification" if y.nunique() < 10 else "regression"
        st.write(f"🧠 Detected Task: {task}")

        # Split
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

        # Scale
        X_train, X_test = scale_features(X_train, X_test)

        # Train
        models = get_models(task)
        trained_models = train_all_models(models, X_train, y_train)

        # Evaluate
        results = evaluate(trained_models, X_test, y_test, task)

        st.subheader("📈 Model Performance")
        st.write(results)

        # Best Model
        best_name, best_model = get_best_model(results, trained_models)

        st.success(f"🏆 Best Model: {best_name}")

        # Save model
        joblib.dump(best_model, "models/best_model.pkl")

        # Prediction
        st.subheader("🎯 Make Prediction")

        input_data = []
        for col in X.columns:
            val = st.number_input(f"{col}", value=0.0)
            input_data.append(val)

        if st.button("Predict"):
            pred = best_model.predict([input_data])
            st.success(f"Prediction: {pred[0]}")