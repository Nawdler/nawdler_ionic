angular.module('starter.services', [])

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
  },{
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'https://pbs.twimg.com/profile_images/598205061232103424/3j5HUXMY.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'https://pbs.twimg.com/profile_images/578237281384841216/R3ae1n61.png'
  }];

 // var dataStructure =
 //    {"Routine_1": {
 //          "title": "morning Routine",
 //          "steps" : [
 //                      "Take Shower",
 //                      "Put On Clothes [Was Get Dressed]",
 //                      "Eat Breakfast]",
 //                      "Pack Bag"
 //                      ],
 //          "currentOps" : {
 //                      "activeStep" : null,//which step is currently active, //"Null" if no step is running, i.e., Pause mode
 //                      "currentAttemptIndex" : 2//index # of the current attempt; increment it when you hit "Finished"
 //                         }
 //          "attempts" : [ //array of attempt data, each attempt is one array element
 //                        [    //each element is an array of steps
 //                          {"title": "Take Shower", //attempt 0 // each "step" is an object with title and times keys
 //                           "times":[{
 //                                    "started_at": TIME, //each TIME key is an array of objects with starts and ends time
 //                                    "ended_at" : TIME
 //                                    }]},
 //                          {"title": "Get Dressed",
 //                           "times": [{
 //                                      "started_at": TIME1,
 //                                      "ended_at" : TIME1
 //                                    },{
 //                                      "started_at": TIME2,
 //                                      "ended_at" : TIME2
 //                                    }]}
 //                        ],//END OF ATTEMPT 0
 //                        [
 //                          {"title": "Take Shower", //attempt 1
 //                           "times":[{
 //                                      "started_at": TIME,
 //                                      "ended_at" : TIME
 //                                      }]},
 //                          {"title": "Get Dressed",
 //                           "times": [{
 //                                      "started_at": TIME1,
 //                                      "ended_at" : TIME1
 //                                    }]},
 //                          {"title": "Eat Breakfast",
 //                          "times" :[{
 //                                      "started_at": TIME1,
 //                                      "ended_at" : TIME1
 //                                   }]}
 //                        ]//END OF ATTEMPT 1
 //                       ]//end all attempts for this routine

 //                  } //end named routine object
 //  } //end all routines



  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
});
