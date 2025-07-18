const express = require("express");
const { AdminModel, CourseModel } = require("../db");
const AdminRouter = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { z } = require("zod");
const adminmiddleware = require("../miidlewares/adminmidddleware");
require('dotenv').config();
const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY;

AdminRouter.post("/signup", async (req, res) => {
  const { username, firstname, lastname, email, password } = req.body;

  // 🔍 Check for missing fields
  const missingfields = [];
  if (!username) missingfields.push("username");
  if (!password) missingfields.push("password");
  if (!firstname) missingfields.push("firstname");
  if (!lastname) missingfields.push("lastname");
  if (!email) missingfields.push("email");

  if (missingfields.length > 0) {
    return res.status(400).json({
      message: "Enter the remaining fields",
      fields: missingfields,
    });
  }

  // ✅ Zod validation
  const valiDdata = z.object({
    username: z
      .string()
      .min(4, "Enter at-least 4 letters")
      .max(10, "Username cannot be longer than 10 letters")
      .regex(/^[0-9a-z]+$/, "Only lowercase letters and numbers allowed"),
    firstname: z
      .string()
      .min(3)
      .max(20)
      .regex(/^[a-zA-Z\s]+$/),
    lastname: z
      .string()
      .min(3)
      .max(100)
      .regex(/^[a-zA-Z\s]+$/),
    email: z.string().email("Enter valid email"),
    password: z
      .string()
      .min(6, "Enter 6 characters")
      .regex(/[a-z]/, "Include lowercase letter")
      .regex(/[A-Z]/, "Include uppercase letter")
      .regex(/[0-9]/, "Include number")
      .regex(/[^a-zA-Z0-9]/, "Include special character"),
  });

  const isvalid = valiDdata.safeParse(req.body);

  if (!isvalid.success) {
    const errortree = isvalid.error.format();
    return res.status(400).json({
      message: "Validation failed",
      errors: errortree,
    });
  }

  // 🧂 Hash and create admin
  try {
    const saltround = 10;
    const hashpw = await bcrypt.hash(password, saltround);

    await AdminModel.create({
      username,
      firstname,
      lastname,
      email,
      password: hashpw,
    });

    return res.json({
      message: "Signup completed 😇",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error occurred during signup ⚠️",
    });
  }
});
AdminRouter.post("/signin", async (req, res) => {
  const { username, password } = req.body;

  try {
    const adminUser = await AdminModel.findOne({ username });

    if (!adminUser) {
      return res.status(404).json({
        message: "Admin not found ❌",
      });
    }

    const ismatch = await bcrypt.compare(password, adminUser.password);

    if (!ismatch) {
      return res.status(401).json({
        message: "Invalid password ❌",
      });
    }

    const token = jwt.sign({ AdminId: adminUser._id }, ADMIN_SECRET_KEY);
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    })
    return res.json({
      message: "Signin successful, Admin Sir 😇",
      adminid:adminUser._id
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong ❌",
    });
  }
});
AdminRouter.post("/course", adminmiddleware,async (req, res) => {
  const{title,description,imageUrl,price}=req.body;
  console.log("imageUrl from body: ", req.body.imageUrl);

  const courseAdminId=req.AdminId;
  console.log(courseAdminId)
  const isvalid=z.object({
    title:z.string(),
    price:z.number().min(0,"enter a valid price"),
    description:z.string().min(5,"enter description length > 5"),
    imageUrl: z.string().url("Must be a valid URL"),
  })
  try {
    var validation=isvalid.safeParse(req.body);
    if(!validation.success){
      return res.status(402).json({
        error:validation.error.format(),
      })
    }
    else{
      const course=await CourseModel.create({
      title,
      description,
      imageUrl,
      price,
      AdminId: courseAdminId
    })
    res.json({
      message:"done your course submitted successfully 👏🏼👏🏼",
      courseId:course._id
    })
    }
  } catch (error) {
    res.json({
      message:"something went wrong plz try again later🐛",
      error:error
      
    })
  }
})
AdminRouter.put("/course/update",adminmiddleware,async(req,res)=>{
  const courseAdminId=req.AdminId;
  console.log(courseAdminId)
  const{title,description,price,imageUrl,CourseId}=req.body;
  const Course=await CourseModel.findOne({
    _id:CourseId,
    AdminId:courseAdminId
  })
  if(!Course){
    return res.status(333).json({
      message:"kindly check that its your course or not 🚨🚨🚨"
    })
  }
  try {
    const isvalid=z.object({
    title:z.string(),
    price:z.number().min(0,"enter a valid price"),
    description:z.string().min(5,"enter description length > 5"),
    imageUrl: z.string().url("Must be a valid URL"),
  })
    var validation=isvalid.safeParse(req.body);
    if(!validation.success){
      return res.status(402).json({
        error:validation.error.format(),
      })
    }
    else{
      await Course.updateOne({
      title,
      description,
      imageUrl,
      price,
      AdminId: courseAdminId
    })
    res.json({
      message:"done your course updated successfully 👏🏼👏🏼",
      courseAdminId:courseAdminId
    })
    }
  } catch (error) {
    res.json({
      message:"something went wrong plz try again later🐛",
      error
    })
  }

})
AdminRouter.get("/owncourse",adminmiddleware,async(req,res)=>{
  const AdminId=req.AdminId;
  const courses=await CourseModel.find({
    AdminId
  })
  try {
    if(courses){
    return res.json({
      courses:courses
    })
    }
  else{
    
      return res.json({
        message:"you dont have any course",
        
      })
  }
  } catch (error) {
    console.error("Own course fetch error:", error);
    res.status(400).json({
      message:"something went wrong try again later🐛",
      error:error.message
    })
  }
})
module.exports = AdminRouter;
