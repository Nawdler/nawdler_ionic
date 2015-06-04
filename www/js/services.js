angular.module('starter.services', [])

.service('TimerCalcs', function() {

  //Current attempt = oneRoutine.currentOps.workingAttempt
  //Is the attempt running? //WORKS
  var is_attemptRunning = function(oneRoutine){
    var workingAttempt = oneRoutine.currentOps.workingAttempt;

    var numCompletedAttempts = oneRoutine.attempts.length;

    if (workingAttempt > numCompletedAttempts){
      return false;
    } else {
      return true;
    }
  }

var setStartTime = function(startedStep, oneRoutine){
    //This takes in:
    // startedStep -- the step that needs to be started in the tree
    // oneRoutine -- for scope purposes
    //This calculates:
    //  which attempt to use
    //  the current time
    //This either initiates a new object in the array if the step has not happened yet in this attempt, or if there was already a segment of this step, it addes a new start time and end time object

    var currentAttempt = oneRoutine.currentOps.workingAttempt;
    var now = moment.utc();

    if (getTimeArray(startedStep, oneRoutine).length > 0) {

      //This means there is at least one time for this step in the current attempt
      //So we can just insert an additional time object into array

      //Create an object with the start time and leave end time null
      var newStepTime = {"started_at": now
                        ,"ended_at" : null};

      //Insert this object into the time array for that step

      var currentAttemptArray = oneRoutine.attempts[currentAttempt-1];

      var target = findElementByTitle(startedStep, currentAttemptArray);
      var thisStep = currentAttemptArray[target];
      thisStep.times.push(newStepTime);

    } else {
      // Get here if we need to insert a whole new step for the startedStep (title + times)
      var newStep = {"title": startedStep
                    ,"times":[{"started_at": now
                    , "ended_at" : null}]};
      var currentAttemptArray = oneRoutine.attempts[currentAttempt-1];

      currentAttemptArray.push(newStep);

    }
  }; // END OF SET START TIME


  var stopStep = function(stepTitle, oneRoutine){
    //Mark step status as "done"
    console.log("Hello from stopStep");
    console.log("Stopping :",stepTitle);
    changeStatus(stepTitle, "done", oneRoutine);

    //timeDiff in oneRoutine.steps is already up-to-date with "final" duration of step, as it was updated every second

    //Store "final" ended_at time in attempts array
    setEndTime(stepTitle, oneRoutine);
  };

var setEndTime = function(endedStep, oneRoutine){
  console.log("Hello from inside setEndTime");

    var x = oneRoutine.attempts[0][0].title.title //WHY ARE TWO .TITLES NEEDED TO ACCESS TEXT WE WANT???
    console.log(x);
    //ARE WE PUSHING ELEMENT INTO ATTEMPT ARRAY WRONG?

    // endedStep -- the step that needs to be ended in the tree
    // oneRoutine -- for scope purposes
    //This looks up: which attempt to use and knows, of course, the current time
    //This adds a new end time into the attempts array in the correct object
    var currentAttempt = oneRoutine.currentOps.workingAttempt;
    var now = moment.utc();

    //changes ended_at to current moment (now) for this step in the attemps array

     //getTimeArray returns one value too high; need to decrement ***** CONFIRM

    var currentAttemptArray = oneRoutine.attempts[currentAttempt-1];

    var target = findElementByTitle(endedStep, currentAttemptArray);

    var thisStep = currentAttemptArray[target];
    var times = thisStep.times;
    times[times.length-1].ended_at = now;

  }; // END OF SET END TIME

  var findElementByTitle = function(title, context){
   // console.log("Hello from FindElementByTitle");
   // console.log("Here are my orders: title then context :: ",title, " , " ,context);

    if (typeof title != "string"){
   //   console.log("Changing target type because object");
      title = title.title; //oh god, I'm so sorry.
   //   console.log("new target title: " , title);
    };

    for (var i = 0; i < context.length; i++) {

      // console.log("--Here are my orders again: title then context :: ",title, " , " ,context);
      // console.log("FEBT says Looking for", title);
      // console.log("FEBT says comparing to", context[i]["title"]);

      if (typeof context[i].title != "string"){
        twoTitle = context[i].title.title
        // console.log("Changing context type because object");
        // console.log("new context title ",twoTitle);
      } else {
        twoTitle = context[i].title
      };

      if (twoTitle == title){
        // console.log("FEBT found something");
        return i;
      }
    };
    // console.log("FEBT returns ", -1);
    return -1;
  };

  var changeStatus = function(stepTitle, status, oneRoutine){
    console.log("Hello from inside changeStatus");
    stepTitle = stepTitle.title;
    var stepArray = oneRoutine.steps;
    var target = findElementByTitle(stepTitle, stepArray);
    stepArray[target].status = status;

    //THE FOLLOWING IS MADE OBSOLETE BY findElementByTitle
    //find the step in question by the title and change the status
    // for (var i = 0; i < stepArray.length; i++) {
    //   // console.log("this is the target for comparison ",stepTitle);
    //   // console.log("This is what changeStatus is checking: ",stepArray[i].title)
    //   if (stepArray[i].title === stepTitle){
    //     stepArray[i].status = status;
    //     // console.log("I found something to change ",stepArray[i].status);
    //     return;
    //   }
    // }
  };


  var getTimeArray = function(stepTitle, oneRoutine){

    //ADJUST CURRENT ATTEMPT TO BE CURRENT IF ROUTINE IS ACTIVE, OTHERWISE DECREMENT BECAUSE WE INCREMENT WHEN ATTEMPTED IS FINISHED
    if (is_attemptRunning(oneRoutine)){
      var currentAttempt = oneRoutine.currentOps.workingAttempt;
    } else {
      var currentAttempt = oneRoutine.currentOps.workingAttempt-1;
    }

    // attemptArray is the array of the entire attempt we want to look through
    //have also to - 1 because of distinction between index (starts at 0) and length (starts at 1)
    var attemptArray = oneRoutine.attempts[currentAttempt-1];
    var timeArray =[]; // return empty array if nothing found

    if (attemptArray === undefined){
      console.log("thought the current attempt array was undefined")
      //Get here if there is no attempt yet, and return empty array to avoid error
     return timeArray;
     // return {"timeArray":[], "titleIndex":null};
    }
    var target = findElementByTitle(stepTitle, attemptArray);

    if (target === -1){
      return timeArray;
    };

    var timeArray = attemptArray[target].times;

    // for (var i = 0; i < attemptArray.length; i++) {
    //   var thisStepName = attemptArray[i].title;
    //     if (thisStepName === stepTitle){
    //       console.log("Hello from found a match inside of Get Time Array");
    //       var timeArray = attemptArray[i].times;
    //     }
    // }
    return timeArray;
    //return {"timeArray":timeArray, "titleIndex":i};
  };

  var calcDurationSegment = function(startedAt, endedAt){
    var segmentDuration = endedAt.diff(startedAt);
    var durationFormatted = moment.duration(segmentDuration).format('H:mm:ss', { trim: false });
    //var durationFixed = moment.utc(segmentDuration.asMilliseconds()).format("H:mm:ss");
   // Math.floor(duration.asHours()) + moment.utc(duration.asMilliseconds()).format(":mm:ss");
    console.log("This is DURATION in calcDurationSegment ",segmentDuration);
    console.log("This is DURATION FORMATTED in calcDurationSegment ",durationFormatted);
    console.log("This is TYPEOF formatted :", typeof durationFormatted);

    //FORMATTING HERE IS NOT MEANINGFUL BECAUSE DURATIONS ARE ADDED in calcMultipleSegments

    return durationFormatted; 

    //moment(dur).format('HH:mm:ss');

  // OLD   var dur = endedAt.diff(startedAt,"DD/MM/YYYY HH:mm:ss");

  //  OLD    return moment.utc(dur).format('HH:mm:ss');
  };

  var calcMultipleSegments = function(array){
    var total = moment.duration(0); //initiatialize as moment duration of zero

    //console.log("Calc multiple Allxie", array);
    //console.log("array.length zoop :: ", array.length);

    for (var i=0; i < array.length; i++){
      //console.log("Calc Multiple Segments: array[i] ",array[i]);
      //console.log("CMS Steven Total before: ",total);
      var start = array[i].started_at;
      var end = array[i].ended_at || moment.utc(); // if there is no end yet, it's running so we call it now.
      var thisSegment = calcDurationSegment(start, end);
      total = total.add(thisSegment); //use moment to add two durations
      //console.log("CMS Total after: ",total);
    }
    var totalFormatted = moment.duration(total).format('H:mm:ss', { trim: false });

    return totalFormatted;
  };

  var changeDiff = function(stepTitle, diff, oneRoutine){
    stepTitle = stepTitle.title;
    var stepArray = oneRoutine.steps;

    var target = findElementByTitle(stepTitle, stepArray);
    stepArray[target].timeDiff = diff;

    // MADE OBSOLETE BY FEBT
    // console.log("!!step array change diff" , stepArray.length);
    // //find the step in question by the title and change the status
    // for (var i = 0; i < stepArray.length; i++) {
    //   console.log("this is the target for comparison ", stepTitle);
    //   console.log("This is what changediff is checking: ",stepArray[i].title)
    //   if (stepArray[i].title === stepTitle){
    //     stepArray[i].timeDiff = diff;
    //     console.log("CHANGING TIME DIFF :: ",stepArray[i].timeDiff);
    //     return;
    //   }
    // }
  };

  //runs diff on all steps in attempt
  var calcDurationAttempt = function(){

  }

  var saveToLocalStorage = function(oneRoutine){
    console.log("Saving to LocalStorage");

    // var user = device.uuid;
    // console.log("User id", user); //NO uuid in Ionic browser emulator, just in iOS emulator
    // once running on devices, then consider using UUID as key, rather than Nawdler

    window.localStorage.setItem("Nawdler", JSON.stringify(oneRoutine));  
  };

var loadFromLocalStorage = function(oneRoutine){
    console.log("Loading from LocalStorage");

    // var user = device.uuid;
    // console.log("User id", user); //NO uuid in Ionic browser emulator, just in iOS emulator
    // once running on devices, then consider using UUID as key, rather than Nawdler

    var reloadedData = JSON.parse(window.localStorage.getItem("Nawdler"));

    oneRoutine = reloadedData;  
  };


  return {
    calcDurationSegment: calcDurationSegment
    ,is_attemptRunning: is_attemptRunning
    ,getTimeArray: getTimeArray
    ,setStartTime: setStartTime
    ,calcDurationAttempt: calcDurationAttempt
    ,calcMultipleSegments: calcMultipleSegments
    ,changeStatus: changeStatus
    ,stopStep: stopStep
    ,changeDiff: changeDiff
    ,findElementByTitle: findElementByTitle
    ,saveToLocalStorage: saveToLocalStorage
    ,loadFromLocalStorage: loadFromLocalStorage
  }
}) //end service

.factory('Routines', function() {
  // Might use a resource here that returns a JSON array

  var titleTime =
    [
    {"title" : "Eat"
      ,"timeDiff" : moment().format('HH:mm:ss')
      ,"status" : "done"
    }
    ,{"title" : "Pray"
      ,"timeDiff" : moment().format('HH:mm:ss')
      ,"status" : "doing"
    }
      ,{"title" : "Love"
      ,"timeDiff" : moment().format('HH:mm:ss')
      ,"status" : "todo"
    }
      ,{"title" : "Read"
      ,"timeDiff" : moment().format('HH:mm:ss')
      ,"status" : "todo"
    }
  ];

    // "breakfast" : moment()
    // ,"lunch" : "2014-09-08T08:02:20-05:00"
    // ,"brunch" : "2014-10-08T08:02:37-05:00"
    // ,"dinner" : "2014-11-08T08:02:47-05:00"
    // ,"dessert" : "2014-12-08T08:02:57-05:00"

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
                        {"title" : "Eat"
                          ,"timeDiff" : moment().format('HH:mm:ss')
                          ,"status" : "done"
                        }
                        ,{"title" : "Pray"
                          ,"timeDiff" : moment().format('HH:mm:ss')
                          ,"status" : "doing"
                        }
                          ,{"title" : "Love"
                          ,"timeDiff" : moment().format('HH:mm:ss')
                          ,"status" : "todo"
                        }
                          ,{"title" : "Party"
                          ,"timeDiff" : moment().format('HH:mm:ss')
                          ,"status" : "todo"
                        }
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
    },
    titleTime: function(){
      return titleTime;
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
