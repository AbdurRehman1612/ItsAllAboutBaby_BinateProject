const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: false,
      trim: true,
    },
    name: {
      type: String,
      default: null,
      trim: true,
    },
    age: {
      type: Number,
      default: null,
      trim: true,
    },
    password: {
      type: String,
      required: false,
      trim: true,
    },
    dateofbirth: {
      type: String,
      required: false,
    },
    gender: {
      type: String,
      required: false,
    },
    imageName: {
      type: String,
      default: null,
      trim: true,
    },
    otp: {
      type: Number,
      required: false,
      trim: true,
    },
    phone: {
      type: Number,
      default: null,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    user_social_token: {
      type: String,
      required: false,
      trim: true,
      default: null,
    },
    user_social_type: {
      type: String,
      required: false,
      trim: true,
      default: null,
    },
    user_device_type: {
      type: String,
      required: false,
      trim: true,
      default: null,
    },
    user_device_token: {
      type: String,
      required: false,
      trim: true,
      default: null,
    },
    token: {
      type: String,
      default: null,
      required: false,
    },
    likeditems: {
      type: [],
      default: null,
    },

    dislikeditems: {
      type: [],
      default: null,
    },
    ispregnant: {
      type: String,
      default: null,
    },

    isbreastfeeding: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) {
    return next();
  }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ userId: user._id }, process.env.Key);
  user.token = token;
  await user.save();
  return token;
};

userSchema.methods.comparePassword = function (candidatePassword) {
  const user = this;
  return new Promise((resolve, reject) => {
    bcrypt.compare(candidatePassword, user.password, (err, isMatch) => {
      if (err) {
        return reject(err);
      }
      if (!isMatch) {
        return reject(err);
      }
      resolve(true);
    });
  });
};
const User = mongoose.model("User", userSchema);

module.exports = User;
