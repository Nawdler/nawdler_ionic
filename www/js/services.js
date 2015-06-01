angular.module('starter.services', [])

.service('TimerCalcs', function() {

  var calcDurationSegment = function(startedAt, endedAt){ //WORKS
    //WE KNOW THIS MAY HAVE AN HOUR CALCULATION BUG
    var dur = endedAt.diff(startedAt,"DD/MM/YYYY HH:mm:ss");
    return moment.utc(dur).format('HH:mm:ss');
  };

  //Current attempt = oneRoutine.currentOps.workingAttempt
  //Is the attempt running? //WORKS
  var is_attemptRunning = function(oneRoutine){
    var workingAttempt = oneRoutine.currentOps.workingAttempt;
    console.log("workingAttempt::  ",workingAttempt);

    var numCompletedAttempts = oneRoutine.attempts.length;
    console.log("attempts_length::  ",numCompletedAttempts);

    if (workingAttempt > numCompletedAttempts){
      console.log("Attempt wasn't running");
      return false;
    } else {
      console.log("Attempt was running");

      return true;
    }
  }

 //might need more massaging to get the times out of objects
  //this gets the start and end times
  //of a particular step in an attempt
  //assuming if an attempt is RUNNING then we return times from that attempt,
  //otherwise we return times from the last completed attempt
  // THIS IS TO PASS INTO DIFF
  var getTimeArray = function(stepTitle, oneRoutine){

    console.log("HEllo from getTimeArray");
    
    //ADJUST CURRENT ATTEMPT TO BE CURRENT IF ROUTINE IS ACTIVE, OTHERWISE DECREMENT BECAUSE WE INCREMENT WHEN ATTEMPTED IS FINISHED
    if (is_attemptRunning(oneRoutine)){
      var currentAttempt = oneRoutine.currentOps.workingAttempt;
    } else {
      var currentAttempt = oneRoutine.currentOps.workingAttempt-1;
    }

    // attemptArray is the array of the entire attempt we want to look through
    //have also to - 1 because of distinction between index (starts at 0) and length (starts at 1)
    var attemptArray = oneRoutine.attempts[currentAttempt-1];

    if (attemptArray === undefined){
      console.log("thought the current attempt array was undefined")
      //Get here if there is no attempt yet, and return empty array to avoid error
      return {"timeArray":[], "titleIndex":null};
    }
      console.log("attempt ARray")
        console.log(attemptArray);

    var timeArray =[]; // return empty array if nothing found

    for (var i = 0; i < attemptArray.length; i++) {
      var thisStepName = attemptArray[i].title;
      console.log("This Step Name::  ", thisStepName);
      console.log("target stepTitle: ",stepTitle);
        if (thisStepName === stepTitle){
          console.log("Hello from found a match");
          var timeArray = attemptArray[i].times;
          console.log("This is the match result: ", timeArray);
        }
    }
    return {"timeArray":timeArray, "titleIndex":i};
  };

  var setStartTime = function(startedStep, oneRoutine){
    //This takes in:
    // startedStep -- the step that needs to be started in the tree
    // oneRoutine -- for scope purposes
    //This calculates:
    //  which attempt to use
    //  the current time
    //This either initiates a new object in the array if the step has not happened yet in this attempt, or if there was already a segment of this step, it addes a new start time and end time object

    var currentAttempt = oneRoutine.currentOps.workingAttempt;
    var now = moment();

    console.log("setStartTime:GetTimeArrayResult:: ", getTimeArray(startedStep, oneRoutine));
    if (getTimeArray(startedStep, oneRoutine).timeArray.length > 0) { 
      //This means there is at least one time for this step in the current attempt
      //So we can just insert an additional time object into array

      //Create an object with the start time and leave end time null
      var newStepTime = {"started_at": now
                        ,"ended_at" : null};

      //Insert this object into the time array for that step
      // *Vomit* Let's clean this line up some time.

      oneRoutine.attempts[currentAttempt][getTimeArray(startedStep, oneRoutine).titleIndex].times.push(newStepTime);
    } else {
      // Get here if we need to insert a whole new step for the startedStep (title + times)
      var newStep = {"title": startedStep
                    ,"times":[{"started_at": now
                    , "ended_at" : null}]};

      console.log("About to push new step name  ::  ", oneRoutine.attempts[currentAttempt]);
      console.log("About to push - one routine  ::  ", oneRoutine);
      console.log("About to push - one routine.attemps  ::  ", oneRoutine.attempts);
      console.log("about to push -- currentAttempt  ", currentAttempt);

      oneRoutine.attempts[currentAttempt-1].push(newStep);
    }
  }; // END OF SET START TIME


  //runs diff on all steps in attempt
  var calcDurationStep = function(){

  }


  return {
    calcDurationSegment: calcDurationSegment
    ,is_attemptRunning: is_attemptRunning
    ,getTimeArray: getTimeArray
    ,setStartTime: setStartTime
    ,calcDurationStep: calcDurationStep
  }
}) //end service

.factory('Routines', function() {
  // Might use a resource here that returns a JSON array


   var dataTemplate =
      {"Routine1": {
            "title": "My Routine"
            ,"steps" : [
                        ]
            ,"currentOps" : {
                        "activeStep" : null //which step is currently active, //"Null" if no step is running, i.e., Pause mode
                        ,"workingAttempt" : 1 //# (not index 0) of the current attempt; increment it when you hit "Finished" //start at 1
                         }
            ,"attempts" :[ //array of attempt data, each attempt is one array element
                          //this will be the first attempt
                         
                         ]//end all attempts for this routine

                     } //end first routine object
     }; //end all routines

  // Some fake testing data
  //call it with: dataStorage.all
  var dataStorage =
      {"Routine1": {
            "title": "My Morning Routine"
            ,"steps" : [
                        "Take Shower"
                        ,"Put On Clothes"
                        ,"Eat Breakfast"
                        ,"Pack Bag"
                        ,"Put on Shoes"
                        ,"Grab a Stinky Coat"
                        ]
            ,"currentOps" : {
                        "activeStep" : null //which step is currently active, //"Null" if no step is running, i.e., Pause mode
                        ,"workingAttempt" : 2 //# (not index 0) of the current attempt; increment it when you hit "Finished"
                         }
            ,"attempts" : [ //array of attempt data, each attempt is one array element
                          //this is attempt 0
                          [ //each element is an array of steps
                          //each "step" is an object with title and times keys
                            {"title": "Take Shower"
                            //each TIME key is an array of objects with starts and ends time
                            ,"times":[{
                                      "started_at": moment("2015-02-09 09:30:20")
                                     , "ended_at" : moment("2015-02-09 09:34:40")
                                      }]
                             }
                            ,{"title": "Get Dressed",
                             "times": [{
                                        "started_at": "T3"
                                        ,"ended_at" : "T4"
                                      }
                                      ,{
                                        "started_at": "T5"
                                       , "ended_at" : "T6"
                                      }]}
                          ]//END OF ATTEMPT 0
                          ,[ // START OF ATTEMPT 1
                            {"title": "Take Shower"
                             ,"times":[{
                                        "started_at": "T7"
                                        ,"ended_at" : "T8"
                                        }]}
                            ,{"title": "Get Dressed"
                             ,"times": [{
                                        "started_at": "T9"
                                        ,"ended_at" : "T10"
                                      }]}
                            ,{"title": "Eat Breakfast",
                            "times" :[{
                                        "started_at": "T11"
                                        ,"ended_at" : "T12"
                                      }]}
                          ]//END OF ATTEMPT 1
                         ]//end all attempts for this routine

                     } //end first routine object
     }; //end all routines


  // var chats = [{
  //   id: 0,
  //   name: 'Ben Sparrow',
  //   lastText: 'You on your way?',
  //   face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
  // }, {
  //   id: 1,
  //   name: 'Max Lynx',
  //   lastText: 'Hey, it\'s me',
  //   face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
  // },{
  //   id: 2,
  //   name: 'Adam Bradleyson',
  //   lastText: 'I should buy a boat',
  //   face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
  // }, {
  //   id: 3,
  //   name: 'Perry Governor',
  //   lastText: 'Look at my mukluks!',
  //   face: 'https://pbs.twimg.com/profile_images/598205061232103424/3j5HUXMY.png'
  // }, {
  //   id: 4,
  //   name: 'Mike Harrington',
  //   lastText: 'This is wicked good ice cream.',
  //   face: 'https://pbs.twimg.com/profile_images/578237281384841216/R3ae1n61.png'
  // }];


  return {
    all: function() {
      return dataStorage;
    },
    template: function() {
      return dataTemplate;
    }
    // remove: function(chat) {
    //   chats.splice(chats.indexOf(chat), 1);
    // },
    // get: function(chatId) 
    // {
    //   for (var i = 0; i < chats.length; i++) {
    //     if (chats[i].id === parseInt(chatId)) {
    //       return chats[i];
    //     }
    //   }
    //   return null;
    // }
  };
});
