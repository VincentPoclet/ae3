// 'use strict';
angular.module("ae3").controller("addEventController", function($scope, $http, $location) {
	$("#wrcred").hide();
	$scope.addEvent = function() {
		// alert("go !");
		console.log($scope.dateDebut);
		console.log($scope.dateFin);
		$http({
			url: "/api/event", 
			method: "POST",
			data: {
				nomEvent: $scope.nomEvent,
				adresse: $scope.adresse,
				codePostal: $scope.codePostal,
				ville: $scope.ville,
				dateDebut: $scope.dateDebut,
				dateFin: $scope.dateFin,
				typeEvent: $scope.typeEvent,
				descEvent: $scope.descEvent,
				longEvent: $scope.longEvent,
				lattEvent: $scope.lattEvent
			}
		}).then(function successCallback(response) {
			$location.url("/");
		}, function errorCallback(response) {
			$("#wrcred").show();
		});
	};
});