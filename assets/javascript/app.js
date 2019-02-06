$(document).ready(function () {

    var trainName = "";
    var trainDestination = "";
    var timeInput = "";
    var trainFrequency = "";

    var config = {
        apiKey: "AIzaSyAX0ZO4ineMdWtU1fVM1_p2gMjQNXngmso",
        authDomain: "train-schedule-20fab.firebaseapp.com",
        databaseURL: "https://train-schedule-20fab.firebaseio.com",
        projectId: "train-schedule-20fab",
        storageBucket: "train-schedule-20fab.appspot.com",
        messagingSenderId: "272795177647"
      };
      
    firebase.initializeApp(config);

    var database = firebase.database();

    database.ref().on("child_added", function (childSnap) {
        trainName = childSnap.val().trainName;
        trainDestination = childSnap.val().trainDestination;
        timeInput = childSnap.val().timeInput;
        trainFrequency = childSnap.val().trainFrequency;
    
        var minutesAway = childSnap.val().minutesAway;
        var nextArrival = childSnap.val().nextArrival;

        $("#table-body").append(
            "<tr><td>" + trainName + "</td>" +
            "<td>" + trainDestination + "</td>" +
            "<td>" + trainFrequency + "</td>" +
            "<td>" + nextArrival + "</td>" +
            "<td>" + minutesAway + "</td></tr>"
        )
    });


    $("#addTrain").on("click", function () {

        trainName = $("#nameInput").val().trim();
        trainDestination = $("#destinationInput").val().trim();
        timeInput = $("#timeInput").val().trim();
        trainFrequency = $("#frequencyInput").val().trim();

        if (trainName == "") {
            alert('Enter a train name.');
            return false;
        }
        if (trainDestination == "") {
            alert('Enter a destination.');
            return false;
        }
        if (timeInput == "") {
            alert('Enter a first train time.');
            return false;
        }
        if (trainFrequency == "") {
            alert('Enter a frequency');
            return false;
        }

    
        var timeConverted = moment(timeInput, "HH:MM").subtract("1,years");
        console.log(timeConverted)
        var currentTime = moment();
        console.log("current military time:  " + currentTime.format("HH:MM"));


        var diffTime = currentTime.diff(moment(timeConverted), "minutes");


        var trainRemainder = diffTime % trainFrequency;


        var minutesLeft = trainFrequency - trainRemainder;


        var nextTrain = moment().add(minutesLeft, "minutes").format("HH:MM a");

        var newTrain = {
            trainName: trainName,
            trainDestination: trainDestination,
            timeInput: timeInput,
            trainFrequency: trainFrequency,
            minutesAway: minutesLeft,
            nextArrival: nextTrain
        }

        console.log(newTrain)
        database.ref().push(newTrain);

        $("#nameInput").val("");
        $("#destinationInput").val("");
        $("#timeInput").val("");
        $("#frequencyInput").val("");


        return false;
    })


});