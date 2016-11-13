var app = angular.module('app', ['ngRoute', 'datatables', 'datatables.bootstrap']);


app.config(function ($routeProvider) {
  $routeProvider

    .when('/students', {
    templateUrl: 'pages/students.html',
    controller: 'StudentController'
  })

  .when('/events', {
    templateUrl: 'pages/events.html',
    controller: 'EventController'
  })

  .otherwise({
    redirectTo: '/events'
  });
});


app.controller('StudentController', ['$scope', '$http', function ($scope, $http) {
  console.log("Hello World from controller");


  var refresh = function () {
    $http.get('/studentlist').success(function (response) {
      console.log("I got the data I requested");
      $scope.studentlist = response;
      $scope.student = "";
    });
  };

  refresh();

  $scope.addStudent = function (student) {
    console.log(student.name);
    $http.post('/studentlist', student).success(function (response) {
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
    $http.get('/studentlist/' + id).success(function (response) {
      $scope.student = response;
    });
  };

  $scope.update = function (student) {
    console.log($scope.student._id);
    console.log(student);
    $http.put('/studentlist/' + $scope.student._id, student).success(function (response) {
      refresh();
    })
  };

  $scope.deselect = function () {
    $scope.student = "";
  }

}]);


app.controller('EventController', function ($scope) {
  $scope.message = 'Hello from EventController';
});