try {
  const express = require('express');
} catch(e) {
  console.log('');
  console.log('Slow down there, Slick! You most likely still need to run the command "npm update"');
  console.log('( or execute the "Update_S3.bat" file in the project root folder )');
  console.log('');
  console.log('Otherwise, the real issue is that I cannot successfully "require(\'express\')" at the top of server.js');
  console.log('');
  return;
}
express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const API = require(path.join(__dirname, 'api/db_api.js'));
const CONFIG = require(path.join(__dirname, 'config.js'));
const LOGGER = require(path.join(__dirname, 'logger.js'));


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({limit:CONFIG.getPostJsonSizeLimit()}));
app.use('/js', express.static(path.join(__dirname, 'views/js')));
app.use('/css', express.static(path.join(__dirname, 'views/css')));
app.use('/json_viewer', express.static(__dirname + '/node_modules/jquery.json-viewer/json-viewer/'));
app.use('/assets', express.static(path.join(__dirname, 'views/assets')));
app.set('view engine', 'ejs');

//vars for easy logging
const e = 'error';
const i = 'info';
const t = 'task';

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
  LOGGER.log('WEB Server Stats Requested: Sending the JSON object', i);
  res.json(API.getJson()); //send them the data they need
});

//API for SLSC Server
//update the database with new info
app.post('/api/dcs/slmod/update', (req, res) => {
  LOGGER.log('DCS Server Stats Received: "' + req.body.name + '", ID ' + req.body.id, i);
  var err = API.update(req.body); //send it the stats and server info
  if (err) {
    LOGGER.log(err, e);
    res.end('fail');
  } else { res.end('pass') }

});

//serve app
app.listen(CONFIG.getPort() || 4000, function() {
  LOGGER.log('S3 Server listening on port ' + CONFIG.getPort(), t);
});
