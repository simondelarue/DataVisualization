#!/usr/bin/python3
# -*- coding: utf-8 -*-

from flask import Flask, render_template
import webbrowser

# Flask config
app = Flask(__name__)

# INDEX
@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')

# INDEFLOWER
@app.route('/indexFlower', methods=['GET'])
def indexFlower():
    return render_template('indexFlower.html')

#INDEXSCATTER
@app.route('/indexScatter', methods=['GET'])
def indexScatter():
    return render_template('indexScatter.html')

# APP
if __name__ == '__main__':
    webbrowser.open_new("http://127.0.0.1:5000/");
    app.run(debug=False)