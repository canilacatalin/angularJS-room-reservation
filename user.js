var user = angular.module('user', [])
				  .directive('datepicker', function() {
					  return {
						require: 'ngModel',
						link: function(scope, element, attrs, ngModel) {
						  $(element).datepicker({
							//dateFormat:'dd.mm.yy',
							onSelect: function(dateText) {
							  scope.$apply(function() {
								ngModel.$setViewValue(dateText);
								});
							}
						  });
						}
					  };
				  });
				user.controller("userController", function($scope, $http, $timeout, $filter, $compile){
					$scope.getReservations = function(){
						$http.get("reservations.php")
							 .then(function(response){
								 $scope.reservations = response.data;
							 });	
					}
					$scope.getRooms = function(){
						$http.get("rooms.php")
							 .then(function(response){
								 $scope.rooms = response.data;
							 });
					}
					
					$scope.init = function(){
						$scope.getReservations();
						$scope.getRooms();
						
						
						
					}
					$scope.getBetweenDates = function(start, end)
					{
						$scope.currentDate = new Date(start);
						var endDate = new Date(end);
						$scope.between = [];
						
						while($scope.currentDate <= endDate)
						{
							$scope.wantedFormat = $.datepicker.formatDate("dd.mm.yy", $scope.currentDate);		
							$scope.between.push({date: $scope.wantedFormat});
							$scope.currentDate.setDate($scope.currentDate.getDate() + 1);
						}
						return $scope.between;
					}
					
					$scope.returnOneTime = function(number)
					{
						$scope.time;
						$scope.startTime = 600;
						$scope.startTime = $scope.startTime + number * 15;
						$scope.hours = Math.floor($scope.startTime/60);
						$scope.minutes = ($scope.startTime%60);
						
						$scope.time = ("0" + ($scope.hours % 24)).slice(-2) + ':' + ("0" + $scope.minutes).slice(-2); 
						
						return $scope.time;
						
					}
					
					$scope.returnRoomsByCapacity = function (roomsArray, capacityWanted)
					{
						$scope.hasCapacityRequired = [];
						
						angular.forEach(roomsArray, function(room)
						{
							if((room.capacity >= capacityWanted) && (capacityWanted <=  room.capacity))	
							{
								$scope.hasCapacityRequired.push(room);
							}	
						});
						
						return $scope.hasCapacityRequired;
					}
					
					$scope.getReservationForRoom = function(array, room, atThisDate)
					{
						$scope.result = [];
						
						angular.forEach(array, function(reservation)
						{
							if((reservation.date.indexOf(atThisDate) >-1) && (reservation.roomId.indexOf(room.id) >-1))
							{
							$scope.result.push(reservation);
							}
						});
												
						return $scope.result;
					}
					
					$scope.timeRangeOverlaps = function(a_start, a_end, b_start, b_end)
					{	
						if((a_start <= b_start && b_start < a_end) 
											|| 
						   (a_start < b_end && b_end <= a_end) 
											|| 
						   (b_start < a_start && a_end < b_end))
						  {
						  return true;
						  }
						return false;
					}
					
					$scope.addMinutes = function(time, minsToAdd)
					{
						$scope.z= function(n){
							return (n<10? '0':'') + n;
						}
						$scope.split = time.split(':');
						$scope.minutes = $scope.split[0]*60 + (+$scope.split[1]) + (+minsToAdd);
						
						return $scope.z($scope.minutes%(24*60)/60 | 0) + ':' + $scope.z($scope.minutes%60);  

					}
					
					$scope.getFirstFit = function(reservations, duration)
					{

						$scope.reservationSort = $filter('orderBy')(reservations, 'startTime');
						for( var i = 0; i< 50 ; i++)
						{
							$scope.matches = 0;
							$scope.sTime = $scope.returnOneTime(i);
							
							for( var j = 0; j < $scope.reservationSort.length; j++)
							{
								if($scope.timeRangeOverlaps($scope.reservationSort[j].startTime, $scope.reservationSort[j].endTime, 
															$scope.sTime,                        $scope.addMinutes($scope.sTime, duration)))
								{
									$scope.matches = 0;
								}
								else
								{
									$scope.matches++;
								}
								if($scope.matches == $scope.reservationSort.length)
								{
									return $scope.sTime;
								}
							}
							
						}
					}
					
					$scope.resultsArray = function(reservations, rooms)
					{
						$scope.finalResults = [];
						$scope.filteredRooms = $scope.returnRoomsByCapacity(rooms, Number($scope.capacity));
						$scope.betweenDates = $scope.getBetweenDates($scope.startDate, $scope.endDate);
		
						angular.forEach($scope.filteredRooms, function(room)
						{
							$scope.currentRoom = room;
							
							angular.forEach($scope.betweenDates, function(between)
							{
								$scope.filteredReservations = $scope.getReservationForRoom(reservations, $scope.currentRoom, between.date);
								$scope.match = $scope.getFirstFit($scope.filteredReservations, $scope.duration);
								
								if($scope.match != null)
								{
		
									$scope.finalResults.push({
															roomId: $scope.currentRoom.id,
															name: $scope.currentRoom.name,
															startTime: $scope.match,
															endTime: $scope.addMinutes($scope.match, $scope.duration),
															date: between.date,
															capacity: $scope.currentRoom.capacity
															});	
								}
								else
								{
									$scope.finalResults.push({
															roomId: $scope.currentRoom.id,
															name: $scope.currentRoom.name,
															startTime: $scope.returnOneTime(0),
															endTime: $scope.addMinutes($scope.returnOneTime(0), $scope.duration),
															date: between.date,
															capacity: $scope.currentRoom.capacity
															});
								}
							});
						});
						
						return $scope.finalResults;
					}
				
					$scope.showResultsTable = function(reservations, rooms)
					{
						var table = angular.element(document.querySelector('#tableContent'));
						table.empty();
						table.append('<table>' +
										'<thead> ' +
											'<tr> ' +
												'<td> Room number </td> <td> Room name  </td><td> Start time </td><td>  End time  </td><td> Date </td><td>  Capacity </td>' +
											'</tr> ' +
										'</thead>' +
										'<tbody> ' +
											'<tr ng-repeat="result in finalResults | limitTo: 5">' +
												'<td model="roomId">' 
												+'{{result.roomId}}'+
												'</td> <td>' 
												+'{{result.name}}'+
												'</td><td>'
												+'{{result.startTime}}'+
												'</td><td>'
												+'{{result.endTime}}'+
												'</td><td >'
												+'{{result.date}}'+
												'</td><td>'
												+'{{result.capacity}}'+
												'</td><td>' 
													+'<button ng-click="reservation(result)">Make reservation</button></td>' +
											'</tr>' +
										'</tbody>' +
									'</table>');
						$compile(table)($scope);
						$scope.$digest();
						
					}
					
				
										
				 })
				 
				 
