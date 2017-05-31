// 'use strict';
var lines = [];
function handleFile(files) {
	getAsText(files[0]);
}

function getAsText(fileToRead) {
	var reader = new FileReader();
	// Read file into memory as UTF-8      
	reader.readAsText(fileToRead);
	// Handle errors load
	reader.onload = loadHandler;
	reader.onerror = errorHandler;
}

function loadHandler(event) {
	var csv = event.target.result;
	processData(csv);
}

function processData(csv) {
	var allTextLines = csv.split(/\r\n|\n/);
	lines = [];
	for (var i=0; i<allTextLines.length; i++) {
		var data = allTextLines[i].split(';');
		var tarr = [];
		for (var j=0; j<data.length; j++) {
			tarr.push(data[j]);
		}
		lines.push(tarr);
	}
	// console.log(lines);
	lines.splice(0, 1);
	lines.splice(lines.length - 1, 1);
	var $rootScope = angular.element($('#indexController')).injector().get('$rootScope');
	$rootScope.displayEvents();
}

function errorHandler(evt) {
	if (evt.target.error.name == "NotReadableError") {
		toast("Cannot read file !", 'red');
	}
}

angular.module("ae3").controller("addEventController", function($scope, $rootScope, $http, $timeout, $location) {
	setTabs("tab05");
	$scope.file = [];
	$scope.file.done = false;
	$scope.file.events = [];
	if (!window.FileReader) {
		toast("Cannot read file with this browser. Please consider browsing with Chrome or Mozilla.", 'red');
		return false;
	}
	$rootScope.displayEvents = function() {
		// console.log("GO !");
		$scope.file.done = true;
		angular.forEach(lines, function(e, i) {
			e[10] = true;
			$scope.file.events.push(e);
		});
		$scope.loading = true;
	    $timeout(function () {
			$scope.loading = false;
		}, 1000);
	};
	$scope.toggleEvent = function(event) {
		// console.log(event);
		// event.checked = !event.checked;
		event[10] = !event[10];
		// console.log(event);
	};

	$scope.submit = function() {
		console.log($scope.file.events);
		$http({
			url: "/api/event/multiple", 
			method: "POST",
			data: {
				events: $scope.file.events
			}
		}).then(function successCallback(response) {
			console.log(response);
			$location.url("/");
			toast("Events added !", "green");
		}, function errorCallback(response) {
			console.log(response);
			toast("An error occured. Please try again.", "red");
		});
	};
});