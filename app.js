const express = require("express");
const http = require("http");
const socketIO = require("socket.io");

const app = express();
const server = http.createServer(app); // 서버 객체 생성
const io = socketIO(server);
const dotenv = require("dotenv");
dotenv.config();
const PORT = process.env.PORT;
const db = require("./models");

app.set("view engine", "ejs");
app.set("views", "./views");
app.use("/static", express.static(__dirname + "/static"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const indexRouter = require("./routes/index");
app.use("/", indexRouter);

const userRouter = require("./routes/user");
app.use("/users", userRouter);

const chatRouter = require("./routes/chat");
app.use("/chats", chatRouter);

// 클라이언트가 서버에 socket.io를 통해 접속한다면 발생하는 이벤트
io.on("connection", (socket) => {
    // socket: 접속한 클라이언트
    console.log("클라이언트 접속 확인");
    // 채팅방 접속
    socket.on("join", (c_seq) => {
        socket.join(`chatroom-${c_seq}`); // 클라이언트로부터 수신한 채팅방 번호로 room에 참여
    });

    // 클라이언트로부터 메세지 수신
    socket.on("sendMessage", async ({ c_seq, content, u_seq, isread }) => {
        const message = await db.Message.create({ c_seq, content, u_seq, isread }); // 메세지를 DB에 저장
        // 서버 -> 클라이언트 메세지 송신
        io.to(`chatroom-${c_seq}`).emit("newMessage", message); // 해당 채팅방에 참여한 모든 클라이언트에게 emit
    });

    // 채팅방 나가기
    socket.on("leave", (c_seq) => {
        socket.leave(`chatroom-${c_seq}`);
        console.log("채팅방 나가기 완료");
    });
});

app.get("*", (req, res) => {
    res.render("404");
});

db.sequelize.sync({ force: false }).then((result) => {
    console.log("DB연결 성공");
});

server.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});
