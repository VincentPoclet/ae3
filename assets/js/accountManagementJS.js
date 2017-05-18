// 'use strict';
angular.module("ae3").controller("accountManagementController", function($scope, $http, $location, $rootScope) {
	setTabs("tab04", true, 1);
	$scope.userData = {};
	$scope.modif = {};
	$scope.modif.mode = "consult";
	$http({
		url: "/api/session",
		method: "GET"
	}).then(function successCallback(response) {
		$scope.userData.email = response.data.res.email;
		$scope.modif.email = response.data.res.email;
		$scope.userData.nom = response.data.res.nom;
		$scope.modif.nom = response.data.res.nom;
		$scope.userData.prenom = response.data.res.prenom;
		$scope.modif.prenom = response.data.res.prenom;
	}, function errorCallback(response) {
		toast("Une erreur est survenue.", 'red');
		console.log("nok");
	});
	$scope.toggleMode = function() {
		$scope.modif.mode = ($scope.modif.mode == 'consult' ? 'modif' : 'consult');
	};

	$scope.upd = function() {
		$http({
			url: "/api/user",
			method: "PUT",
			data: {
				emailUserOld: $scope.userData.email,
				emailUser: $scope.modif.email,
				nomUser: $scope.modif.nom,
				prenomUser: $scope.modif.prenom
			}
		}).then(function successCallback(response) {
			$rootScope.session = "";
			$location.path("/");
			toast("Information updated !", 'green');
		}, function errorCallback(response) {
		toast("Une erreur est survenue.", 'red');
		});
	};
});