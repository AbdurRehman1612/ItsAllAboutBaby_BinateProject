const mongoose = require("mongoose");
const Users = mongoose.model("User");
const db = require("../models");
const bcrypt = require("bcrypt");
// const { sendVerificationEmail } = require("../utils/utils");

const signUp = async (req, res) => {
  const { name, email, dateofbirth, gender, password, confirmPassword } =
    req.body;
  const otp = Math.floor(100000 + Math.random() * 900000);

  const year = dateofbirth.substring(0, 4);
  const curryear = new Date().getFullYear();
  const age = curryear - year;

  console.log(year);
  console.log(curryear);
  console.log(age);

  const userex = await db.User.findOne({ email });
  if (userex) {
    return res.status(400).send({ status: 0, message: "Email Already Exist" });
  }
  if (!email) {
    return res.status(400).send({ status: 0, message: "Email is Blank" });
  } else if (!password) {
    return res.status(400).send({ status: 0, message: "Password is Blank" });
  } else if (!confirmPassword) {
    return res
      .status(400)
      .send({ status: 0, message: "Confirm Password is Blank" });
  } else if (!dateofbirth) {
    return res
      .status(400)
      .send({ status: 0, message: "Date of Birth field is Blank" });
  } else if (!gender) {
    return res.status(400).send({ status: 0, message: "Gender is Blank" });
  } else if (password !== confirmPassword) {
    return res
      .status(400)
      .send({ status: 0, message: "Password Do not Match" });
  } else {
    try {
      const user = new db.User({
        name,
        age,
        email,
        dateofbirth,
        gender,
        password,
        otp: 510016,
      });
      await user.save();
      // sendVerificationEmail(user);
      res
        .status(200)
        .send({ status: 1, message: "Verify Your Account", _id: user._id });
    } catch (err) {
      return res.status(400).send(err.message);
    }
  }
};

const verifyAccount = async (req, res) => {
  const { otp, _id } = req.body;
  if (!otp) {
    return res.status(400).send({ status: 0, message: "OTP is blank" });
  } else {
    try {
      const user = await db.User.findOne({ _id });
      if (!user) {
        return res.status(400).send({ status: 0, message: "Invalid User" });
      } else if (user.isVerify) {
        return res.status(200).send({ status: 1, message: "Already Verified" });
      } else {
        if (otp !== user.otp) {
          return res
            .status(400)
            .send({ status: 0, message: "Invalid One Time Password" });
        } else {
          await db.User.findByIdAndUpdate(
            { _id: user._id },
            { $set: { isVerify: true } }
          );
          return res
            .status(200)
            .send({ status: 1, message: "Account Verified Successfully" });
        }
      }
    } catch (error) {
      return res.status(400).send({ status: 0, message: "Some Error Occur" });
    }
  }
};

const resendOTP = async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000);
  try {
    const userex = await db.User.findOne({ email });
    if (!userex) {
      return res.status(400).send({ status: 0, message: "Invalid User" });
    } else {
      if (!userex.isVerify) {
        await db.User.findByIdAndUpdate(
          { _id: userex._id },
          { $set: { otp: 510016 } }
        );
        const user = await db.User.findOne({ _id: userex._id });
        console.log(user);
        // sendVerificationEmail(user);
        return res
          .status(200)
          .send({ status: 1, message: "Verification OTP Sent" });
      } else {
        return res.status(200).send({ status: 1, message: "Already Verified" });
      }
    }
  } catch (error) {
    return res.status(400).send({ status: 0, message: "Some Error Occur" });
  }
};

const forgetPassword = async (req, res) => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  const { email } = req.body;
  try {
    const userex = await db.User.findOne({ email });
    if (!userex) {
      return res.status(400).send({ status: 0, message: "Invalid User" });
    } else {
      await db.User.findByIdAndUpdate(
        { _id: userex._id },
        { $set: { isVerify: false, otp: 510016 } }
      );
      const user = await db.User.findOne({ email });
      console.log(user);
      // sendVerificationEmail(user);
      return res
        .status(200)
        .send({ status: 1, message: "Verification OTP Sent", _id: user._id });
    }
  } catch (error) {
    return res.status(400).send({ status: 0, message: "Some Error Occur" });
  }
};

const newPassword = async (req, res) => {
  const { newPassword, email } = req.body;
  console.log(newPassword);
  if (!newPassword) {
    return res
      .status(400)
      .send({ status: 0, message: "New Password is Blank" });
  } else {
    try {
      const usercheck = await db.User.findOne({ email });
      if (!usercheck) {
        return res.status(400).send({ status: 0, message: "User Not Found" });
      }
      const salt = await bcrypt.genSalt(10);
      const pass = await bcrypt.hash(newPassword, salt);
      const user = await db.User.findByIdAndUpdate(
        { _id: usercheck._id },
        { $set: { password: pass, isVerify: true } }
      );
      res.status(200).send({
        status: 1,
        message: "Password Changed Successfully",
        data: user,
      });
    } catch (err) {
      return res.status(400).send({ status: 0, message: err });
    }
  }
};

const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);
    if (!email || !password) {
      return res
        .status(400)
        .send({ status: 0, message: "Must provide email or password" });
    }
    const user = await db.User.findOne({ email });
    if (!user) {
      return res.status(400).send({ status: 0, message: "Invalid User" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!user.isVerify) {
      return res
        .status(400)
        .send({ status: 0, message: "User is Not Verified", data: user });
    } else if (!isMatch) {
      return res
        .status(400)
        .send({ status: 0, message: "Password is not valid" });
    } else {
      await user.generateAuthToken();
      const updateUser = await db.User.findOneAndUpdate(
        { _id: user._id },
        {
          user_device_type: req.body.devicetype,
          user_device_token: req.body.devicetoken,
        },
        { new: true }
      );
      res
        .status(200)
        .send({ status: 1, message: "Login Successfull", data: updateUser });
    }
  } catch (err) {
    return res.status(400).send({ status: 0, message: err });
  }
};

const socialLogin = async (req, res) => {
  const {
    socialToken,
    socialType,
    device_token,
    device_type,
    name,
    email,
    image,
    age,
  } = req.body;
  try {
    if (!socialToken) {
      return res
        .status(400)
        .send({ status: 0, message: "User Social Token field is required" });
    } else if (!socialType) {
      return res
        .status(400)
        .send({ status: 0, message: "User Social Type field is required" });
    } else if (!device_token) {
      return res
        .status(400)
        .send({ status: 0, message: "User Device Type field is required" });
    } else if (!device_type) {
      return res
        .status(400)
        .send({ status: 0, message: "User Device Token field is required" });
    } else {
      const checkUser = await db.User.findOne({
        user_social_token: socialToken,
      });
      if (!checkUser) {
        const user = new db.User({
          name,
          age,
          email,
          user_social_token: socialToken,
          user_social_type: socialType,
          user_device_type: device_type,
          user_device_token: device_token,
          imageName: req.file ? req.file.path : image,
          isVerify: true,
        });
        await user.generateAuthToken();
        await user.save();
        return res
          .status(200)
          .send({ status: 1, message: "Login Successfully", data: user });
      } else {
        const token = await checkUser.generateAuthToken();
        const upatedRecord = await db.User.findOneAndUpdate(
          { _id: checkUser._id },
          {
            user_device_type: device_type,
            user_device_token: device_token,
            isVerify: true,
            token,
          },
          { new: true }
        );
        return res
          .status(200)
          .send({ status: 1, message: "Login Successfully", upatedRecord });
      }
    }
  } catch (e) {
    res.status(400).send({ status: 0, message: e });
  }
};

const signOut = async (req, res) => {
  try {
    const user = await db.User.findById({ _id: req.user._id });
    console.log("user", req.user._id);
    if (!user) {
      return res.status(400).send({ status: 0, message: "User Not Found" });
    } else {
      const updateUser = await db.User.findOneAndUpdate(
        { _id: req.user._id },
        {
          token: null,
          user_device_type: null,
          user_device_token: null,
        },
        { new: true }
      );
      res.status(200).send({ status: 1, message: "User Logged Out" });
    }
  } catch (err) {
    return res.status(400).send({ status: 0, message: err });
  }
};

const userProfile = async (req, res) => {
  try {
    const user = await db.User.findById({ _id: req.user._id });
    res.send({ status: 1, user });
  } catch (err) {
    return res.status(400).send({ status: 0, message: "Something Went Wrong" });
  }
};

const profileUpdate = async (req, res) => {
  const { name, phone, dateofbirth, gender, ispregnant, isbreastfeeding } =
    req.body;

  try {
    const user = await db.User.findOneAndUpdate(
      { _id: req.user._id },
      {
        name: name,
        phone: phone,
        imageName: req.file ? req.file.path : req.user.imageName,
        dateofbirth: dateofbirth,
        gender: gender,
        ispregnant: ispregnant,
        isbreastfeeding: isbreastfeeding,
      },
      { new: true }
    );
    res
      .status(200)
      .send({ status: 1, message: "Profile updated successfully", user: user });
  } catch (err) {
    return res.status(400).send({ status: 0, message: "Something Went Wrong" });
  }
};

const updatePassword = async (req, res) => {
  const { currentPassword, newPassword, confirmnewPassword } = req.body;
  if (!currentPassword) {
    return res
      .status(400)
      .send({ status: 0, message: "Current Password is Blank" });
  } else if (!newPassword) {
    return res
      .status(400)
      .send({ status: 0, message: "New Password is Blank" });
  } else if (!confirmnewPassword) {
    return res
      .status(400)
      .send({ status: 0, message: "Confirm New Password is Blank" });
  } else if (currentPassword == newPassword) {
    return res.status(400).send({
      status: 0,
      message: "Old password and new password can't be same",
    });
  } else if (newPassword !== confirmnewPassword) {
    return res.status(400).send({
      status: 0,
      message: "New password and confirm new password does not match",
    });
  } else {
    try {
      const usercheck = await db.User.findOne({ _id: req.user._id });
      if (!usercheck) {
        return res.status(400).send({ status: 0, message: "User Not Found" });
      }
      await usercheck.comparePassword(currentPassword);
      const salt = await bcrypt.genSalt(10);
      const pass = await bcrypt.hash(newPassword, salt);
      const user = await db.User.findByIdAndUpdate(
        { _id: req.user._id },
        { $set: { password: pass } }
      );
      res.status(200).send({
        status: 1,
        message: "Password updated successfully",
        password: user.password,
      });
    } catch (err) {
      return res
        .status(400)
        .send({ status: 0, message: "Invalid Current Password" });
    }
  }
};

const likes_dislikes = (req, resp) => {
  const { user_id, likeditem, dislikeditem } = req.body;

  db.User.updateOne(
    { _id: user_id },
    { $push: { likeditems: likeditem, dislikeditems: dislikeditem } }
  ).then((res) => {
    return resp
      .status(200)
      .json({ status: 1, message: "Values added successfully" });
  });
};

const mydislikes = (req, res) => {
  const list = [];
  db.User.find({ _id: req.user._id }).then((resp) => {
    resp.map((data) => {
      list.push(data.dislikeditems);
    });
    res.status(200).send({ status: 1, dislikeditems: list[0] });
  });
};

module.exports = {
  signUp,
  signIn,
  userProfile,
  profileUpdate,
  updatePassword,
  verifyAccount,
  resendOTP,
  forgetPassword,
  newPassword,
  signOut,
  socialLogin,
  likes_dislikes,
  mydislikes,
};
