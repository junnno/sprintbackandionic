angular.module('starter.controllers', [])

  //  .controller('LoginCtrl', function (Backand, $state, $rootScope, LoginService) {
   .controller('LoginCtrl', function (Backand,$state, $rootScope, LoginService,$scope,APIInterceptor) {
         console.log("Login Controller Initialized");
 		 var login = this;

        function signin() {
            LoginService.signin(login.email, login.password)
                .then(function () {
                   console.log(Backand.getUserRole());
                   if(Backand.getUserRole() == 'User'){
                   		 onLogin(Backand.getUsername());
                   }
                   else{
                   console.log("Access Denied");
                   }
                }, function (error) {
                    console.log(error)
                })
        }

        function anonymousLogin(){
            LoginService.anonymousLogin();
            onLogin();
        }
        
        $scope.signUp = function(){
           console.log("reg");
           $state.go('signup');
        }

        function onLogin(username){
            $rootScope.$broadcast('authorized');
            console.log("G");
            $state.go('tab.dash');
            login.username = username;
           //login.username = username;
           console.log(username);
                    $rootScope.username = login.username;
        }

        function signout() {
            LoginService.signout()
                .then(function () {
                    //$state.go('tab.login');
                    $rootScope.$broadcast('logout');
                    console.log("Bye.");
                    $state.go($state.current, {}, {reload: true});
                })

        }

        function socialSignIn(provider) {
            LoginService.socialSignIn(provider)
                .then(onValidLogin, onErrorInLogin);

        }

        function socialSignUp(provider) {
            LoginService.socialSignUp(provider)
                .then(onValidLogin, onErrorInLogin);

        }

        onValidLogin = function(response){
            onLogin();
            login.username = response.data || login.username;
        }

        onErrorInLogin = function(rejection){
            login.error = rejection.data;
            $rootScope.$broadcast('logout');

        }

        login.username = '';
        login.error = '';
        login.signin = signin;
        login.signout = signout;
        login.anonymousLogin = anonymousLogin;
        login.socialSignup = socialSignUp;
        login.socialSignin = socialSignIn;
     
    })

   .controller('SignUpCtrl', function (Backand, $state, $rootScope, LoginService) {
        var vm = this;

        vm.signup = signUp;

        function signUp(){
            vm.errorMessage = '';
		var parameters = {degree_course: vm.degree, student_number: vm.stdno, role:'User'};
            LoginService.signup(vm.firstName, vm.lastName, vm.email, vm.password, vm.again, parameters)
                .then(function (response) {
                    // success
         
                    onLogin();
                }, function (reason) {
                    if(reason.data.error_description !== undefined){
                        vm.errorMessage = reason.data.error_description;
                    }
                    else{
                        vm.errorMessage = reason.data;
                    }
                });
           
        }


        function onLogin() {
            $rootScope.$broadcast('authorized');
            $rootScope.username = Backand.getUsername();;
            $state.go('tab.dash');
            
        }


        vm.email = '';
        vm.password ='';
        vm.again = '';
        vm.firstName = '';
        vm.lastName = '';
         vm.stdno = '';
          vm.degree = '';
        vm.errorMessage = '';
    })

.controller('DashCtrl', function($scope,$state,LoginService,$rootScope,AuthService,DashService, RequestService, $ionicPopup,Backand) {
        //palitan nang details from user login. //gawa ng service, hanapin sa db.

        initialize();
        Backand.on('items_updated', function (data) {
	 			 //Get the 'items' object that have changed
	 			 console.log("requests updated!!");
	  			console.log(data);
	  			initialize();
		});
		
       function initialize(){
       			
               console.log("Dashboard Controller Initialized");
               AuthService.getUserDetails().then(function(data){
                     
                      $scope.userData = data;
                      $scope.ready = [];
                      $scope.pending = [];
                      $scope.completed = [];
                      
                        $scope.pendingFlag = true;
		                $scope.readyFlag = true;
		                $scope.completedFlag = true;
                    
                      DashService.getReady(data.id).then(function(result){
                            /*request object*/
                             $scope.ready = result.data;
                             
                              if($scope.ready.length == 0){
				                      $scope.readyFlag = false;
				                      		$scope.ready[0] = {
				                      				//if no results returned, tell the user. Using shopname as placeholder...
				                      				"shopname" : "No requests po khoya."
				                      		}
                              }
                           
                      });
                      
                      DashService.getPending(data.id).then(function(result){
                            /*request object*/
                             $scope.pending = result.data;
                            
                              if($scope.pending.length == 0){
				                      $scope.pendingFlag = false;
				                      		$scope.pending[0] = {
				                      				//if no results returned, tell the user. Using shopname as placeholder...
				                      				"shopname" : "No requests po khoya."
				                      		}
                              }
                              
                      });
                      
                      DashService.getCompleted(data.id).then(function(result){
                            /*request object*/
                             $scope.completed = result.data;
                            
                              if($scope.completed.length == 0){
                              $scope.completedFlag = false;
                              		$scope.completed[0] = {
                              				//if no results returned, tell the user. Using shopname as placeholder...
                              				"shopname" : "No requests po khoya."
                              		}
                              }
                               // Stop the ion-refresher from spinning
                             $scope.$broadcast('scroll.refreshComplete');
                      });
                      
                });

       }
 		/*@@@@@@@@@@@ACCORDION CODE @@@@@@@@@@@@@@@@*/
				$scope.groups = [];
				
				//Top Level Accordion Elements
				titles = ["Ready for Pick-up", "Pending", "Completed"];
				 //Lower Level Accordion Elements

			  for (var i=0; i<3; i++) {    //hardcoded to 3 groups, ready, pending and completed
							$scope.groups[i] = {
							  		name: titles[i],          //only stored names 
							  		//"item" : entries[i]  //still used scope.ready, scope.pending etc.. to ensure synced data
							};
			  }
			  
			  /*
			   * if given group is the selected group, deselect it
			   * else, select the given group
			   */
			  $scope.toggleGroup = function(group) {
						if ($scope.isGroupShown(group)) {
						 			 $scope.shownGroup = null;
						} else {
						 			 $scope.shownGroup = group;
						}
			  };
			  
			  $scope.isGroupShown = function(group) {
									return $scope.shownGroup === group;
			  };

			$scope.toggleGroup($scope.groups[0]);
		/////////////END OF ACCORDION CODE////////////////////////////


       $scope.cancelRequest = function(id) {
       
 			 var  object = {
                 "status" : "cancelled"
             };
            RequestService.update(id,object).then(function(response){
                        console.log(response);       
				    //Refresh pending requests
				     initialize();
              });
                                   
         }
             
           //pull to refresh data
         $scope.doRefresh = function() {
			initialize()
          };
          
       $scope.logout = function() {

						var confirmPopup = $ionicPopup.confirm({
						
						 template: "<style> .popup-container .popup {border-radius: 5px; border: 1px solid #ddd;}</style>",
						 title: 'Are you sure? :(',
						  scope: $scope,
						 buttons: [{
								text: 'No',
								type: 'button-dark',    	    
								onTap: function(e) {
									confirmPopup.close();
									$scope.result = false;
								}
							  }, {
								text: 'Yes',
								type: 'button-energized',
								onTap: function(e) {  	
									confirmPopup.close();
									$scope.result = true;
								}
							  }]
					   });

					  confirmPopup.then(function() {
								   	//Action if confirm is selected
									 if($scope.result) {
								   	//Send resource request
									LoginService.signout()
											.then(function () {
												$rootScope.$broadcast('logout');
												console.log("Bye.");
												//$state.go('login', {}, {reload: true});
												window.location = "index.html";  //reload, clear cache
											})
									 } else {//Action if cancel is selected
												console.log("");
									 }
							  })
				   
				}
            
 

})

.controller('uploadCtrl', function($scope, $rootScope, Backand, $http, RequestService, $ionicPopup, ShopService) {
  
   		console.log("Upload Controller Initialized");
		$scope.data={};
		
		
			 getAllShops();
			  
			   function getAllShops(){
					  ShopService.getAllShops()
						    .then(function(result){
						           $scope.shops = result.data.data;
						           console.log($scope.shops);
					  })
			   }
		
		
			//@@@@File uploading code@@@@

			  var baseUrl = '/1/objects/';
			  var baseActionUrl = baseUrl + 'action/'
			  var objectName = 'uploads';
			  var filesActionName = 'files';
			  
			  // Display the image after upload
			  $scope.data.fileUrl = null;
			  
			  // Store the file name after upload to be used for delete
			  $scope.filename = null;

			  // input file onchange callback
			  function imageChanged(fileInput) {

							//read file content
							var file = fileInput.files[0];
							console.log(file);
							var reader = new FileReader();

							reader.onload = function(e) {
							console.log();
							  upload(file.name, e.currentTarget.result).then(function(res) {
							  console.log(res.data);
							$scope.data.fileUrl = res.data.url;
							$scope.filename = file.name;
							  }, function(err){
							  console.log(err);
								alert(err.data);
							  });
							};
						   
							reader.readAsDataURL(file);
			  };

			  // register to change enent on input file 
			  function initUpload() {
				var fileInput = document.getElementById('fileInput');

				fileInput.addEventListener('change', function(e) {
				  imageChanged(fileInput);
				});
			  }

			   // call to Backand action with the file name and file data  
			  function upload(filename, filedata) {
				// By calling the files action with POST method in will perform 
				// an upload of the file into Backand Storage
					console.log(filename);
					console.log(filedata);
					return $http({
					  method: 'POST',
					  url : Backand.getApiUrl() + baseActionUrl +  objectName,
					  params:{
						"name": filesActionName
					  },
					  headers: {
						'Content-Type': 'application/json'
					  },
					  // you need to provide the file name and the file data
					  data: {
						"filename": filename,
						"filedata": filedata.substr(filedata.indexOf(',') + 1, filedata.length) //need to remove the file prefix type
					  }
				});
			  };

			  $scope.deleteFile = function(){
				if (!$scope.filename){
				  alert('Please choose a file');
				  return;
				}
				// By calling the files action with DELETE method in will perform 
				// a deletion of the file from Backand Storage
				$http({
				  method: 'DELETE',
				  url : Backand.getApiUrl() + baseActionUrl +  objectName,
				  params:{
					"name": filesActionName
				  },
				  headers: {
					'Content-Type': 'application/json'
				  },
				  // you need to provide the file name 
				  data: {
					"filename": $scope.filename
				  }
				}).then(function(){
				  // Reset the form
				  $scope.data.fileUrl = null;
				  document.getElementById('fileInput').value = "";
				});
			  }
			  
			  $scope.initCtrl = function() {
						initUpload();
			  }
			  ////////////END OF FILE UPLOAD////////////
			  
			  
		$scope.printRequest = function(){
			var fileId = null;
            var confirmPopup = $ionicPopup.confirm({
            
			 template: "<center><p>Are you sure?</p></center><style> .popup-container .popup {border-radius: 5px; border: 1px solid #ddd;}</style>",
			 title: 'Confirm Submission',
			 scope: $scope,
		     buttons: [{
		    	    text: 'Cancel',
		    	    type: 'button-dark',    	    
		    	    onTap: function(e) {
		    	    	confirmPopup.close();
		    	    	$scope.result = false;
		    	    }
		    	  }, {
		    	    text: 'Submit',
		    	    type: 'button-energized',
		    	    onTap: function(e) {  	
		    	    	confirmPopup.close();
		    	    	$scope.result = true;
		    	    }
		    	  }]
		   });

		  confirmPopup.then(function() {
					   	//Action if confirm is selected
						 if($scope.result) {
					   	//Send resource request
							RequestService.getUserId().then(
									function(result){ //Input successful
									
									  userId = result.id;
									  printOption = $scope.data.choice;
									  notes =  $scope.data.notes;
									  shopId = $scope.data.shopid;
									  console.log($scope.data.shopid);
				                      request = createObject(fileId, userId, shopId,printOption,notes);
				                      
				                      
				                      RequestService.add(request)
				                              .then(function(result){
				                              console.log("Request Sent.");
				                      })
										var confirmPopup_1 = $ionicPopup.confirm({
											 template: "<style>.popup-head, .popup-buttons { background-color: #eee; border: 0px;}.popup-body{max-height: 0px; padding: 0px;} .popup-container .popup {border-radius: 5px; border: 5px solid #eee;}</style>",
											 title: 'Your Request Has Been Sent',

										     buttons: [{
										    	    text: 'OK',
										    	    type: 'button-default',							    	    
										    	    onTap: function(e) {
										    	    	confirmPopup_1.close();
										    	    }
										    }]
										});
									},
									function(result){ 
										console.log("[ERROR] Failed to send data");
									}
								
								);
						 } else {//Action if cancel is selected
									console.log("");
						 }
				  })
			}
			   function createObject(fileId, userId, shopId, printOption,notes){
			   
						var date = new Date();

					   date =  ("00" + (date.getMonth() + 1)).slice(-2) + "/" + 
									("00" + date.getDate()).slice(-2) + "/" + 
									date.getFullYear() + " " + 
									("00" + date.getHours()).slice(-2) + ":" + 
									("00" + date.getMinutes()).slice(-2) + ":" + 
									("00" + date.getSeconds()).slice(-2)
					   				 console.log(date);
					   				 
						var  object = [
						         {
						             "file_id" : '',
						             "user_id": userId,
						             "shop_id":shopId,
						             "date_requested":  date,
						             "status": "pending",
						             "isColored" : printOption,
						             "notes": notes,
						             "file_url": $scope.data.fileUrl,
						             "upload_name":$scope.filename
						         }
						 ];

						    return object; //return request object
			   }
		  
})

.controller('CourseDetailCtrl', function($scope, $stateParams) {
  			console.log("Course Details Controller Initialized");
})

.controller('ShopDetailCtrl', function($scope, $stateParams, CourseService) {
  console.log("Course Details Controller Initialized");
   console.log($stateParams.shopId);
   var shopId = $stateParams.shopId;
   getCourses(shopId);
  
   function getCourses(id){
          CourseService.getCourses(id)
                .then(function(result){
                       $scope.courses = result.data.data;
                       console.log($scope.courses);
          })
   }
})




.controller('FileDetailCtrl', function($scope, $stateParams, FileService,$rootScope, RequestService, $ionicPopup, $ionicModal) {
	  console.log("File Details Controller Initialized");
	  console.log($stateParams.shopId);
	  console.log($stateParams.courseId);
	   var shopId = $stateParams.shopId;
	   var courseId = $stateParams.courseId;
	   var userId;
	   var printOption;
	   var notes;
	   var request = [];
   
 	   getFiles(shopId, courseId);
  
	   function getFiles(shopId, courseId){
		      FileService.getFiles(shopId,courseId)
		            .then(function(result){
		                   $scope.files = result.data.data;
		                   console.log($scope.files);
		      })
	   }
   
     $scope.printRequest = function(fileId){
            
            $scope.data={};
            var confirmPopup = $ionicPopup.confirm({
            
			 template: "<ion-radio ng-model='data.choice' ng-value='false'>Black & White</ion-radio><ion-radio ng-model='data.choice' ng-value='true'>Colored</ion-radio><span class='input-label'>Notes	</span><textarea placeholder='Place your additional instructions here.' rows='4' ng-model='data.notes'></textarea><style> .popup-container .popup {border-radius: 5px; border: 1px solid #ddd;}</style>",
			 title: 'Print Options',
			  scope: $scope,
			 //templateUrl:'my-modal.html',
		     buttons: [{
		    	    text: 'Cancel',
		    	    type: 'button-dark',    	    
		    	    onTap: function(e) {
		    	    	confirmPopup.close();
		    	    	$scope.result = false;
		    	    }
		    	  }, {
		    	    text: 'Submit',
		    	    type: 'button-energized',
		    	    onTap: function(e) {  	
		    	    	confirmPopup.close();
		    	    	$scope.result = true;
		    	    }
		    	  }]
		   });

		  confirmPopup.then(function() {
					   	//Action if confirm is selected
						 if($scope.result) {
					   	//Send resource request
							RequestService.getUserId().then(
									function(result){ //Input successful
									  userId = result.id;
									  printOption = $scope.data.choice;
									  notes =  $scope.data.notes;
				                      request = createObject(fileId, userId, $stateParams.courseId, printOption,notes);
				                      
				                      
				                      RequestService.add(request)
				                              .then(function(result){
				                              console.log("Request Sent.");
				                      })
										var confirmPopup_1 = $ionicPopup.confirm({
											 template: "<style>.popup-head, .popup-buttons { background-color: #eee; border: 0px;}.popup-body{max-height: 0px; padding: 0px;} .popup-container .popup {border-radius: 5px; border: 5px solid #eee;}</style>",
											 title: 'Your Request Has Been Sent',

										     buttons: [{
										    	    text: 'OK',
										    	    type: 'button-default',							    	    
										    	    onTap: function(e) {
										    	    	confirmPopup_1.close();
										    	    }
										    }]
										});
									},
									function(result){ 
										console.log("[ERROR] Failed to send data");
									}
								
								);
						 } else {//Action if cancel is selected
									console.log("");
						 }
				  })
				   
				}
   
   function createObject(fileId, userId, courseId, printOption,notes){
            var date = new Date();

		   date =  ("00" + (date.getMonth() + 1)).slice(-2) + "/" + 
						("00" + date.getDate()).slice(-2) + "/" + 
						date.getFullYear() + " " + 
						("00" + date.getHours()).slice(-2) + ":" + 
						("00" + date.getMinutes()).slice(-2) + ":" + 
						("00" + date.getSeconds()).slice(-2)
           				 console.log(date);
           				 
            var  object = [
                     {
                         "file_id" : fileId,
                         "user_id": userId,
                         "shop_id":shopId,
                         "course_id":courseId,
                         "date_requested":  date,
                         "status": "pending",
                         "isColored" : printOption,
                         "notes": notes
                     }
             ];

                return object; //return request object
   }
})

  
.controller('ShopCtrl', function($scope, ShopService, $rootScope) {
  
	   console.log("Shops Controller Initialized");
	  // With the new view caching in Ionic, Controllers are only called
	  // when they are recreated or on app start, instead of every page change.
	  // To listen for when this page is active (for example, to refresh data),
	  // listen for the $ionicView.enter event:
	  //
	  //$scope.$on('$ionicView.enter', function(e) {
	  //});
	   $scope.input = {};

	  getAllShops();
	  
	   function getAllShops(){
		      ShopService.getAllShops()
		            .then(function(result){
		                   $scope.shops = result.data.data;
		      })
	   }
	   /*
	   $scope.add = function(){
	   console.log($scope.input);
		        ShopService.add($scope.input)
		               .then(function(result){
		                 $scope.input = {};
		                 
		                 getShops();
		        })
	   }
	   $scope.remove = function(id){
		         ShopService.remove(id)
		               .then(function(result){
		                 
		                 getShops();
		        })
	   }*/
	   
});



