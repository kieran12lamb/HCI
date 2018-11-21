from flask import Flask, request, render_template, abort, redirect, url_for, jsonify
import json
import urllib
# from postcodes import PostCoder
app = Flask(__name__)

# pc = PostCoder()
gpURL = 'https://www.opendata.nhs.scot/api/3/action/datastore_search?resource_id=34f02dbe-2827-47ae-821f-d529e26075cd&q='
prescriptionURL='https://www.opendata.nhs.scot/api/3/action/datastore_search?resource_id=592f3b58-2da8-4cc7-b4ab-e0eb0f16aa3f&q='


def getPrescriptionData(drug):
    limit = '&limit=1000000'
    url= prescriptionURL+drug+limit
    prescriptionData = urllib.request.urlopen(url)
    prescriptionData = json.loads(prescriptionData.read().decode('utf-8'))
    prescriptionData = prescriptionData['result']['records']
    return prescriptionData

def getGpData():
    limit = '&limit=1000000'
    gpData = urllib.request.urlopen(gpURL+limit)
    gpData = json.loads(gpData.read().decode('utf-8'))['result']['records']
    postcodeToGPID = {}
    for gp in gpData:
        if str(gp['GPPractice']) not in postcodeToGPID:
            postcodeToGPID[str(gp['GPPractice'])] = gp['Postcode']
    return postcodeToGPID

postcodeToGPID = getGpData()

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
    geocodes = {}
    for presciptions in prescriptionData:
        if presciptions['GPPractice'] in geocodes:
             geocodes[presciptions['GPPractice']]['count'] = geocodes[presciptions['GPPractice']]['count']+1
        else:
            postcode = getPostcode(presciptions['GPPractice'])
            if postcode != None:
                geocodes[presciptions['GPPractice']] = {  "postcode":postcode,
                                                "count":1,
                                                'medicine':drug,
                                                # 'lat':pc.get(postcode=postcode)['lat'],
                                                # 'lng':pc.get(postcode=postcode)['lng']
                                         }
    print(geocodes)
    return render_template('graphs.html',prescriptionData = prescriptionData,geocodes = geocodes)
