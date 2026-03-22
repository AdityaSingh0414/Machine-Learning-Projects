import pandas as pd
import numpy as np

def impute_zeros(df):
    """
    Imputes 0 values in Cholesterol and RestingBP with their respective non-zero means.
    """
    # Cholesterol imputation
    chol_mean = df.loc[df['Cholesterol'] != 0, 'Cholesterol'].mean()
    if pd.isna(chol_mean): # Handle case where all are 0 or empty
        chol_mean = 0
    df['Cholesterol'] = df['Cholesterol'].replace(0, chol_mean)
    
    # RestingBP imputation
    bp_mean = df.loc[df['RestingBP'] != 0, 'RestingBP'].mean()
    if pd.isna(bp_mean):
        bp_mean = 0
    df['RestingBP'] = df['RestingBP'].replace(0, bp_mean)
    
    return df

def preprocess_features(input_dict, expected_columns):
    """
    Converts input dictionary to a DataFrame, handles categorical encoding 
    to match expected_columns, and ensures correct feature ordering.
    """
    # Create DataFrame from input
    df = pd.DataFrame([input_dict])
    
    # Define categorical columns
    categorical_cols = ['Sex', 'ChestPainType', 'RestingECG', 'ExerciseAngina', 'ST_Slope']
    
    # Generate dummies for current input
    df_encoded = pd.get_dummies(df, columns=[col for col in categorical_cols if col in df.columns])
    
    # Create a full feature vector with 0s for missing dummy columns
    final_df = pd.DataFrame(0, index=[0], columns=expected_columns)
    
    # Update with values from encoded input
    for col in df_encoded.columns:
        if col in final_df.columns:
            final_df[col] = df_encoded[col]
            
    return final_df
