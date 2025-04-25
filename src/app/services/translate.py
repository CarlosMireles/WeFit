from flask import Flask, request, jsonify
from flask_cors import CORS
from googletrans import Translator

app = Flask(__name__)
CORS(app)

translator = Translator()

def flatten_json(y, prefix=''):
    out = {}
    for key, val in y.items():
        new_key = f"{prefix}.{key}" if prefix else key
        if isinstance(val, dict):
            out.update(flatten_json(val, new_key))
        else:
            out[new_key] = val
    return out

def unflatten_json(flat):
    out = {}
    for composite_key, value in flat.items():
        keys = composite_key.split('.')
        d = out
        for key in keys[:-1]:
            d = d.setdefault(key, {})
        d[keys[-1]] = value
    return out

@app.route('/translate', methods=['POST'])
def translate():
    data = request.json
    original = data.get('text', {})
    target_lang = data.get('target', 'en')

    if len(target_lang) != 2:
        return jsonify({'error': 'Código de idioma no válido'}), 400

    flat_original = flatten_json(original)
    translated_flat = {}

    for key, value in flat_original.items():
        try:
            result = translator.translate(value, dest=target_lang)
            translated_flat[key] = result.text
        except Exception as e:
            print(f"Error traduciendo '{value}': {e}")
            translated_flat[key] = value

    translated_nested = unflatten_json(translated_flat)
    return jsonify(translated_nested)

if __name__ == '__main__':
    app.run(port=5000)
