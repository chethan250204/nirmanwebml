```mermaid
flowchart TD
    A[Data Source (CSV / PostgreSQL)] --> B[Feature Engineering & Preprocessing]
    B --> C[Train/Test Split]
    C --> D[Model Training<br/>(RandomForest, GradientBoosting, LogisticRegression)]
    D --> E[Cross-Validation & Hyperparameter Tuning]
    E --> F[Best Model Selection / Ensemble Voting]
    F --> G[Model & Scaler Saved (.pkl)]
    G --> H[FastAPI Server Loads Model]
    H --> I[API Receives Prediction Request]
    I --> J[Preprocess Input Features]
    J --> K[Model Predicts Outcome]
    K --> L[Return Prediction & Probability (JSON)]
    L --> M[Testing Scripts Validate Predictions]
```
