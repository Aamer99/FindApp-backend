const router = require("express").Router();
const db = require("./db");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "../client-side/assets/places/");
  },
  filename: (req, file, cb) => {
    console.log(file);
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage, limits: { fileSize: 200000000 } });
const uploadLogo = multer({ storage: storage });

router.post("/", async (req, res) => {
  try {
    const type = req.body.type;
    const city = req.body.city;

    const places = await db.getPlaces([type, city]);

    places.map((item) => {
      const placeLogo = JSON.parse(item.logo);
      const placeLogoDecoded =
        `data:${placeLogo.mimetype};base64,` +
        fs.readFileSync(placeLogo.path, "base64");
      item.logo = placeLogoDecoded;

      const placeMnue = JSON.parse(item.mnue);

      item.mnue = placeMnue;
    });

    return res.status(200).json(places);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

router.post("/addPlace", async (req, res) => {
  try {
    const id = Math.floor(Math.random() * 1000) * 1000 + 100;
    const placeInfo = {
      name: req.body.name,
      logo: req.body.logo,
      mnue: req.body.mnue,
      city: req.body.city,
      type: req.body.type,
      PlaceLocation: req.body.PlaceLocation,
      categories: req.body.categories,
    };
    const newPlace = await db.addPlace([
      id,
      placeInfo.name,
      placeInfo.logo,
      placeInfo.mnue,
      placeInfo.city,
      placeInfo.type,
      placeInfo.PlaceLocation,
      placeInfo.categories,
    ]);
    res.status(200).json(newPlace);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/search/:id", async (req, res) => {
  try {
    const searchTerm = req.params.id;
    const userCity = req.body.userCity;
    const placeType = req.body.placeType;

    const places = await db.getPlaces([placeType, userCity]);
    const searchResult = places.filter((item) => {
      if (item.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return item;
      }
    });

    searchResult.map((item) => {
      const placeLogo = JSON.parse(item.logo);
      const placeLogoDecoded =
        `data:${placeLogo.mimetype};base64,` +
        fs.readFileSync(placeLogo.path, "base64");
      item.logo = placeLogoDecoded;

      const placeMnue = JSON.parse(item.mnue);

      item.mnue = placeMnue;
    });
    res.status(200).json(searchResult);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/Categories/:id", async (req, res) => {
  try {
    const categories = req.params.id;
    const Categories = await db.Categories(categories);
    res.status(200).json(Categories);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post(
  "/uploadeLogo",
  uploadLogo.single("placeLogo"),
  async (req, res) => {
    try {
      res.status(200).json(JSON.stringify(req.file));
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
);

module.exports = router;
