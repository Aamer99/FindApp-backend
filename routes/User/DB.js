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
    connect.query("SELECT * FROM users ", (err, resualt) => {
      if (err) {
        return reject(err);
      }
      return resolve(resualt);
    });
  });
};

db.getOneByID = (id) => {
  return new Promise((resolve, reject) => {
    connect.query("SELECT * FROM users WHERE id= ?", id, (err, resualt) => {
      // i can pass array when i use insert
      if (err) {
        return reject(err);
      }
      return resolve(resualt);
    });
  });
};

db.login = (email) => {
  return new Promise((resolve, reject) => {
    connect.query(
      "SELECT * FROM users WHERE email=?",
      email,
      (err, resualt) => {
        if (err) {
          return reject(err);
        }
        if (resualt.length != 0) {
          return resolve(resualt);
        } else {
          return resolve(false);
        }
      }
    );
  });
};

db.register = (user) => {
  return new Promise((resolve, reject) => {
    connect.query(
      "INSERT INTO users VALUES(?,?,?,?,?,?,?)",
      user,
      (err, resualt) => {
        if (err) {
          return reject(err);
        }

        return resolve("successful registered");
      }
    );
  });
};

db.getOneByEmail = (email) => {
  return new Promise((resolve, reject) => {
    connect.query(
      "SELECT * FROM users WHERE email= ?",
      email,
      (err, resualt) => {
        if (err) {
          return reject(err);
        }
        return resolve(resualt);
      }
    );
  });
};

db.getPassword = (id) => {
  return new Promise((resolve, reject) => {
    connect.query("SELECT password FROM users WHERE id=?", id, (err, res) => {
      if (err) {
        return reject(err);
      }
      return resolve(res[0].password);
    });
  });
};

//update one user

db.updateProfile = (user) => {
  return new Promise((resolve, reject) => {
    connect.query(
      "UPDATE users SET name=? , email=? , password=?, city=?,imageProfile=?, profileLanguage=? WHERE id=?",
      user,
      (err, resualt) => {
        if (err) {
          return reject(err);
        }
        return resolve("successful");
      }
    );
  });
};

db.GetCity = (userEmail) => {
  return new Promise((resolve, reject) => {
    connect.query(
      "SELECT city FROM users WHERE email=? ",
      userEmail,
      (err, res) => {
        if (err) {
          return reject(err);
        }
        return resolve(res[0]);
      }
    );
  });
};
module.exports = db;
