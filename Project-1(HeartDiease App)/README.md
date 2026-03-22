# HeartWise: Advanced Heart Disease Prediction System

HeartWise is a professional-grade machine learning application designed to assess cardiac risk based on clinical patient data. The system utilizes a K-Nearest Neighbors (KNN) classifier trained on the UCI Heart Disease dataset.

## 🚀 Features
- **Modern UI**: Dark-themed glassmorphism interface for a premium clinical experience.
- **Robust ML Pipeline**: Automated data imputation and standardized feature engineering.
- **Real-time Analytics**: Instant risk assessment with probability scoring.
- **Modular Architecture**: Clean separation between frontend (Flask), core logic (src), and data/models.

## 📁 Directory Structure
```
Heart-Disease-Prediction/
│
├── app/                         # Flask Web Application
│   ├── templates/               # HTML Templates
│   ├── static/                  # CSS, JS, and Assets
│   └── app.py                   # Flask Server
│
├── src/                         # Core Machine Learning Modules
│   ├── data_preprocessing.py     # Imputation & Encoding
│   ├── predict.py                # Inference Pipeline
│   └── utils.py                  # Asset Management
│
├── models/                      # Serialized ML Models
│   ├── heart_model.pkl          # KNN Classifier
│   ├── scaler.pkl               # StandardScaler
│   └── columns.pkl              # Feature Order
│
├── notebook/                    # Exploratory Data Analysis
│   └── EDA_and_Model.ipynb
│
├── data/                        # Dataset Storage
│   └── raw/                     # Original CSVs
│
├── requirements.txt             # Dependencies
└── main.py                      # Application Entry Point
```

## 🛠️ Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd Heart-Disease-Prediction
   ```

2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the application**:
   ```bash
   python main.py
   ```
   The app will be available at `http://localhost:5000`.

## 🧠 Model Information
- **Algorithm**: K-Nearest Neighbors (KNN)
- **Features**: Age, Sex, Chest Pain Type, Resting BP, Cholesterol, Fasting BS, Resting ECG, Max HR, Exercise Angina, Oldpeak, ST Slope.
- **Preprocessing**: 
  - Mean imputation for zero values in Cholesterol/RestingBP.
  - StandardScaler for numerical scaling.
  - One-Hot Encoding for categorical features.

---
Developed by Aditya Singh
