const router = require("express").Router();
const User = require("../models/User");




// 遠藤のデータを取得・・これでデータが出てこないのはなぜ
router.get("/endou", async (req, res) => {
  console.log("endouのこんそーる");
  const endou = await User.find({username: 遠藤航 });
  console.log(endou);
  console.log("endouのこんそーる");
  return res.send("endou");
  // return res.status(200).json(endou);
})






// //ユーザー登録
router.post("/register", async (req, res) => {
//   try {
//     //generate crypt password
//     // const salt = await bcrypt.genSalt(10);
//     // const hashedPassword = await bcrypt.hash(req.body.password, salt);

   //create user
    const newUser = await new User({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });

    //save user
    const user = await newUser.save();
    return res.status(200).json(user);
//   } catch (err) {
//     return res.status(500).json(err);
//   }
});

// //ログイン
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).send("ユーザーが見つかりません");

//     // const vailedPassword = await bcrypt.compare(
//     //   req.body.password,
//     //   user.password,
//     //   (err, res) => {
//     //     console.log(res);
//     //   }
//     // );

    const vailedPassword = req.body.password === user.password;

    if (!vailedPassword) return res.status(400).json("パスワードが正しくありません");

    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router;