angular.module('starter.controllers', ['angularMoment'])

//.controller('TimerCtrl', function($scope) {})
.controller('TimerCtrl', ['$scope', 'moment', '$interval', '$state', 'Routines', function($scope, moment, $interval, $state, Routines) {

  var allData = Routines.all(); //get the sample data from the factory

  var oneRoutine = allData["Routine1"]; //focus on the first (now only) routine, for now

  $scope.routineTitle = oneRoutine.title; //store the title

  $scope.steps = oneRoutine.steps; //store the steps array

  $scope.currentTime = moment().format('h:mm:ss a');

}])

.controller('ReportCtrl', function($scope) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  }
})


.controller('RoutinesCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
