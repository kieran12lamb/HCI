from flask import Flask, request, render_template, abort, redirect, url_for, jsonify
import json
app = Flask(__name__)

@app.route("/")
def index():
    return render_template('index.html')


@app.route("/graphs-warfarin")
def graphs():
    return "Here is the graphs"
