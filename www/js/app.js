angular.module('explorer', ['ionic', 
    'explorer.product',
    'explorer.controllers',
    'auth0',
    'angular-storage',
    'angular-jwt'])

    .run(function ($ionicPlatform, $rootScope) { 

        $rootScope.server = ""; 

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
          .state('app', {
            url: "/products",
            abstract: true,
            templateUrl: "templates/menu.html",
            controller: 'AppCtrl'
          })
        $urlRouterProvider.otherwise('/products');
        // Configure Auth0
          authProvider.init({
            domain: AUTH0_DOMAIN,
            clientID: AUTH0_CLIENT_ID,
            loginState: 'products'
          });

        jwtInterceptorProvider.tokenGetter = function(store, jwtHelper, auth) {
          var idToken = store.get('token');
          var refreshToken = store.get('refreshToken');
          if (!idToken || !refreshToken) {
            return null;
          }
          if (jwtHelper.isTokenExpired(idToken)) {
            return auth.refreshIdToken(refreshToken).then(function(idToken) {
              store.set('token', idToken);
              return idToken;
            });
          } else {
            return idToken;
          }
        }

        $httpProvider.interceptors.push('jwtInterceptor');
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


