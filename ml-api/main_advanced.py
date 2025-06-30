from fastapi import FastAPI, Request
import joblib
import numpy as np
import pandas as pd

app = FastAPI()

# Load the advanced model and scaler
model = joblib.load("model_advanced.pkl")
scaler = joblib.load("scaler.pkl")

# The features must match the order in your training script
features = [
    'bid_total', 'materials_cost', 'labor_cost', 'equipment_cost', 'overhead_cost',
    'timeline_days', 'profit_margin', 'roi', 'contingency',
    'materials_ratio', 'labor_ratio', 'equipment_ratio', 'overhead_ratio',
    'cost_per_day', 'profit_per_day', 'high_risk', 'low_margin',
    'risk_count', 'permit_count'
]

def engineer_features(data):
    # Calculate engineered features from input
    df = pd.DataFrame([data])
    # Ratios
    df['materials_ratio'] = df['materials_cost'] / df['bid_total']
    df['labor_ratio'] = df['labor_cost'] / df['bid_total']
    df['equipment_ratio'] = df['equipment_cost'] / df['bid_total']
    df['overhead_ratio'] = df['overhead_cost'] / df['bid_total']
    # Efficiency
    df['cost_per_day'] = df['bid_total'] / (df['timeline_days'] if df['timeline_days'].iloc[0] != 0 else 1)
    df['profit_per_day'] = (df['bid_total'] * df['profit_margin'] / 100) / (df['timeline_days'] if df['timeline_days'].iloc[0] != 0 else 1)
    # Risk indicators
    df['high_risk'] = int(df['contingency'].iloc[0] > 15 or df['timeline_days'].iloc[0] < 0)
    df['low_margin'] = int(df['profit_margin'].iloc[0] < 10)
    # Text-based features (optional, set to 0 if not provided)
    df['risk_count'] = data.get('risk_count', 0)
    df['permit_count'] = data.get('permit_count', 0)
    # Fill missing
    df = df[features].fillna(0)
    return df

@app.post("/predict")
async def predict(request: Request):
    data = await request.json()
    try:
        features_dict = data["features"]
        X = engineer_features(features_dict)
        X_scaled = scaler.transform(X)
        prediction = int(model.predict(X_scaled)[0])
        probability = float(model.predict_proba(X_scaled).max())
        return {"prediction": prediction, "probability": probability}
    except Exception as e:
        return {"error": str(e)}

# To run: python -m uvicorn main_advanced:app --reload --port 8000 