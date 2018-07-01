//set up fire base
  var config = {
    apiKey: "AIzaSyByNmGGaeyToEysdYSZV_WCWmjpa52dnxA",
    authDomain: "train-times-7d5fd.firebaseapp.com",
    databaseURL: "https://train-times-7d5fd.firebaseio.com",
    projectId: "train-times-7d5fd",
    storageBucket: "train-times-7d5fd.appspot.com",
    messagingSenderId: "753416560881"
  };
  firebase.initializeApp(config);
          var database = firebase.database();
 
          //set current time thruy moment JS
          var currentTime = moment().format("HH:mm");
              console.log("CURRENT TIME: " + currentTime);


          // 
          $("inputTrainButton").on("click", function(){
              var trainName = $("#inputTrainName").val().trim();
              var destination = $("#inputDestination").val().trim();
              var firstTrainTime =moment($("#inputFirstTime").val().trim(), "HH:mm").format("HH:mm");
              var frequency = $("#inputFrequency").val().trim();

              
              var newTrain = {
                  name: trainName,
                  dest: destination,
                  first: firstTrainTime,
                  freq: frequency
              }
              database.ref().push(newTrain);
              console.log(newTrain.name);
              console.log(newTrain.dest);
              console.log(newTrain.first);
              console.log(newTrain.freq)

              //clear text box for next input
              $("#inputTrainName").val("");
              $("#inputDestination").val("");
              $("#inputFirstTime").val("");
              $("#inputFrequency").val("");
              return false;
          });
 
          database.ref().on("child_added", function(childSnapshot) {
              console.log(childSnapshot.val());

              var trainName = childSnapshot.val().name;
              var destination = childSnapshot.val().dest;
              var firstTrainTime = childSnapshot.val().first;
              var frequency = childSnapshot.val().freq;
              
              var firstTrainHourMinute = moment(firstTrainTime, "HH:mm");             
              console.log(firstTrainHourMinute);

              var timeDifference = moment().diff(moment(firstTrainHourMinute, "minutes"))
              console.log(firstTrainHourMinute);
              console.log("Difference in Time: " + timeDifference);

              var timeRemainder = timeDifference % frequency;
              console.log(timeRemainder);
              var minutesUntilTrain = frequency - timeRemainder;
              var nextTrain = moment().add(minutesUntilTrain, "minutes").format("HH:mm");
                 $("#tableSchedule").append("<tr><td>" + trainName + "</td><td>" + destination + "</td><td>" + nextTrain + "</td><td>" + frequency + "</td><td>" + minutesUntilTrain + "</td><tr>");
                  // Create the new row

                //   var newRow = $("<tr>").append(
                // $("<td>").text(trainName),
                // $("<td>").text(destination),
                // $("<td>").text(nextTrain),
                // $("<td>").text(frequency),
                // $("<td>").text(minutesUntilTrain),
                // );

                // Append the new row to the table
                $("tableSchedule > tbody").append(newRow);
                
              });

              

       