'use strict';



angular.module("ae3").controller("mainController", function($scope, $http, $compile) {
	$http({
		url: "/api/event", 
		method: "GET"
	}).then(function successCallback(response) {
		// console.log(response);
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
				
				//afficher tous les events
				for (var i = 0; i < $scope.events.length; i++) {
		
					// Current object
					var obj = $scope.events[i];
					console.log(obj);


					// Adding a new marker for the object
					var marker = new google.maps.Marker({
						position: new google.maps.LatLng(obj.lattEvent,obj.longEvent),
						map: map,
						animation: google.maps.Animation.DROP,
						title: obj.nomEvent // this works, giving the marker a title with the correct title
					});
					//marker.addListener('click', toggleBounce);
					var clicker = addClicker(marker, obj.title);
					
				}



				// écoute les cliques de l'utilisateur pour créer un marker
				google.maps.event.addListener(map, 'click', function(event) {
					clearMarkers();
					for (var i = 0; i < infoWindow.length; i++) {
				   	 infoWindow[i].setMap(null);
				  	}
					infoWindow=[];
  					placeMarker(event.latLng);
				});

				// écoute les cliques de l'utilisateur sur les markers déjà présent, affiche le titre de l'événement
				function addClicker(marker, content) {
					infoWindow = new google.maps.InfoWindow({content : obj.title});
					google.maps.event.addListener(marker, "click", function (e) {
						clearMarkers();
						infoWindow.setContent(marker.title);
						infoWindow.open(map, marker);
					});
					var deleteButton = `<button ng-click='modifyButton(`+location.lng()+`,`+location.lat()+`)' class='btn btn-primary'>Modifier</button>&nbsp;<button ng-click='deleteButton(`+location.lng()+`,`+location.lat()+`)' class='btn btn-primary'>Supprimer</button>'`;
				    google.maps.event.addListener(marker, 'rightclick', function (e) {
				    	clearMarkers();
				        infoWindow.setContent(deleteButton);
				        infoWindow.open(map, marker);
				    });
				}


				// // effet d'animation du bouton
				// function toggleBounce() {
				//   if (this.getAnimation() !== null) {
				//     this.setAnimation(null);
				//   } else {
				//     this.setAnimation(google.maps.Animation.BOUNCE);
				//   }
				// }

				
				// Range tous les marqueurs dans un tableau
				function setMapOnAll(map) {
				  for (var i = 0; i < markers.length; i++) {
				    markers[i].setMap(map);
				  }
				}

				// Supprime tous les markers de la map tout en les gardant dans le tableau
				function clearMarkers(){
					setMapOnAll(null);
					markers = [];
				}

				// Créer la marker sur la map
				function placeMarker(location) {
					clearMarkers();
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
						<input ng-model='dateDebut' class='form-control' type='text' />
						<label class='control-label'>End Date</label>
						<input ng-model='dateFin' class='form-control' type='text' />
						<label class='control-label'>Event Type</label>
						<select ng-model='typeEvent' class='form-control'>
							<option value='0'>Museum</option>
							<option value='1'>Concert</option>
							<option value='2'>Other</option>
						</select>
						<label class='control-label'>Description</label>
						<textarea ng-model='descEvent' class='form-control'></textarea>
						<button ng-click='addEvent(`+location.lng()+`,`+location.lat()+`)' class='btn btn-primary'>Submit</button>
                    </div>`;

                    compiledContent = $compile(content)($scope);
					$scope.infoWindow = new google.maps.InfoWindow({content : ''});
                    google.maps.event.addListener(marker, 'click', (function(marker, content, scope) {
	                    return function() {
	                        scope.infoWindow.setContent(content);
	                        scope.infoWindow.open(scope.map, marker);
	                    };
                	})(marker, compiledContent[0], $scope));			
				}

				$scope.addEvent = function(longitude,lattitude) {
					// alert("clicked");
					// console.log("totototototto");
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
								longEvent: longitude,
								lattEvent: lattitude
							}
						}).then(function successCallback(response) {
								$location.url("/");
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
							$location.url("/");
						}, function errorCallback(response) {
							alert(response);
					});
				}
    			
    			$scope.deleteButton = function(longitude,lattitude){
    				$http({
						url: "/api/event", 
						method: "DELETE",
						data: {
							nomEvent: $scope.nomEvent,
							adresse: $scope.adresse,
							codePostal: $scope.codePostal,
							ville: $scope.ville,
							dateDebut: $scope.dateDebut,
							dateFin: $scope.dateFin,
							typeEvent: $scope.typeEvent,
							descEvent: $scope.descEvent,
							longEvent: longitude,
							lattEvent: lattitude
						}
					}).then(function successCallback(response) {
							$location.url("/");
						}, function errorCallback(response) {
							alert(response);
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