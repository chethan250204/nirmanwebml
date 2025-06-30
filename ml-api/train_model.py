import pandas as pd
from sqlalchemy import create_engine
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
import joblib
import sys
import os

# Database URL
DATABASE_URL = "postgresql://neondb_owner:npg_0OTRzKcFfYt4@ep-wandering-forest-a4gy0qyi-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require"

# List of possible features and their default values (bid-only features)
feature_defaults = {
    'bid_total': 0.0,
    'materials_cost': 0.0,
    'labor_cost': 0.0,
    'equipment_cost': 0.0,
    'overhead_cost': 0.0,
    'start_date': None,
    'completion_date': None,
    'profit_margin': 0.0,
    'roi': 0.0,
    'contingency': 0.0,
    'won': 0
}

# Try to load from CSV first
csv_path = 'bids.csv'
if os.path.exists(csv_path):
    print(f"Loading data from {csv_path}...")
    try:
        df = pd.read_csv(csv_path)
    except Exception as e:
        print(f"Error loading {csv_path}: {e}")
        sys.exit(1)
else:
    # Create SQLAlchemy engine with error handling
    try:
        engine = create_engine(DATABASE_URL)
    except Exception as e:
        print(f"Error creating engine: {e}")
        sys.exit(1)

    # SQL query: select bid-only features
    query = f"""
    SELECT
        b.id as bid_id,
        b.total_cost as bid_total,
        b.materials_cost,
        b.labor_cost,
        b.equipment_cost,
        b.overhead_cost,
        b.start_date,
        b.completion_date,
        b.profit_margin,
        b.roi,
        b.contingency,
        CASE 
            WHEN b.status = 'accepted' THEN 1 
            WHEN b.status IN ('rejected', 'withdrawn') THEN 0 
            ELSE NULL 
        END as won
    FROM
        bids b
    WHERE
        b.status IN ('accepted', 'rejected', 'withdrawn')
    """

    # Load data into DataFrame with error handling
    try:
        df = pd.read_sql(query, engine)
    except Exception as e:
        print(f"Error loading data from database: {e}")
        sys.exit(1)

    if df.empty:
        print("No data loaded from the database. Please check your tables and query.")
        sys.exit(1)

# Create target variable from status if not exists
if 'won' not in df.columns and 'status' in df.columns:
    df['won'] = df['status'].map({'accepted': 1, 'rejected': 0, 'withdrawn': 0})

# Fill missing columns with default values
for col, default in feature_defaults.items():
    if col not in df.columns:
        df[col] = default

# Calculate timeline_days
try:
    df['timeline_days'] = (
        pd.to_datetime(df['completion_date']) - pd.to_datetime(df['start_date'])
    ).dt.days
except Exception as e:
    print(f"Error calculating timeline_days: {e}")
    df['timeline_days'] = 0  # fallback

# Features and target (bid-only features)
features = [
    'bid_total', 'materials_cost', 'labor_cost', 'equipment_cost', 'overhead_cost',
    'timeline_days', 'profit_margin', 'roi', 'contingency'
]

missing_features = [f for f in features if f not in df.columns]
if missing_features:
    print(f"Missing features in data: {missing_features}")
    sys.exit(1)

# Remove rows where target is null
df = df.dropna(subset=['won'])

if df.empty:
    print("No valid data after removing null targets.")
    sys.exit(1)

X = df[features].fillna(0)
y = df['won']

print(f"Training with {len(X)} samples and {len(features)} features")
print(f"Features: {features}")

# Split data
try:
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
except Exception as e:
    print(f"Error splitting data: {e}")
    sys.exit(1)

# Train model
try:
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
except Exception as e:
    print(f"Error training model: {e}")
    sys.exit(1)

# Evaluate
try:
    print("Train accuracy:", model.score(X_train, y_train))
    print("Test accuracy:", model.score(X_test, y_test))
except Exception as e:
    print(f"Error evaluating model: {e}")

# Save model (no encoder needed since we removed category)
try:
    joblib.dump(model, "model.pkl")
    print("Model saved.")
except Exception as e:
    print(f"Error saving model: {e}") 