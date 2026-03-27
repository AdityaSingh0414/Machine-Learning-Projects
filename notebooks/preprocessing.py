import pandas as pd
from src.data_preprocessing import preprocess_pipeline

df = pd.read_csv(r'J:\Machine Learning Projects\Project-5(All models ML)\Ecommerce_Consumer_Behavior_Analysis_Data.csv')

df_clean = preprocess_pipeline(df)

print(df_clean.head())