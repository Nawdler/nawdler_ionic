angular.module('starter.controllers', ['angularMoment'])

//.controller('TimerCtrl', function($scope) {})
.controller('TimerCtrl', ['$scope', 'moment', '$interval', '$state', 'Routines', 'TimerCalcs', function($scope, moment, $interval, $state, Routines, TimerCalcs) {

  //Use timer to reference scope of this controller.
  $scope.timer = $scope;
  //GETTERS AND SETTERS
  var allData = Routines.template(); //get the sample data from the factory
  var oneRoutine = allData["Routine1"]; //focus on the first (now only) routine, at least for now
  $scope.routineTitle = oneRoutine.title; //store the title


  //WE MAY NEED TO MOVE THIS TO OUR PULSING ITERATOR
  $scope.steps = oneRoutine.steps; //store the steps array


//DURATION CALCULATIONS


    // var start = moment.utc("2015-06-01T10:15:00","DD/MM/YYYY HH:mm:ss");
    // var finish = moment.utc("2015-06-01T11:45:10","DD/MM/YYYY HH:mm:ss");
    // //var finish = moment();
    // //var dur = finish.diff(start,"DD/MM/YYYY HH:mm:ss");
    // var x = TimerCalcs.calcDurationSegment(start,finish);
    // console.log(x);
    // $scope.currentTime = x;

  //moment.utc(dur).format('HH:mm:ss');


  $scope.addStep = function(newStep){
    console.log("Hello from addStep and $scope.newStep", $scope.newStep)

    var tempObj = {"title" : newStep
      ,"timeDiff" : null
      ,"status" : "todo"
    }
    $scope.steps.push(tempObj);
    $scope.newStep = "";

    var test = moment.duration(93, "seconds").format();
    console.log("HELLO YODA", test);
  };

  $scope.startStep = function(clickedStep){
    //Ionic passes us clickedStep based on which list item user clicked on!
    // This is the currently active step, Null if none is active

    console.log("Hello from start step");
    console.log("This is what was clicked",clickedStep);

    var clickedStepString = clickedStep.title;
    console.log("This is what was clicked and hopefully now a string",clickedStepString);

   // clickedStep = clickedStepString;

    var activeStep = oneRoutine.currentOps.activeStep;

    if (activeStep === clickedStep) { //If user clicks on current step, then nothing should happen. Let it keep timing.
      // console.log("you're already on this step.");
      return;
    }

    //This means there is no attempt running and we need to create one
    if (TimerCalcs.is_attemptRunning(oneRoutine) === false) {

      //Initiate a new attempt by creating an array to hold the steps of that attempt
     // console.log("Hello from new attempt init");
      oneRoutine.attempts.push([]);
      //consider saving oneRoutine to LocalStorage here later
    }
    console.log("Active Step 1 ", activeStep);
    //This means some other step is running and we need to stop it
    if (activeStep != null) {
      TimerCalcs.stopStep(activeStep, oneRoutine);
      stopPulsar();
    }
    console.log("STOPPING Active Step 2 ", activeStep);


    //Get here if we really, truly want to start the clickedStep timer
    //Set activeStep to be clickedStep
    oneRoutine.currentOps.activeStep = clickedStep;
    console.log("Active Step 3 ", activeStep);
    activeStep = oneRoutine.currentOps.activeStep;
    console.log("Active Step 4 ", activeStep);

    // console.log("Hello from right before change status");
    //Set status of this step to be "doing"
    TimerCalcs.changeStatus(clickedStep, "doing", oneRoutine);

    //Back-end timer start (i.e., push step name and start time into tree, as appropriate)
    TimerCalcs.setStartTime(clickedStep, oneRoutine);

    //Front-end timer start (i.e., change CSS and start pulsing clock)
    //start(clickedStep); //this starts the timer
    startUpdateTime(clickedStep);

  } //END OF STARTSTEP

  ///////// updateTime stuff
  var pulsar;
  var startUpdateTime = function(clickedStep){
   pulsar = $interval(function(){
    updateTime(clickedStep);
    console.log("UPDATE Clicked Step:: ", clickedStep);
   }, 1000, [clickedStep]);
   // we pass [clickedStep] in as a parameter to the callbackfunction
  }

  function updateTime(runningStep){
    var diff = currentDiff();
    TimerCalcs.changeDiff(runningStep, diff, oneRoutine);
    console.log("ONE ROUTINE TO RULE THEM ALL (oneRoutine from updateTime) : " , oneRoutine);
    console.log("Tick tock ($scope.steps from updateTime",$scope.steps);
  }

  var currentDiff = function(){
    var currentStep = oneRoutine.currentOps.activeStep;

    var timeArray = TimerCalcs.getTimeArray(currentStep, oneRoutine); //.timeArray;
    var total = TimerCalcs.calcMultipleSegments(timeArray);
    return total;
  }

  var stopPulsar = function(){
    $interval.cancel(pulsar);
  }
  ///////end update time stuff

  $scope.probablyDone = function(){
    var activeStep = oneRoutine.currentOps.activeStep;
    if (activeStep != null) {
      TimerCalcs.stopStep(activeStep, oneRoutine);
      stopPulsar();
    }
  }
  // $scope.active = TimerCalcs.is_attemptRunning(oneRoutine);
  // console.log($scope.active);

}])

.controller('ReportCtrl', ['$scope', 'GraphCalcs', 'Reports', function($scope, GraphCalcs, Reports) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  // window.onload = function(){
  //   chart.render();
  // }
  Reports.render();


}])


.controller('RoutinesCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
