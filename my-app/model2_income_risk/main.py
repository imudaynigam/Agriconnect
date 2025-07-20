from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import numpy as np
from src.api.contact_api import router as contact_router

app = FastAPI(title="Income Risk Predictor")

# Load model
model = joblib.load("income_risk_model.pkl")

# Request body structure
class InputData(BaseModel):
    Crop_Name: int
    Year: int
    State: int
    Market_Demand_Index: float

# Root endpoint
@app.get("/")
def read_root():
    return {"message": "Welcome to Income Risk Prediction API"}

# Prediction endpoint
@app.post("/predict")
def predict(data: InputData):
    input_array = np.array([[data.Crop_Name, data.Year, data.State, data.Market_Demand_Index]])
    prediction = model.predict(input_array)[0]
    return {
        "Estimated_Revenue": round(prediction[0], 2),
        "Risk_Index": round(prediction[1], 2)
    }

app.include_router(contact_router)
