var app = angular.module('app', ['ngRoute']);


app.config(function($routeProvider){
  $routeProvider

  .when('/',{
    templateUrl : 'pages/student.html',
    controller : 'StudentController'
  })

  .when('/events',{
    templateUrl : 'pages/events.html',
    controller : 'EventController'
  })

  .otherwise({redirectTo: '/'});
});

app.controller('StudentController', ['$scope', '$http', function($scope, $http) {
    console.log("Hello World from controller");


var refresh = function() {
  $http.get('/contactlist').success(function(response) {
    console.log("I got the data I requested");
    $scope.contactlist = response;
    $scope.contact = "";
  });
};

refresh();

$scope.addContact = function() {
  console.log($scope.contact);
  $http.post('/contactlist', $scope.contact).success(function(response) {
    console.log(response);
    refresh();
  });
};

$scope.remove = function(id) {
  console.log(id);
  $http.delete('/contactlist/' + id).success(function(response) {
    refresh();
  });
};

$scope.edit = function(id) {
  console.log(id);
  $http.get('/contactlist/' + id).success(function(response) {
    $scope.contact = response;
  });
};  

$scope.update = function() {
  console.log($scope.contact._id);
  $http.put('/contactlist/' + $scope.contact._id, $scope.contact).success(function(response) {
    refresh();
  })
};

$scope.deselect = function() {
  $scope.contact = "";
}

}]);


app.controller('EventController', function($scope) {
  $scope.message = 'Hello from EventController';
});