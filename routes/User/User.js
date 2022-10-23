const router = require("express").Router();

const bcrypt = require("bcrypt");
const db = require("./DB");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const fs = require("fs");
require("dotenv").config();
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "../client-side/Images/");
  },
  filename: (req, file, cb) => {
    console.log(file);
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

router.post("/uploadProfileImage", upload.single("Image"), async (req, res) => {
  try {
    res.status(200).json(JSON.stringify(req.file));
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//get all users
router.get("/", async (req, res) => {
  try {
    let resualt = await db.getAll();
    res.status(200).json(resualt);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//get one user by id
router.get("/:id", async (req, res) => {
  try {
    const userID = req.params.id;
    let resualt = await db.getOneByID(userID);

    res.status(200).json(resualt);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//signup
router.post("/signup", async (req, res) => {
  try {
    const id = Math.floor(Math.random() * 100000 * 120);
    const saltPassword = await bcrypt.genSalt(10);
    const securePasssword = await bcrypt.hash(req.body.password, saltPassword);

    const userInfo = {
      id: id,
      name: req.body.name,
      email: req.body.email,
      password: securePasssword,
      city: req.body.city,
      imageProfile: req.body.imageProfile,
      profileLanguage: req.body.profileLanguage,
    };
    const signup = await db.register([
      userInfo.id,
      userInfo.name,
      userInfo.email,
      userInfo.password,
      userInfo.city,
      userInfo.imageProfile,
      userInfo.profileLanguage,
    ]);

    res.status(200).json(signup);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//login
router.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const user = await db.login(email);

    if (!user) {
      res.status(500).json("invalid email or password");
    } else {
      const validatePassowrd = await bcrypt.compare(password, user[0].password);
      if (!validatePassowrd) {
        return res.status(500).json("invalid email or password ");
      } else {
        let token = jwt.sign({ user: user }, process.env.JWT_PRIVATE_KEY, {
          expiresIn: "3m",
        });

        return res.status(200).json(token);
      }
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//verify token
router.post("/verifyToken", async (req, res) => {
  try {
    const token = req.body.token;
    const verifyToken = jwt.verify(
      token,
      process.env.JWT_PRIVATE_KEY,
      (err, resualt) => {
        if (err) {
          throw new Error(err);
        } else {
          res.status(200).json(true);
        }
      }
    );
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//get one user by email
router.get("/getOneByEmail/:id", async (req, res) => {
  try {
    const useremail = req.params.id;
    const resualt = await db.getOneByEmail(useremail);
    if (resualt[0].imageProfile != null) {
      const imageProfile = JSON.parse(resualt[0].imageProfile);

      const decodeImage =
        `data:${imageProfile.mimetype};base64,` +
        fs.readFileSync(imageProfile.path, "base64");
      const newResualt = (resualt[0].imageProfile = decodeImage);
    }

    res.status(200).json(resualt);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.post("/authUser/:id", async (req, res) => {
  try {
    const OTP = Math.floor(Math.random() * 1000 * 10);
    const userEmail = req.params.id;
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "find02find@gmail.com",
        pass: "anbbrghidzgddsdb",
      },
    });
    const mailOptions = {
      from: "find02find@gmail.com",
      to: userEmail,
      subject: "OTP message ",
      text: "the OTP message to edit your account is " + OTP,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        res.status(200).json(OTP);
      }
    });
  } catch (error) {
    res.status(400).json({ message: res.message });
  }
});

router.post("/updateProfile/:id", async (req, res) => {
  try {
    const userID = req.params.id;
    const saltPassword = await bcrypt.genSalt(10);
    const securePassword = await bcrypt.hash(req.body.password, saltPassword);

    const userInfo = {
      name: req.body.name,
      email: req.body.email,
      password: securePassword,
      city: req.body.city,
      imageProfile: req.body.imageProfile,
      profileLanguage: req.body.profileLanguage,
    };
    const update = await db.updateProfile([
      userInfo.name,
      userInfo.email,
      userInfo.password,
      userInfo.city,
      userInfo.imageProfile,
      userInfo.profileLanguage,
      userID,
    ]);

    res.status(200).json(update);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get("/getCity/:id", async (req, res) => {
  try {
    const userEmail = req.params.id;
    const city = await db.GetCity(userEmail);
    res.status(200).json(city.city);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
