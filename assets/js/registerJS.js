// 'use strict';
angular.module("ae3").controller("registerController", function($scope, $http, $location) {
	$("#wrcred").hide();
	$scope.register = function() {
		// alert("go !");
		$http({
			url: "/api/user", 
			method: "POST",
			data: {
				nomUser: $scope.nom,
				prenomUser: $scope.surnom,
				emailUser: $scope.email,
				pwdUser: $scope.pw
			}
		}).then(function successCallback(response) {
			$location.url("/");
		}, function errorCallback(response) {
			$("#wrcred").show();
		});
	};
});