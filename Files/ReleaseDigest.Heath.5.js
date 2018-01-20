// Coded by Kira Boettcher & Natalia Harrow - January 2018
// Powered By Javascript, Node.JS, JSON
// Accesses MediaMath's internal tool Heath, a Deployment Ledger that accesses DynamoDB with authorization from OAuth

// Extracts Deployment Data and Creates seperate JSON file

// Base Authentication Variables
const fetch = require('node-fetch');
const baseUrl = "https://heath.infra.mediamath.com/";
const auth0Url = "https://sso.mediamath.auth0.com/oauth/token";
const clientId = "xxxxxxxxxxxxxxxxxxxxxxxxxxx"
const clientSecret = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

// The required parameters for authentication
const authPayload = {
  "client_id": clientId,
  "client_secret": clientSecret,
  "scope": "write:deployments",
  "audience": baseUrl,
  "grant_type": "client_credentials"
};

// Function that converts Json objects into a readable Javascript String
function prettify(obj) {
  return JSON.stringify(obj, null, 3);
}

// Function that retrieves JSON Web Token
function getJWT() {
  return fetch(auth0Url, {
    method: "POST",
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(authPayload)
  })
    .then(result => result.json())
    .then(body => {
      console.dir(body);
      return body.access_token
    });
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Functions and Constants for creating a readable JSON file
const filename = 'ReleaseExample.json'
const fs = require('fs');

function WriteFirst(){
  fs.writeFileSync(filename, "{ \"services\": \[")
  console.log("First"); }

function Append(vname,vdate,vwho){
  fs.appendFileSync(filename, prettify({
                                  service :{
                                    fixVersions :[{
                                        versionName : vname,
                                        deploymentInfo :{
                                          datetime :vdate,
                                          who : vwho
                                        }
                                    }]
                                  }
                              },),
                            (err) => {if (err) throw wee;
                          console.log("Append");})
                            }

function AppendComma(){
  fs.appendFileSync(filename,",")
  console.log("Comma");;
}

function AppendLast(){
  fs.appendFileSync(filename, "\]\}" )
  console.log("Last");
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Function that retrieves database information
function Retrieve(jwt, Data) {
  return fetch('https://heath.infra.mediamath.com/deployments/search', {
    method: "POST",
    body: JSON.stringify(Data),
    headers: {
      "Authorization":`Bearer ${jwt}`,
    },
})
  .then(result => result.json())
// Loop to access each database object (hit) individually and append values into outside document
  .then((body) => {
    for(i = 0; i < body.hits.hits.length; i++){
    vname = (body.hits.hits[i]._source.extra["fix-version"]),
    vdate = (body.hits.hits[i]._source.preDeploymentTimestamp),
    vwho = (body.hits.hits[i]._source.deployedBy)
      if (i+1 != body.hits.hits.length) {
        Append(vname,vdate,vwho),
        AppendComma()
      }
      else if (i+1 == body.hits.hits.length) {
        Append(vname,vdate,vwho),
        AppendLast()
      }
  }
})
}
// Eleastic Search Query
const Data = {
  "query": {
    "bool": {
      "must": [{ "range": { "preDeploymentTimestamp": {"gte" : "1510448400","lt" :  "1510554329.032"}}}],
    }
}}

// Main
WriteFirst(),
getJWT().then((jwt) => {
  Retrieve(jwt, Data);
});
