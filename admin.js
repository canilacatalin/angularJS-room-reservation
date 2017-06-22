var menu = angular.module("menu", ["ngRoute"]) // dependency
				.config(['$locationProvider', function($locationProvider) {
						$locationProvider.hashPrefix('');
				}])
				.config(function ($routeProvider){
					 $routeProvider
						.when("/reservations", {
							templateUrl: "Templates/reservations.html",
							controller: "reservationsController"
						})
						.when("/rooms", {
							templateUrl: "Templates/rooms.html",
							controller: "roomsController"
						})
					
				 })
				 .controller("reservationsController", function($scope, $http){
					$scope.showReservations = function(){
						$http.get("reservations.php")
							 .then(function(response){
								 $scope.reservations = response.data;
							 });	
					}
				 })
				 .controller("roomsController", function($scope, $http){
					$scope.showRooms = function(){
						$http.get("rooms.php")
							 .then(function(response){
								 $scope.rooms = response.data;
							 });
							 ///////////////////////////// edit /////////////////////////////
							$scope.editingData = {};
							
							for(var i = 0; i < $scope.rooms.length; i++)
							{
								$scope.editingData[$scope.rooms[i].id] = false;
							}
					}
					
					$scope.edit = function(data){
						$scope.editingData[data.id] = true;
						};
					$scope.saveEdit = function(data){
						$scope.editingData[data.id] = false;
						
						$http({
							url: "actions/edit.php",
							method: "POST",
							data: { 'name': data.name, 'floor':data.floor, 'capacity':data.capacity, 'id':data.id }
						}).then(function(response){
								$scope.showRooms();
							});
					};
					$scope.delete = function(data){
						$http({
							url: "actions/delete.php",
							method: "POST",
							data: { 'id': data.id }
						}).then(function(response){
								$scope.showRooms();
						    });
					};
					$scope.addRoom = function(data){
						$http({
							url: "actions/add.php",
							method: "POST",
							data: { 'name': $scope.name, 'floor': $scope.floor, 'capacity': $scope.capacity }
						}).then(function(response){
								$scope.showRooms();
							});
					};
					$scope.clearInputs = function()
					{
						$scope.name = null;
						$scope.floor = null;
						$scope.capacity = null;
					}
					
				});
				 

				   