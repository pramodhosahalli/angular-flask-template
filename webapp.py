from flask import Flask,render_template,request
import json
import random
app = Flask(__name__)

imageList = {}

@app.route("/health")
def healthCheck():
    return "Hello, World!"

@app.route("/getImages")
def getImages():
    return imageList

@app.route("/uploadImages", methods = ["POST"])
def uploadImages():
    objectId = str(random.randint(0,10000000))
    imageList[objectId] = request.json
    return getImages()

@app.route("/deleteImages", methods = ["POST"])
def deleteImages():
    for objectId in request.json.keys():
        del imageList[objectId]
    return getImages()


@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run()