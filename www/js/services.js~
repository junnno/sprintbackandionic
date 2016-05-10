angular.module('starter.services', [])
    .service('APIInterceptor', function ($rootScope, $q) {
        var service = this;

        service.responseError = function (response) {
            if (response.status === 401) {
                $rootScope.$broadcast('unauthorized');
            }
            return $q.reject(response);
        };
    })
    
    .service('LoginService', function (Backand, $http) {
        var service = this;
      baseUrl = '/1/objects/',
            objectName = 'users/';
            
        service.signin = function (email, password, appName) {
            //call Backand for sign in
            return Backand.signin(email, password);
        };

        service.anonymousLogin= function(){
            // don't have to do anything here,
            // because we set app token att app.js
        }

        service.socialSignIn = function (provider) {
            return Backand.socialSignIn(provider);
        };

        service.socialSignUp = function (provider) {
            return Backand.socialSignUp(provider);

        };

        service.signout = function () {
            return Backand.signout();
        };

        service.signup = function(firstName, lastName, email, password, confirmPassword, parameters){
         //how to add to custom user table??
           return  Backand.signup(firstName, lastName, email, password, confirmPassword, parameters);
    }
     
        function getUrl() {
            return Backand.getApiUrl() + baseUrl + objectName;
        }

        function getUrlForId(id) {
            return getUrl() + id;
        }
      service.get = function (id){
             return $http.get(getUrlForId(id));
      };
        service.update = function (id, object) {
       // console.log("Service object ");
             //   console.log(object);
        
            return $http.put(getUrlForId(id), object);
        };


    })

    .service('AuthService', function($http, Backand){

    var self = this;
    var baseUrl = Backand.getApiUrl() + '/1/objects/';
    self.appName = 'sprintbackand';//CONSTS.appName || '';
    self.currentUser = {};
    
    self.getSocialProviders = function () {
        return Backand.getSocialProviders()
    };

    self.socialSignIn = function (provider) {
        return Backand.socialSignIn(provider)
            .then(function (response) {
                loadUserDetails();
                return response;
            });
    };

    self.socialSignUp = function (provider) {
        return Backand.socialSignUp(provider)
            .then(function (response) {
                loadUserDetails();
                return response;
            });
    };

    self.setAppName = function (newAppName) {
        self.appName = newAppName;
    };

    self.signIn = function (username, password, appName) {
        return Backand.signin(username, password, appName)
            .then(function (response) {
                loadUserDetails();
                return response;
            });
    };

    self.signUp = function (firstName, lastName, username, password, parameters) {
        return Backand.signup(firstName, lastName, username, password, password, parameters)
            .then(function (signUpResponse) {

                if (signUpResponse.data.currentStatus === 1) {
                    return self.signIn(username, password)
                        .then(function () {
                        console.log(signUpResponse);
                            return signUpResponse;
                        });

                } else {
                    return signUpResponse;
                }
            });
    };

    self.changePassword = function (oldPassword, newPassword) {
        return Backand.changePassword(oldPassword, newPassword)
    };

    self.requestResetPassword = function (username) {
        return Backand.requestResetPassword(username, self.appName)
    };

    self.resetPassword = function (password, token) {
        return Backand.resetPassword(password, token)
    };

    self.logout = function () {
        Backand.signout().then(function () {
            angular.copy({}, self.currentUser);
        });
    };

    getUserDetails = function() {
        return $http({
            method: 'GET',
            url:  baseUrl + "users/",
            params: {
                filter: JSON.stringify([{
                    fieldName: "email",
                    operator:    "contains",
                    value: Backand.getUsername()
                }])
            }
        }).then(function (response) {
            if (response.data && response.data.data && response.data.data.length == 1){
                                                                   // console.log(response.data.data[0].id);      
                return response.data.data[0];
             }
             else{
                console.log(response);    
             }
        });
    }

    
return{
getUserDetails  : getUserDetails
}
})
  
 .service('DashService', function($http, Backand){
 Backand.on('items_updated', function (data) {
  //Get the 'items' object that have changed
  console.log(data);
});
			 getReady = function(id){
							
							return $http ({
									  method: 'GET',
									  url: Backand.getApiUrl() + '/1/query/data/getReady',
									  params: {
										parameters: {
										  user_id: id
										}
									  }
									});
			 }
 			getPending = function(id){
							
							return $http ({
									  method: 'GET',
									  url: Backand.getApiUrl() + '/1/query/data/getPending',
									  params: {
										parameters: {
										  user_id: id
										}
									  }
									});
			 }
			 getCompleted = function(id){
							
							return $http ({
									  method: 'GET',
									  url: Backand.getApiUrl() + '/1/query/data/getCompleted',
									  params: {
										parameters: {
										  user_id: id
										}
									  }
									});
			 }
			 
			 
	 return{
			  getPending :getPending,
		      getReady :getReady,
		      getCompleted:getCompleted,
	 }
 })
  
.service('CourseService', function($http, Backand) {
      var baseUrl = '/1/objects/';
      var object1Name = 'shops/';
     var object2Name = '/courses';
      
      function getUrl() {
             return Backand.getApiUrl() + baseUrl + object1Name;
      }
      
      function getUrlForId(id){
            return getUrl() + id;
      }
     
      getCourses = function (id){
             return $http.get(getUrl() + '/' + id + object2Name);
      };
      
      subscribeToCourse = function(course){
               return $http.post(getUrl(), course);
      };
      
      unsubscribeToCourse = function(id){
              return $http.delete(getUrlForId(id));
      };
      
      return{
          getCourses: getCourses,
          subscribeToCourse : subscribeToCourse,
          unsubscribeToCourse: unsubscribeToCourse
      }
})


.service('ShopService', function($http, Backand) {
      var baseUrl = '/1/objects/';
      var objectName = 'shops/';
      
      function getUrl() {
             return Backand.getApiUrl() + baseUrl + objectName;
      }
      
      function getUrlForId(id){
            return getUrl() + id;
      }
      
      getAllShops = function (){
             return $http.get(getUrl());
      };
      
     getShops = function (id){
             return $http.get(getUrlForId(id));
      };
      
      add = function(course){
               return $http.post(getUrl(), course);
      };
      
      remove = function(id){
              return $http.delete(getUrlForId(id));
      };
      
      return{
          getShops: getShops,
          getAllShops: getAllShops,
          add : add,
          remove: remove
      }
})

.service('FileService', function($http, Backand) {
      var baseUrl = '/1/objects/';
      var object1Name = 'shops/';
      var object2Name = '/courses';
      var object3Name = '/files';
      
      function getUrl() {
             return Backand.getApiUrl() + baseUrl + object2Name;
      }
      
      function getUrlForId(id){
            return getUrl() + id;
      }
     
      getFiles = function (shopId, courseId){
             return $http.get(getUrl() + '/' + courseId + object3Name);
      };
      
      add = function(course){
               return $http.post(getUrl(), course);
      };
      
      remove = function(id){
              return $http.delete(getUrlForId(id));
      };
      
      return{
          getFiles: getFiles,
          add : add,
          remove: remove
      }
})

.service('RequestService', function($http, Backand) {



      var baseUrl = '/1/objects/';
      var object1Name = 'requests/';
      var self = this;

    self.currentUser = {};
      
      function getUrl() {
             return Backand.getApiUrl() + baseUrl + object1Name;
      }
      
      function getUrlForId(id){
            return getUrl() + id;
      }
     
      getRequests = function (){
             return $http.get(getUrl());
      };
      
      add = function(request){
               return $http.post(getUrl(), request);
      };
      
      remove = function(id){
              return $http.delete(getUrlForId(id));
      };
      
      update = function(id, object){
              return $http.put(getUrlForId(id), object);
      };

    getUserId = function() {
        return $http({
            method: 'GET',
            url:  Backand.getApiUrl() + baseUrl + "users/",
            params: {
                filter: JSON.stringify([{
                    fieldName: "email",
                    operator:    "contains",
                    value: Backand.getUsername()
                }])
            }
        }).then(function (response) {
            if (response.data && response.data.data && response.data.data.length == 1){
                                                                   // console.log(response.data.data[0].id);      
                return response.data.data[0];
             }
             else{
                console.log(response);    
             }
        });
    }
    
    
    
      return{
         getUserId: getUserId,
          getRequests: getRequests,
          add : add,
          remove: remove,
          update: update
      }
});


