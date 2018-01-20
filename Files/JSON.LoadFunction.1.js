// This code reads a Json File

function prettify(obj) {
  return JSON.stringify(obj, null, 4);
}

const loadJsonFile = require('load-json-file');

function Load(){
  loadJsonFile('Info1.json').then(json => {
      console.log(prettify(json.services[1]));
  })
}

// Main
Load()
