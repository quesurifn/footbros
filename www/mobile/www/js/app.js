angular.module('explorer', ['ionic', 'explorer.product'])

    .run(function ($ionicPlatform, $rootScope) {

        $rootScope.server = "http://ec2-54-84-169-32.compute-1.amazonaws.com";

        $ionicPlatform.ready(function () {
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }
        });
    })
    .config(function ($sceDelegateProvider) {
        $sceDelegateProvider.resourceUrlWhitelist(['self', new RegExp('^(http[s]?):\/\/(w{3}.)?youtube\.com/.+$')]);
    })
    .config(function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/products');
    });


