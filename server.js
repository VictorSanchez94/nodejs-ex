//  OpenShift sample Node application
var express = require('express'),
    fs      = require('fs'),
    app     = express(),
    eps     = require('ejs'),
    morgan  = require('morgan');
    
Object.assign=require('object-assign')

app.engine('html', require('ejs').renderFile);
app.use(morgan('combined'))

var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
    ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0',
    mongoURL = process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL,
    mongoURLLabel = "";

var player1Joined = false;
var player2Joined = false;
var winner = -1;

var gameInfo1 = {
  "offers": 3,
  "newDrones": 5
};

var gameInfo2 = {
  "offers": 3,
  "newDrones": 5
};

/*if (mongoURL == null && process.env.DATABASE_SERVICE_NAME) {
  var mongoServiceName = process.env.DATABASE_SERVICE_NAME.toUpperCase(),
      mongoHost = process.env[mongoServiceName + '_SERVICE_HOST'],
      mongoPort = process.env[mongoServiceName + '_SERVICE_PORT'],
      mongoDatabase = process.env[mongoServiceName + '_DATABASE'],
      mongoPassword = process.env[mongoServiceName + '_PASSWORD']
      mongoUser = process.env[mongoServiceName + '_USER'];

  if (mongoHost && mongoPort && mongoDatabase) {
    mongoURLLabel = mongoURL = 'mongodb://';
    if (mongoUser && mongoPassword) {
      mongoURL += mongoUser + ':' + mongoPassword + '@';
    }
    // Provide UI label that excludes user id and pw
    mongoURLLabel += mongoHost + ':' + mongoPort + '/' + mongoDatabase;
    mongoURL += mongoHost + ':' +  mongoPort + '/' + mongoDatabase;

  }
}
var db = null,
    dbDetails = new Object();

var initDb = function(callback) {
  if (mongoURL == null) return;

  var mongodb = require('mongodb');
  if (mongodb == null) return;

  mongodb.connect(mongoURL, function(err, conn) {
    if (err) {
      callback(err);
      return;
    }

    db = conn;
    dbDetails.databaseName = db.databaseName;
    dbDetails.url = mongoURLLabel;
    dbDetails.type = 'MongoDB';

    console.log('Connected to MongoDB at: %s', mongoURL);
  });
};*/

app.get('/test', function (req, res) {
  res.send('HOLA HOLA!');
});

app.get('/join', function (req, res) {
  if (player1Joined === false) {
    var r = {
      "id": 1,
      "offers": gameInfo1.offers,
      "newDrones": gameInfo1.newDrones
    };
    res.send(r);
    player1Joined = true;
    gameInfo1.newDrones = 0;
  }
  else{
    var r = {
      "id": 2,
      "offers": gameInfo2.offers,
      "newDrones": gameInfo2.newDrones
    };
    res.send(r);
    player2Joined = true;
    gameInfo2.newDrones = 0;
  }
});

app.get('/requestToInit', function (req, res) {
  if (player1Joined === true && player2Joined === true) {
    res.send('INITGAME');
  }
  else {
    res.send('WAIT');
  }
});

app.post('/updateState', function (req, res) {
  if (req.id == 1) {   //Player 1
    /*gameInfo1.offers = req.offers;
    if (gameInfo1.offers === 0 && winner === -1) {
      winner = 2;
    }
    gameInfo2.newDrones = req.newDrones;
    if (winner === 1) {
      res.send('WINNER');
    }
    else{
      var r = {
        "newDrones": gameInfo1.newDrones
      };
      res.send(r);
      gameInfo1.newDrones = 0;
    }*/
    res.send('PLAYER1 UPDATED');
  }
  else {                 //Player 2
    /*gameInfo2.offers = req.offers;
    if (gameInfo2.offers === 0 && winner === -1) {
      winner = 1;
    }
    gameInfo1.newDrones = req.newDrones;
    if (winner === 2) {
      res.send('WINNER');
    }
    else {
      var r = {
        "newDrones": gameInfo2.newDrones
      };
      res.send(r);
      gameInfo2.newDrones = 0;
    }*/
    res.send('PLAYER2 UPDATED');
  }
});


app.get('/gameInfo/:id', function (req, res) {
  if (req.params.id === 1) {
    res.send(gameInfo1);
  }
  else {
    res.send(gameInfo2);
  }
});

app.get('/gameInfo/offers/:id', function (req, res) {
  if (req.params.id === 1) {
    res.send(gameInfo1.offers);
  }
  else {
    res.send(gameInfo2.offers);
  }});

app.get('/gameInfo/drones/:id', function (req, res) {
  if (req.params.id === 1) {
    res.send(gameInfo1.newDrones);
  }
  else {
    res.send(gameInfo2.newDrones);
  }
});

app.post('/gameInfo/addDrones', function (req, res) {
  if (req.id === 1) {
    gameInfo2.newDrones = gameInfo2.newDrones + req.newDrones;
    res.send('OK');
  }
  else {
    gameInfo1.newDrones = gameInfo1.newDrones + req.newDrones;
    res.send('OK');
  }
});

// error handling
app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500).send('Something bad happened!');
});

/*initDb(function(err){
  console.log('Error connecting to Mongo. Message:\n'+err);
});*/

app.listen(port, ip);
console.log('Server running on http://%s:%s', ip, port);

module.exports = app ;
