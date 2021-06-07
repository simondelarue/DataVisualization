#!/usr/bin/python3
# -*- coding: utf-8 -*-

from flask import Flask, render_template

# Flask config
app = Flask(__name__)

# INDEX
@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')


# APP
if __name__ == '__main__':
    app.run(debug=True)