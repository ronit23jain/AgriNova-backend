import os

from flask import Flask, request, jsonify
import joblib
import numpy as np

# Initialize Flask app
app = Flask(__name__)

# Load trained model and encoders
model = joblib.load("fertilizer_model.pkl")
label_encoders = joblib.load("label_encoders.pkl")


@app.route("/predict_fertilizer", methods=["POST"])
def predict():
    try:
        # Get JSON data
        data = request.get_json()

        # Extract input values
        crop = data["crop"]
        stage = data["stage"]
        soil_type = data["soil_type"]

        N = float(data["N"])
        P = float(data["P"])
        K = float(data["K"])
        pH = float(data["pH"])
        organic_carbon = float(data["organic_carbon"])
        temp = float(data["temp"])
        rainfall = float(data["rainfall"])

        # Encode categorical values
        crop_encoded = label_encoders["Crop"].transform([crop])[0]
        stage_encoded = label_encoders["Stage"].transform([stage])[0]
        soil_encoded = label_encoders["Soil_Type"].transform([soil_type])[0]

        # Create feature array
        features = np.array([[
            crop_encoded,
            stage_encoded,
            soil_encoded,
            N,
            P,
            K,
            pH,
            organic_carbon,
            temp,
            rainfall
        ]])

        # Predict fertilizer recommendation
        prediction = model.predict(features)

        pred = prediction[0]

        # Format response
        response = (
            f"{float(pred[1]):.2f}kg DAP + "
            f"{float(pred[2]):.2f}kg MOP + "
            f"{float(pred[0]):.2f}kg Urea/acre + "
            f"{float(pred[3]):.2f}kg SSP + "
            f"{float(pred[4]):.2f}kg Compost"
        )

        return jsonify({
            "recommendation": response
        })

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 400


@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "ok"
    })


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=int(os.environ.get("PORT", 5000)),
        debug=True
    )