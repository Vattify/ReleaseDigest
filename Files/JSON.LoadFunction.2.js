// This code sucessfully makes a JSON file, with individual updates

function prettify(obj) {
  return JSON.stringify(obj, null, 4);
}

const writeJsonFile = require('write-json-file');
const loadJsonFile = require('load-json-file');
const updateJsonFile = require('update-json-file');
const filename = 'Info2.json'
const fs = require('fs');

function WriteFirst(){
  fs.writeFileSync(filename, "{ \"services\": \[")
  console.log("First"); }

function Append(){
  fs.appendFileSync(filename, prettify({
                                  service :{
                                    fixVersions :[{
                                        versionName : "a",
                                        deploymentInfo :{
                                          datetime :"b",
                                          who :"c"
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

function Load(){
  loadJsonFile(filename).then(json => {
      console.log(prettify(json.services[1]));
  })
}

function run(){
  WriteFirst(),
  Append(),
  AppendComma(),
  Append(),
  AppendLast();
  Load();
}

// Main
run();
