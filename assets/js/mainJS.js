'use strict';



angular.module("ae3").controller("mainController", function($scope, $http, $compile) {
	$http({
		url: "/api/event", 
		method: "GET"
	}).then(function successCallback(response) {
		// console.log(response);
		/*
			à changer :
				-> Stocker le marqueur d'un événement DANS cet événement
				Ansi, $scope.events[0].marker contiendra le marqueur de l'événement 0.
		*/
		var map;
		var markers = [];
		var content;
		var compiledContent;
		var infoWindow = [];
		$scope.events = response.data.data;
		
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
				
				// ###################################################################################################
				// ###################################################################################################
				// ############################ affichage de events sur la maps ######################################
				// ###################################################################################################
				// ###################################################################################################

				function afficherEvents(){
					//afficher tous les events
					clearMarkers();

					for (var i = 0; i < $scope.events.length; i++) {
						// Current object
						var obj = $scope.events[i];
						//console.log(obj);

						var location = new google.maps.LatLng(obj.lattEvent,obj.longEvent);
						// Adding a new marker for the object
						var marker = new google.maps.Marker({
							position: location,
							map: map,
							animation: google.maps.Animation.DROP,
							title: obj.nomEvent // this works, giving the marker a title with the correct title
						});
						//marker.addListener('click', toggleBounce);
						var clicker = addClicker(marker, obj.title, location);						
					}
				}


				// écoute les cliques de l'utilisateur pour créer un marker
				google.maps.event.addListener(map, 'click', function(event) {
					clearMarkers();
  					placeMarker(event.latLng);
				});


				// ###################################################################################################
				// ###################################################################################################
				// ############################ gestion des cliques sur la maps ######################################
				// ###################################################################################################
				// ###################################################################################################


				// écoute les cliques de l'utilisateur sur les markers déjà présent, affiche le titre de l'événement
				function addClicker(marker, content, location) {
					clearMarkers();
					infoWindow = new google.maps.InfoWindow({content : ''});
					google.maps.event.addListener(marker, "click", function (e) {
						clearMarkers();
						if( $scope.infoWindow ) {
           							$scope.infoWindow.close();
       					}
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
	                    	clearMarkers();
	                    	if( infoWindow ) {
           							infoWindow.close();
       						}
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
				function setMapOnAll(map) {
				  for (var i = 0; i < markers.length; i++) {
				    markers[i].setMap(map);
				  }
				}

				// Supprime tous les markers de la map 
				function clearMarkers(){
					setMapOnAll(null);
					markers = [];
				}

				// Créer la marker sur la map
				function placeMarker(location) {
					clearMarkers();
					if( infoWindow ) {
   						//infoWindow.close();
					}if( $scope.infoWindow ) {
       					$scope.infoWindow.close();
   					}
				    var marker = new google.maps.Marker({
				        position: location, 
				        map: map,
				        animation: google.maps.Animation.DROP
					});
					//marker.addListener('click', toggleBounce);
					markers.push(marker);
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
					$scope.infoWindow = new google.maps.InfoWindow({content : ''});
                    google.maps.event.addListener(marker, 'click', (function(marker, content, scope) {
	                    return function() {
	                    	if( $scope.infoWindow ) {
           						$scope.infoWindow.close();
       						}else if (infoWindow){
       							infoWindow.close();
       						}
	                        scope.infoWindow.setContent(content);
	                        scope.infoWindow.open(scope.map, marker);
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
							$scope.infoWindow.close();
							//$scope.infoWindow = "";
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
							if( infoWindow ) {
		   						infoWindow.close();
							}if( $scope.infoWindow ) {
		       					$scope.infoWindow.close();
		   					}
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
							if( infoWindow ) {
		   						infoWindow.close();
							}if( $scope.infoWindow ) {
		       					$scope.infoWindow.close();
		   					}
		   					// console.log($scope.events);
		   					$scope.events = $scope.events.filter(function(el) {
		   						var bool = true;
								angular.forEach(response.data.data, function(value, key) {
									bool = ((el.id != value.id) && bool);
									// console.log("Comparing " + el.id + " to " + value.id);
								});
		   						return bool;
		   					});
		   					// console.log($scope.events);
		   					// console.log(response.data.data.id);
							// $scope.events.remove(response.data.data);
							
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

});