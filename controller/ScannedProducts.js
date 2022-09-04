const { User } = require("../models/User");
const bcrypt = require("bcryptjs");
const db = require("../models");
const { sendMail } = require("../utils/utils");

const mypreferences = (req, res) => {
  const list = [];
  try {
    db.User.find({ _id: req.user._id }).then((resp) => {
      resp.map((data) => {
        list.push({ likeditems: data.likeditems });
        list.push({ dislikeditems: data.dislikeditems });
      });
      return res.status(200).send({ status: 1, list });
    });
  } catch (err) {
    return res.status(400).send({ status: 0, message: "Something Went Wrong" });
  }
};

const setpreferences = async (req, res) => {
  const { likes, dislikes } = req.body;
  try {
    await db.User.updateOne(
      { _id: req.user._id },
      { $push: { likeditems: likes, dislikeditems: dislikes } }
    );

    return res
      .status(200)
      .send({ status: 1, message: "Values added successfully" });
  } catch (error) {
    return res.status(400).send({ status: 0, message: "Some Error Occur" });
  }
};

// const likes_dislikes = (req, resp) => {
//   const { user_id, likeditem, dislikeditem } = req.body;

//   db.User.updateOne(
//     { _id: user_id },
//     { $push: { likeditems: likeditem, dislikeditems: dislikeditem } }
//   ).then((res) => {
//     return res
//       .status(200)
//       .json({ status: 1, msg: "Values added successfully" });
//   });
// };
const editpreferences = async (req, res) => {
  const { likes, dislikes } = req.body;
  try {
    await db.User.updateOne(
      { _id: req.user._id },
      { $push: { likeditems: likes, dislikeditems: dislikes } }
    );

    return res
      .status(200)
      .send({ status: 1, message: "Values updated successfully" });
  } catch (error) {
    return res.status(400).send({ status: 0, message: "Some Error Occur" });
  }
};

const otherinfo = async (req, res) => {
  const { user_id, ispregnant, isbreastfeeding } = req.body;
  try {
    const user = await db.User.findOne({ _id: user_id });
    console.log("user", user);
    const token = await user.generateAuthToken();
    console.log("token", token);
    const result = await db.User.findOneAndUpdate(
      { _id: user_id },
      {
        ispregnant: ispregnant,
        isbreastfeeding: isbreastfeeding,
        token: token,
      },
      { new: true }
    );

    return res
      .status(200)
      .send({ status: 1, message: "Values added successfully", data: result });
  } catch (error) {
    return res.status(400).send({ status: 0, message: "Some Error Occur" });
  }
};

const updatePreferences = async (req, res) => {
  const { liked_ingredient, disliked_ingredient } = req.body;
  const liked = [];
  const list = [];
  try {
    const result = await db.User.find({ _id: req.user._id });

    result.map((data) => {
      list.push(data.dislikeditems);
      liked.push(data.likeditems);
    });

    const index1 = liked[0].indexOf(liked_ingredient);
    if (index1 > -1) {
      liked[0].splice(index1, 1);
    }

    const index = list[0].indexOf(disliked_ingredient);
    if (index > -1) {
      list[0].splice(index, 1);
    }

    if (liked_ingredient !== "" && disliked_ingredient !== "") {
      await db.User.findOneAndUpdate(
        { _id: req.user._id },
        {
          likeditems: liked[0],
          dislikeditems: list[0],
        },
        { new: true }
      );
      res.status(200).send({
        status: 1,
        message: "Preferences updated successfully",
        data: { likeditems: liked[0], dislikeditems: list[0] },
      });
    }
  } catch (error) {
    return res.status(400).send({ status: 0, message: "Some Error Occur" });
  }
};

const checkproductingredients = (req, res) => {
  const list = [];
  var i = 0;
  const { p_ingredients } = req.body;

  db.User.find({ _id: req.user._id }).then((resp) => {
    resp.map((data) => {
      list.push(data.dislikeditems);
    });

    p_ingredients.filter((element) => {
      if (list[0].includes(element)) {
        i = i + 1;
      }
    });

    if (i > 0) {
      return res
        .status(200)
        .send({ status: 1, message: "This product is unhealthy for you" });
    } else {
      return res
        .status(200)
        .send({ status: 1, message: "This product is healthy for you" });
    }
  });
};

module.exports = {
  otherinfo,
  checkproductingredients,
  setpreferences,
  editpreferences,
  mypreferences,
  updatePreferences,
};
