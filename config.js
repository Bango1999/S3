
// default: '229th Server Stats'
// what do you want to call your Web Server?
const name = '229th Server Stats';



// default: 4000
// on what port should I host your Web Server?
const port = 4000;



// default: 'patch.png'
// what is the name of the image you have stored in views/assets
//  that will be displayed in the page header
const logo = 'patch.png';



/*
  EDIT TOKENS BELOW ACCORDING TO YOUR NEEDS
    i.e. if you have 2 game servers posting to this app
    then give them each a token. You will need to share
    the id and token manually to its respective game server

    default:
      "0": "token_for_server_0",
      "1": "token_for_server_1"
*/
const tokens = {
  "0": "token_for_server_0",
  "1": "token_for_server_1"
};



/*
   AIRCRAFT STATS WHITELIST
    you dont want a column for every aircraft, or your table will be too wide.
    comment out aircraft you dont want included in the hours list
*/
const aircraft = [
  // "CA", //combined arms
  // "IL-76MD",
  // "MiG-21Bis",
  // "AJS37",
  // "Su-25",
  // "Su-27",
  // "MiG-29S",
  // "FW-190D9",
  // "MiG-15bis",
  // "ah-64d",
  // "SpitfireLFMkIX",
  // "L-39C",
  // "MiG-29A",
  // "L-39ZA",
  // "M-2000C",
  // "Su-25T",
  // "Bf-109K-4",
  // "F-5E-3",
  // "F-15C",
  // "F-86F Sabre",
  // "P-51D",
  // "A-10C",
  // "CobraH",
  "SA342M",
  "SA342L",
  "UH-1H",
  "Ka-50",
  "Mi-8MT"
];


// default: db
// what do you want to call your database?
const databaseName = 'db';

// default: db_backup
// what do you want to call your backup database?
const backupDatabaseName = 'db_backup';


//----------------------------------------------
//DO NOT EDIT PAST THIS LINE




module.exports = {
  getName: function() {
    return name
  },
  getLogo: function() {
    return logo
  },
  getPort: function() {
    return port
  },
  getTokens: function() {
    return tokens
  },
  getAircraft: function() {
    return aircraft
  },
  getDB: function() {
    return databaseName
  },
  getBDB: function() {
    return backupDatabaseName
  }
}
