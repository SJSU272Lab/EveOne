// MEAN Stack RESTful API Tutorial - Contact List App

var express = require('express');
var app = express();
var mongojs = require('mongojs');
var bodyParser = require('body-parser');
var db = mongojs('user1:user1@ds155087.mlab.com:55087/272school',['schoollist']);
var session = require('express-session');

var sess;
var sess_p;

app.use(session({
    secret: 'secret',
    saveUninitialized: false,
    resave: false,
    HttpOnly: false, 
    
}));

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

app.get('/studentlist/:name', function (req, res) {
  console.log('I received a student GET request');
	console.log(req.params.name);
  db.studentlist.find({"schoolUsername":req.params.name}, function (err, docs) {
    console.log(docs);
    res.json(docs);
  });
});

app.post('/studentlist/:name', function (req, res) {
  console.log(req.body);
  req.body.schoolUsername=req.params.name;
  db.studentlist.insert(req.body, function(err, doc) {
    res.json(doc);
  });
});

app.delete('/studentlist/:id', function (req, res) {
  var id = req.params.id;
  console.log(id);
  db.studentlist.remove({_id: mongojs.ObjectId(id)}, function (err, doc) {
    res.json(doc);
  });
});

app.get('/studentlistbyid/:id', function (req, res) {
  var id = req.params.id;
  console.log(id);
  db.studentlist.findOne({_id: mongojs.ObjectId(id)}, function (err, doc) {
    res.json(doc);
  });
});

app.put('/studentlist/:id', function (req, res) {
  var id = req.params.id;
  console.log(req.body.name);
  db.studentlist.findAndModify({
    query: {_id: mongojs.ObjectId(id)},
    update: {$set: {name: req.body.name, parentName: req.body.parentName, parentEmail: req.body.parentEmail, parentContactnumber: req.body.parentContactnumber}},
    new: true}, function (err, doc) {
      res.json(doc);
    }
  );
});

//school registration and login
//user sign up
//insert user details
app.post('/schoollist', function (req, res) {
  console.log(req.body);
  db.schoollist.insert(req.body, function(err, doc) {
    res.json(doc);
  });
});

//check valid username and password
app.get('/schoollist/:name/:password', function (req, res) {
	
  console.log('I received a GET request');

  db.schoollist.find({},{"username":1,"password":1,_id:0}).toArray(function (err, docs) {
	console.log(docs);
	//console.log(docs[0].username);
	flag = "unsuccessful";
	
	for (i=0; i<docs.length; i++)
	{
		if(docs[i].username.toString() == req.params.name.toString() & docs[i].password.toString() == req.params.password.toString())
		{
			console.log('successful');
			flag = "successful"
			break;
		}
	}
	
	if(flag == "successful")
	{
		/*res.setHeader('Set-Cookie', cookie.serialize('username', String(req.params.name), {
			httpOnly: true,
		}));*/
		sess = req.session;
		sess.username=req.params.name;
		res.send("successful");
	}
	else
	{
		res.send("unsuccessful");
	}
	
  });
});


//session check
app.get('/sessioncheck', function (req, res) {
	
  console.log('I received a session check request');
  sess = req.session;
	
  if(sess.username)
  {
	  res.send(sess.username);
  }
  else
  {
	  res.send("not exist");
  }
	
});

//session destroy
app.get('/sessiondestroy', function (req, res) {
	
  console.log('I received a session destroy request');
  sess = req.session;
  sess.destroy(function(err) {
        if(err){
             console.log('Error destroying session');
			 res.send("not done");
        }else{
            console.log('Session destroy successfully');
			res.send("done");
        }
    });
	
});



app.listen(3000);
console.log("Server running on port 3000");