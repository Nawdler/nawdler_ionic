angular.module('starter.controllers', ['angularMoment'])

//.controller('TimerCtrl', function($scope) {})
.controller('TimerCtrl', ['$scope', 'moment', '$interval', '$state', 'Routines', 'TimerCalcs', function($scope, moment, $interval, $state, Routines, TimerCalcs) {

  //GETTERS AND SETTERS
  var allData = Routines.template(); //get the sample data from the factory
  var oneRoutine = allData["Routine1"]; //focus on the first (now only) routine, at least for now
  $scope.routineTitle = oneRoutine.title; //store the title
  $scope.steps = oneRoutine.steps; //store the steps array


//DURATION CALCULATIONS


    // var start = moment.utc("2015-06-01T10:15:00","DD/MM/YYYY HH:mm:ss");
    // var finish = moment.utc("2015-06-01T11:45:10","DD/MM/YYYY HH:mm:ss");
    // //var finish = moment();
    // //var dur = finish.diff(start,"DD/MM/YYYY HH:mm:ss");
    // var x = TimerCalcs.calcDurationSegment(start,finish);
    // console.log(x);
    // $scope.currentTime = x;
  //console.log("activeStep outside");
    //console.log(activeStep);

  //moment.utc(dur).format('HH:mm:ss');


  $scope.addStep = function(newStep){
    var tempObj = {"title" : newStep
      ,"timeDiff" : null
      ,"status" : "todo"
    }
    $scope.steps.push(tempObj);
    //$scope.newStep = "";
  }

  $scope.startStep = function(clickedStep){
    //Ionic passes us clickedStep based on which list item user clicked on!
    // This is the currently active step, Null if none is active
    var activeStep = oneRoutine.currentOps.activeStep;

    if (activeStep === clickedStep) { //If user clicks on current step, then nothing should happen. Let it keep timing.
      console.log("you're already on this step.");
      return;
    }

    if (TimerCalcs.is_attemptRunning(oneRoutine) === false) { //This means there is no attempt running and we need to create one
      //Initiative a new attempt by creating an array to hold the steps of that attempt
     console.log("Hello from new attempt init");
      oneRoutine.attempts.push([]);
      //console.log(oneRoutine);
      //consider saving oneRoutine to LocalStorage here later
    }

    if (activeStep != null) { //This means some other step is running and we need to stop it
      stopStep(activeStep);
    }

    //Get here if we really, truly want to start the clickedStep timer
    //Set activeStep to be clickedStep
    oneRoutine.currentOps.activeStep = clickedStep;
    //start(clickedStep); //this starts the timer
    console.log("clicked Step::  ", clickedStep);

    //Front-end timer start (i.e., change CSS and start pulsing clock)

    //Back-end timer start (i.e., push step name and start time into tree, as appropriate)
    TimerCalcs.setStartTime(clickedStep, oneRoutine);



    console.log("OneRoutine -- Yoda");
    console.log(oneRoutine);

    console.log("attempts");
    console.log(oneRoutine.attempts);

    console.log("activeStep");
    console.log(activeStep);
  } //END OF STARTSTEP

  ///////// updateTime stuff
  var pulsar;
  var start = function(clickedStep){
   pulsar = $interval(function(clickedStep){
    var now = moment();
    titleTime.clickedStep = now;
    //console.log(now);
   }, 1000);
  }

  // function updateTime(clickedStep){
  //   // var now = moment();
  //   // titleTime.breakfast = now;
  //   // console.log(now);
  //   //console.log("update time");
  //   //updateCurrentTime();
  // }

  // $scope.stop = function(){
  //   $interval.cancel(pulsar);
  // }
  ///////end update time stuff


  // $scope.active = TimerCalcs.is_attemptRunning(oneRoutine);
  // console.log($scope.active);

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
