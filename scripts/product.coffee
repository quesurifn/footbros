window.Franchino = angular.module('tap.product', [])

Franchino.factory 'Product', ($http, $rootScope) ->
  { all: (queryString) ->
    $http.get $rootScope.server + '/products', params: queryString
 }

Franchino.controller 'ProductListCtrl', ($scope, $rootScope, $ionicScrollDelegate, $ionicSideMenuDelegate, Product) ->
  $scope.products = []
  pageSize = 20
  productCount = 1
  page = 0

  $scope.clearSearch = ->
    $scope.searchKey = ''
    $scope.loadData()
    return

  $rootScope.$on 'searchKeyChange', (event, searchKey) ->
    $scope.searchKey = searchKey
    $scope.loadData()
    return

  $scope.formatAlcoholLevel = (val) ->
    parseFloat val

  $scope.loadData = ->
    page = 1
    range = 1
    Product.all(
      search: $scope.searchKey
      min: range[0]
      max: range[1]
      page: page
      pageSize: pageSize).success (result) ->
      $scope.products = result.products
      productCount = result.total
      $ionicScrollDelegate.$getByHandle('myScroll').getScrollView().scrollTo 0, 0, true
      $scope.$broadcast 'scroll.infiniteScrollComplete'
      return
    return

  $scope.loadMoreData = ->
    page++
    range = 1
    Product.all(
      search: $scope.searchKey
      min: range[0]
      max: range[1]
      page: page
      pageSize: pageSize).success (result) ->
      productCount = result.total
      Array::push.apply $scope.products, result.products
      $scope.$broadcast 'scroll.infiniteScrollComplete'
      return
    return

  $scope.isMoreData = ->
    page < productCount / pageSize

  return


Franchino.controller 'ProductDetailCtrl', ($scope, $rootScope, $state, $stateParams, $sce, Product, $ionicHistory) ->
  
  $scope.myGoBack = ->
    $ionicHistory.goBack()
    return

  $scope.product =
    name: $stateParams.name
    brewery: $stateParams.brewery
    alcohol: $stateParams.alcohol
    video: $stateParams.video
    tags: $stateParams.tags
  $scope.tags = $scope.product.tags.split(', ')

  $scope.setSearchKey = (searchKey) ->
    $rootScope.$emit 'searchKeyChange', searchKey
    $state.go 'products'
    return

  $scope.formatAlcoholLevel = (val) ->
    '' + parseFloat(val) + '%'

  $scope.formatYoutubeUrl = (val) ->
    $scope.currentUrl = 'https://www.youtube.com/embed/' + val + ''
    $scope.betterUrl = $sce.trustAsResourceUrl($scope.currentUrl)
    $scope.betterUrl

  return

# ---
# generated by js2coffee 2.0.4