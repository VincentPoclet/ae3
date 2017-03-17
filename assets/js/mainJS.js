'use strict';

// var events = [
// 				{ 
// 					nomEvent:     "Salon de l'auto", 
// 					address:      "porte de Versailles", 
// 					codePostal:  "75015", 
// 					ville:        "Paris",
// 					dateDebut:    "2017-03-03 20:45:00",
// 					dateFin:      "2017-03-03 23:45:00",
// 					typEvent:     "Musée", 
// 					descrEvent:   "40 ème salon de l'automobile à porte de Versailles",
// 					lattEvent:    "48.830411",
// 					longEvent:    "2.287810"
// 				},
// 				{ 
// 					nomEvent:     "Nausicaa", 
// 					address:      "Boulevard Sainte-Beuve", 
// 					codePostal:  "62200", 
// 					ville:        "Boulogne-sur-mer",
// 					dateDebut:    "2017-03-03 20:45:00",
// 					dateFin:      "2017-03-03 23:45:00",
// 					typEvent:     "Musée", 
// 					descrEvent:   "Musée de la mer",
// 					lattEvent:    "50.730249",
// 					longEvent:    "1.594595"
// 				},
// 				{ 
// 					nomEvent:     "IG2I Institut de Génie Informatique et Industriel", 
// 					address:      "13 Rue Jean Souvraz", 
// 					codePostal:  "62300", 
// 					ville:        "Lens",
// 					dateDebut:    "2017-03-03 20:45:00",
// 					dateFin:      "2017-03-03 23:45:00",
// 					typEvent:     "Ecole", 
// 					descrEvent:   "Institut de Génie Informatique et Industriel",
// 					lattEvent:    "50.434698",
// 					longEvent:    "2.823621"
// 				},
// 		];

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