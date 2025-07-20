import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.multioutput import MultiOutputRegressor
from sklearn.ensemble import RandomForestRegressor
import joblib

# === 1. Load Dataset ===
df = pd.read_excel("final_cleaned_agri_dataset.csv.xlsx", engine="openpyxl")

# === 2. Drop Missing Values ===
df.dropna(inplace=True)

# === 3. Select Features and Targets ===
features = ['Crop_Name', 'Year', 'State', 'Market_Demand_Index']
targets = ['Estimated_Revenue', 'Risk_Index']
df = df[features + targets]

# === 4. Encode Categorical Features ===
label_cols = ['Crop_Name', 'State']
for col in label_cols:
    le = LabelEncoder()
    df[col] = le.fit_transform(df[col])

# === 5. Train-Test Split ===
X = df[features]
y = df[targets]
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# === 6. Train Model ===
model = MultiOutputRegressor(RandomForestRegressor(n_estimators=100, random_state=42))
model.fit(X_train, y_train)

# === 7. Save Model ===
joblib.dump(model, "income_risk_model.pkl")
print("✅ Model saved as income_risk_model.pkl")
