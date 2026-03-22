import pandas as pd
import numpy as np

def get_patient_insights(input_df, dataset_path):
    """
    Calculates similarity with historical patients and 
    generates clinical recommendations.
    """
    try:
        df = pd.read_csv(dataset_path)
        # Simplified similarity: Look at risk prevalence in the same Age bucket
        age = input_df['Age'].iloc[0]
        age_bucket = df[(df['Age'] >= age - 5) & (df['Age'] <= age + 5)]
        
        if len(age_bucket) > 0:
            risk_pct = int(age_bucket['HeartDisease'].mean() * 100)
            msg = f"In patients aged {age-5}-{age+5}, {risk_pct}% exhibited positive diagnostic indicators."
        else:
            msg = "Statistical correlation based on clinical demographic benchmarks."
            
        recommendations = [
            "Maintain dietary sodium levels below 2g daily.",
            "Engage in at least 150 minutes of moderate aerobic activity weekly.",
            "Monitor resting heart rate and blood pressure twice daily."
        ]
        
        return {
            "similar_cases_stat": msg,
            "lifestyle_recommendations": recommendations
        }
    except Exception as e:
        return {"error": str(e)}
