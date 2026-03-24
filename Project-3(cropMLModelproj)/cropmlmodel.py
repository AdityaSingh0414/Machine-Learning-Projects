# -------------------------------------
# CROP RECOMMENDATION SYSTEM (FULL PROJECT)
# WITH EDA + TRAINING + PICKLE EXPORT
# -------------------------------------

import pandas as pd
import numpy as np
import seaborn as sns
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import pickle

# ---------------------------------------------------------
# 1. LOAD DATASET
# ---------------------------------------------------------
data = pd.read_csv("Crop_recommendation.csv")
print("Dataset Loaded Successfully!")
print(data.head())

# ---------------------------------------------------------
# 2. BASIC INFORMATION ABOUT DATASET
# ---------------------------------------------------------
print("\nDataset Shape:", data.shape)
print("\nColumn Names:", data.columns)
print("\nMissing Values:\n", data.isnull().sum())
print("\nData Types:\n", data.dtypes)

# ---------------------------------------------------------
# 3. DESCRIPTIVE STATISTICS (EDA PART 1)
# ---------------------------------------------------------
print("\nStatistical Summary:\n", data.describe())

# ---------------------------------------------------------
# 4. CORRELATION ANALYSIS (EDA PART 2)
# ---------------------------------------------------------
numeric_data = data.select_dtypes(include=['int64', 'float64'])

plt.figure(figsize=(10, 6))
sns.heatmap(numeric_data.corr(), annot=True, cmap='coolwarm')
plt.title("Correlation Heatmap")
plt.show()

# ---------------------------------------------------------
# 5. DISTRIBUTION OF FEATURES (EDA PART 3)
# ---------------------------------------------------------
plt.figure(figsize=(12, 6))
data.hist(bins=30, figsize=(12, 10), color='green')
plt.suptitle("Feature Distributions", fontsize=16)
plt.show()

# ---------------------------------------------------------
# 6. CROP COUNT VISUALIZATION (EDA PART 4)
# ---------------------------------------------------------
plt.figure(figsize=(12, 5))
sns.countplot(y=data['label'], palette="viridis")
plt.title("Crop Frequency Count")
plt.show()

# ---------------------------------------------------------
# 7. FEATURE & LABEL SEPARATION
# ---------------------------------------------------------
X = data[['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']]
y = data['label']

# ---------------------------------------------------------
# 8. TRAIN-TEST SPLIT
# ---------------------------------------------------------
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)
print("Data Split Completed.")

# ---------------------------------------------------------
# 9. MODEL TRAINING
# ---------------------------------------------------------
model = RandomForestClassifier()
model.fit(X_train, y_train)
print("\nModel Training Completed!")

# ---------------------------------------------------------
# 10. MODEL EVALUATION
# ---------------------------------------------------------
y_pred = model.predict(X_test)

print("\nAccuracy:", accuracy_score(y_test, y_pred))
print("\nClassification Report:\n", classification_report(y_test, y_pred))

# Confusion Matrix
plt.figure(figsize=(10, 6))
sns.heatmap(confusion_matrix(y_test, y_pred), cmap="Blues", annot=True)
plt.title("Confusion Matrix")
plt.show()

# ---------------------------------------------------------
# 11. SAVE MODEL AS PICKLE
# ---------------------------------------------------------
with open("model.pkl", "wb") as file:
    pickle.dump(model, file)

print("\n🎉 model.pkl created successfully!")
