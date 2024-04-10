const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");
const cors = require('cors');

app.use(cors());


//投稿を作成する
router.post("/", async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

// //投稿を修正する
router.put("/:id", async (req, res) => {
  try {
    //投稿したidを取得
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.updateOne({ $set: req.body });
      res.status(200).json("投稿が修正されました");
    } else {
      res.status(403).json("他人の投稿は修正できません");
    }
  } catch (err) {
    res.status(403).json(err);
  }
});

//delete a post
router.delete("/:id", async (req, res) => {
  try {
    //投稿したidを取得
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.deleteOne();
      res.status(200).json("the post has been deleted");
    } else {
      res.status(403).json("you can delete only your post");
    }
  } catch (err) {
    res.status(403).json(err);
  }
});

//いいね・取り消し
router.put("/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    //まだ投稿にいいねが押されていなかったら
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      return res.status(200).json("いいねされました");
      //すでにいいねが押されていたら
    } else {
      //いいねしているユーザーを取り除く
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json("いいねが取り消されました");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//特定の投稿を一つ取得する
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get all post one user
router.get("/profile/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    const posts = await Post.find({ userId: user._id });
    return res.status(200).json(posts);
  } catch (err) {
    return res.json(500).json(err);
  }
});

//プロフィール専用のタイムラインの取得
router.get("/profile/:username", async (req, res) => {
  try {
    const user = await User.findOne({username:req.params.username});
    const posts = await Post.find({ userId: user._id });
    return res.status(200).json(posts);
  } catch (err) {
    return res.status(500).json(err);
  }
});


//タイムラインの投稿を取得
router.get("/timeline/:userId", async (req, res) => {
  try {
    const currentUser = await User.findById(req.params.userId);
    const userPosts = await Post.find({ userId: currentUser._id });
    const friendPosts = await Promise.all(
      currentUser.followings.map((friendId) => {
        return Post.find({ userId: friendId });
      })
    );
    res.status(200).json(userPosts.concat(...friendPosts));
  } catch (err) {
    res.status(500).json(err);
  }
});










// router.get("/", (req, res) => {
//   console.log("post page");
// });

module.exports = router;