const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  firstname: String,
  lastname: String,
  email: { type: String, unique: true },
  password: String,
});

const AdminSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  firstname: String,
  lastname: String,
  email: { type: String, unique: true },
  password: String,
});
const CourseSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
});
const Purchases = new mongoose.Schema({
  CourseId: { type: ObjectId, ref: Course },
  UserId: { type: ObjectId, ref: User },
  Time: { Date: Date, default: Date.now },
});

const User = mongoose.model("User", UserSchema);
const Admin = mongoose.model("Admin", AdminSchema);
const Purchase = mongoose.model("Purchases", Purchases);

module.exports = {
  User,
  Admin,
  Purchase,
};
