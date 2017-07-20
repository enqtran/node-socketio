//https://enqtran-chat.herokuapp.com
//http://localhost:8888
var socket = io("https://enqtran-chat.herokuapp.com");

socket.on("server-send-Username-thatbai", function () {
    alert('dk that bai');
});

socket.on("server-send-Username-thanhcong", function (data) {
    $('#currentUser').html(data);
    $('#loginForm').hide(2000);
    $('#chatForm').show(1000);
    $('#chatRoom').show(1000);
});

socket.on("server-send-danhsach-user", function (data) {
    $('#boxContent').html("");

    data.forEach(function (i) {
        $('#boxContent').append("<div class='useronline'> " + i + "</div>");
    });

});

socket.on("server-send-messages", function (data) {
    $('#listMessages').append("<div class='ms'>" + data.username + " : " + data.content + "</div>");
    $('#listMessages').animate({ scrollTop: $('#listMessages').prop("scrollHeight") }, 500);
});

socket.on("server-send-typing", function (data) {
    $('#typing').html(data);
});


socket.on("server-stop-typing", function (data) {
    $('#typing').html('');
});

//room chat
socket.on("all-room", function (data) {
    $('#listRoom').html('');
    data.map(function (r) {
        $('#listRoom').append("<h4 class='room'>" + r + "</h4>");
    });
});

socket.on("sv-send-room", function (data) {
    $('#roomHienTai').html(data);
});

socket.on("server-chat", function (data) {
    $('#roomListMessages').append("<div class='msr'>" + data.username + " : " + data.content + "</div>");

    $('#roomListMessages').animate({ scrollTop: $('#roomListMessages').prop("scrollHeight") }, 500);
});




jQuery(document).ready(function ($) {
    $('#loginForm').show();
    $('#chatForm').hide();
    $('#chatRoom').hide();

    $('#txtMessages').focusin(function () {
        socket.emit("typing");
    });

    $('#txtMessages').focusout(function () {
        socket.emit("typing-out");
    });

    $('#btnRegister').click(function () {
        socket.emit("client-send-Username", $('#txtUsername').val());
    });

    $('#btnLogout').click(function () {
        socket.emit("client-logout");
        $('#loginForm').show(2000);
        $('#chatForm').hide(1000);
        $('#chatRoom').hide(1000);
    });

    $('#btnSendMessages').click(function () {
        if ($('#txtMessages').val() != '') {
            socket.emit("client-send-messages", $('#txtMessages').val());
            $('#txtMessages').val('');
        }
    });


    // room chat
    $('#btnRoom').click(function () {
        socket.emit("client-tao-room", $('#txtRoom').val());
        $('#txtRoom').val('');
    });

    $('#btnSendMessagesRoom').click(function () {
        if ($('#txtMessagesRoom').val() != '') {
            socket.emit("user-chat", $('#txtMessagesRoom').val());
            $('#txtMessagesRoom').val('');
        }

    });



});
