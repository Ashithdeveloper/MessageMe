import { Server as SocketServer, Socket } from "socket.io";
import Conversation from "../src/model/conversation.js";

export function registerChatEvents(io: SocketServer, socket: Socket) {
  socket.on("newConversation", async (data) => {
    console.log("newConversation", data);
    try {
      if (data.type == "direct") {
        const existingConversation = await Conversation.findOne({
          type: "direct",
          participants: { $all: data.participants, $size: 2 },
        })
          .populate({
            path: "participants",
            select: "name email profilepic",
          })
          .lean();

        if (existingConversation) {
          socket.emit("newConversation", {
            success: true,
            data: { ...existingConversation, isNew: false },
          });
          return;
        }
      }
      //create new conversation
      const conversation = await Conversation.create({
        type: data.type,
        participants: data.participants,
        name: data.name || " ",
        avatar: data.avatar || " ",
        createdBy: socket.data.userId,
      });
      // get all conversated users
      const connectedSockets = Array.from(io.sockets.sockets.values()).filter(
        (s) => {
          const userId = s.data?.userId;
          return userId && data.participants.includes(userId);
        }
      );
      //join this conversation by all online users
      connectedSockets.forEach((participantSocket) => {
        participantSocket.join(conversation._id.toString());
      });
      //send conversation to all participants
      const populatedConversation = await Conversation.findById(
        conversation._id
      )
        .populate({
          path: "participants",
          select: "name email profilepic",
        })
        .lean();

      if (!populatedConversation) {
        throw new Error("Conversation not found");
      }
      //emit conversation to all participants
      io.to(conversation._id.toString()).emit("newConversation", {
        success: true,
        data: { ...populatedConversation, isNew: true },

      });
    } catch (error) {
      console.log("newConversation error", error);
      socket.emit("newConversation", {
        success: false,
        msg: "Error creating conversation",
      });
    }
  });
}
