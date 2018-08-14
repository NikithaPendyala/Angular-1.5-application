var app = angular.module('testapp',['ngRoute']);
app.config(function($routeProvider){
	$routeProvider.when(('/'),{
		template:`
			<h1>Welcome to User Application!</h1>
		`,
		resolve:['authservice',function(authservice){
		return authservice.checklogin();
	}]
	})
	
	.when(('/loginpage'),{
	templateUrl:'login.html',
	controller:'loginctrl'
	})

	.when(('/user'),{
	templateUrl:'userspg.html',
	controller:'usercntrl',
	resolve:['authservice',function(authservice){
		return authservice.checklogin();
	}]
		
	})
	.when(('/userlist'),{
		templateUrl:'userlist.html',
		controller:'userlistcntrl',
	resolve:['authservice',function(authservice){
		return authservice.checklogin();
	}]
		
	})
	.when(('/logout'),{
		templateUrl:'login.html',
		controller:'logoutcntrl'
	})
	.otherwise({
		redirectTo:'/'
	})

});

app.factory('authservice',function($location){
	return{
		'checklogin': function(){
			if(!localStorage.isLoggedIn || localStorage.isLoggedIn=="false")
			{
				$location.path('/loginpage');
				return false;
			}
			return true;
		}
	};
});



app.controller('loginctrl',function($scope,$location,$window, $rootScope){
	$scope.authform = {};
	$scope.login = function()
	{
		$scope.username= $scope.authform.uname;
		$scope.password= $scope.authform.pwd;
			if($scope.username=='admin'&& $scope.password=='admin'){
				alert("welcome");
				$window.localStorage.isLoggedIn=true;
				$location.path('/');
				$rootScope.$broadcast('isLoggedIn', true);
			}
			else {
				alert("please enter valid details");
				return false;
			}
	}
});

app.controller('usercntrl',function($scope,$window,$location){	
	$scope.submit = function(){
		var users=[];
		if($window.localStorage.userdata){
			users=JSON.parse($window.localStorage.userdata);
			$location.path('/userlist')
		}
		users.push({Username:$scope.username, Password:$scope.password, Email:$scope.email, Usertype:$scope.utype,Gender:$scope.gender, Location:$scope.location});

		$scope.username='';
		$scope.password='';
		$scope.email='';
		$scope.utype='';
		$scope.gender='';
		$scope.location='';
	

		$window.localStorage.userdata=JSON.stringify(users);
	}
	

});

app.controller('userlistcntrl',function($scope,$window,$location){
	$scope.users=[];
	if($window.localStorage.userdata){
		$scope.users=JSON.parse($window.localStorage.userdata);
		$scope.delete= function(key)
		{
			var del= $scope.users.indexOf(key);
			$scope.users.splice(del,1);

	$window.localStorage.setItem('userdata', JSON.stringify($scope.users));
	};
	}

});

app.controller('logoutcntrl', function($scope){
	localStorage.setItem('isLoggedIn',false);
})

app.controller('appController',function($scope,authservice, $rootScope){
	$scope.userstatus=authservice.checklogin();
	$rootScope.$on('isLoggedIn', function(event, args) {
		$scope.userstatus = args;
	});

});