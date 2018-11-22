from flask import Flask, request, render_template, abort, redirect, url_for, jsonify
import json
import urllib

app = Flask(__name__)

gpURL = 'https://www.opendata.nhs.scot/api/3/action/datastore_search?resource_id=34f02dbe-2827-47ae-821f-d529e26075cd&q='
prescriptionURL='https://www.opendata.nhs.scot/api/3/action/datastore_search?resource_id=592f3b58-2da8-4cc7-b4ab-e0eb0f16aa3f&q='

def getGpData():
    limit = '&limit=1000000'
    gpData = urllib.request.urlopen(gpURL+limit)
    gpData = json.loads(gpData.read().decode('utf-8'))['result']['records']
    postcodeToGPID = {}
    for gp in gpData:
        if str(gp['GPPractice']) not in postcodeToGPID:
            postcodeAPI =   json.loads(urllib.request.urlopen('http://api.getthedata.com/postcode/'+gp['Postcode'].replace(' ','+')).read().decode('utf-8'))
            postcodeToGPID[str(gp['GPPractice'])] = {'Postcode':gp['Postcode'],'lat':postcodeAPI['data']['latitude'],'lng': postcodeAPI['data']['longitude']}
    return postcodeToGPID
postcodeToGPID = getGpData()

def getPrescriptionData(drug):
    limit = '&limit=1000000'
    url= prescriptionURL+drug+limit
    prescriptionData = urllib.request.urlopen(url)
    prescriptionData = json.loads(prescriptionData.read().decode('utf-8'))
    prescriptionData = prescriptionData['result']['records']
    return prescriptionData

def getPostcode(gpID):
    try:
        return postcodeToGPID[str(gpID)]
    except:
        return None


@app.route("/")
def index():
    return render_template('index.html')

@app.route("/graphs/<drug>",methods = ['POST'])
def graphs(drug):
    prescriptionData = getPrescriptionData(drug)
    geocodes = []
    for prescriptions in prescriptionData:
        for g in geocodes:
            if (g['GPPractice']  == prescriptions['GPPractice']):
                g['count'] = g['count']+1
        else:
            postcode = getPostcode(prescriptions['GPPractice'])
            if postcode != None:
                geocode = {
                    'GPPractice': prescriptions['GPPractice'],
                    "postcode":postcode['Postcode'],
                    "count":1,
                    'medicine':drug,
                    'lat':postcode['lat'],
                    'lng':postcode['lng']
                }
                geocodes.append(geocode.copy())
    print(geocodes)
    return render_template('graphs.html',prescriptionData = prescriptionData,geocodes = geocodes)
