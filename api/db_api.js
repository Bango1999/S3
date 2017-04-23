const jsondb = require('node-json-db');
const CONFIG = require('../config.js');
const LOGGER = require('../logger.js');

//vars for easy logging
const e = 'error';
const i = 'info';
const t = 'task';

const DB = 'api/db/' + CONFIG.getDB();
const BDB = 'api/db/' + CONFIG.getBDB();

//helper function deTokenize:
//takes token and id out of json before sending it to public
function deTokenize(json) {
  for (var i in json) {
    json[i]['id'] = "redacted";
    json[i]['token'] = "redacted";
  }
  return json;
}

//helper function addAircraft:
//adds aircraft whitelist from config, so only relevant aircraft flight hrs shown
function addAircraft(json) {
  json['whitelistedAircraft'] = CONFIG.getAircraft();
  return json;
}

//helper function addKillObjects:
//adds aircraft whitelist from config, so only relevant aircraft flight hrs shown
function addKillObjects(json) {
  json['whitelistedKillObjects'] = CONFIG.getKillObjects();
  return json;
}

//helper function integerIncrementNameHashes:
//removes hashes from the stats json, could be somewhat private data
function integerIncrementNameHashes(json) {
  var id = 1;
  for (var hash in json['stats']) { //for each hashed player node
    json['stats'][id++] = json['stats'][hash]; //make a new node as integer ID
    delete json['stats'][hash]; //delete the old hashed node
  }
  return json;
}

//helper function setDisplayNames:
//helpful for units with standard handle tags
function setDisplayNames(json) {
  for (var pid in json['stats']) { //for each hashed player node
    var lastName;
    for (var id in json['stats'][pid]['names']) {
      //console.log(json['stats'][pid]['names'][id]);
      var foundOfficial = false;
      if (json['stats'][pid]['names'][id].indexOf(CONFIG.getHandleTag()) != -1) {
        //console.log('found official');
        json['stats'][pid]['name'] = json['stats'][pid]['names'][id];
        foundOfficial = true;
        break;
      }
      lastName = json['stats'][pid]['names'][id];
    }
    if (!foundOfficial) {
      //console.log('didnt find official');
      json['stats'][pid]['name'] = lastName;
    }
  }
  return json;
}

//helper function updateTokens:
//update tokens in the db with whats in the config
function updateTokens() {
  var db = new jsondb(DB, true, true);
  db.push('/token',CONFIG.getTokens());
}
updateTokens(); //do it now

//helper function authorizeToken:
//makes sure the update is valid
function authorizeToken(id, token) {
  var db = new jsondb(DB, true, true);
  try { var tokens = db.getData('/token') }
  catch(err) {
    LOGGER.log('ERROR: Either the DB "'+ DB + '.json" does not exist, or there is no ["token"] index within it',e);
    return false; //dont authorize token
  }
  for (var i in tokens) {
    if (token == tokens[i] && i == id) {
      return i; //authorize token
    }
  }
  return false; //dont authorize token
}

//helper function storejson:
//updates the databases with new stats
function updateJson(json) {
  var serverId = authorizeToken(json['id'], json['token']);
  if (serverId === false) {
    return 'Invalid Token, Aborting DB Update';
  } else { LOGGER.log('Token validated, server ID: ' + serverId, i) }
  LOGGER.log('Performing DB update and backup...',i);

        //The second argument is used to tell the DB to save after each push
        //If you put false, you'll have to call the save() method.
        //The third argument is to ask JsonDB to save the database in an human readable format. (default false)
  var db = new jsondb(DB, true, true);
  var backupdb = new jsondb(BDB, true, true);
  try { var prevjson = db.getData('/') }
  catch(err) { return 'ERROR: Either the DB "'+ DB + '.json" does not exist, or there is no-thing "{}" within it' }
  backupdb.push('/', prevjson);
  LOGGER.log('Updated Backup DB',i);
  json = integerIncrementNameHashes(json);
  json = setDisplayNames(json);
  db.push('/server/'+json['id'], json);
  LOGGER.log('Updated Main DB',i);
      //https://github.com/Belphemur/node-json-db
      //Deleting data
      //db.delete("/info");
}

//helper function getJson:
//returns the server json currently stored in the main db
function getJson() {
  var fdb = new jsondb(DB, true, true);
  try { var json = fdb.getData('/server') }
  catch(err) {
    LOGGER.log('ERROR: Trying to send data to web client, but no data is available.',i);
    LOGGER.log('(Have you started recieving SLmod Stats data yet from any SLSC servers?)',i);
    LOGGER.log('Technical info: Either the DB "'+ DB + '.json" does not exist, or there is no ["server"] index within it',i);
    return false; //return empty object
  }
  return addKillObjects(addAircraft(deTokenize(json)));
}

module.exports = {
  update: function(json) { return updateJson(json) },
  getJson: function() { return getJson() }
};
