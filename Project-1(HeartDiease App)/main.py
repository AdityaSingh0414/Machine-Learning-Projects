import os
from app.app import app

if __name__ == '__main__':
    # Entry point for the Heart Disease Prediction app
    # Defaulting to port 5000
    print("Starting HeartWise System...")
    app.run(debug=True, host='0.0.0.0', port=5000)
