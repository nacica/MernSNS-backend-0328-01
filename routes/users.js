const router = require("express").Router();
const User = require("../models/User");



// ユーザー情報の更新
router.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    if (req.body.password) {
      try {
        req.body.password = req.body.password;
      } catch (err) {
        return res.status(500).json(err);
      }
    }

    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      res.status(200).json("ユーザー情報の更新が完了しました");
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("自分のアカウントしか更新できません");
  }
});

//ユーザー削除
router.delete("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      res.status(200).json("account has been deleted");
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("you can delete only your account");
  }
});

//ユーザー情報の取得
// router.get("/:id", async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id);
//     const { passward, updateAt, ...other } = user._doc;
//     return res.status(200).json(other);
//   } catch (err) {
//     return res.status(500).json(err);
//   }
// });

//ユーザー情報の取得
router.get("/:username", async (req, res) => {
  try {
    const user = await User.findOne({username: req.params.username});
    const { passward, updateAt, ...other } = user._doc;
    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json(err);
  }
});


// //クエリでuser情報を取得
// router.get("/", async (req, res) => {
router.get("https://mernsns-backend-0404-01.onrender.com/api/users", async (req, res) => {
  const userId = req.query.userId;
  const username = req.query.username;

  try {
    const user = userId
      ? await User.findById(userId)
      : await User.findOne({ username: username });
    const { password, updatedAt, ...other } = user._doc;
    return res.status(200).json(other);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//フォロー
// router.put("https://mernsns-backend-0404-01.onrender.com/api/users/:id/follow", async (req, res) => {
router.put("/:id/follow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      //フォロワーにいなかったらフォローできる
      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({ 
          $push: {
             followers: req.body.userId } });
        await currentUser.updateOne({ 
          $push: {
             followings: req.params.id } });
        res.status(200).json("フォローできたよ");
      } else {
        return res.status(403).json("既にフォローしてるよ");
      }
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(500).json("自分はフォローできないよ");
  }
});

//unfollow a user
router.put("/:id/unfollow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      //フォロワーにいたらフォロー外せる
      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({ 
          $pull: { followers: req.body.userId } });
        await currentUser.updateOne({ 
          $pull: { followings: req.params.id } });
        res.status(200).json("アンフォローに成功しました");
      } else {
        return res.status(403).json("このユーザーをフォローしていません");
      }
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(500).json("自分自身をフォローできません");
  }
});

module.exports = router;