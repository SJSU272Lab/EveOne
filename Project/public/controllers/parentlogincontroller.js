var parentapp = angular.module('parentapp', []);


parentapp.controller('ParentController', ['$scope', '$http', '$window', function($scope, $http, $window) {
    console.log("Hello from ParentController");
	
	//destroy session
	$http.get('/sessiondestroyParent').success(function(response){
		console.log("session destroyed");
	});
	
	//authenticate parent
	$scope.checkParent = function(name,password) {
		console.log($scope.login);
	  $http.get('/parentauth/'+ name +'/'+password, $scope.login).success(function(response) {
		console.log("I got the data I requested");
		console.log(response);

		$scope.login.status="Wrong username or Password. Try Again!!";
		
		if(response.toString() == "successful"){
			$scope.login.status="";
					
					$window.location.href = "parentIndex.html";
			
		}
		
	});
	};
}]);
