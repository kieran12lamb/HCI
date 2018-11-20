from flask import Flask, request, render_template, abort, redirect, url_for, jsonify
import json
import urllib
app = Flask(__name__)

gpURL = 'https://www.opendata.nhs.scot/api/3/action/datastore_search?resource_id=34f02dbe-2827-47ae-821f-d529e26075cd&'
prescriptionURL ='https://www.opendata.nhs.scot/api/3/action/datastore_search?resource_id=592f3b58-2da8-4cc7-b4ab-e0eb0f16aa3f&'

@app.route("/")
def index():
    return render_template('index.html')

@app.route("/graphs/<drug>",methods = ['POST'])
def graphs(drug):
    if drug == 'warfarin':
        fileobj = urllib.request.urlopen(gpURL+'limit=1&q=BNFItemDescription:methadone' )
        print(fileobj.read())
    elif drug == 'methadone':
        print('boop2')
    else:
        print('boop3')
    return render_template('graphs.html')
