import express  from "express";
import dotevn from "dotenv";
import http from "http";
import cors from "cors";
import { connectDB } from "./DB/db.js";

dotevn.config();

const app = express();;


app.use(express.json());
app.use(cors());

app.use("/", (req, res) => {
    res.send("Hello World");
});

//PORT Number
const PORT = process.env.PORT || 3000;  
// creating a server
const server = http.createServer(app);


// listening to the port
server.listen(PORT, () => {
    connectDB();
    console.log("Server is running on port 3000");
});

