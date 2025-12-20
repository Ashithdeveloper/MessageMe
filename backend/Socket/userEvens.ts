import { Server as SocketServer , Socket } from "socket.io";

export const registerUserEvents = (io: SocketServer , socket: Socket) => {
    socket.on("testSocket", (data) => {
        socket.emit("testSocket", { msg :"Hello World"});
    })
}