// Coded by Kira Boettcher & Natalia Harrow - January 2018
// Powered By Javascript, Node.JS, JSON
// Accesses MediaMath's internal tool Heath, a Deployment Ledger that accesses DynamoDB with authorization from OAuth

// Uses Elastic Search to select files from between two dates

const fetch = require('node-fetch');
const baseUrl = "https://heath.infra.mediamath.com/";
const auth0Url = "https://sso.mediamath.auth0.com/oauth/token";
const preDeployUrl = baseUrl + "pre-deploy";
const clientId = "xxxxxxxxxxxxxxxxxxxxxxxxxxx"
const clientSecret = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

const authPayload = {
  "client_id": clientId,
  "client_secret": clientSecret,
  "scope": "write:deployments",
  "audience": baseUrl,
  "grant_type": "client_credentials"
};

function prettify(obj) {
  return JSON.stringify(obj, null, 4);
}

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
      return body.access_token;
    });
}

function Retrieve(jwt, Data) {
  return fetch('https://heath.infra.mediamath.com/deployments/search', {
    method: "POST",
    body: JSON.stringify(Data),
    headers: {
      "Authorization":`Bearer ${jwt}`,
    },
})
  .then(result => result.json())
  .then((body) => {
    console.log(prettify(body));
  });
}

const Data = {
  "query": {
    "bool": {
      "must": [{ "range": { "preDeploymentTimestamp": {"gte" : "1510448400","lt" :  "1510554329.032"}}}],
    }
}}

getJWT().then((jwt) => {
  Retrieve(jwt, Data);
});
