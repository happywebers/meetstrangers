const express = require("express");
const http = require("http");

const PORT = process.env.PORT || 3001;

const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server);

app.use(express.static("public"));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

let connectedPeers = [];

io.on("connection", (socket) => {
    connectedPeers.push(socket.id);
    console.log(connectedPeers);

    socket.on("pre-offer", (data) => {
        console.log("pre-offer-came");
        const { calleePersonalCode, callType } = data;
        console.log(calleePersonalCode);
        console.log(connectedPeers);
        const connectedPeer = connectedPeers.find(
            (peerSocketId) => peerSocketId === calleePersonalCode
        );
        console.log(connectedPeer);

        if (connectedPeers) {
            const data = {
                callerSocketId: socket.id,
                callType,
            };
            io.to(calleePersonalCode).emit("pre-offer", data);
        }
    });

    socket.on("pre-offer-answer", (data) => {
        console.log("pre offer answer came");
        console.log(data);
    });

    socket.on("disconnect", () => {
        console.log("user disconnected");
        const newConnectedPeers = connectedPeers.filter(
            (peerSocketId) => peerSocketId !== socket.io
        );
        connectedPeers = newConnectedPeers;
        console.log(connectedPeers);
        //logic is applicable to single user all peers disapper when disconnected
    });



});



server.listen(PORT, () => {
    console.log(`listening on ${PORT}`);
});