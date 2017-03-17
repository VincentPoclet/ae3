// 'use strict';
angular.module("ae3").controller("loginController", function($scope, $http, $location) {
	$("#wrcred").hide();
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
		}, function errorCallback(response) {
			console.log("nok");
			$("#wrcred").show('slow');
		});
	};
});