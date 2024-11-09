from flask import Flask, request, jsonify, render_template
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad
import hashlib
import os

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/transform_to_aes', methods=['POST'])
def transform_to_aes():
    data = request.json
    shared_secret = data.get("shared_secret")
    
    if not shared_secret:
        return jsonify({"error": "Shared secret is missing."}), 400

    aes_key = hashlib.sha256(str(shared_secret).encode()).digest()

    return jsonify({"aes_key": aes_key.hex()})

if __name__ == '__main__':
    app.run(debug=True)
