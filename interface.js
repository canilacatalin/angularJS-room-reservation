
angular.module("interface", [])
	   .controller("interfaceController", function($scope, $http){
		   $scope.userPage = function(){
			   window.location = "user.html"
		   };
		   $scope.adminPage = function(){
			   document.getElementById('myModal').style.display = "none";
			   document.getElementById("loginPopup").style.display = "block";
		   };
		   $scope.cancelButton = function(){
			   document.getElementById('myModal').style.display = "block";
			   document.getElementById("loginPopup").style.display = "none";
		   };
		   $scope.interfaceOpen = function(){
			   var modal = document.getElementById('myModal');
				   modal.style.display = "block";
		   };
		   $scope.LogInCheck = function(){
			   $http({
					url: "loginCheck.php",
					method: "POST",
					data: { 'username': $scope.username, 'password':$scope.password }
					})
					.then(function(response){
						
						if(response.data == "success")
						{
							window.location="admin.html"
						}
						else
						{
							alert("Try again !");
						}
					});
		   };
	   });