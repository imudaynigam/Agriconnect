from google.colab import files
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.multioutput import MultiOutputRegressor
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, r2_score
import numpy as np

# Upload and load dataset
uploaded = files.upload()
file_name = next(iter(uploaded))

if file_name.endswith('.csv'):
    df = pd.read_csv(file_name)
elif file_name.endswith('.xlsx'):
    df = pd.read_excel(file_name, engine='openpyxl')
else:
    raise ValueError("Unsupported file format. Upload .csv or .xlsx only.")

df.dropna(inplace=True)

features = ['Crop_Name', 'Year', 'State', 'Market_Demand_Index']
targets = ['Estimated_Revenue', 'Risk_Index']
df = df[features + targets]

label_cols = ['Crop_Name', 'State']
encoders = {}
for col in label_cols:
    le = LabelEncoder()
    df[col] = le.fit_transform(df[col])
    encoders[col] = le

X = df[features]
y = df[targets]

scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

X_train, X_test, y_train, y_test = train_test_split(
    X_scaled, y, test_size=0.2, random_state=42
)

model = MultiOutputRegressor(RandomForestRegressor(n_estimators=50, random_state=42))
model.fit(X_train, y_train)

y_pred = model.predict(X_test)

rmse = np.sqrt(mean_squared_error(y_test, y_pred))
r2 = r2_score(y_test, y_pred)

print("\n📊 Model 2: Net Income & Risk Estimator")
print(f"Root Mean Squared Error (RMSE): {rmse:.2f}")
print(f"R² Score: {r2:.2f}")

print("\n📈 Sample Predictions:")
for i in range(3):
    print(f"Sample {i+1}:")
    print(f"  Predicted Net Income: ₹{y_pred[i][0]:,.2f}")
    print(f"  Predicted Risk Index: {y_pred[i][1]:.2f}")
