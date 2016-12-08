var express = require('express');
var app = express();
var mongojs = require('mongojs');
var bodyParser = require('body-parser');
//var db = mongojs('user1:user1@ds155087.mlab.com:55087/272school',['schoollist']);
var db = mongojs('user1:user1@ds113668.mlab.com:13668/272school', ['schoollist']);
var session = require('express-session');

var sess;
var sess_p;

app.use(session({
  secret: 'secret',
  saveUninitialized: false,
  resave: false,
  HttpOnly: false,
  maxAge: 10000
}));

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

app.get('/studentlist/:name', function (req, res) {
  console.log('I received a student GET request');
  console.log(req.params.name);
  db.studentlist.find({
    "schoolUsername": req.params.name
  }, function (err, docs) {
    console.log(docs);
    res.json(docs);
  });
});

app.post('/studentlist/:name', function (req, res) {
  console.log(req.body);
  req.body.schoolUsername = req.params.name;
  db.studentlist.insert(req.body, function (err, doc) {
    res.json(doc);
  });
});

app.delete('/studentlist/:id', function (req, res) {
  var id = req.params.id;
  console.log(id);
  db.studentlist.remove({
    _id: mongojs.ObjectId(id)
  }, function (err, doc) {
    res.json(doc);
  });
});

app.get('/studentlistbyid/:id', function (req, res) {
  var id = req.params.id;
  console.log(id);
  db.studentlist.findOne({
    _id: mongojs.ObjectId(id)
  }, function (err, doc) {
    res.json(doc);
  });
});

app.put('/studentlist/:id', function (req, res) {
  var id = req.params.id;
  console.log(req.body.name);
  db.studentlist.findAndModify({
    query: {
      _id: mongojs.ObjectId(id)
    },
    update: {
      $set: {
        name: req.body.name,
        parentName: req.body.parentName,
        parentEmail: req.body.parentEmail,
        parentContactnumber: req.body.parentContactnumber
      }
    },
    new: true
  }, function (err, doc) {
    res.json(doc);
  });
});

//school registration and login
//user sign up
//insert user details
app.post('/schoollist', function (req, res) {
  console.log(req.body);
  db.schoollist.insert(req.body, function (err, doc) {
    res.json(doc);
  });
});

//check valid username and password
app.get('/schoollist/:name/:password', function (req, res) {

  console.log('I received a GET request');

  db.schoollist.find({}, {
    "username": 1,
    "password": 1,
    _id: 0
  }).toArray(function (err, docs) {
    console.log(docs);
    //console.log(docs[0].username);
    flag = "unsuccessful";

    for (i = 0; i < docs.length; i++) {
      if (docs[i].username.toString() == req.params.name.toString() & docs[i].password.toString() == req.params.password.toString()) {
        console.log('successful');
        flag = "successful"
        break;
      }
    }

    if (flag == "successful") {
      /*res.setHeader('Set-Cookie', cookie.serialize('username', String(req.params.name), {
      	httpOnly: true,
      }));*/
      sess = req.session;
      sess.username = req.params.name;
      res.send("successful");
    } else {
      res.send("unsuccessful");
    }

  });
});


//session check
app.get('/sessioncheck', function (req, res) {

  console.log('I received a session check request');
  sess = req.session;

  if (sess.username) {
    res.send(sess.username);
  } else {
    res.send("not exist");
  }

});

//session destroy
app.get('/sessiondestroy', function (req, res) {

  console.log('I received a session destroy request');
  sess = req.session;
  sess.destroy(function (err) {
    if (err) {
      console.log('Error destroying session');
      res.send("not done");
    } else {
      console.log('Session destroy successfully');
      res.send("done");
    }
  });

});

//user profile info for school
app.get('/schoolprofile/:name', function (req, res) {

  console.log('I received a GET request');

  db.schoollist.findOne({
    "username": req.params.name
  }, (function (err, docs) {
    console.log(docs);
    res.send(docs);

  }));
});

//get event detials by school username 
app.get('/geteventlist/:name', function (req, res) {

  console.log('I received a GET request');

  db.eventlist.find({
    "schoolUsername": req.params.name
  }, (function (err, docs) {
    console.log(docs);
    res.send(docs);

  }));
});

//get school name by school username
app.get('/getschoolname/:name', function (req, res) {

  console.log('I received a GET request');

  db.schoollist.findOne({
    "username": req.params.name
  }, (function (err, docs) {
    console.log(docs);
    res.send(docs);

  }));
});

//get all school name from schoollist
app.get('/getschoollist', function (req, res) {

  //get school details
  db.schoollist.find({}, (function (err, docs) {
    console.log(docs);
    res.send(docs);

  }));
});

//get invited event list from event list
app.get('/getinvitedeventlist/:name', function (req, res) {

  console.log('I received a GET request');

  db.eventlist.find({
    "schoolName": req.params.name
  }, (function (err, docs) {
    console.log(docs);
    res.send(docs);

  }));
});

//insert event details -> eventlist
app.post('/addeventlist/:name', function (req, res) {
  console.log(req.body);
  req.body.invited = [];
  req.body.schoolUsername = req.params.name;
  db.eventlist.insert(req.body, function (err, doc) {
    res.json(doc);
  });
});

//insert inot event notification list ->  invitee school username, school name, event_id
app.post('/eventnotification/:name/:id/:username', function (req, res) {
  console.log(req.body);

  db.eventnotificationlist.insert({
    "schoolName": req.params.name,
    "eventId": req.params.id,
    "schoolUsername": req.params.username
  }, function (err, doc) {
    res.json(doc);
  });
});

//get notification data for invited school from eventnotificationlist
app.get('/geteventnotification/:name', function (req, res) {

  console.log('I received a GET request');

  db.eventnotificationlist.find({
    "schoolName": req.params.name
  }, (function (err, docs) {
    console.log(docs);
    res.send(docs);

  }));
});

// get event data based on event Id
app.get('/geteventlistnoti/:id', function (req, res) {

  console.log('I received a GET request');

  db.eventlist.findOne({
    _id: mongojs.ObjectId(req.params.id)
  }, (function (err, docs) {
    console.log(docs);
    res.send(docs);

  }));
});

//when school clicks on Okay button of Notification Table (dashboard) -> delete entry from notification table
app.delete('/deleteeventnotification/:id/:name', function (req, res) {
  var id = req.params.id;
  console.log(id + " and " + req.params.name);

  db.eventnotificationlist.remove({
    "eventId": id,
    "schoolName": req.params.name
  }, function (err, doc) {
    res.json(doc);
  });
});

//insert inot parent notification list ->  invitee school name, event id, parent mail Id
app.post('/parentnotification/:id/:name/:email', function (req, res) {
  console.log(req.body);

  db.parentnotification.insert({
    "schoolName": req.params.name,
    "eventId": req.params.id,
    "ParentEmail": req.params.email
  }, function (err, doc) {
    res.json(doc);
  });
});

//get parent Email by schoolusername
app.get('/getparentemail/:name', function (req, res) {

  console.log('I received a GET request : ' + req.params.name);

  db.studentlist.find({
    "schoolUsername": req.params.name
  }, (function (err, docs) {
    console.log(docs);
    res.send(docs);

  }));
});

//update event list when school clicks on invite button of parent invitation
app.put('/updateinviteineventlist/:name/:id', function (req, res) {

  console.log("name " + req.params.name + " id " + req.params.id);
  db.eventlist.findAndModify({
    query: {
      "_id": mongojs.ObjectId(req.params.id)
    },
    update: {
      $push: {
        "invited": req.params.name
      }
    },
    new: true
  }, function (err, doc) {
    console.log('update' + doc);
    res.json(doc);
  });
});


//update event list when school wants to edit event info
app.put('/updateeventlist/:id', function (req, res) {

  console.log(" id " + req.params.id);
  db.eventlist.findAndModify({
    query: {
      "_id": mongojs.ObjectId(req.params.id)
    },
    update: {
      $set: {
        "eventName": req.body.eventName,
        "team": req.body.team,
        "member": req.body.member,
        "date": req.body.date,
        "time": req.body.time,
        "instruction": req.body.instruction
      }
    },
    new: true
  }, function (err, doc) {
    console.log('update' + doc);
    res.json(doc);
  });
});


//get number of teams by event name
app.get('/getteamnumber/:name', function (req, res) {

  db.eventlist.findOne({
    eventName: req.params.name
  }, (function (err, docs) {
    console.log(docs);
    res.send(docs);

  }));
});

//****************** Parent *****************
//check valid username and password
app.get('/parentauth/:name/:password', function (req, res) {

  console.log('I received a GET request');

  db.studentlist.find({}, {
    "parentEmail": 1,
    "parentContactnumber": 1,
    _id: 0
  }).toArray(function (err, docs) {
    console.log(docs);
    //console.log(docs[0].username);
    flag = "unsuccessful";

    for (i = 0; i < docs.length; i++) {
      if (docs[i].parentEmail.toString() == req.params.name.toString() & docs[i].parentContactnumber.toString() == req.params.password.toString()) {
        console.log('successful');
        flag = "successful"
        break;
      }
    }

    if (flag == "successful") {
      /*res.setHeader('Set-Cookie', cookie.serialize('username', String(req.params.name), {
      	httpOnly: true,
      }));*/
      sess_p = req.session;
      sess_p.username = req.params.name;
      res.send("successful");
    } else {
      res.send("unsuccessful");
    }

  });
});


//session check
app.get('/sessioncheckParent', function (req, res) {

  console.log('I received a session check request');
  sess_p = req.session;

  if (sess_p.username) {
    res.send(sess_p.username);
  } else {
    res.send("not exist");
  }

});

//session destroy
app.get('/sessiondestroyParent', function (req, res) {

  console.log('I received a session destroy request');
  sess_p = req.session;
  sess_p.destroy(function (err) {
    if (err) {
      console.log('Error destroying session');
      res.send("not done");
    } else {
      console.log('Session destroy successfully');
      res.send("done");
    }
  });

});

//**************************************************

//user profile info for parent -> by username (parent email)
app.get('/parentprofile/:email', function (req, res) {

  console.log('I received a GET request');

  db.studentlist.findOne({
    "parentEmail": req.params.email
  }, (function (err, docs) {
    console.log(docs);
    res.send(docs);

  }));
});

//get event id from parent notification table by parent username
app.get('/checkparentIdintoNoti/:email', function (req, res) {

  console.log('I received a parent GET request');

  db.parentnotification.find({
    "ParentEmail": req.params.email
  }, (function (err, docs) {
    console.log(docs);
    res.send(docs);

  }));
});

//insert into judge list
app.post('/judgelist/:id/:username/:school', function (req, res) {
  console.log(req.body);
  req.body.schoolUsername = req.params.school;
  req.body.parentEmail = req.params.username;
  req.body.eventId = req.params.id;
  req.body.assign = "no";
  req.body.reached = "no";
  db.judgelist.insert(req.body, function (err, doc) {
    res.json(doc);
  });
});

//when parent clicks on Okay button of Parent Notification Table (dashboard) -> delete entry from notification table
app.delete('/deleteparenteventnotification/:id/:name', function (req, res) {
  var id = req.params.id;
  console.log(id + " and " + req.params.name);

  db.parentnotification.remove({
    "eventId": id,
    "ParentEmail": req.params.name
  }, function (err, doc) {
    res.json(doc);
  });
});

//get event id from judhelist table by parent username
app.get('/findjudgelist/:email', function (req, res) {

  console.log('I received a parent GET request');

  db.judgelist.find({
    "parentEmail": req.params.email
  }, (function (err, docs) {
    console.log(docs);
    res.send(docs);

  }));
});

//when use clicks on yes (have you reached to the destination) button -> update reache:yes in judgelist
app.put('/judgelist/:email/:id', function (req, res) {

  db.judgelist.findAndModify({
    query: {
      eventId: req.params.id,
      parentEmail: req.params.email
    },
    update: {
      $set: {
        reached: "yes"
      }
    },
    new: true
  }, function (err, doc) {
    res.json(doc);
  });
});

//get event id by event name
app.get('/geteventid/:name', function (req, res) {

  console.log('I received a GET request');

  db.eventlist.findOne({
    eventName: req.params.name
  }, (function (err, docs) {
    console.log(docs);
    res.send(docs);

  }));
});

//get judge list by event id
app.get('/getjudgelist/:id', function (req, res) {

  db.judgelist.find({
    eventId: req.params.id
  }, (function (err, docs) {
    console.log(docs);
    res.send(docs);

  }));
});

//insert judge details and team number into team list
app.post('/insertteamlist/:id/:username/:parentname/:teamnum', function (req, res) {
  console.log(req.body);

  db.teamlist.insert({
    "schoolName": req.params.username,
    "eventId": req.params.id,
    "parentName": req.params.parentname,
    "teamNumber": req.params.teamnum
  }, function (err, doc) {
    res.json(doc);
  });
});

//get team lisy by event id an school username
app.get('/getteamlist/:id/:name', function (req, res) {
  console.log(req.params.id + " and  " + req.params.name);
  db.teamlist.find({
    "eventId": req.params.id,
    "schoolName": req.params.name
  }, (function (err, docs) {
    console.log(docs);
    res.send(docs);

  }));
});

//when parent assigned as a just for any team -> update assign key to "yes"
app.put('/updatjudgelistassign/:id/:parent', function (req, res) {

  console.log("update : " + req.params.id + " " + req.params.parent);

  db.judgelist.findAndModify({
    query: {
      eventId: req.params.id,
      parentEmail: req.params.parent
    },
    update: {
      $set: {
        assign: "yes"
      }
    },
    new: true
  }, function (err, doc) {
    console.log(doc);
    res.json(doc);
  });
});

//get parent email by parent name
app.get('/getparentmail/:name', function (req, res) {

  console.log('I received a GET request');

  db.studentlist.findOne({
    "parentName": req.params.name
  }, (function (err, docs) {
    console.log(docs);
    res.send(docs);

  }));
});

//update judge array by event id and team number into team list
//when user performs draga nd drop event 
//drop event
app.put('/updateteamlistassignDrop/:id/:team/:name', function (req, res) {

  db.teamlist.findAndModify({
    query: {
      eventId: req.params.id,
      teamNumber: req.params.team
    },
    update: {
      $set: {
        parentName: req.params.name
      }
    },
    new: true
  }, function (err, doc) {
    console.log(doc);
    res.json(doc);
  });
});

//drag event
app.put('/updateteamlistassignDrag/:id/:name', function (req, res) {

  db.teamlist.findAndModify({
    query: {
      eventId: req.params.id,
      parentName: req.params.name
    },
    update: {
      $unset: {
        parentName: 1
      }
    },
    new: true
  }, function (err, doc) {
    console.log(doc);
    res.json(doc);
  });
});

//update judge list
app.put('/updatjudgelistDrop/:id/:mail', function (req, res) {

  db.judgelist.findAndModify({
    query: {
      eventId: req.params.id,
      parentEmail: req.params.mail
    },
    update: {
      $set: {
        assign: "yes"
      }
    },
    new: true
  }, function (err, doc) {
    console.log(doc);
    res.json(doc);
  });
});

app.put('/updatjudgelistDrag/:id/:mail', function (req, res) {

  db.judgelist.findAndModify({
    query: {
      eventId: req.params.id,
      parentEmail: req.params.mail
    },
    update: {
      $set: {
        assign: "no"
      }
    },
    new: true
  }, function (err, doc) {
    console.log(doc);
    res.json(doc);
  });
});

//get event id from judhelist table by parent username -> if reached = no
app.get('/findjudgenotreahed/:email', function (req, res) {

  console.log('I received a parent GET request');

  db.judgelist.find({
    "parentEmail": req.params.email,
    "reached": "no"
  }, (function (err, docs) {
    console.log(docs);
    res.send(docs);

  }));
});

app.get('/findjudgelistforinstruction/:email', function (req, res) {

  console.log('I received a parent GET request');

  db.judgelist.find({
    "parentEmail": req.params.email,
    "assign": "yes"
  }, (function (err, docs) {
    console.log(docs);
    res.send(docs);

  }));
});

//get student count by school name
app.get('/studentcount/:name', function (req, res) {
  console.log('I received a student GET request');
  console.log(req.params.name);
  db.studentlist.count({
    "schoolUsername": req.params.name
  }, function (err, docs) {
    console.log(docs);
    res.json(docs);
  });
});

//get event count by school username 
app.get('/geteventcount/:name', function (req, res) {

  console.log('I received a GET request');

  db.eventlist.count({
    "schoolUsername": req.params.name
  }, (function (err, docs) {
    console.log(docs);
    res.json(docs);

  }));
});

//get invited event count
app.get('/getinvitedeventcount/:name', function (req, res) {

  console.log('I received a GET request');

  db.eventlist.count({
    "schoolName": req.params.name
  }, (function (err, docs) {
    console.log(docs);
    res.json(docs);

  }));
});


app.listen(process.env.PORT || 3000, function () {
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});