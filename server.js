const process = require('process');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const API = require(path.join(__dirname, 'api/db_api.js'));
const CONFIG = require(path.join(__dirname, 'config.js'));


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({limit:CONFIG.getPostJsonSizeLimit()}));
app.use('/js', express.static(path.join(__dirname, 'views/js')));
app.use('/css', express.static(path.join(__dirname, 'views/css')));
app.use('/assets', express.static(path.join(__dirname, 'views/assets')));
app.set('view engine', 'ejs');

const LOGLEVEL = process.argv[2] || '-d';

//vars for easy logging
const e = 'error';
const i = 'info';
const t = 'task';

//global function for succinct logging ability
//only log what the process wanted us to log
function log(data, level) {
  switch (level) {
    case 'error': //log all errors
      console.log(data);
      break;
    case 'info': //only log info if verbose flag
      if (LOGLEVEL == '-v') {console.log(data)}
      break;
    case 'task': //log task-level log only if the silent flag is not set
      if (LOGLEVEL != '-s') {console.log(data)}
      break;
    default: //something is amiss, we better just log it
      console.log(data);
  }
}

//serve index page
app.get('/', (req, res) => {
    res.render('html/index', {
        title: 'S3 ' + CONFIG.getName(),
        name: CONFIG.getName(),
        logo: CONFIG.getLogo()
    });
});
//serve about page
app.get('/about', (req, res) => {
  res.render('html/about', {
    title: 'S3 About',
    name: CONFIG.getName()
  });
});

//API for WEB View
app.post('/api/web/fetch', (req, res) => {
  log('WEB Server Stats Requested: Sending the JSON object', i);
  res.json(API.getJson()); //send them the data they need
});

//API for SLSC Server
//update the database with new info
app.post('/api/dcs/slmod/update', (req, res) => {
  log('DCS Server Stats Received: "' + req.body.name + '", ID ' + req.body.id, i);
  var err = API.update(req.body); //send it the stats and server info
  if (err) {
    log(err, e);
    res.end('fail');
  } else { res.end('pass') }

});

//serve app
app.listen(CONFIG.getPort() || 4000, function() {
  log('S3 Server listening on port ' + CONFIG.getPort(), t);
});
