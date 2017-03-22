'use strict';

var app = angular.module("ae3", ["ngRoute"]);

app.config(function($routeProvider) {
	$routeProvider
	.when("/", {
		templateUrl : "templates/mainTemplate.html",
		controller: "mainController",
		controllerAs: "mainJS"
	}).when("/login", {
		templateUrl : "templates/loginTemplate.html",
		controller: "loginController",
		controllerAs: "loginJS"
	}).when("/register", {
		templateUrl : "templates/registerTemplate.html",
		controller: "registerController",
		controllerAs: "registerJS"
	}).when("/addEvent", {
		templateUrl : "templates/addEventTemplate.html",
		controller: "addEventController",
		controllerAs: "addEventJS.js"
	}).otherwise({
		templateUrl : "templates/deadLink.html"
	});
});

app.controller("indexController", function($scope, $http) {
	$scope.$on('$locationChangeStart', function(event) {
		if (!$scope.session) {
			console.log("Fetch Session");
			$http({
				url: "/api/session",
				method: "GET"
			}).then(function successCallback(response) {
				if (!response.data.res) {
					$scope.session = false;
					$scope.id = "";
					$scope.nomUser = "";
					$scope.prenomUser = "";
				} else {
					$scope.session = true;
					$scope.id = response.data.res.id;
					$scope.nomUser = response.data.res.nom;
					$scope.prenomUser = response.data.res.prenom;
				}
				// alert("conn");
			}, function errorCallback(response) {
				$scope.session = false;
				$scope.id = "";
				$scope.nomUser = "";
				$scope.prenomUser = "";
				// alert("nconn");
			});
		}
	});

	$scope.destroySession = function() {
		$http({
			url: "/api/session",
			method: "DELETE"
		}).then(function successCallback(response) {
			$scope.session = false;
			$scope.id = "";
			$scope.nomUser = "";
			$scope.prenomUser = "";
		}, function errorCallback(response) {
			$scope.session = false;
			$scope.id = "";
			$scope.nomUser = "";
			$scope.prenomUser = "";
		})
	}
});
