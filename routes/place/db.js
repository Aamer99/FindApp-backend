const mysql = require("mysql");

const connect = mysql.createConnection({
  host: "database-1.cuvpdikkxfeh.ap-northeast-1.rds.amazonaws.com",
  user: "admin",
  password: "Aamer1420",
  database: "Find",
  port: "3306",
});

let db = {};

db.getAll = () => {
  return new Promise((resolve, reject) => {
    connect.query("SELECT * FROM place ", (err, res) => {
      if (err) {
        return reject(err);
      }
      return resolve(res);
    });
  });
};

db.addPlace = (placeInfo) => {
  return new Promise((resolve, reject) => {
    console.log(placeInfo);
    connect.query(
      "INSERT INTO place VALUES(?,?,?,?,?,?,?,?)",
      placeInfo,
      (err, res) => {
        if (err) {
          console.log(err);
          return reject(err);
        }
        return resolve("place added sussfuly !!!!");
      }
    );
  });
};

db.getPlaces = (data) => {
  return new Promise((resolve, reject) => {
    connect.query(
      "SELECT * FROM place WHERE type=? AND city=?",
      data,
      (err, res) => {
        if (err) {
          reject(err);
        }
        resolve(res);
      }
    );
  });
};

db.Categories = (data) => {
  return new Promise((resolve, reject) => {
    connect.query(
      "SELECT * FROM place WHERE JSON_EXTRACT(categories, '$.Categories') =?",
      data,
      (err, res) => {
        if (err) {
          return reject(err);
        }
        return resolve(res);
      }
    );
  });
};
module.exports = db;
