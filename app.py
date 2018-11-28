from flask import Flask, request, render_template, abort, redirect, url_for, jsonify
import json
import urllib

app = Flask(__name__)

gpURL = 'https://www.opendata.nhs.scot/api/3/action/datastore_search?resource_id=34f02dbe-2827-47ae-821f-d529e26075cd&q='
prescriptionURL='https://www.opendata.nhs.scot/api/3/action/datastore_search?resource_id=592f3b58-2da8-4cc7-b4ab-e0eb0f16aa3f&q='

prescriptionURLs = { 'August':"https://www.opendata.nhs.scot/api/3/action/datastore_search?resource_id=592f3b58-2da8-4cc7-b4ab-e0eb0f16aa3f&q=",
                     'July':"https://www.opendata.nhs.scot/api/3/action/datastore_search?resource_id=fec5dfdb-96dc-4e87-b7a0-6ecf20ec86e9&q=",
                     'June':"https://www.opendata.nhs.scot/api/3/action/datastore_search?resource_id=d73cfc66-3330-416f-8507-873db28eca5c&q=",
                     'April':'https://www.opendata.nhs.scot/api/3/action/datastore_search?resource_id=e35aebd7-55be-4c8b-82b7-54d1ed946b91&q=',
                     'March':'https://www.opendata.nhs.scot/api/3/action/datastore_search?resource_id=0b7bc1dd-9731-405b-a55e-656a8c996a58&q=',
                     'February':'https://www.opendata.nhs.scot/api/3/action/datastore_search?resource_id=1ae16a5f-aa26-4911-989b-ba4a6ab87037&q=',
                     'January':'https://www.opendata.nhs.scot/api/3/action/datastore_search?resource_id=82ef2c55-5a31-4759-ab9a-83b176e107f2&q='
                    }


def getGpData():
    limit = '&limit=1000000'
    gpData = urllib.request.urlopen(gpURL+limit)
    gpData = json.loads(gpData.read().decode('utf-8'))['result']['records']
    postcodeToGPID = {}
    for gp in gpData:
        if str(gp['GPPractice']) not in postcodeToGPID:
            postcodeAPI =   json.loads(urllib.request.urlopen('http://api.getthedata.com/postcode/'+gp['Postcode'].replace(' ','')).read().decode('utf-8'))
            postcodeToGPID[str(gp['GPPractice'])] = {'Postcode':gp['Postcode'],'lat':postcodeAPI['data']['latitude'],'lng': postcodeAPI['data']['longitude']}
    return postcodeToGPID
postcodeToGPID = getGpData()

def getPrescriptionData(drug,month):
    limit = '&limit=1000000'
    prescriptionURL = prescriptionURLs[month]
    url= prescriptionURL+drug+limit
    prescriptionData = urllib.request.urlopen(url)
    prescriptionData = json.loads(prescriptionData.read().decode('utf-8'))
    prescriptionData = prescriptionData['result']['records']
    for data in prescriptionData:
        data['month'] = month
    return prescriptionData

def getPostcode(gpID):
    try:
        return postcodeToGPID[str(gpID)]
    except:
        return None

def generateAnalysis(drug):
    paragraphs = []
    if drug == 'Warfarin':
        paragraphs.append(
            "Cardivascular Diseases are one of the leading causes of death in the Scotland. Warfarin is used as a way to thin patients blood and prevent blood clots, thus it is a useful indicator of the cardiovascular health of an area."+
            "From our distribution map above and using warfarin as our indicator, it becomes clear that the west of Scotland has a much higher incidence of cardiovascular disease than the rest of the country. "+
            "The central belt in general has a higher incidence and this trends downwards the further north you go. This is posibly due to the greater availibility of fast foods availible in more densly populated areas."
        )
        paragraphs.append(
            "Unfortunately, due to the volitility of the dataset it is somewhat difficult to infer any corrolation from the line graph above. The data set has gaps due to lack of data availibility for certain months, and August and February"+
            "have vastly larger datasets than the other months for reasons that we are not entirely certain about. In an ideal situation where the data is not simply from opensourced data but rather the NHS Prescription database, more useful information"+
            "could be infered from this graph. In particular this graph would be useful when tracking antibiotic prescriptions as currently there is a widespread push to lower antibiotic usage due to the growing problem of antibiotic resistance."
        )
        paragraphs.append(
            ""
        )


@app.route("/")
def index():
    return render_template('index.html')

@app.route("/about")
def about():
    return render_template('about.html')

@app.route("/graphs/<drug>",methods = ['POST'])
def graphs(drug):
    #filename = os.path.join(app.static_folder, '/json/administrative/sco/lad.json')
    with app.open_resource('static/json/administrative/sco/lad.json') as f:
        data = json.load(f)

    paragraphs = generateAnalysis()


    if drug == "search":
        drug = request.form['drug']
    prescriptionData = getPrescriptionData(drug,'August')+getPrescriptionData(drug,'July')+getPrescriptionData(drug,'June')+getPrescriptionData(drug,'April')+getPrescriptionData(drug,'March')+getPrescriptionData(drug,'February')+getPrescriptionData(drug,'January')
    geocodes = {}

    for prescriptions in prescriptionData:
        if prescriptions['GPPractice'] in geocodes:
            if prescriptions['month'] not in geocodes[prescriptions['GPPractice']]['months']:
                geocodes[prescriptions['GPPractice']]['months'][prescriptions['month']] =1
            else:
                geocodes[prescriptions['GPPractice']]['months'][prescriptions['month']] = geocodes[prescriptions['GPPractice']]['months'][prescriptions['month']]+1
        else:
            postcode = getPostcode(prescriptions['GPPractice'])
            if postcode != None:
                geocodes[prescriptions['GPPractice']] = {
                    'GPPractice': prescriptions['GPPractice'],
                    "postcode":postcode['Postcode'],
                    'medicine':drug,
                    'lat':postcode['lat'],
                    'lng':postcode['lng'],
                    'months':{prescriptions['month']:1}
                }
    return render_template('graphs.html',prescriptionData = prescriptionData,geocodes = geocodes,prescriptionName = drug, map=data)
