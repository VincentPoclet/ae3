'use strict';


angular.module("ae3").controller("planningController", function($scope, $rootScope, $http, $compile, $timeout) {
	var map;
	var route;
	var directionsDisplay;
	var directionsService = new google.maps.DirectionsService();
	var markers = [];

	$scope.planName = "";
	$scope.planDescr = "";
	$scope.planningPhase = 1;
	$http({
		url: "/api/event", 
		method: "GET"
	}).then(function successCallback(response) {
		// console.log(response);
		var markersTemps = [];
		var content;
		var compiledContent;
		var infoWindow = [];

		$scope.startDate = new Date();
		$scope.endDate = new Date();
		$scope.oldDate = new Date();
		$scope.events = response.data.data;
		$scope.checkedEvents = 0;
		angular.forEach($scope.events, function(value, key) {
			value.isChecked = false;
			value.check = function() {
				if (this.isChecked) {
					$scope.checkedEvents--;
					this.isChecked = false;
					$scope.endDate = new Date(new Date($scope.endDate).getTime() - new Date(new Date(Date.parse(this.dateFin)) - new Date(Date.parse(this.dateDebut))).getTime());
				} else {
					if ($scope.checkedEvents < 10) {
						$scope.checkedEvents++;
						this.isChecked = true;
						
						$scope.endDate = new Date(new Date($scope.endDate).getTime() + new Date(new Date(Date.parse(this.dateFin)) - new Date(Date.parse(this.dateDebut))).getTime());
					} else {
						console.log("Cannot Check !");
						$("#maxTen").show('slow');
					}
				}
			};
		});
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function (p) {
				var LatLng = new google.maps.LatLng(p.coords.latitude, p.coords.longitude);
				var mapOptions = {
						center: LatLng,
						zoom: 13,
						mapTypeId: google.maps.MapTypeId.ROADMAP
				};
				map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
				
				afficherEvents();

				function afficherEvents(){
					//afficher tous les events
					clearMarkers(markers);


					angular.forEach($scope.events, function(val,i){
						var location = new google.maps.LatLng(val.lattEvent,val.longEvent);
						val.markers=new google.maps.Marker({
							position: location,
							map: map,
							animation: google.maps.Animation.DROP,
							title: val.nomEvent // this works, giving the marker a title with the correct title
						});
						var clicker = addClicker(markers, val.title, location);
					});					
				}



				// écoute les cliques de l'utilisateur pour créer un marker
				google.maps.event.addListener(map, 'click', function(event) {
					clearMarkers(markersTemps);
					clearInfoWindow(infoWindow);
  					placeMarker(event.latLng);
				});

				// écoute les cliques de l'utilisateur sur les markers déjà présent, affiche le titre de l'événement
				function addClicker(marker, content, location) {
					infoWindow = new google.maps.InfoWindow({content : ''});
					google.maps.event.addListener(marker, "click", function (e) {
						clearMarkers(markersTemps);
						clearInfoWindow(infoWindow);
						infoWindow.setContent(marker.title);
						infoWindow.open(map, marker);
					});
					
					
					content = `
					<div>
					<button ng-click='modifyButton(`+location.lng()+`,`+location.lat()+`)' class='btn btn-primary'>Modifier</button>
					<button ng-click='deleteButton(`+location.lng()+`,`+location.lat()+`)' class='btn btn-primary'>Supprimer</button>
					</div>`;
					compiledContent = $compile(content)($scope);
	                
                    infoWindow = new google.maps.InfoWindow({content : ''});
                    google.maps.event.addListener(marker, 'rightclick', (function(marker, content, scope) {
	                    return function() {
	                    	clearInfoWindow(infoWindow);
	                    	clearMarkers(markersTemps);
	                        infoWindow.setContent(content);
	                        infoWindow.open(scope.map, marker);
	                    };
                	})(marker, compiledContent[0], $scope));		
				}


				// ###################################################################################################
				// ###################################################################################################
				// ############################ gestion des markers sur la maps ######################################
				// ###################################################################################################
				// ###################################################################################################


				// Range tous les marqueurs dans un tableau
				function setMapOnAll(map,markers) {
				  for (var i = 0; i < markers.length; i++) {
				    markers[i].setMap(map);
				  }
				}

				// Supprime tous les markers de la map 
				function clearMarkers(markers){
					setMapOnAll(null,markers);
					markers = [];
				}

				// Range tous les infoWindow dans un tableau
				function setInfoWindowOnAll(map,infoWindow) {
				  for (var i = 1; i < infoWindow.length; i++) {
				    infoWindow[i].close();
				    console.log('fermé');
				  }
				}

				// Supprime tous les markers de la map 
				function clearInfoWindow(infoWindow){
					setInfoWindowOnAll(null,infoWindow);
					infoWindow = [];
				}

				// Créer la marker sur la map
				function placeMarker(location) {

					infoWindow.close();
					clearMarkers(markersTemps);
					
				    var marker = new google.maps.Marker({
				        position: location, 
				        map: map,
				        animation: google.maps.Animation.DROP
					});
					markersTemps.push(marker);
					infoWindow = new google.maps.InfoWindow({content : ''});
                    infoWindow.setContent("Cliquer sur le marker pour créer un évenement");
                    infoWindow.open(map, marker);
					content = `
					<div class='panel-body'>
						<label class='control-label'>Créer votre évenement!</label><br>
						<label class='control-label'>Name</label>
						<input ng-model='nomEvent' class='form-control' type='text' />
						<label class='control-label'>Start Date</label>
						<input ng-model='dateDebut' class='form-control' type='datetime-local' />
						<label class='control-label'>End Date</label>
						<input ng-model='dateFin' class='form-control' type='datetime-local' />
						<label class='control-label'>Event Type</label>
						<select ng-model='typeEvent' class='form-control'>
							<option value='0'>Museum</option>
							<option value='1'>Concert</option>
							<option value='2'>Other</option>
						</select>
						<label class='control-label'>Description</label>
						<textarea ng-model='descEvent' class='form-control'></textarea>
						<br>
						<button ng-click='addEvent(`+location.lng()+`,`+location.lat()+`)' class='btn btn-primary'>Submit</button>
                    </div>`;

                    compiledContent = $compile(content)($scope);
					
                    google.maps.event.addListener(marker, 'click', (function(marker, content, scope) {
	                    return function() {
	                    	infoWindow.close();
	                    	infoWindow = new google.maps.InfoWindow({content : ''});
	                        infoWindow.setContent(content);
	                        infoWindow.open(scope.map, marker);
	                    };
                	})(marker, compiledContent[0], $scope));		
				}


				// ###################################################################################################
				// ###################################################################################################
				// ##################################### gestion des évenements ######################################
				// ###################################################################################################
				// ###################################################################################################

				$scope.addEvent = function(longitude,lattitude) {
					var newLongEvent = Number((longitude).toPrecision(6));
    				var newLattEvent = Number((lattitude).toPrecision(6));
					
					$http({
						url: "/api/event", 
						method: "POST",
						data: {
							nomEvent: $scope.nomEvent,
							adresse: "toto",
							codePostal: "1234",
							ville: "toto",
							dateDebut: $scope.dateDebut,
							dateFin: $scope.dateFin,
							typeEvent: $scope.typeEvent,
							descEvent: $scope.descEvent,
							longEvent: newLongEvent,
							lattEvent: newLattEvent
						}
					}).then(function successCallback(response) {
							clearInfoWindow(infoWindow);
							infoWindow.close();
							$scope.events.push(response.data.data);
							afficherEvents();
						}, function errorCallback(response) {
							alert(response);
					});
				}

				$scope.modifyButton = function(longitude,lattitudelongitude,lattitude){
					$http({
						url: "/api/event", 
						method: "PUT",
						data: {
							longEvent: longitude,
							lattEvent: lattitude
						}
					}).then(function successCallback(response) {
							clearInfoWindow(infoWindow);
							$scope.events.push(response.data.data);
							afficherEvents();
						}, function errorCallback(response) {
							alert(response);
					});
				}
    			
    			$scope.deleteButton = function(longEvent,lattEvent){
    				var newLongEvent = Number((longEvent).toPrecision(6));
    				var newLattEvent = Number((lattEvent).toPrecision(6));
    				$http({
						url: "/api/event", 
						method: "DELETE",
						data: {
							longEvent: newLongEvent,
							lattEvent: newLattEvent
						}
					}).then(function successCallback(response) {
							clearInfoWindow(infoWindow);
		   					//console.log($scope.events);
							$scope.events.remove(response.data.data);
							
							afficherEvents();
						}, function errorCallback(response) {
							alert("This event is already removed. Please refresh the web page (F5).");
						});
    			}
			});
		}else { // si la position n'est pas disponible on affiche paris 
			var LatLng = new google.maps.LatLng(48.858377,2.294460);
				var mapOptions = {
						center: LatLng,
						zoom: 50,
						mapTypeId: google.maps.MapTypeId.ROADMAP
				};
			map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
		}
	}, function errorCallback(response) {
		alert("Error loading events");
	});
	

		// ###################################################################################################
		// ###################################################################################################
		// ##################################### gestion des plannings  ######################################
		// ###################################################################################################
		// ###################################################################################################

	$scope.createPlanning = function() {
		// console.log("Events :");
		// console.log($scope.events);
		var checkedMarkers = $scope.events.filter(function(element) {
			return element.isChecked;
		});
		// .map(function(el) {
		// 	return el.markers;
		// })
		console.log(checkedMarkers);
		angular.forEach($scope.events, function(val,i){
			val.markers.setMap(null);
		});

		markers.length = 0;
		initializeRoute(checkedMarkers);
		google.maps.event.addDomListener(window, "load", initializeRoute);

		$scope.checkedEvents = checkedMarkers;
		angular.forEach($scope.checkedEvents, function(val, i) {
			val.order = i;
		});
		$scope.planningPhase = 2;
		$timeout(function() {
			fullHeight();
		});
	}

	function initializeRoute(checkedMarkers){
	    if (directionsDisplay != null) { 
   			directionsDisplay.setMap(null);
   			directionsDisplay = null; 
   		}
		directionsDisplay = new google.maps.DirectionsRenderer();
	  	directionsDisplay.setMap(map);
	  	var infowindow = new google.maps.InfoWindow();

	  	var marker, i;
	  	var request = {
	  	  travelMode: google.maps.TravelMode.WALKING
	  	};

	  	angular.forEach(checkedMarkers, function(val,i){
	  		marker = new google.maps.Marker({
	      		position: new google.maps.LatLng(val.lattEvent, val.longEvent),
	    	});

	  		google.maps.event.addListener(marker, 'click', (function(marker, i) {
	      	return function() {
		        infowindow.setContent(val.name);
	        	infowindow.open(map, marker);
	      	}
	    	})(marker, i));

	  		if (i == 0) request.origin = marker.getPosition();
	    	else if (i == checkedMarkers.length - 1) request.destination = marker.getPosition();
	    	else {
		      	if (!request.waypoints) request.waypoints = [];
		      	request.waypoints.push({
			        location: marker.getPosition(),
		        	stopover: true
			     });
	    	}
		});

	directionsService.route(request, function(result, status) {
	    if (status == google.maps.DirectionsStatus.OK) {
	     	directionsDisplay.setDirections(result);
	    }
 	});
}




	$scope.startChange = function() {
		if (new Date(Date.parse($scope.startDate)) > new Date()) {
			$scope.endDate = new Date(new Date($scope.endDate).getTime() + new Date(new Date(Date.parse($scope.startDate)) - new Date(Date.parse($scope.oldDate))).getTime());
			$scope.oldDate = $scope.startDate;
		} else {
			$scope.startDate = new Date();
			$scope.endDate = new Date(new Date($scope.endDate).getTime() + new Date(new Date(Date.parse($scope.startDate)) - new Date(Date.parse($scope.oldDate))).getTime());
			$scope.oldDate = $scope.startDate;
		}
	};

	$scope.moveUp = function(elem) {
		var pos = $scope.checkedEvents.indexOf(elem);
		if (pos == 0) {
			return false;
		}
		var tmp = $scope.checkedEvents[pos-1];
		$scope.checkedEvents[pos-1] = elem;
		$scope.checkedEvents[pos] = tmp;
		$scope.checkedEvents[pos-1].order = pos - 1;
		$scope.checkedEvents[pos].order = pos;
		console.log($scope.checkedEvents);
		return true;
	};

	$scope.moveDown = function(elem) {
		var pos = $scope.checkedEvents.indexOf(elem);
		if (pos == ($scope.checkedEvents.length - 1)) {
			return false;
		}
		var tmp = $scope.checkedEvents[pos+1];
		$scope.checkedEvents[pos+1] = elem;
		$scope.checkedEvents[pos] = tmp;
		$scope.checkedEvents[pos+1].order = pos + 1;
		$scope.checkedEvents[pos].order = pos;
		console.log($scope.checkedEvents);
		return true;
	};

	$scope.renderPlanning = function() {
		initializeRoute($scope.checkedEvents);
	};

	$scope.validPlanning = function() {
		$scope.renderPlanning();
		$scope.planningPhase = 3;
	};

	$scope.savePlanning = function() {
		var post = new Object();
		post.name = $scope.planName;
		post.startDate = $scope.startDate;
		post.description = $scope.planDescr;
		if ($rootScope.session != null) {
			post.userID = $rootScope.session.id;
		} else {
			alert("Please connect.");
			return false;
		}
		post.checkedEvents = [];
		angular.forEach($scope.checkedEvents, function(el) {
			post.checkedEvents.push({
				eventID: el.id,
				duration: el.durationPlanned,
				order: el.order
			});
		});
		console.log(post);
	}

	$timeout(function() {
		$("#maxTen").hide();
		fullHeight();
	});

});