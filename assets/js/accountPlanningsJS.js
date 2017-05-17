// 'use strict';




angular.module("ae3").controller("accountPlanningsController", function($scope, $http, $location, $rootScope, $timeout) {
	$scope.plann = {};
	$http({
		url: '/api/planning',
		method: 'GET',
		params: {
			idUser: $rootScope.session.id
		}
	}).then(function successCallback(response) {
		// console.log(response);
		$scope.plann.list = response.data.data.plannings;
		console.log($scope.plann.list);
		angular.forEach($scope.plann.list, function(value, key, arr) {
			arr[key].mode = "consult";
			arr[key].upd = {};
			arr[key].upd.name = value.name;
			arr[key].upd.description = value.description;
		});

		$timeout(function() {
			var acc = document.getElementsByClassName("cstAccordion");
			var i;

			for (i = 0; i < acc.length; i++) {
				acc[i].onclick = function() {
					this.classList.toggle("active");
					var panel = this.nextElementSibling;
					if (panel.style.maxHeight) {
						panel.style.maxHeight = null;
					} else {
						panel.style.maxHeight = panel.scrollHeight + "px";
					}
				}
			}
		});		
	}, function errorCallback(response) {
		console.log("nok");
	});

	$scope.plann = function(idPlan, $event) {
		console.log("PL - edit " + idPlan);
		$scope.plann.list[idPlan].mode = ($scope.plann.list[idPlan].mode == 'consult' ? 'modif' : 'consult');
		$event.stopPropagation();
	};

	$scope.delPlannEv = function(idEv, idPlan, $event) {
		$http({
			url: '/api/planning/event',
			method: 'DELETE',
			data: {
				idPlanning: $scope.plann.list[idPlan].id,
				idEvent: $scope.plann.list[idPlan].events[idEv].event.id,
			}
		}).then(function successCallback(response) {
			$scope.plann.list[idPlan].events = $scope.plann.list[idPlan].events.filter(function(e, i) {
				return (i != idEv);
			});
		}, function errorCallback(response) {
			console.log('nok');
		});
		console.log("EV - edit " + idEv);
		$event.stopPropagation();
	};

	$scope.upd = function(idPlan, $event) {
		$http({
			url: "/api/planning",
			method: "PUT",
			data: {
				id: $scope.plann.list[idPlan].id,
				name: $scope.plann.list[idPlan].upd.name,
				description: $scope.plann.list[idPlan].upd.description
			},
		}).then(function successCallback(response) {
			console.log("updated !");
			$scope.plann.list[idPlan].name = $scope.plann.list[idPlan].upd.name;
			$scope.plann.list[idPlan].description = $scope.plann.list[idPlan].upd.description;
			$scope.plann.list[idPlan].mode = 'consult';
		}, function errorCallback(response) {
			console.log("nok");
		});
		$event.stopPropagation();
	};

	$scope.cancel = function(idPlan, $event) {
		$scope.plann.list[idPlan].upd.name = $scope.plann.list[idPlan].name;
		$scope.plann.list[idPlan].upd.description = $scope.plann.list[idPlan].description;
		$scope.plann.list[idPlan].mode = 'consult';
		$event.stopPropagation();
	};

	$scope.delete = function(idPlan, $event) {
		$http({
			url: "/api/planning",
			method: "DELETE",
			data: {
				id: $scope.plann.list[idPlan].id
			},
		}).then(function successCallback(response) {
			$scope.plann.list = $scope.plann.list.filter(function(e, i) {
				return (i != idPlan);
			});
		}, function errorCallback(response) {
			console.log("nok");
		});
		$event.stopPropagation();
	};
});