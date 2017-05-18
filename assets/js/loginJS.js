// 'use strict';
angular.module("ae3").controller("loginController", function($scope, $http, $location) {
	$("#wrcred").hide();
	setTabs("tab03");
	$scope.login = function() {
		// alert("go !");
		$http({
			url: "/api/user", 
			method: "GET",
			params: {
				'emailUser': $scope.email,
				'pwdUser': $scope.pw
			}
		}).then(function successCallback(response) {
			$location.url("/");
			toast("Welcome :)", 'green');
		}, function errorCallback(response) {
			console.log("nok");
			toast("Wrong credentials.", 'red');
			// $("#wrcred").show('slow');
		});
	};
});