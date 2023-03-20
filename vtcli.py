from pyhocon import ConfigFactory
import argparse
import requests
import pprint
import os
import time
import sys

       
conf = ConfigFactory.parse_file("./secrets.conf")

headers = {
    "x-apikey": conf.get("api_key")
}

def getReport(url):
    # just a pretty print wrapper
    # takes any object
    # returns None
    def printer(dataDict):
        for out in dataDict:
            res = out[1].get("data").get("attributes").get("stats")
            items = out[1].get("data").get("attributes").get("stats").items()
            
            return items

    # reads the response
    # takes a list or response object
    # changes response object to list
    # returns array of response objects dictonaries
    def readResponse(uploadResponse):
        params = []
        # changes type to list if its not a list
        if(type(uploadResponse[0]) is list):
            params = uploadResponse
        else: 
            params.append(uploadResponse)
        responses = []
        for name, i in params:
            if "error" in i:
                continue

            response = requests.get("https://www.virustotal.com/api/v3/analyses/{}".format(i["data"]["id"]), headers=headers)
            responceObj = response.json()
            while responceObj.get("data").get("attributes").get("status") == "queued":
                print("waiting for response for {}".format(name))
                response = requests.get("https://www.virustotal.com/api/v3/analyses/{}".format(i["data"]["id"]), headers=headers)
                responceObj = response.json()
                time.sleep(1.5)
            
            responses.append([name,responceObj])

        return responses

    # sends a url to VT endpoint
    # takes string
    # returns response object
    def sendUrl(path):
        url = {'url': (None, path)}
        response = requests.post("https://www.virustotal.com/api/v3/urls", headers=headers, data=url )
        
        if response.status_code != requests.codes.ok:
            shutdown("error code: {}\nerror message: {}".format(response.json()["error"]["code"], response.json()["error"]["message"]))
        return [path, response.json()]

    return printer(
        readResponse(
            sendUrl(url)
        )
    )