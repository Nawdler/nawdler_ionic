angular.module('starter.controllers', ['angularMoment'])

//.controller('TimerCtrl', function($scope) {})
.controller('TimerCtrl', ['$scope', 'moment', '$interval', '$state', 'Routines', 'TimerCalcs', function($scope, moment, $interval, $state, Routines, TimerCalcs) {

  var allData = Routines.all(); //get the sample data from the factory

  var oneRoutine = allData["Routine1"]; //focus on the first (now only) routine, at least for now

  $scope.routineTitle = oneRoutine.title; //store the title

  $scope.steps = oneRoutine.steps; //store the steps array

  //$scope.currentTime = moment().format('h:mm:ss a'); // just to see that Moment is working
  $scope.past1 = $scope.currentTime ;
  $scope.past2 = $scope.currentTime - 10.5;

 // $scope.past1 = moment("2015-02-09 09:34:40").diff(moment("2015-02-09 09:34:20", 'seconds'));

var start = moment.utc("2015-06-01T10:15:00","DD/MM/YYYY HH:mm:ss");
var finish = moment.utc("2015-06-01T11:45:10","DD/MM/YYYY HH:mm:ss");
//var finish = moment();
//var dur = finish.diff(start,"DD/MM/YYYY HH:mm:ss");
var x = TimerCalcs.calcDurationSegment(start,finish);
console.log(x);
$scope.currentTime = x;
//console.log($scope.currentTime);

//moment.utc(dur).format('HH:mm:ss');

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
