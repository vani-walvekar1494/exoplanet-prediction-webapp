from flask import Flask, request, jsonify, render_template
import pickle
import pandas as pd
import os

# Initialize Flask app
current_dir = os.path.dirname(os.path.abspath(__file__))
app = Flask(__name__, template_folder=os.path.join(current_dir, 'templates'), static_folder=os.path.join(current_dir, 'static'))

# Load the pre-trained model
model_path = os.path.join(current_dir, 'model.pkl')
with open(model_path, 'rb') as model_file:
    model = pickle.load(model_file)

# Define a mapping for the discovery_method
discovery_method_mapping = {
    'Transit': 0,
    'Radial Velocity': 1,
    'Direct Imaging': 2,
    'Gravitational Microlensing': 3,
    'Astrometry': 4
}

# Define a route for making predictions
@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Extract data from JSON request
        data = request.get_json()
        star_temperature = float(data['star_temperature'])
        star_radius = float(data['star_radius'])
        star_luminosity = float(data['star_luminosity'])
        exoplanet_orbit = float(data['exoplanet_orbit'])
        exoplanet_mass = float(data['exoplanet_mass'])
        discovery_method = data['discovery_method']
        
        # Convert discovery_method to numerical value
        discovery_method_encoded = discovery_method_mapping.get(discovery_method)
        if discovery_method_encoded is None:
            raise ValueError(f"Invalid discovery method: {discovery_method}")
        
        # Create a DataFrame from the extracted data
        input_data = pd.DataFrame({
            'star_temperature': [star_temperature],
            'star_radius': [star_radius],
            'star_luminosity': [star_luminosity],
            'exoplanet_orbit': [exoplanet_orbit],
            'exoplanet_mass': [exoplanet_mass],
            'discovery_method': [discovery_method_encoded]
        })
        
        # Make predictions
        predictions = model.predict(input_data)
        
        # Log predictions to server logs
        app.logger.info(f"Predictions: {predictions}")
        
        # Render the predictions.html template with the predictions
        return render_template('predictions.html', predictions=predictions.tolist())
    except Exception as e:
        # Log the error
        app.logger.error(f"An error occurred during prediction: {e}")
        # Return an error response
        return jsonify({'error': 'An error occurred during prediction'}), 500

# Define a route to render the index.html page
@app.route('/')
def index():
    return render_template('index.html')

# Run the Flask application
if __name__ == '__main__':
    app.run(debug=True)
