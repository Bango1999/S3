/*
  EDIT TOKENS BELOW ACCORDING TO YOUR NEEDS
    i.e. if you have 2 game servers posting to this app
    then give them each a token. You will need to share
    the id and token manually to its respective game server
*/
const var tokens = {
  "0": "token_for_server_0",
  "1": "token_for_server_1"
}

//default: db
//what do you want to call your database?
const var databaseName = 'db';

//default: db_backup
//what do you want to call your backup database?
const var backupDatabaseName = 'db_backup';

module.exports = {
  getTokens: function() {
    return tokens
  },
  getDB: function() {
    return databaseName
  },
  getBDB: function() {
    return backupDatabaseName
  }
}
