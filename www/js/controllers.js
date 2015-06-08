angular.module('starter.controllers', ['angularMoment', 'chart.js'])

//.controller('TimerCtrl', function($scope) {})
.controller('TimerCtrl', ['$scope', 'moment', '$interval', '$state', 'ShareData','Routines', 'TimerCalcs', function($scope, moment, $interval, $state, ShareData, Routines, TimerCalcs) {


  //INITIALIZE FUNCTIONS

  //Use timer to reference scope of this controller.
  $scope.timer = $scope;

  //LOAD DATA FROM LAST TIME
  //TimerCalcs.loadFromLocalStorage()

  var allData = Routines.template(); //get the sample data from the factory

  ShareData.oneRoutine = allData["Routine1"];

  console.log("This is ShareData.oneRoutine in TimerCtrl ", ShareData.oneRoutine);

  var oneRoutine = ShareData.oneRoutine; //because Objects are reference type, this should work!

  $scope.routineTitle = oneRoutine.title; //store the title


  //WE MAY NEED TO MOVE THIS TO OUR PULSING ITERATOR
  $scope.steps = oneRoutine.steps; //store the steps array

  //Start the main UI button in "none" category
  $scope.buttonStatus = "none";

  $scope.addStep = function(newStep){


    //First validate that there is not already a step with this same name
    var found = TimerCalcs.findElementByTitle(newStep,$scope.steps);

    //Only create new step if this step did not previously exist (return value -1)

    //PRESENTLY NO UI FOR ERROR MESSAGES -- ADD THIS LATER ***

    // also filters out empty steps
    if (found === -1 && newStep != "") {
      var tempObj = {
        "title" : newStep
        ,"timeDiff" : null
        ,"status" : "todo"
      }
      $scope.steps.push(tempObj);
    }

    ShareData.wow = ShareData.wow+" "+newStep; //FOR TESTING
    console.log(ShareData.wow);

    //Erase the user's value, regardless of whether it was created or not
    $scope.newStep = "";

    //Save data to LocalStorage
    TimerCalcs.saveToLocalStorage(oneRoutine);
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
    //This means some other step is running and we need to stop it
    if (activeStep != null) {
      TimerCalcs.stopStep(activeStep, oneRoutine);
      stopPulsar();
    }

    //Get here if we really, truly want to start the clickedStep timer
    //Set activeStep to be clickedStep
    oneRoutine.currentOps.activeStep = clickedStep;
    activeStep = oneRoutine.currentOps.activeStep;

    // console.log("Hello from right before change status");
    //Set status of this step to be "doing"
    TimerCalcs.changeStatus(clickedStep, "doing", oneRoutine);

    //Back-end timer start (i.e., push step name and start time into tree, as appropriate)
    TimerCalcs.setStartTime(clickedStep, oneRoutine);

    //Front-end timer start (i.e., change CSS and start pulsing clock)
    //start(clickedStep); //this starts the timer
    startUpdateTime(clickedStep);

    //UPDATE TIMER MAIN BUTTON
    evaluateButtonStatus();

    //Save data to LocalStorage
    TimerCalcs.saveToLocalStorage(oneRoutine);
  } //END OF STARTSTEP

  ///////// updateTime stuff
  var pulsar;
  var startUpdateTime = function(clickedStep){
   pulsar = $interval(function(){
    updateTime(clickedStep);
   // console.log("UPDATE Clicked Step:: ", clickedStep);
   }, 1000, [clickedStep]);
   // we pass [clickedStep] in as a parameter to the callbackfunction
  }

  function updateTime(runningStep){
    var diff = currentDiff();
    TimerCalcs.changeDiff(runningStep, diff, oneRoutine);

    var currentAttempt = oneRoutine.attempts[oneRoutine.currentOps.workingAttempt-1];
    $scope.bigDiff = TimerCalcs.calcDurationAttempt(currentAttempt);
    
    console.log("ONE ROUTINE TO RULE THEM ALL (oneRoutine from updateTime) : " , oneRoutine);
    console.log("Tick tock ($scope.steps from updateTime",$scope.steps);
          console.log("UPDATE TIME Button status: ",$scope.buttonStatus);
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

    //set ACTIVESTEP = null to show that no steps are now running
    oneRoutine.currentOps.activeStep = null;

    //UPDATE TIMER MAIN BUTTON
    evaluateButtonStatus();
    }

    //Save data to LocalStorage
    TimerCalcs.saveToLocalStorage(oneRoutine);
  }

   $scope.finishAttempt = function(){

    //Increment currentAttempt
    oneRoutine.currentOps.workingAttempt += 1;
    //we think this "locks" the prior attempt so that user cannot modify it / access it anymore

    //Reset oneRoutine.steps so that all are "todo" and timeDiff is null
    for (var i = 0; i < $scope.steps.length; i++) {
      $scope.steps[i].timeDiff = null;
      $scope.steps[i].status = "todo";
    };

    //Reset the button status to "none"
    $scope.buttonStatus = "none";

    //Save data to LocalStorage
    TimerCalcs.saveToLocalStorage(oneRoutine);

    //Redirect to graphs view, once it is ready
    $state.go('tab.graph');
   }
 
  var evaluateButtonStatus = function(){

    console.log("Hello from evaluateButtonStatus");
    
    if (TimerCalcs.is_attemptRunning(oneRoutine) === false){
      $scope.buttonStatus = "none";
    } else if(TimerCalcs.is_attemptRunning(oneRoutine) === true && oneRoutine.currentOps.activeStep != null){
      $scope.buttonStatus = "probably";
    } else if(TimerCalcs.is_attemptRunning(oneRoutine) === true && oneRoutine.currentOps.activeStep == null){
      $scope.buttonStatus = "definitely";
    };
  };

}]) // END OF TIMERCTRL CONTROLLER

.controller('GraphCtrl', ['$scope', 'ShareData', 'TimerCalcs', 'GraphCalcs', function($scope, ShareData, TimerCalcs, GraphCalcs) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  //Initialize data
  var oneRoutine = ShareData.oneRoutine; //because Objects are reference type, this should work!

  //Start with the all attempts view
  $scope.chartSelector = "allChrono"; //other options are "allFastest" or "oneDetail"
  $scope.routineTitle = oneRoutine.title;

  //Get info for all attempts chart
  var chartAllAttempts = function() {
    //Labels on X axis
    $scope.labels = GraphCalcs.getAttemptNames(oneRoutine);

    //Data for Y axis -- how long each attempt took
    var attemptDurations = GraphCalcs.getAttemptDurations(oneRoutine);
    $scope.data = [attemptDurations]; //Need to put result in an array to match angular-chart's expectations

    console.log("This is what is getting graphed, first labels then data ",$scope.labels,$scope.data); 

    //This is for if we convert this to a more generic chart engine
    // $scope.chartId = "bar";
    // $scope.chartClass = "chart chart-bar";
    // $scope.chartClick = "onClick";
  };

  chartAllAttempts(); // call this function

  var chartOneAttempt = function(attempt, attemptIndex) {
    //Labels on X axis
    $scope.labelsDetail = GraphCalcs.getStepNames(attemptIndex, oneRoutine);
    $scope.dataDetail = GraphCalcs.getStepDurations(attemptIndex, oneRoutine);

    console.log("This is what is getting graphed, first labels then data ",$scope.labels,$scope.data); 

  };


  $scope.clickAttempt = function(points, evt) {
    console.log("Which attempt was clicked?");
    
    prettyTimeClicked = points[0]._saved.label; // This is the "pretty" formatted time of the attempt that user clicked, but since it is "pretty" and not exact, we can only compare it to other pretty times in the attempts array

    //Look up "prettyTimeClicked" in the array of prettyTimes
    var foundResult = GraphCalcs.convertPrettyTimeToFullAttempt(prettyTimeClicked, oneRoutine);

    var attemptDetail = foundResult.array;
    var attemptDetailIndex = foundResult.index;

    if (attemptDetailIndex != -1) {
      //Show the detail chart of this Attempt
      chartOneAttempt(attemptDetail, attemptDetailIndex);
    } else {
      console.log("Fire in the hole! There's an error in $scope.clickAttempt in GraphsCtrl")
    }
  };

}])

.controller('RoutinesCtrl', ['$scope','ShareData', function($scope, ShareData) {
  // $scope.settings = {
  //   enableFriends: true
  // };

}]);
