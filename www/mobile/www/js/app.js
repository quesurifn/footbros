angular.module('explorer', ['ionic', 
    'explorer.product',
    'explorer.controllers',
    'auth0',
    'angular-storage',
    'angular-jwt'])

    .run(function ($ionicPlatform, $rootScope) {

        $rootScope.server = "http://footbros.com";

        $ionicPlatform.ready(function () {
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
              cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
              // org.apache.cordova.statusbar required
              StatusBar.styleDefault();
            }
        });
    })
    .config(function ($sceDelegateProvider) {
        $sceDelegateProvider.resourceUrlWhitelist(['self', new RegExp('^(http[s]?):\/\/(w{3}.)?youtube\.com/.+$')]);
    })
    .config(function ($stateProvider, $urlRouterProvider, authProvider,
      jwtInterceptorProvider, $httpProvider) {

        $stateProvider
          .state('login', {
            url: "/login",
            templateUrl: "templates/login.html",
            controller: 'LoginCtrl'
          })
        $urlRouterProvider.otherwise('/products');
        // Configure Auth0
          authProvider.init({
            domain: AUTH0_DOMAIN,
            clientID: AUTH0_CLIENT_ID,
            loginState: 'products'
          });
    })
    .run(function($rootScope, auth, store) {
      $rootScope.$on('$locationChangeStart', function() {
        if (!auth.isAuthenticated) {
          var token = store.get('token');
          if (token) {
            auth.authenticate(store.get('profile'), token);
          }
        }

      });
    });


