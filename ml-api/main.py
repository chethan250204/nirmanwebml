from fastapi import FastAPI, Request
import joblib
import numpy as np
import uvicorn

app = FastAPI()

# Load model (no encoder needed for bid-only features)
model = joblib.load("model.pkl")

@app.post("/predict")
async def predict(request: Request):
    data = await request.json()
    # Expecting data to have bid features only
    try:
        features = data["features"]
        # Build feature vector in the correct order (bid-only features)
        feature_vector = [
            features["bid_total"],
            features["materials_cost"],
            features["labor_cost"],
            features["equipment_cost"],
            features["overhead_cost"],
            features["timeline_days"],
            features["profit_margin"],
            features["roi"],
            features["contingency"]
        ]
        X = np.array(feature_vector).reshape(1, -1)
        prediction = int(model.predict(X)[0])
        probability = float(model.predict_proba(X).max())
        return {"prediction": prediction, "probability": probability}
    except Exception as e:
        return {"error": str(e)}

# Uncomment below to run directly with: python main.py
# if __name__ == "__main__":
#     uvicorn.run(app, host="0.0.0.0", port=8000) 