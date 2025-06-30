import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, cross_val_score, GridSearchCV
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier, VotingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import joblib
import sys
import os

# Load data
csv_path = 'bids.csv'
if os.path.exists(csv_path):
    print(f"Loading data from {csv_path}...")
    df = pd.read_csv(csv_path)
else:
    print("bids.csv not found!")
    sys.exit(1)

# Rename columns to match feature engineering expectations
if 'total_cost' in df.columns:
    df = df.rename(columns={"total_cost": "bid_total"})

# Create target variable from status
if 'won' not in df.columns and 'status' in df.columns:
    df['won'] = df['status'].map({'accepted': 1, 'rejected': 0, 'withdrawn': 0})

# Feature Engineering
print("Performing feature engineering...")

# 1. Calculate timeline_days
try:
    df['timeline_days'] = (
        pd.to_datetime(df['completion_date']) - pd.to_datetime(df['start_date'])
    ).dt.days
except:
    df['timeline_days'] = 0

# 2. Cost ratios (important features)
try:
    df['materials_ratio'] = df['materials_cost'] / df['bid_total']
    df['labor_ratio'] = df['labor_cost'] / df['bid_total']
    df['equipment_ratio'] = df['equipment_cost'] / df['bid_total']
    df['overhead_ratio'] = df['overhead_cost'] / df['bid_total']
except Exception as e:
    print(f"Error computing cost ratios: {e}")
    df['materials_ratio'] = 0
    df['labor_ratio'] = 0
    df['equipment_ratio'] = 0
    df['overhead_ratio'] = 0

# 3. Efficiency metrics
try:
    df['cost_per_day'] = df['bid_total'] / df['timeline_days'].replace(0, 1)
    df['profit_per_day'] = (df['bid_total'] * df['profit_margin'] / 100) / df['timeline_days'].replace(0, 1)
except Exception as e:
    print(f"Error computing efficiency metrics: {e}")
    df['cost_per_day'] = 0
    df['profit_per_day'] = 0

# 4. Risk indicators
try:
    df['high_risk'] = ((df['contingency'] > 15) | (df['timeline_days'] < 0)).astype(int)
    df['low_margin'] = (df['profit_margin'] < 10).astype(int)
except Exception as e:
    print(f"Error computing risk indicators: {e}")
    df['high_risk'] = 0
    df['low_margin'] = 0

# 5. Text-based features (if available)
if 'technical_risks' in df.columns:
    df['risk_count'] = df['technical_risks'].astype(str).str.count('\\n') + 1
else:
    df['risk_count'] = 0

if 'permits' in df.columns:
    df['permit_count'] = df['permits'].astype(str).str.count('\\n') + 1
else:
    df['permit_count'] = 0

# Select features
features = [
    'bid_total', 'materials_cost', 'labor_cost', 'equipment_cost', 'overhead_cost',
    'timeline_days', 'profit_margin', 'roi', 'contingency',
    'materials_ratio', 'labor_ratio', 'equipment_ratio', 'overhead_ratio',
    'cost_per_day', 'profit_per_day', 'high_risk', 'low_margin',
    'risk_count', 'permit_count'
]

# Remove rows where target is null
df = df.dropna(subset=['won'])

if df.empty:
    print("No valid data after removing null targets.")
    sys.exit(1)

# Check for missing features
missing_features = [f for f in features if f not in df.columns]
if missing_features:
    print(f"Missing features in data: {missing_features}")
    print(f"Available columns: {df.columns.tolist()}")
    sys.exit(1)

X = df[features].fillna(0)
y = df['won']

print(f"Training with {len(X)} samples and {len(features)} features")
print(f"Features: {features}")

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Scale features
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# 1. Try Multiple Algorithms
print("\n=== Testing Multiple Algorithms ===")

models = {
    'Random Forest': RandomForestClassifier(n_estimators=100, random_state=42),
    'Gradient Boosting': GradientBoostingClassifier(random_state=42),
    'Logistic Regression': LogisticRegression(random_state=42)
}

best_model = None
best_score = 0

for name, model in models.items():
    if name == 'Logistic Regression':
        # Use scaled data for linear models
        scores = cross_val_score(model, X_train_scaled, y_train, cv=3)
    else:
        scores = cross_val_score(model, X_train, y_train, cv=3)
    
    print(f"{name}: {scores.mean():.3f} (+/- {scores.std() * 2:.3f})")
    
    if scores.mean() > best_score:
        best_score = scores.mean()
        best_model = (name, model)

print(f"\nBest model: {best_model[0]}")

# 2. Hyperparameter Tuning
print("\n=== Hyperparameter Tuning ===")

if best_model[0] == 'Random Forest':
    param_grid = {
        'n_estimators': [50, 100, 200],
        'max_depth': [3, 5, 7, None],
        'min_samples_split': [2, 5, 10],
        'min_samples_leaf': [1, 2, 4]
    }
    model = RandomForestClassifier(random_state=42)
elif best_model[0] == 'Gradient Boosting':
    param_grid = {
        'n_estimators': [50, 100, 200],
        'learning_rate': [0.01, 0.1, 0.2],
        'max_depth': [3, 5, 7]
    }
    model = GradientBoostingClassifier(random_state=42)
else:
    param_grid = {
        'C': [0.1, 1, 10, 100],
        'penalty': ['l1', 'l2']
    }
    model = LogisticRegression(random_state=42)

# Grid search
grid_search = GridSearchCV(model, param_grid, cv=3, scoring='accuracy', n_jobs=-1)
if best_model[0] == 'Logistic Regression':
    grid_search.fit(X_train_scaled, y_train)
else:
    grid_search.fit(X_train, y_train)

print(f"Best parameters: {grid_search.best_params_}")
print(f"Best cross-validation score: {grid_search.best_score_:.3f}")

# 3. Ensemble Method (Combine multiple models)
print("\n=== Creating Ensemble Model ===")

rf = RandomForestClassifier(n_estimators=100, random_state=42)
gb = GradientBoostingClassifier(random_state=42)
lr = LogisticRegression(random_state=42)

ensemble = VotingClassifier(
    estimators=[('rf', rf), ('gb', gb), ('lr', lr)],
    voting='soft'
)

# Train ensemble
ensemble.fit(X_train, y_train)

# 4. Evaluate all models
print("\n=== Final Evaluation ===")

models_to_test = {
    'Best Single Model': grid_search.best_estimator_,
    'Ensemble': ensemble
}

for name, model in models_to_test.items():
    if name == 'Best Single Model' and best_model[0] == 'Logistic Regression':
        y_pred = model.predict(X_test_scaled)
        y_pred_proba = model.predict_proba(X_test_scaled)[:, 1]
    else:
        y_pred = model.predict(X_test)
        y_pred_proba = model.predict_proba(X_test)[:, 1]
    
    accuracy = accuracy_score(y_test, y_pred)
    print(f"\n{name}:")
    print(f"Accuracy: {accuracy:.3f}")
    print(f"Classification Report:")
    print(classification_report(y_test, y_pred))

# 5. Save the best model
best_ensemble = ensemble
joblib.dump(best_ensemble, "model_advanced.pkl")
joblib.dump(scaler, "scaler.pkl")

print(f"\nAdvanced model saved as 'model_advanced.pkl'")
print(f"Scaler saved as 'scaler.pkl'")

# 6. Feature Importance (for Random Forest)
if hasattr(best_ensemble, 'estimators_'):
    rf_model = best_ensemble.estimators_[0]  # First estimator is Random Forest
    if hasattr(rf_model, 'feature_importances_'):
        feature_importance = pd.DataFrame({
            'feature': features,
            'importance': rf_model.feature_importances_
        }).sort_values('importance', ascending=False)
        
        print(f"\nTop 10 Most Important Features:")
        print(feature_importance.head(10))
