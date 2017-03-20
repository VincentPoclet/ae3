'use strict';



angular.module("ae3").controller("mainController", function($scope, $http) {
	$http({
		url: "/api/event", 
		method: "GET"
	}).then(function successCallback(response) {
		// console.log(response);
		$scope.events = response.data.data;
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function (p) {
				var LatLng = new google.maps.LatLng(p.coords.latitude, p.coords.longitude);
				var mapOptions = {
						center: LatLng,
						zoom: 13,
						mapTypeId: google.maps.MapTypeId.ROADMAP
				};
				var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
				
				// //ma position 
				// var marker = new google.maps.Marker({
				//     position: LatLng,
				//     map: map,
				//     title: "<div style = 'height:60px;width:200px'><b>Your location:</b><br />Latitude: " + p.coords.latitude + "<br />Longitude: " + p.coords.longitude
				// });
				for (var i = 0; i < $scope.events.length; i++) {
		
					// Current object
					var obj = $scope.events[i];
					console.log(obj);
					 var marker = new google.maps.Marker({
						position: new google.maps.LatLng(obj.lattEvent,obj.longEvent),
						map: map,
						title: "<div style = 'height:60px;width:200px'><b>Your location:</b><br />Latitude: " + p.coords.latitude + "<br />Longitude: " + p.coords.longitude
				});

					// Adding a new marker for the object
				var marker = new google.maps.Marker({
						position: new google.maps.LatLng(obj.lattEvent,obj.longEvent),
						map: map,
						title: obj.nomEvent // this works, giving the marker a title with the correct title
					});
					var clicker = addClicker(marker, obj.title);
				}
				function addClicker(marker, content) {
					google.maps.event.addListener(marker, "click", function (e) {
						var infoWindow = new google.maps.InfoWindow({content : obj.title});
						infoWindow.setContent(marker.title);
						infoWindow.open(map, marker);
					});
				}
			});
		}else {
			var LatLng = new google.maps.LatLng(48.858377,2.294460);
				var mapOptions = {
						center: LatLng,
						zoom: 50,
						mapTypeId: google.maps.MapTypeId.ROADMAP
				};
			var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
		}
	}, function errorCallback(response) {
		alert("Error loading events");
	});

});