from flask import Flask, request, render_template, abort, redirect, url_for, jsonify
import json
import urllib
app = Flask(__name__)

gpURL = 'https://www.opendata.nhs.scot/api/3/action/datastore_search?resource_id=34f02dbe-2827-47ae-821f-d529e26075cd&q='
prescriptionURL='https://www.opendata.nhs.scot/api/3/action/datastore_search?resource_id=592f3b58-2da8-4cc7-b4ab-e0eb0f16aa3f&q='

@app.route("/")
def index():
    return render_template('index.html')

@app.route("/graphs/<drug>",methods = ['POST'])
def graphs(drug):
    url= prescriptionURL+drug
    prescriptionData = urllib.request.urlopen(url)
    prescriptionData = json.loads(prescriptionData.read().decode('utf-8'))
    prescriptionData = prescriptionData['result']['records']
    return render_template('graphs.html',prescriptionData = prescriptionData)
