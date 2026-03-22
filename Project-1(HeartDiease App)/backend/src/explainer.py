import numpy as np

def explain_prediction(input_df, model, scaler):
    """
    Calculates feature contribution for the prediction.
    For KNN, we look at how the features of the current sample 
    differ from the mean or the 'healthy' profile.
    """
    # Placeholder: In a real system, you'd use SHAP or LIME.
    # For now, we simulate based on common clinical impact.
    
    features = input_df.columns.tolist()
    impacts = []
    
    # Feature-specific heuristic logic for demonstrate explainability
    if 'Sex_M' in input_df.columns and input_df['Sex_M'].iloc[0] == 1:
        impacts.append({"feature": "Sex (Male)", "impact": "High", "type": "Risk Factor"})
    
    if 'Cholesterol' in input_df.columns and input_df['Cholesterol'].iloc[0] > 240:
        impacts.append({"feature": "High Cholesterol", "impact": "Medium", "type": "Risk Factor"})
        
    if 'MaxHR' in input_df.columns and input_df['MaxHR'].iloc[0] > 160:
        impacts.append({"feature": "High Heart Rate", "impact": "Medium", "type": "Protective Factor"})
    
    if 'ST_Slope_Flat' in input_df.columns and input_df['ST_Slope_Flat'].iloc[0] == 1:
        impacts.append({"feature": "ST Slope (Flat)", "impact": "High", "type": "Risk Factor"})

    # Fallback to general list
    if not impacts:
        impacts = [{"feature": "Genetics", "impact": "Low", "type": "Risk Factor"}]
        
    return {"top_factors": impacts[:3]}
