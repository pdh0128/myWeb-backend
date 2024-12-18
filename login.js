require("dotenv").config();
const axios = require("axios");
const express = require("express");
const router = express.Router();

router.get("/github", (req, res) => {
  const url = "https://github.com/login/oauth/authorize";

  const config = {
    client_id: process.env.CLIENT_ID,
    scope: "read:user user:email",
    allow_signup: true,
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${url}?${params}`;

  res.json({ url: finalUrl });
});

router.get("/github/callback", async (req, res) => {
  const { code } = req.query;
  const finalUrl = "https://github.com/login/oauth/access_token";
  const body = new URLSearchParams({
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET_KEY,
    code,
  });

  try {
    const responseToken = await axios.post(finalUrl, body.toString(), {
      headers: {
        Accept: "application/json",
      },
    });

    if (!responseToken.data.access_token) {
      throw new Error("토큰이 올바르지 않습니다.");
    }

    const { access_token } = responseToken.data;

    // 깃허브 사용자정보
    const responseUser = await axios.get("https://api.github.com/user", {
      headers: {
        Authorization: `token ${access_token}`,
      },
    });

    if (!responseUser.data) {
      throw new Error("유저 데이터가 없습니다.");
    }

    const userdata = responseUser.data;

    // 깃허브 이메일정보
    const responseEmail = await axios.get(
      "https://api.github.com/user/emails",
      {
        headers: {
          Authorization: `token ${access_token}`,
        },
      }
    );

    if (!responseEmail.data) {
      throw new Error("유저 이메일 데이터가 없습니다.");
    }

    const emailData = responseEmail.data;

    console.log(userdata, emailData);
    return res.status(201).redirect("http://localhost:3000/login");
  } catch (err) {
    // 에러 처리
    console.error(err);
    return res.status(500).redirect("서버 이슈로");
  }
});

module.exports = router;
