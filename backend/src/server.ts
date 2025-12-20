import express  from "express";
import dotevn from "dotenv";
import http from "http";
import cors from "cors";
import { connectDB } from "./DB/db.js";
import authRoute from "./Routes/auth.route.js"
import { initalizeSocket } from "../Socket/socket.js";

dotevn.config();

const app = express();;


app.use(express.json());
app.use(cors());


// // For testing 
// app.use("/", (req, res) => {
//     res.send("Hello World");
// });

//auth routes 
app.use("/api/auth", authRoute )


//PORT Number
const PORT = process.env.PORT || 3000;  
// creating a server
const server = http.createServer(app);
// listening to the server
initalizeSocket(server);


server.listen(PORT, () => {
    connectDB();
    console.log("Server is running on port 3000");
});

