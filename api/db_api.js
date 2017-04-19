const jsondb = require('node-json-db');

//helper function authorizeToken:
//makes sure the update is valid
function authorizeToken(id, token) {
  //console.log('id='+id+'token='+token);
  var db = new jsondb('api/db/flight_db', true, true);
  var tokens = db.getData('/token');
  for (var i in tokens) {
    if (token == tokens[i] && i == id) {
      return i;
    }
  }
  return false;
}

//helper function storejson:
//updates the databases with new stats
function updateJson(json) {
  console.log('authenticating...');
  var serverId = authorizeToken(json['id'], json['token']);
  if (serverId === false) {
    console.log('invalid token received. aborting');
    return "Invalid Token in updateJson";
  } else {
    //console.log('token validated, server ID: ' + serverId);
  }
  console.log('Performing DB update and backup...');
    //The second argument is used to tell the DB to save after each push
    //If you put false, you'll have to call the save() method.
    //The third argument is to ask JsonDB to save the database in an human readable format. (default false)
  var db = new jsondb('api/db/flight_db', true, true);
  //db.push('/token',{"0": "token","1":"token1"});
  var backupdb = new jsondb('api/db/flight_backup_db', true, true);
  try {
    var prevjson = db.getData('/');
  } catch(error) {
    return error;
  }
  backupdb.push('/', prevjson);
  //console.log('Updated Backup DB');
  db.push('/server/'+json['id'], json);
  //console.log('Updated Main DB');
      //https://github.com/Belphemur/node-json-db
      //Deleting data
      //db.delete("/info");
}

//helper function deTokenize:
//takes token and id out of json before sending it to public
function deTokenize(json) {
  for (var i in json) {
    json[i]['id'] = "redacted";
    json[i]['token'] = "redacted";
  }
  return json;
}

//helper function getJson:
//returns the server json currently stored in the main db
function getJson() {
  var relevant = [];
  var fdb = new jsondb('api/db/test', true, true);
  var json = fdb.getData('/server');
  return deTokenize(json);
}

module.exports = {
  update: function(json) {
    return updateJson(json);
  },
  getJson: function() {
    return getJson();
  }
};
