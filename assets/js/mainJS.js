'use strict';



angular.module("ae3").controller("mainController", function($scope, $http) {
	$http({
		url: "/api/event", 
		method: "GET"
	}).then(function successCallback(response) {
		// console.log(response);
		var map;
		var markers = [];
		var form;
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
					marker.addListener('click', toggleBounce);
					var clicker = addClicker(marker, obj.title);
					
				}



				// écoute les cliques de l'utilisateur pour créer un marker
				google.maps.event.addListener(map, 'click', function(event) {
					clearMarkers();
  					placeMarker(event.latLng);
				});






				// écoute les cliques de l'utilisateur sur les markers déjà présent, affiche le titre de l'événement
				function addClicker(marker, content) {
					var infoWindow = new google.maps.InfoWindow({content : obj.title});
					google.maps.event.addListener(marker, "click", function (e) {
						infoWindow.setContent(marker.title);
						infoWindow.open(map, marker);
					});
					var deleteButton = '<button id="modifyButton">modify</button><button id="deleteButton">Delete</button>';
				    google.maps.event.addListener(marker, 'rightclick', function (e) {
				        infoWindow.setContent(deleteButton);
				        infoWindow.open(map, marker);
				    });
				}

				





				// effet d'animation du bouton
				function toggleBounce() {
				  if (marker.getAnimation() !== null) {
				    marker.setAnimation(null);
				  } else {
				    marker.setAnimation(google.maps.Animation.BOUNCE);
				  }
				}

				
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
				    var marker = new google.maps.Marker({
				        position: location, 
				        map: map,
				        title: location,
				        animation: google.maps.Animation.DROP
					});
					marker.addListener('click', toggleBounce);
					markers.push(marker);
					form = `
					<div class='panel-body'>
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
						<label class='control-label'>Longitude</label>
						<input ng-model='longEvent' class='form-control' type='text' value=`+ location.lng() +`></input>
						<label class='control-label'>Lattitude</label>
						<input ng-model='lattEvent' class='form-control' type='text' value=`+ location.lat() +`></input>
					</div>
					<div class='panel-footer text-center'>
						<button ng-click='addEvent()' class='btn btn-primary'>Submit</button>
                    </div>
					</div>`;
					showMarker(marker,form);
					
				}

				$scope.addEvent = function() {
					console.log("totototototto");
    					$http({
							url: "/api/event", 
							method: "POST",
							data: {
								nomEvent: $scope.nomEvent,
								adresse: "toto",
								codePostal: "toto",
								ville: "toto",
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

				}
    			


				// Montre les markers sur la maps
				function showMarker(marker, content){
						var infoWindow = new google.maps.InfoWindow({content : form});
						//infoWindow.setContent(content);
						infoWindow.open(map, marker);

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