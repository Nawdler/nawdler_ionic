angular.module('starter.controllers', ['angularMoment', 'chart.js'])

//.controller('TimerCtrl', function($scope) {})
.controller('TimerCtrl', ['$scope', 'moment', '$interval', '$state', 'ShareData','Routines', 'TimerCalcs', 'LocalStorage', function($scope, moment, $interval, $state, ShareData, Routines, TimerCalcs, LocalStorage) {


  //INITIALIZE FUNCTIONS

  //Use timer to reference scope of this controller.
  $scope.timer = $scope;

  //LOAD DATA FROM LAST TIME
  //ShareData.loadFromLocalStorage()

  //If no routine is "active" send user to Routines page to pick one


//REPLACE THIS or REMOVE THIS -- REPLACED BY LOADING IN ROUTINES TAB
  //var allData = Routines.template(); //get the sample data from the factory

//  ShareData.oneRoutine = allData["Routine1"]; //this will be replaced with active routine
//TO HERE

 
 // var oneRoutine = ShareData.oneRoutine; //because Objects are reference type, this should work!
 // console.log("This is ShareData.oneRoutine in TimerCtrl ", ShareData.oneRoutine);

  

  //Initialize data -- load from "ShareData" service!
  var oneRoutine = ShareData.oneRoutine; //because Objects are reference type, this works!
  console.log("This is loaded data in TimerCtrl - ShareData.oneRoutine ",oneRoutine);

  //Load data about the routine into $scope for displaying
  $scope.routineTitle = oneRoutine.title; //store the title

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

      //Save data to LocalStorage
      LocalStorage.saveToLocalStorage();
 
     // LocalStorage.saveToLocalStorage(LocalStorage.mergeRoutineIntoDataTree());
      // ShareData.saveToLocalStorage(oneRoutine);
    }

    // ShareData.wow = ShareData.wow+" "+newStep; //FOR TESTING
    // console.log(ShareData.wow);

    //Erase the user's value, regardless of whether it was created or not
    $scope.newStep = "";

  };

  $scope.startStep = function(clickedStep){
    //Ionic passes us clickedStep based on which list item user clicked on!
    // This is the currently active step, Null if none is active

    console.log("Hello from start step");
    console.log("YODA This is what was clicked",clickedStep);
    console.log("YODA typeof what was clicked ",typeof clickedStep);

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
    LocalStorage.saveToLocalStorage();

//    LocalStorage.saveToLocalStorage(LocalStorage.mergeRoutineIntoDataTree());
    //OLD WAY ShareData.saveToLocalStorage(oneRoutine);
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
    LocalStorage.saveToLocalStorage();

    //LocalStorage.saveToLocalStorage(LocalStorage.mergeRoutineIntoDataTree());

    //OLD WAY ShareData.saveToLocalStorage(oneRoutine);
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
    LocalStorage.saveToLocalStorage();

    //LocalStorage.saveToLocalStorage(LocalStorage.mergeRoutineIntoDataTree());

    //OLD WAY ShareData.saveToLocalStorage(oneRoutine);

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

.controller('GraphCtrl', ['$scope', 'ShareData', 'TimerCalcs', 'GraphCalcs', 'LocalStorage', function($scope, ShareData, TimerCalcs, GraphCalcs, LocalStorage) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  //Initialize data
  var oneRoutine = ShareData.oneRoutine; //because Objects are reference type, this works!

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

.controller('RoutinesCtrl', ['$scope','ShareData', 'Routines', 'LocalStorage', function($scope, ShareData, Routines, LocalStorage) {

  //INITIALIZE DATA FOR APP, which defaults to Routines page.  Thus, this should be the first code that runs in the app after being launched

  console.log("This should be first code to run... Start of RoutinesCtrl");

  //Check if localStorage exists with Nawdler data.  If so, load it.  If not, create it with default template

  var allData = LocalStorage.loadFromLocalStorage();

  //allData will be false if there is nothing with "Nawdler" key in localStorage. See loadFromLocalStorage function
  if (!allData) { 
    //Get here if there is no "nawdler" data in localStorage  
    console.log("Nothing for Nawdler in localStorage");

    //load data template from factory new user with example routines
    var allData = Routines.template(); //get the template data from the factory
    console.log("Starting Nawdler with template data in RoutineCtrl", allData);

    //Save full template data to localStorage
    window.localStorage.setItem("Nawdler", JSON.stringify(allData));  

    //LocalStorage.initialSaveToLocalStorage(allData);
  } else {
    console.log("Found stuff in LocalStorage to start Nawdler with");
  };

  //Set oneRoutine to be active routine
  //Determine which routine is the "active" one for the user
  var activeRoutine = allData.appOps.activeRoutine; //get the index number of the active routine
  
  // To "activate" and share a given routine...  Share activeRoutine by using ShareData.oneRoutine variable.  Because Objects are a reference type, this works
  ShareData.oneRoutine = allData.routines[activeRoutine];

  console.log("This is ShareData.oneRoutine in RoutinesCtrl ", ShareData.oneRoutine);

  //PREP FOR ROUTINES PAGE USER INTERACTIONS
  //Use 'routines' term to reference scope of this controller -- important for HTML template
  $scope.routines = $scope;

  //Make the "routines" array for template ng-repeat



  $scope.addRoutine = function(){


  }

  $scope.selectRoutine = function(clickedRoutine){


  }

}]);
