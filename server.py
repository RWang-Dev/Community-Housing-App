from flask import Flask, render_template

app = Flask(__name__)


@app.route('/')
def index():
    render_template('index.html')