import { Server as SocketServer , Socket } from "socket.io";
import User from "../src/model/auth.model.js";

export const registerUserEvents = (io: SocketServer , socket: Socket) => {
    socket.on("testSocket", (data) => {
        socket.emit("testSocket", { msg :"Hello World"});
    })

    socket.on("getContacts",async ()=>{
        try {
            const currentUser = socket.data.userId;
            if(!currentUser) {
                socket.emit("getContacts", { success: false  ,
                    msg: "Error getting contacts"
                });
                return
            }
            const users = await User.find({ _id: { $ne: currentUser } },{ password: 0 }).lean();

             const contacts = users.map((user) => ({
               id: user._id.toString(),
               name: user.name,
               email: user.email,
               profilepic: user.profilepic,
            }));
            socket.emit("getContacts", { success: true  ,
                data : contacts
            }); 

            
        } catch (error) {
            console.log("getContacts error",error);
            socket.emit("getContacts", { success: false  ,
                msg: "Error getting contacts"
            });
        }
    })
}