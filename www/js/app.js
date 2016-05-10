// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'backand','starter.controllers', 'starter.services'])

.run(function($ionicPlatform,LoginService, Backand, $rootScope, $state) {

   console.log("Welcome to Sprint!");
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
    
    var isMobile = !(ionic.Platform.platforms[0] == "browser");
            Backand.setIsMobile(isMobile);
            Backand.setRunSignupAfterErrorInSigninSocial(true);
  });
  
         function unauthorized() {
            console.log("user is unauthorized, sending to login");
            $state.go('login');
        }

        function signout() {
            LoginService.signout();
        }

        $rootScope.$on('unauthorized', function () {
            unauthorized();
        });

        $rootScope.$on('$stateChangeSuccess', function (event, toState) {
            if (toState.name == 'login') {
                signout();
            }
            else if (toState.name != 'login' && Backand.getToken() === undefined) {
                unauthorized();
            }
        });

})

.config(function($stateProvider, $urlRouterProvider,BackandProvider) {
   BackandProvider.setAppName('sprintbackand');
   BackandProvider.setSignUpToken('b4befb93-5615-4cc0-b8b5-33fa1588e4ea');
  BackandProvider.setAnonymousToken('643c461a-1fc6-4a66-b277-8f929b92bf73');
    BackandProvider.runSocket(true);
  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive

  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:
  
  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    }
  })

  .state('tab.courses', {
      url: '/courses',
      views: {
        'tab-courses': {
          templateUrl: 'templates/tab-courses.html',
          controller: 'CoursesCtrl'
        }
      }
    })
    
    .state('tab.courses-detail', {
      url: '/courses/:courseId',
      views: {
        'tab-courses': {
          templateUrl: 'templates/course-detail.html',
          controller: 'CourseDetailCtrl'
        }
      }
    })

  .state('tab.shops', {
    url: '/shops',
    views: {
      'tab-shops': {
        templateUrl: 'templates/tab-shop.html',
        controller: 'ShopCtrl as vm'
      }
    }
  })
  
      .state('tab.shops-detail', {
      url: '/shops/:shopId',
      views: {
        'tab-shops': {
          templateUrl: 'templates/shop-detail.html',
          controller: 'ShopDetailCtrl'
        }
      }
    })
    
      .state('tab.file-detail', {
      url: '/shops/:shopId/:courseId',
      views: {
        'tab-shops': {
          templateUrl: 'templates/files.html',
          controller: 'FileDetailCtrl'
        }
      }
    })
    
   .state('login', {
    url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl as login'

  })
  
  .state('signup', {
    url: '/signup',
        templateUrl: 'templates/signup.html',
        controller: 'SignUpCtrl as vm'

  })
  
  .state('tab.upload', {
    url: '/upload',
    views: {
      'tab-upload': {
        templateUrl: 'templates/tab-upload.html',
        controller: 'uploadCtrl as vm'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');

});
