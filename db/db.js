const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.join(__dirname, "donghyun.db");

const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error("DB 연결 오류", err.message);
  } else {
    console.log("DB 연결 성공");
  }
});

module.exports = db;
