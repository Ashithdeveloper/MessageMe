import { getSocket } from "./socket";


export const testSocket = (payload : any , off : boolean = false ) => {
    const socket = getSocket();
    if(!socket) {
        console.log("❌ Socket is not connected");
        return 
    }
    if(off){
        socket.off("testSocket",payload);
    }else if(typeof payload === "function"){
        socket.on("testSocket",payload);
    }else{
        socket.emit("testSocket",payload);
    }
}  
export const getContacts = (payload : any , off : boolean = false ) => {
    const socket = getSocket();
    if(!socket) {
        console.log("❌ Socket is not connected");
        return 
    }
    if(off){
        socket.off("getContacts",payload);
    }else if(typeof payload === "function"){
        socket.on("getContacts",payload);
    }else{
        socket.emit("getContacts",payload);
    }
}  
