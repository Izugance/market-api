import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// We adopt a strict separation between actions permissible by an admin
// and those permissible by a user. (Role-based access system.)
const adminSchema = new mongoose.Schema(
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

adminSchema.pre("save", function (next) {
  // Uses different rounds from User.
  this.password = bcrypt.hash(this.password, 16);
  next();
});

adminSchema.methods.genJWT = async function () {
  // Uses a different secret and token expiration.
  return jwt.sign(
    { userId: this._id, email: this.email },
    env.ADMIN_JWT_SECRET,
    {
      expiresIn: env.ADMIN_JWT_LIFETIME,
    }
  );
};

adminSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

const Admin = mongoose.model("Admin", adminSchema);
export { Admin };
