  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyCSsv6eWNULm3LUiDwhUkcSGbHoKgDKEhQ",
    authDomain: "train-5f422.firebaseapp.com",
    databaseURL: "https://train-5f422.firebaseio.com",
    projectId: "train-5f422",
    storageBucket: "train-5f422.appspot.com",
    messagingSenderId: "567681839872"
  };
  firebase.initializeApp(config);
          
    var database = firebase.database();
 
          //set current time thruy moment JS
          var currentTime = moment().format("HH:mm");
              console.log("CURRENT TIME: " + currentTime);


          // 
          $("#inputTrainButton").on("click", function(){
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
 







        // function for adding new trains to the database
          database.on("child_added", function(childSnapshot) {
              console.log(childSnapshot.val());

              // variables for firebase snapshots to be stored in
              var trainName = childSnapshot.val().name;
              var destination = childSnapshot.val().dest;
              var firstTrainTime = childSnapshot.val().first;
              var frequency = childSnapshot.val().freq;


              //pull first time from moment.js
              var firstTrainHourMinute = moment(firstTrainTime, "HH:mm");             
              console.log(firstTrainHourMinute);

              //number of minutes between time
              var timeDifference = moment().diff(moment(firstTrainHourMinute, "minutes"))
              console.log(firstTrainHourMinute);
              console.log("Difference in Time: " + timeDifference);

              // minutes remaining between frequency and time difference
              var timeRemainder = timeDifference % frequency;
              console.log(timeRemainder);

                //subtracting remainder from frequency
              var minutesUntilTrain = frequency - timeRemainder;

              // variables to hold next train information
              var nextTrain = moment().add(minutesUntilTrain, "minutes");
              var nextTrainTime = moment(nextTrain).format("HH:mm");



                 $("#tableSchedule").append("<tr><td>" + trainName + "</td><td>" + destination + "</td><td>" + nextTrainTime + "</td><td>" + frequency + "</td><td>" + minutesUntilTrain + "</td><tr>");
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

              

       