require('dotenv').config();

const ENV         = process.env.ENV || "development";
const knexConfig  = require("../knexfile");
const knex        = require("knex")(knexConfig[ENV]);
const knexLogger  = require('knex-logger');

// var records = [
//     { id: 1, username: 'jack', password: 'secret', displayName: 'Jack', email: 'jack@example.com' }
//   , { id: 2, username: 'jill', password: 'birthday', displayName: 'Jill', email: 'jill@example.com' }
// ];

exports.findById = function(id, cb) {
  process.nextTick(function() {
    knex.select("*")
    .from("users")
    .where("id", "=", id)
    .then((record) => {
      console.log("searching id")
      console.log("record:", record)
      if (record.length > 0 && record[0].id === id) {
        console.log("user found!")
        return cb(null, record[0]);
      }
      console.log("user not found!")
      cb(new Error('User ' + id + ' does not exist'));
    })
    .catch((err) => cb(err));
  })
}

// exports.findById = function(id, cb) {
//   process.nextTick(function() {
//     var idx = id - 1;
//     if (records[idx]) {
//       cb(null, records[idx]);
//     } else {
//       cb(new Error('User ' + id + ' does not exist'));
//     }
//   });
// }

// exports.findByUsername = function(username, cb) {
//   process.nextTick(function() {
//     for (var i = 0, len = records.length; i < len; i++) {
//       var record = records[i];
//       if (record.email === username) {
//         return cb(null, record);
//       }
//     }
//     return cb(null, null);
//   });
// }

exports.findByUsername = function(username, cb) {
  process.nextTick(function() {
    knex.select("*")
    .from("users")
    .where("email", "=", username)
    .then((record) => {
      console.log("searching username")
      console.log("record:", record)
      if (record.length > 0 && record[0].email === username) {
        console.log("user found!")
        return cb(null, record[0]);
      }
      console.log("user not found!")
      return cb(null, null);
    })
    .catch((err) => cb(err));
  })
}

exports.addUser = function(req, cb) {
  process.nextTick(function() {
    console.log("addUser:", req.body)
    knex("users")
      .insert({
          "firstName": req.body.firstName,
          "lastName": req.body.lastName,
          "email": req.body.email,
          "password": req.body.password,
          "address": req.body.address,
          "phoneNumber": req.body.phoneNumber
        })
      .catch((err) => cb(err));
    })
  }

    // passport.use('local-login', new LocalStrategy(options,
    //   function(req, username, password, cb) {
    //     knex
    //     .select("*")
    //     .from("users")
    //     .where("email","=",username)
    //     .then((results) => {
    //       if (results.length === 0) {
    //         return cb(null, false, req.flash('loginMessage', 'User not found.'));
    //       }
    //       if (! bcrypt.compareSync(password, results[0].password) ) {
    //         return cb(null, false, req.flash('loginMessage', 'Password incorrect.'));
    //       }
    //       return cb(null, results[0]);
    //     })
    //     .catch((err) => cb(err));
    // }));
