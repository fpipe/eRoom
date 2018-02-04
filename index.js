navigator.getUserMedia({ video: true, audio:false},function (stream) {

    var Peer = require("simple-peer");
    var peer = new Peer({
        initiator: location.hash === '#host',
        trickle: false,
        stream: stream
    });

    peer.on('signal', function (data) {
        var id = JSON.stringify(data);
        // console.log(id);
        var yourId = document.getElementById('yourId').value = id;
    });

    //Connect to peer
    document.getElementById('connect').addEventListener('click', function () {
        var otherId = document.getElementById('otherId').value;
        peer.signal(otherId);
    });

    // Open room tab when they are connected
    peer.on('connect', function () {
        openRoomTab();
    });

    // Listen click button and send data
    document.getElementById('send').addEventListener('click', function () {
        sendMessage(peer);
    });

    //Listen enter keypressed and send data
    document.getElementById('yourMessage').addEventListener('keypress', function (e) {
        var key = e.which || e.keyCode;
        if (key === 13) { // 13 is enter
            sendMessage(peer);
        }
    });

    //Peer recieves data
    peer.on('data', function (data) {
        var stringData = data.toString();
        var parts = stringData.split("cdefg23");
        var message = parts[0];
        var user = parts[1];
        document.getElementById('messages').textContent += user + ": " + message + ' \n';
    });

    // Streaming the camera
    peer.on('stream', function (stream) {
        var video = document.getElementById('videoCamera');
        video.src = window.URL.createObjectURL(stream);
        video.play();
    });

    //When error happens
    // peer.on('error', function (err) {
    //    console.log(err);
    // });

}, function (err) {
    console.error(err);
});



//Custom functions
function getSplitterCode(){
    return "cdefg23";
}
//Generate random ID
function randomId() {
    return Math.random().toString(36).substr(2, 9);
}

//Send Message from box
function sendMessage(peer){
    var messageBox = document.getElementById('yourMessage');
    var yourMessage = messageBox.value;

    //Check is there empty box
    if(yourMessage !== ""){
        document.getElementById('messages').textContent += "Me:" + yourMessage + ' \n';

        messageBox.value = "";

        var storageUser = localStorage.getItem("currentUsername");
        // console.log(storageUser);
        var splitterCode = "cdefg23";
        yourMessage+=splitterCode + storageUser;
        peer.send(yourMessage);
    }
}

//Open room tab
function openRoomTab() {
    $('#roomPill').tab('show');
    console.log('here');
}





