import urllib.request
import json
import sys
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, r2_score

try:
    with urllib.request.urlopen("http://localhost:3001/api/v1/metrics") as response:
        metrics = json.loads(response.read().decode('utf-8'))
except Exception as e:
    print(f"Error fetching data from backend: {e}")
    sys.exit(1)

rows = []
for step_id, stats in metrics.items():
    if stats.get('entered', 0) > 0:
        drop_rate = stats.get('dropped', 0) / stats.get('entered', 1)
        rows.append({
            'step_name': stats.get('name', step_id),
            'avgTime': stats.get('avgTime', 0),
            'errors': stats.get('errors', 0),
            'rageClicks': stats.get('rageClicks', 0),
            'hesitation': stats.get('hesitation', 0),
            'tabSwitches': stats.get('tabSwitches', 0),
            'backButtons': stats.get('backButtons', 0),
            'dropRate': drop_rate
        })

df = pd.DataFrame(rows)

if len(df) < 5:
    print("Insufficient data to train a model.")
    sys.exit(0)

print(f"Loaded {len(df)} tracking points for training.")

features = ['avgTime', 'errors', 'rageClicks', 'hesitation', 'tabSwitches', 'backButtons']
X = df[features]
y = df['dropRate']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

preds = model.predict(X_test)
print(f"R-squared Score: {r2_score(y_test, preds):.3f} (Model accuracy)")
print(f"RMSE: {mean_squared_error(y_test, preds)**0.5:.3f}%\n")

importances = model.feature_importances_
feature_imp = pd.DataFrame({'Feature': features, 'Importance': importances}).sort_values('Importance', ascending=False)

print("=== Predictive Weight of Behavioral Signals ===")
for idx, row in feature_imp.iterrows():
    print(f"- {row['Feature']}: {row['Importance']*100:.1f}% impact on dropping out")
