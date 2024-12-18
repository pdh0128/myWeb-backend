const express = require("express");
const cors = require("cors");
const app = express();
const postsRouter = require("./posts.js");
const loginRouter = require("./login.js");
app.use(cors());

app.use(express.json()); //json 파싱 미들웨어
app.use("/api/posts", postsRouter);
app.use("/api/login", loginRouter);

app.get("/", (req, res) => {
  res.send("Hello");
});

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`서버는 ${PORT}에서 실행 중입니다!`);
});
