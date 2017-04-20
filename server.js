const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const API = require(path.join(__dirname, 'api/db_api.js'));
const port = 4000;
const name = '229th Server Stats';

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({limit:'5mb'}));
app.use('/js', express.static('views/js'));
app.use('/css', express.static('views/css'));
app.use('/assets', express.static('views/assets'));
app.set('view engine', 'ejs');

//index page
app.get('/', (req, res) => {
    var title = "S3 229th";
    res.render('html/index', {
        title: title,
        name: name
    });
});
//about page
app.get('/about', (req, res) => {
  var title = "S3 About";
  res.render('html/about', {
      title: title,
      name: name
  });
});

//API for WEB View
app.post('/api/web/fetch', (req, res) => {
  console.log('POST /api/web/fetch');
   res.json(API.getJson()); //send them the data they need
});

//API for DCS node_children
//update the database with new info
app.post('/api/dcs/slmod/update', (req, res) => {
  console.log('POST MISSION SERVER UPDATE:');
  console.log('Server: ' + req.body['name'] + ' id:' + req.body['id']);
  console.log('Access Token: ' + req.body['token']);
  //send it the stats and server info
  var error = API.update(req.body);
  if (error) {
    console.log('UPDATE FAILED!');
    console.log('ERROR: ' + error);
    res.end('fail'); //end transmission
  } else {
    console.log('Update Successful');
    res.end('pass'); //end transmission
  }

});

//serve app
app.listen(port, function() {
  console.log('listening on '+port);
});
