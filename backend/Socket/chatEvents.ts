import { Server as SocketServer, Socket } from "socket.io";
import Conversation from "../src/model/conversation.js";

export function registerChatEvents(io: SocketServer, socket: Socket) {
  /* ---------------- GET CONVERSATIONS ---------------- */
  socket.on("getConversations", async () => {
    try {
      const userId = socket.data.userId;
      

      if (!userId) {
        socket.emit("getConversations", {
          success: false,
          msg: "Unauthorized user",
        });
        return;
      }

      const conversations = await Conversation.find({
        participants: userId,
      })
        .sort({ updatedAt: -1 })
        .populate({
          path: "participants",
          select: "name email profilepic",
        })
        .lean();

      // 🔥 join all conversation rooms
      conversations.forEach((conversation) => {
        socket.join(conversation._id.toString());
      });

      socket.emit("getConversations", {
        success: true,
        data: conversations,
      });
    } catch (error) {
      console.error("getConversations error", error);
      socket.emit("getConversations", {
        success: false,
        msg: "Error getting conversations",
      });
    }
  });

  /* ---------------- NEW CONVERSATION ---------------- */
  socket.on("newConversation", async (data) => {
    try {
      const userId = socket.data.userId;

      if (!userId) {
        socket.emit("newConversation", {
          success: false,
          msg: "Unauthorized user",
        });
        return;
      }

      // ensure current user is always included
      const participants = Array.from(new Set([userId, ...data.participants]));

      /* ---- DIRECT CHAT DUPLICATE CHECK ---- */
      if (data.type === "direct") {
        const existingConversation = await Conversation.findOne({
          type: "direct",
          participants: { $all: participants, $size: 2 },
        })
          .populate({
            path: "participants",
            select: "name email profilepic",
          })
          .lean();

        if (existingConversation) {
          socket.join(existingConversation._id.toString());

          socket.emit("newConversation", {
            success: true,
            data: { ...existingConversation, isNew: false },
          });
          return;
        }
      }
      console.log("Participants:", data );
      /* ---- CREATE CONVERSATION ---- */
      const conversation = await Conversation.create({
        type: data.type,
        participants,
        name: data.name || "",
        avatar: data.avatar || "",
        createdBy: userId,
      });

      // find all online participants
      const connectedSockets = Array.from(io.sockets.sockets.values()).filter(
        (s) => participants.includes(s.data?.userId)
      );

      // join room
      connectedSockets.forEach((s) => s.join(conversation._id.toString()));

      // populate before emitting
      const populatedConversation = await Conversation.findById(
        conversation._id
      )
        .populate({
          path: "participants",
          select: "name email profilepic",
        })
        .lean();

      io.to(conversation._id.toString()).emit("newConversation", {
        success: true,
        data: { ...populatedConversation, isNew: true },
      });
    } catch (error) {
      console.error("newConversation error", error);
      socket.emit("newConversation", {
        success: false,
        msg: "Error creating conversation",
      });
    }
  });
}
