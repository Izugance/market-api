import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { env } from "node:process";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: [true, "Please provide an email address"],
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please provide a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
    },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  this.password = bcrypt.hash(this.password, 10);
  next();
});

// For each role-based object, the convention for its payload is:
// {<role>Id: value, email: email}.
userSchema.methods.genJWT = async function () {
  return jwt.sign({ userId: this._id, email: this.email }, env.JWT_SECRET, {
    expiresIn: env.JWT_LIFETIME,
  });
};

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);
export { User };
