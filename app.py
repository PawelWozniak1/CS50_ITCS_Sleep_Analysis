from flask import Flask, render_template, request
import csv

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload():
    file = request.files['file']
    if file:
        file_contents = file.read().decode('utf-8')
        data = parse_csv(file_contents)
        return render_template('index.html', data=data)
    return 'No file uploaded', 400

def parse_csv(file_contents):
    reader = csv.reader(file_contents.split('\n'))
    headers = next(reader)
    rows = [row for row in reader if row]
    return {'headers': headers, 'rows': rows}

if __name__ == '__main__':
    app.run(debug=True)
