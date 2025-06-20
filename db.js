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
  imageUrl: { type: String, unique: true },
  price: Number,
  AdminId: { type: ObjectId, ref: "Admin" }, // ✅ Matches model name
});

const Purchases = new mongoose.Schema({
  CourseId: { type: ObjectId, ref: "Course" }, // ✅
  UserId: { type: ObjectId, ref: "User" },     // ✅
  Time: { type: Date, default: Date.now },
});

const userModel = mongoose.model("User", UserSchema);
const AdminModel = mongoose.model("Admin", AdminSchema);
const CourseModel = mongoose.model("Course", CourseSchema);
const PurchaseModel = mongoose.model("Purchases", Purchases);

module.exports = {
  userModel,
  AdminModel,
  PurchaseModel,
  CourseModel
};
