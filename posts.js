const express = require("express");
const db = require("./db/db.js");
const router = express.Router();

router.get("/", (req, res) => {
  // 게시물 총 목록 전달하기
  // DB 블로그 내용 json 형태로;
  const query = "select * from Posts;";
  db.all(query, (err, rows) => {
    if (err) return res.status(500).json({ message: "select error~" });
    res.status(200).json({ posts: rows });
  });
});
router.get("/post/:postid", (req, res) => {
  //게시물 내용 보내기
  const postId = req.params.postid;
  console.log(postId);
  let query = "select * from Posts where PostId = ?;";
  db.get(query, [postId], (err, row) => {
    if (err) return res.status(500).json({ message: "Select error" });
    if (!row) return res.status(404).json({ message: "Not Found" });

    query = "select * from Comment where PostId = ?;";
    db.all(query, [postId], (err, rows) => {
      if (err) return res.status(500).json({ message: "Select error" });

      res.status(200).json({ post: row, comments: rows });
    });
  });
});

router.get("/post/:postid/:Heart", (req, res) => {
  const postId = req.params.postid;
  const Heart = req.params.Heart;
  const query = "UPDATE Posts SET Heart = ? where PostId = ?;";
  console.log("하트 수 : ", Heart);
  db.run(query, [Heart, postId], (err) => errorHandler(err, res));
});

const errorHandler = (err, res) => {
  // 쿼리할 때 에러 관리
  if (err) {
    console.error("Error : " + err.message);
    return res.status(500).json({ error: "Database error~" });
  }
  res.status(200).json({ message: "Nice Database!" });
};

router.post("/write", (req, res) => {
  //DB에 게시물 정보 삽입
  const query = "INSERT INTO Posts (Author, Title, Content) VALUES (?, ?, ?);";
  console.log(req.body);
  const author = req.body.author;
  const title = req.body.title;
  const content = req.body.content;
  console.log(author, title, content);
  db.run(query, [author, title, content], (err) => errorHandler(err, res));
});

router.post("/update", (req, res) => {
  const postid = req.body.postid;
  const title = req.body.title;
  const content = req.body.content;
  const query = "UPDATE Posts SET Title = ?, Content = ? where PostId = ?;";
  db.run(query, [title, content, postid], (err) => errorHandler(err, res));
});

module.exports = router;
