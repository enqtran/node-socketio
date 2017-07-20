const express = require("express");
const app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./views");

const server = require("http").Server(app);
const io = require("socket.io")(server);

const port = Number(process.env.PORT || 3000);
server.listen(port);

app.get("/", function (req, res) {
    res.render("trangchu");
});


/**
 * SERVER START
 */
const arrUsername = [];
console.log('server-started');


io.on('connection', socket => {
     /**
     * CONNECT SOCKET
     */
    // console.log("Co ket noi " + socket.id);
    // console.log("rooms: ", socket.adapter.rooms);


    /**
     * REGISTER & LOGIN
     */
    socket.on('NGUOI_DUNG_DANG_KY', user => {
        //check exist user
        const isExist = arrUsername.some(e => e.username === user.username);
        if(isExist) return socket.emit('DANG_KY_THAT_BAI');

        socket.peerId = user.id;
        socket.Username = user.username;
        arrUsername.push(user);

        //result list_user
        io.sockets.emit('DANH_SACH_ONLINE', arrUsername);
        socket.broadcast.emit('CO_NGUOI_DUNG_MOI', user);
    });

    /**
     * LOGOUT
     */
    socket.on('disconnect', () => {
        const index = arrUsername.findIndex(user => user.id === socket.peerId);
        arrUsername.splice(index,1);
        io.emit('AI_DO_NGAT_KET_NOI', socket.peerId);
    });

    socket.on('NGUOI_DUNG_LOGOUT', (peerId) => {
        console.log(peerId);
        const index = arrUsername.findIndex(user => user.id === peerId);
        arrUsername.splice(index,1);
        io.emit('AI_DO_NGAT_KET_NOI', peerId);
    });


    /**
     * CHAT ALL USER
     */
    socket.on("NGUOI_DUNG_GUI_TIN_NHAN", function (messages) {
        io.sockets.emit("SERVER_TRA_TIN_NHAN", { username: socket.Username, messages, peerId: socket.peerId });
    });

    /**
     * ROOM CHAT CREATE
     */
    socket.on("NGUOI_DUNG_TAO_ROOM", function (id_room) {
        socket.join(id_room);
        socket.phong = id_room;

        const arrRoom = [];
        for (r in socket.adapter.rooms) {
            arrRoom.push(r);
        }

        io.sockets.emit("SERVER_TRA_LIST_ROOM_HIEN_CO", arrRoom);
        io.sockets.emit("SERVER_TRA_KET_NOI_ROOM", id_room);
    });

    /**
     * ROOM CHAT CONNECT
     */
    socket.on("NGUOI_DUNG_GUI_TIN_NHAN_CHAT_ROOM", function( messages ){
        io.sockets.in(socket.phong).emit("SERVER_TRA_TIN_NHAN_CHAT_ROOM",{ username: socket.Username, messages });
    });

    /**
     * TYPING START
     */
    socket.on("NGUOI_DUNG_TYPING_START", function () {
        let typing = socket.Username + "....";
        socket.broadcast.emit("SERVER_TRA_TYPING_START", typing);
    });

    /**
     * TYPING END
     */
    socket.on("NGUOI_DUNG_TYPING_END", function () {
        socket.broadcast.emit("SERVER_TRA_TYPING_END");
    });




});
