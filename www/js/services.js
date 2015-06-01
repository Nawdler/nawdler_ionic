angular.module('starter.services', [])

.factory('Routines', function() {
  // Might use a resource here that returns a JSON array

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
                        ,"Grab a Coat"
                        ]
            ,"currentOps" : {
                        "activeStep" : null //which step is currently active, //"Null" if no step is running, i.e., Pause mode
                        ,"currentAttemptIndex" : 2 //index # of the current attempt; increment it when you hit "Finished"
                         }
            ,"attempts" : [ //array of attempt data, each attempt is one array element
                          //this is attempt 0
                          [ //each element is an array of steps
                          //each "step" is an object with title and times keys
                            {"title": "Take Shower"
                            //each TIME key is an array of objects with starts and ends time
                            ,"times":[{
                                      "started_at": "T1" 
                                     , "ended_at" : "T2"
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
