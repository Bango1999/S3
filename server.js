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

//index page
app.get('/', (req, res) => {
    res.render('html/index', {
        title: 'S3 ' + CONFIG.getName(),
        name: CONFIG.getName(),
        logo: CONFIG.getLogo()
    });
});
//about page
app.get('/about', (req, res) => {
  res.render('html/about', {
    title: 'S3 About',
    name: CONFIG.getName()
  });
});

//API for WEB View
app.post('/api/web/fetch', (req, res) => {
  console.log('POST /api/web/fetch');
  res.json(API.getJson()); //send them the data they need
});

//API for SLSC Server
//update the database with new info
app.post('/api/dcs/slmod/update', (req, res) => {
  console.log('DCS Server Stats Received from Server [ ' + req.body.name + ' ] with ID [ ' + req.body.id + ' ]');
  var err = API.update(req.body); //send it the stats and server info
  if (err) {
    console.log('API UPDATE ERROR: ');
    console.log(err);
    res.end('fail');
  } else { res.end('pass') }

});

//serve app
app.listen(CONFIG.getPort() || 4000, function() {
  console.log('listening on ' + CONFIG.getPort());
});
