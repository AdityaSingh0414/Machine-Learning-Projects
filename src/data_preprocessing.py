import pandas as pd
from sklearn.preprocessing import LabelEncoder, StandardScaler

def handle_missing_values(df):
    for col in df.columns:
        if df[col].dtype == 'object':
            df[col].fillna(df[col].mode()[0], inplace=True)
        else:
            df[col].fillna(df[col].mean(), inplace=True)
    return df


def encode_data(df):
    le = LabelEncoder()
    for col in df.select_dtypes(include='object').columns:
        df[col] = le.fit_transform(df[col])
    return df


def scale_features(X_train, X_test):
    scaler = StandardScaler()
    X_train = scaler.fit_transform(X_train)
    X_test = scaler.transform(X_test)
    return X_train, X_test


def preprocess_pipeline(df):
    df = handle_missing_values(df)
    df = encode_data(df)
    return df