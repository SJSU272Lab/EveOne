var app = angular.module('app', ['ngRoute', 'datatables', 'datatables.bootstrap']);

app.config(function ($routeProvider) {
	$routeProvider


		.when('/', {
		templateUrl: 'pages/dashboard.html',
		controller: 'DashboardController'
	})

	.when('/student', {
		templateUrl: 'pages/students.html',
		controller: 'StudentController'
	})

	.when('/events', {
		templateUrl: 'pages/addEvent.html',
		controller: 'EventController'
	})

	.when('/viewevent', {
		templateUrl: 'pages/viewEvent.html',
		controller: 'ViewEventController'
	})

	.when('/editevent/:id', {
		templateUrl: 'pages/editEvent.html',
		controller: 'EditEventController'
	})

	.when('/invitedevent', {
		templateUrl: 'pages/invitedEvent.html',
		controller: 'InvitedEventController'
	})

	.when('/profile', {
		templateUrl: 'pages/profile.html',
		controller: 'ProfileController'
	})

	.when('/parentinvitation', {
		templateUrl: 'pages/parentInvitation.html',
		controller: 'ParentInvitationController'
	})

	.when('/judge', {
		templateUrl: 'pages/judge.html',
		controller: 'JudgeController'
	})

	.otherwise({
		redirectTo: '/'
	});
});

app.factory('Scopes', function ($rootScope) {
	var mem = {};

	return {
		store: function (key, value) {
			mem[key] = value;
		},
		get: function (key) {
			return mem[key];
		}
	};
});


app.run(['$rootScope', function ($rootScope) {
	$rootScope.logout = function () {
		$http.get('/sessiondestroy').success(function (response) {
			console.log("session destroyed");
		});
	};
}]);



//student
app.controller('StudentController', ['$scope', '$http', '$rootScope', function ($scope, $http, $rootScope) {
	console.log("Hello World from Studentcontroller");

	var refresh = function () {
		$http.get('/sessioncheck').success(function (response) {
			//console.log("I got the data I requested");
			//console.log(response);


			if (response.toString() == 'not exist') {
				$rootScope.school_username = "";
				$window.location.href = "login.html";
			} else {
				username = response.toString();
				$rootScope.school_username = response.toString();

				console.log($rootScope.school_username);
				$http.get('/studentlist/' + $rootScope.school_username).success(function (response) {
					console.log("I got student data I requested");
					$scope.studentlist = response;
					$scope.student = "";
				});
			}
		});
	};

	refresh();

	$scope.addStudent = function (student) {
		console.log(student);
		$http.post('/studentlist/' + $rootScope.school_username, student).success(function (response) {
			console.log(response);
			refresh();
		});
	};

	$scope.remove = function (id) {
		console.log(id);
		$http.delete('/studentlist/' + id).success(function (response) {
			refresh();
		});
	};

	$scope.edit = function (id) {
		console.log(id);
		$http.get('/studentlistbyid/' + id).success(function (response) {
			$scope.student = response;
		});
	};

	$scope.update = function (student) {
		console.log($scope.student._id);
		$http.put('/studentlist/' + $scope.student._id, $scope.student).success(function (response) {
			refresh();
		})
	};

	$scope.deselect = function () {
		$scope.student = "";
	}

}]);

//Add Event 
app.controller('EventController', ['$scope', '$http', '$rootScope', '$window', function ($scope, $http, $rootScope, $window) {
	console.log('Hello from EventController');

	$http.get('/sessioncheck').success(function (response) {
		//console.log("I got the data I requested");
		//console.log(response);


		if (response.toString() == 'not exist') {
			$rootScope.school_username = "";
			$window.location.href = "login.html";
		} else {
			username = response.toString();
			$rootScope.school_username = response.toString();

			var name = "";
			$http.get('/schoolprofile/' + $rootScope.school_username).success(function (resp) {
				name = resp.name;
			});

			//get all school name for dropdown list
			$http.get('/getschoollist').success(function (response) {
				console.log("I got the school list");
				$scope.schoollist = [];

				for (var i = 0; i < response.length; i++) {
					console.log("name : " + name);

					if (response[i].name != name) {
						$scope.schoollist.push(response[i].name);
					}
				}

			});
		}
	});

	$scope.addEvent = function () {
		console.log($scope.schoolevent);
		$http.post('/addeventlist/' + $rootScope.school_username, $scope.schoolevent).success(function (response) {
			console.log(response);

			//add notification for invitations
			for (var i = 0; i < $scope.schoolevent.schoolName.length; i++) {
				$http.post('/eventnotification/' + $scope.schoolevent.schoolName[i] + '/' + response._id + '/' + $rootScope.school_username).success(function (response) {
					console.log(response);
				});
			}

			$window.alert("Event Registration successfully .. !!");

		});


	};

}]);

//view and edit profile
app.controller('ProfileController', ['$scope', '$http', '$rootScope', function ($scope, $http, $rootScope) {
	console.log("Hello from ProfileController");

	$http.get('/sessioncheck').success(function (response) {
		//console.log("I got the data I requested");
		//console.log(response);


		if (response.toString() == 'not exist') {
			$rootScope.school_username = "";
			$window.location.href = "login.html";
		} else {
			username = response.toString();
			$rootScope.school_username = response.toString();

			$http.get('/schoolprofile/' + $rootScope.school_username).success(function (response) {
				console.log("I got the data I requested");

				$scope.user = response;

			});
		}
	});


}]);

//Dashboard
app.controller('DashboardController', ['$scope', '$http', '$rootScope', '$location', function ($scope, $http, $rootScope, $location) {
	$scope.message = 'Hello from DashboardController';

	refreshPage = function () {
		//session checking
		$http.get('/sessioncheck').success(function (response) {
			//console.log("I got the data I requested");
			//console.log(response);


			if (response.toString() == 'not exist') {
				$rootScope.school_username = "";
				$window.location.href = "login.html";
			} else {
				username = response.toString();
				$rootScope.school_username = response.toString();

				//student count
				$http.get('/studentcount/' + $rootScope.school_username).success(function (response) {
					$scope.students = response;
				});

				//total number of events
				$http.get('/geteventcount/' + $rootScope.school_username).success(function (response) {

					$scope.events = response;
				});

				//total number of invited events
				$http.get('/getschoolname/' + $rootScope.school_username).success(function (res) {

					//get invited event list from event list
					$http.get('/getinvitedeventcount/' + res.name).success(function (response) {

						$scope.invited_events = response;
					});
				});

				//get school name form school username
				$http.get('/getschoolname/' + $rootScope.school_username).success(function (res) {
					console.log("I got the school name : " + res.name);

					//for notification table
					$http.get('/geteventnotification/' + res.name).success(function (response1) {
						console.log("I got the notification data I requested");
						console.log(response1);

						$scope.notification = [];

						for (var i = 0; i < response1.length; i++) {
							$http.get('/geteventlistnoti/' + response1[i].eventId).success(function (resp) {
								console.log("I got the event data I requested");
								console.log(resp);
								$scope.notification.push(resp);
							});

						}

					});

				});

			}

		});
	};

	refreshPage();

	$scope.eventEntry = function (id) {
		console.log(id);

		$http.get('/getschoolname/' + $rootScope.school_username).success(function (res) {

			//delete entry from notification list
			$http.delete('/deleteeventnotification/' + id + '/' + res.name).success(function (response) {
				$location.path('/invitedevent');
			});
		});
	};


}]);

//View Event 
app.controller('ViewEventController', ['$scope', '$http', '$rootScope', '$location', '$routeParams', function ($scope, $http, $rootScope, $location, $routeParams) {
	console.log('Hello from ViewEventController');

	$http.get('/sessioncheck').success(function (response) {
		//console.log("I got the data I requested");
		//console.log(response);


		if (response.toString() == 'not exist') {
			$rootScope.school_username = "";
			$window.location.href = "login.html";
		} else {
			username = response.toString();
			$rootScope.school_username = response.toString();

			$http.get('/geteventlist/' + $rootScope.school_username).success(function (response) {
				console.log("I got the data I requested");

				for (var i = 0; i < response.length; i++) {
					response[i].school = "";
					for (var j = 0; j < response[i].schoolName.length; j++) {
						response[i].school = response[i].school + "  |  " + (j + 1) + ".  " + response[i].schoolName[j];
					}
				}

				console.log(response.length);
				$scope.eventlist = response;

			});
		}
	});


	$scope.editEvent = function (id) {

		console.log(id);
		$location.path('/editevent/' + id);
	};


}]);

//Edit event
app.controller('EditEventController', ['$scope', '$http', '$rootScope', '$location', '$routeParams', function ($scope, $http, $rootScope, $location, $routeParams) {
	console.log('Hello from EditEventController');

	$http.get('/sessioncheck').success(function (response) {
		//console.log("I got the data I requested");
		//console.log(response);


		if (response.toString() == 'not exist') {
			$rootScope.school_username = "";
			$window.location.href = "login.html";
		} else {
			username = response.toString();
			$rootScope.school_username = response.toString();

			console.log($routeParams.id);

			$http.get('/geteventlistnoti/' + $routeParams.id).success(function (response) {
				console.log("I got the data I requested");
				console.log(response);
				$scope.schoolevent = response;
			});
		}
	});


	$scope.updateEvent = function () {

		//update event list by event id.
		$http.put('/updateeventlist/' + $routeParams.id, $scope.schoolevent).success(function (response) {
			console.log("updated : " + response);
		});

		$location.path('/viewevent');
	};
}]);


//Invited Event 
app.controller('InvitedEventController', ['$scope', '$http', '$rootScope', function ($scope, $http, $rootScope) {
	console.log('Hello from InvitedEventController');

	$http.get('/sessioncheck').success(function (response) {
		//console.log("I got the data I requested");
		//console.log(response);


		if (response.toString() == 'not exist') {
			$rootScope.school_username = "";
			$window.location.href = "login.html";
		} else {
			username = response.toString();
			$rootScope.school_username = response.toString();

			//get school name by school username
			$http.get('/getschoolname/' + $rootScope.school_username).success(function (res) {
				//console.log("I got the school name : "+res.name);

				//get invited event list from event list
				$http.get('/getinvitedeventlist/' + res.name).success(function (response) {
					//console.log("I got the data I requested");

					for (var i = 0; i < response.length; i++) {
						response[i].school = "";
						for (var j = 0; j < response[i].schoolName.length; j++) {
							response[i].school = response[i].school + "  |  " + (j + 1) + ".  " + response[i].schoolName[j];
						}
					}

					$scope.invitedlist = response;

				});
			});
		}
	});
}]);

// parent invitation
app.controller('ParentInvitationController', ['$scope', '$http', '$rootScope', function ($scope, $http, $rootScope) {
	console.log("Hello from ParentInvitationController");

	refresh = function () {

		$http.get('/sessioncheck').success(function (response) {
			//console.log("I got the data I requested");
			//console.log(response);


			if (response.toString() == 'not exist') {
				$rootScope.school_username = "";
				$window.location.href = "login.html";
			} else {
				username = response.toString();
				$rootScope.school_username = response.toString();

				$scope.invitationlist = [];

				//events that organized by school
				$http.get('/geteventlist/' + $rootScope.school_username).success(function (response) {
					console.log("I got the data I requested");
					console.log(response);

					for (var i = 0; i < response.length; i++) {
						//check schoolusername into invited []
						//if yes -> do nothing
						//if no -> send invitation
						if (response[i].invited.includes($rootScope.school_username)) {

						} else {
							$scope.invitationlist.push(response[i]);
						}
					}
				});

				//events -> invitation
				$http.get('/getschoolname/' + $rootScope.school_username).success(function (res) {
					//console.log("I got the school name : "+res.name);

					//get invited event list from event list
					$http.get('/getinvitedeventlist/' + res.name).success(function (response) {
						//console.log("I got the data I requested");

						for (var i = 0; i < response.length; i++) {

							if (response[i].invited.includes($rootScope.school_username)) {

							} else {
								$scope.invitationlist.push(response[i]);
							}
						}

					});
				});
			}
		});
	};

	refresh();

	$scope.invite = function (id) {
		console.log(id);

		//get parent mail Id
		$http.get('/getparentemail/' + $rootScope.school_username).success(function (res) {
			console.log(res);

			for (var i = 0; i < res.length; i++) {

				//insert into parent notification list
				$http.post('/parentnotification/' + id + '/' + $rootScope.school_username + '/' + res[i].parentEmail).success(function (response) {
					console.log(response);

				});
			}
		});

		//add school username to invite [] -> bcz already sent parent invitation
		$http.put('/updateinviteineventlist/' + $rootScope.school_username + '/' + id).success(function (response) {
			console.log("updated : " + response);
			refresh();
		});

	};

}]);

//Assign Judge
app.controller('JudgeController', ['$scope', '$http', '$rootScope', '$window', '$location', function ($scope, $http, $rootScope, $window, $location) {
	console.log('Hello from JudgeController');

	$http.get('/sessioncheck').success(function (response) {
		//console.log("I got the data I requested");
		//console.log(response);


		if (response.toString() == 'not exist') {
			$rootScope.school_username = "";
			$window.location.href = "login.html";
		} else {
			username = response.toString();
			$rootScope.school_username = response.toString();

			//disable assign judge button
			document.getElementById("btn").disabled = true;

			$scope.eventlist = [];

			//events that organized by school
			$http.get('/geteventlist/' + $rootScope.school_username).success(function (response) {
				console.log("I got the data I requested");
				console.log(response);

				for (var i = 0; i < response.length; i++) {
					$scope.eventlist.push(response[i].eventName);
				}
			});

			//events -> invitation
			$http.get('/getschoolname/' + $rootScope.school_username).success(function (res) {
				//console.log("I got the school name : "+res.name);

				//get invited event list from event list
				$http.get('/getinvitedeventlist/' + res.name).success(function (response) {
					//console.log("I got the data I requested");

					for (var i = 0; i < response.length; i++) {
						$scope.eventlist.push(response[i].eventName);
					}

				});
			});
		}
	});

	//select event name form dropdown and clicks find button
	$scope.findEvent = function (name, id) {
		//get parentname -> already reached to the destination
		//and not assigned for any team
		$http.get('/geteventid/' + name).success(function (response) {
			console.log(response._id);

			//get parent name fro assign judge list
			$http.get('/getjudgelist/' + response._id).success(function (resp) {

				//fetch data from team list for table
				$http.get('/getteamlist/' + response._id + '/' + $rootScope.school_username).success(function (respo) {

					$scope.judgelist = respo;
					if (respo.length < 1) {
						$window.alert("Please assign Judge First!! ");
						document.getElementById("btn").disabled = false;
					}
				});

				//display parent name
				//reached = true, assign = no, not in same school
				$scope.otherjudgelist = [];
				for (var i = 0; i < resp.length; i++) {
					if (resp[i].schoolUsername != $rootScope.school_username && resp[i].reached == "yes" && resp[i].assign == "no") {
						$http.get('/parentprofile/' + resp[i].parentEmail).success(function (res) {
							//console.log(parent);
							$scope.otherjudgelist.push(res.parentName);
							console.log("name : " + res.parentName);
						});

					}
				}
			});
		});

	};


	//automatic assign judge for each team
	$scope.automatic = function (name, id) {
		var parent = [];
		var team = 0;
		//find number of teams in event by event name
		$http.get('/getteamnumber/' + name).success(function (response) {
			//console.log(response.team);
			team = response.team;
		});

		//get parentname -> already reached to the destination
		//and not assigned for any team
		$http.get('/geteventid/' + name).success(function (response) {
			//console.log(response._id);

			//get parent name fro assign judge list
			$http.get('/getjudgelist/' + response._id).success(function (resp) {

				//display parent name
				//reached = true, assign = no, not in same school
				for (var i = 0; i < resp.length; i++) {
					var num = 1;

					if (resp[i].schoolUsername != $rootScope.school_username && resp[i].reached == "yes" && resp[i].assign == "no") {
						//console.log(resp[i]);
						//get parent name from parent email id
						$http.get('/parentprofile/' + resp[i].parentEmail).success(function (res) {
							//console.log(parent);
							parent.push(res.parentName);
							console.log("name : " + res.parentName);

							if (num <= team) {
								console.log("event id :" + response._id + " username : " + $rootScope.school_username + " parent name : " + res.parentName + " team # : " + num);


								//automatically assign judge for every team
								//insert data into team list
								$http.post('/insertteamlist/' + response._id + '/' + $rootScope.school_username + '/' + res.parentName + '/' + num).success(function (response1) {
									//console.log(response1);

								});

								//get parent email by parent name
								$http.get('/getparentmail/' + res.parentName).success(function (r) {

									//update assign key into judgelist
									$http.put('/updatjudgelistassign/' + response._id + '/' + r.parentEmail).success(function (r1) {
										//console.log("updated : " + r1);
									});
								});

								//fetch data from team list for table
								$http.get('/getteamlist/' + response._id + '/' + $rootScope.school_username).success(function (respo) {
									$scope.judgelist = respo;
								});
								num++;
								document.getElementById("btn").disabled = false;
							}
						});

					}
				}
			});

			//judge list
			$http.get('/getjudgelist/' + response._id).success(function (resp) {
				//display parent name
				//reached = true, assign = no, not in same school
				$scope.otherjudgelist = [];
				for (var i = 0; i < resp.length; i++) {
					var num = 1;

					if (resp[i].schoolUsername != $rootScope.school_username && resp[i].reached == "yes" && resp[i].assign == "no") {
						$http.get('/parentprofile/' + resp[i].parentEmail).success(function (res) {
							//console.log(parent);
							$scope.otherjudgelist.push(res.parentName);
							console.log("name : " + res.parentName);
						});
					}
				}
			});


		});

		$location.path('/');

	};

	//when user drag and drop parent button
	$scope.updateDrop = function (parentname, teamnumber, eventname) {
		console.log("update " + parentname + " " + teamnumber + " " + eventname);

		//find event id by event name
		$http.get('/getteamnumber/' + eventname).success(function (res) {
			console.log(res._id);
			if (teamnumber > 0) {
				//update judge by event id and team number in teamlist
				$http.put('/updateteamlistassignDrop/' + res._id + '/' + teamnumber + '/' + parentname).success(function (resp) {

				});

				//assign judgelist -> assign:"yes"

				$http.get('/getparentmail/' + parentname).success(function (resp) {

					console.log(resp.parentEmail);
					$http.put('/updatjudgelistDrop/' + res._id + '/' + resp.parentEmail).success(function (resp) {

					});
				});
			}

		});

	}


	$scope.updateDrag = function (parentname, eventname) {
		console.log("drag event " + parentname + " " + eventname);

		//find event id by event name
		$http.get('/getteamnumber/' + eventname).success(function (res) {
			console.log(res._id);

			//update judge by event id and team number
			$http.put('/updateteamlistassignDrag/' + res._id + '/' + parentname).success(function (resp) {});

			//update judgelist -> assign:"no"
			$http.get('/getparentmail/' + parentname).success(function (resp) {

				console.log(resp.parentEmail);
				$http.put('/updatjudgelistDrag/' + res._id + '/' + resp.parentEmail).success(function (resp) {

				});
			});


		});
	}

}]);