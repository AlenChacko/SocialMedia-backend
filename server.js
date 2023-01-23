const dotenv = require("dotenv").config();
const express = require("express");
const http = require("http");
const { errorHandler } = require("./middlewares/errorMiddleware");
const logger = require("morgan");
const colors = require("colors");
const cors = require("cors");
const { Server } = require("socket.io");
const connectDB = require("./config/db");
const port = process.env.PORT || 5000;

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

connectDB();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors());

io.on("connection", (socket) => {
  console.log("Connected socket", socket.id);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with id: ${socket.id} Joined with room: ${data}`);
  });

  socket.on("send_message", (data) => {
    console.log(data);
    socket.to(data.room).emit("recieve_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

app.use("/", require("./routes/userRoutes"));
app.use("/posts", require("./routes/postRouter"));
app.use("/chat", require("./routes/chatRouter"));
app.use("/admin", require("./routes/adminRouter"));

app.use(errorHandler);
server.listen(port, () =>
  console.log(`Server started at port ${port.rainbow}`)
);
