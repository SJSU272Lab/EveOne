var express = require('express');
var app = express();
var mongojs = require('mongojs');
var db = mongojs('user:user@ds149437.mlab.com:49437/eveone', ['studentlist']);
var bodyParser = require('body-parser');

var logger = require('morgan');
app.use(logger("dev"));



var stormpath = require('express-stormpath');


app.use(stormpath.init(app,{
  
    client: {
        apiKey: {
            id: '3A6ERPYU38GCYC8BL0KT6RZ6C',
            secret:'5rLj+wlNcTrsdahJMMOZ7LHrkzQsEWbq7oplTHFS8u0'
        }
    },
     application:{

    href:'https://api.stormpath.com/v1/applications/6t5AvCQz6ffrIcm9cZk8ds'
 }


}));



app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());


app.get('/test',stormpath.apiAuthenticationRequired, function(req,res){
  res.json({ Autheticated: true});
});

app.get('/studentlist',stormpath.apiAuthenticationRequired, function (req, res) {
  console.log('I received a GET request');

  db.studentlist.find(function (err, docs) {
    console.log(docs);
    res.json(docs);
  });
});

app.post('/studentlist',stormpath.apiAuthenticationRequired, function (req, res) {
  console.log(req.body);
  db.studentlist.insert(req.body, function(err, doc) {
    res.json(doc);
  });
});

app.delete('/studentlist/:id',stormpath.apiAuthenticationRequired, function (req, res) {
  var id = req.params.id;
  console.log(id);
  db.studentlist.remove({_id: mongojs.ObjectId(id)}, function (err, doc) {
    res.json(doc);
  });
});

app.get('/studentlist/:id',stormpath.apiAuthenticationRequired, function (req, res) {
  var id = req.params.id;
  console.log(id);
  db.studentlist.findOne({_id: mongojs.ObjectId(id)}, function (err, doc) {
    res.json(doc);
  });
});

app.put('/studentlist/:id',stormpath.apiAuthenticationRequired, function (req, res) {
  var id = req.params.id;
  console.log(req.body.name);
  db.studentlist.findAndModify({
    query: {_id: mongojs.ObjectId(id)},
    update: {$set: {name: req.body.name, parentemailid: req.body.parentemailid, parentno: req.body.parentno, parentname: req.body.parentname, sid: req.body.sid }},
    new: true}, function (err, doc) {
      res.json(doc);
    }
  );
});

app.on('stormpath.ready', function() {
  app.listen(3000);
  console.log("Server running on port 3000");
});

