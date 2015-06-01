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
    var numCompletedAttempts = oneRoutine.attempts.length
    if (workingAttempt > numCompletedAttempts){
      return false;
    } else {
      return true;
    }
  }

 //might need more massaging to get the times out of objects
  //this gets the start and end times
  //of a particular step in an attempt
  //assuming if an attempt is RUNNING then we return times from that attempt,
  //otherwise we return times from the last completed attempt
  // THIS IS TO PASS INTO DIFF
  var getTime = function(stepTitle, oneRoutine){
    //ADJUST CURRENT ATTEMPT TO BE CURRENT IF ROUTINE IS ACTIVE, OTHERWISE DECREMENT BECAUSE WE INCREMENT WHEN ATTEMPTED IS FINISHED

    if (is_attemptRunning(oneRoutine)){
      var currentAttempt = oneRoutine.currentOps.workingAttempt;
    } else {
      var currentAttempt = oneRoutine.currentOps.workingAttempt-1;
    }
    //have to - 1 because of index/length issue.
    //We adjusted it twice. It needs that.
    var attemptArray = oneRoutine.attempts[currentAttempt-1];
    for (var i = 0; i < attemptArray.length; i++) {
      var thisStepName = attemptArray[i].title;
      if (thisStepName === stepTitle){
        var timeArray = attemptArray[i].times;
      }
    }
    return timeArray;
  };

  var setTime = function(newTime, oneRoutine){

  }


  //runs diff on all steps in attempt
  var calDurationStep = function(){

  }



  return {
    calcDurationSegment: calcDurationSegment
    ,is_attemptRunning: is_attemptRunning
    ,getTime: getTime
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
                        ,"workingAttempt" : 0 //# (not index 0) of the current attempt; increment it when you hit "Finished"
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
                        ,"workingAttempt" : 3 //# (not index 0) of the current attempt; increment it when you hit "Finished"
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
