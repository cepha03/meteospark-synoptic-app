from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import pandas as pd
import json
import os

app = Flask(__name__)
# allow vite frontend to communicate with API
CORS(app, resources={r"/predict": {
    "origins": [
        "http://localhost:5173", 
        "https://meteospark-synoptic-app.vercel.app/ 
    ]
}})

# load the trained model and expected columns on startup
print("Loading ML Model..")
with open('meteospark_model.pkl', 'rb') as file:
    model = pickle.load(file)

with open('model_columns.json', 'r') as file:
    expected_columns = json.load(file)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # get JSON data sent from the Vite frontend
        data = request.json
        month = data.get('month') 
        nao = float(data.get('nao'))
        ao = float(data.get('ao'))

        # create a blank dictionary with all expected columns set to 0
        input_data = {col: 0 for col in expected_columns}
        
        # input the numerical features
        input_data['NAO_Index'] = nao
        input_data['AO_Index'] = ao
        
        # input the specific month dummy variable e.g. Jan to 1
        month_column = f'Month_{month}'
        if month_column in input_data:
            input_data[month_column] = 1

        # convert to DataFrame for scikit learn
        input_df = pd.DataFrame([input_data])

        # make the prediction
        prediction = model.predict(input_df)[0]

        # send the predicted temperature back to the frontend
        return jsonify({
            'success': True,
            'predicted_temperature': round(prediction, 2)
        })

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400

if __name__ == '__main__':
    # run the server on port 5000
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port, debug=False)