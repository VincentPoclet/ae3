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
	});
});

app.controller("indexController", function($scope, $http) {
	$http({
		url: "/api/session",
		method: "GET"
	}).then(function successCallback(response) {
		$scope.session = true;
		$scope.id = response.data.res.id;
		$scope.nomUser = response.data.res.nom;
		$scope.prenomUser = response.data.res.prenom;
		// alert("conn");
	}, function errorCallback(response) {
		$scope.session = false;
		$scope.id = "";
		$scope.nomUser = "";
		$scope.prenomUser = "";
		// alert("nconn");
	});
});
