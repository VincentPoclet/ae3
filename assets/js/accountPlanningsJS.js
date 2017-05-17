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

	$scope.plannEv = function(idEv, $event) {
		console.log("EV - edit " + idEv);
		$event.stopPropagation();
	};

	$scope.upd = function(idPlan, $event) {
		$http({
			url: "/api/planning",
			method: "PUT",
			data: {
				id: $scope.plan.list[idPlan].id,
				name: $scope.plan.list[idPlan].name,
				description: $scope.plan.list[idPlan].description
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

		$event.stopPropagation();
	};
});