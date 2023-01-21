const initModels = require('../models/init-models');
var sequelize = require('../config')
const async = require("async");
var models = initModels(sequelize);
const { body, validationResult } = require("express-validator");

// exports.check_duplicate = () => {
//   console.log("Hello");
// }

exports.index = (req, res) => {
    async.parallel(
      {
        player_count(callback) {
          models.player.count().then(player => {
            callback(null, player);
          });
        },
        game_count(callback) {
          models.game.count().then(game => {
            callback(null, game);
          });
        },
      },
      (err, results) => {
        res.render("index", {
          title: "NBA Betting Game",
          error: err,
          data: results,
        });
      }
    );
};


exports.get_players = (req, res) => {
    async.parallel(
        {
          player_list(callback) {
            models.player.findAll().then(players => {
                callback(null, players);
            });
          }
        },
        (err, results) => {
          res.render("player", {
            title: "Player List",
            error: err,
            data: results,
          });
        }
      );
};


exports.player_detail = (req, res) => {
    async.parallel(
      {
        detail_player(callback) {
          models.player.findOne({ where: {player_id: req.params.id}}).then(player => {
            callback(null, player);
          });
        }
      },
      (err, results) => {
        res.render("player_detail", {
          title: "Player",
          error: err,
          player: results.detail_player,
          player_id: req.params.id
        });
      }
    );
};


exports.user_create_get = (req, res) => {
  async.parallel(
      {},
      (err, results) => {
          res.render("signup", {
            title: "Create new account",
            paragraph: ""
          });
    ;  }
  )
};


exports.user_create_post = [
  // Validate and sanitize fields.
  body("userid", "UserId must not be empty.")
  .trim()
  .isLength({ min: 1 })
  .escape(),

  body("password", "Password must not be empty.")
  .trim()
  .isLength({ min: 1 })
  .escape(),

  (req, res, next) => {
    const errors = validationResult(req);

    // Create a player instance
    const player = models.player.build({
      player_id: req.body.userid,
      passcode: req.body.password
    });

    // If error
    if(!errors.isEmpty()) {
      return next(err);
    }

    // Check if the input user id already exist
    async.parallel(
      {
        find_player(callback) {
          models.player.findOne({ where: { player_id: player.player_id }})
          .then(player => {
              callback(null, player);
            }
          )
        }
      },
      (err, results) => {
        if(err) {
          return next(err);
        }
        if(results.find_player) {
          res.render("signup", {
            title: "Player Already Exist",
            paragraph: "please choose another user id",
            errors: errors.array()
          });
        }
      },
    );
    
    player.save()
    .then(player => {
      res.redirect(player.url);
    })
    .catch(err => { return next(err) });
  }
];


exports.user_login_get = (req, res) => {
  res.render("login", {
    title: "Log in"
  })
};


exports.user_login_post = [
  // Validate and sanitize fields.
  body("userid", "UserId must not be empty.")
  .trim()
  .isLength({ min: 1 })
  .escape(),

  body("password", "Password must not be empty.")
  .trim()
  .isLength({ min: 1 })
  .escape(),

  (req, res, next) => {
    async.parallel(
      {
        get_player(callback) {
          models.player.findOne({ where: { player_id: req.body.userid }})
          .then(player => {
            callback(null, player);
          })
        }
      },
      (err, results) => {
        if(err) {
          return next(err);
        }

        if(!results.get_player){
          res.render('login', {
            title: "No such user",
            paragraph: "Please sign up for the new account"
          })
        }
        else if(results.get_player.dataValues.passcode === req.body.password) {
          res.redirect(results.get_player.url);
        }
        else{
          res.render('login', {
            title: "User ID and password not match",
            paragraph: "please re-sign in"
          });
        }
      }
    );
  },
];


exports.user_delete_get = (req, res) => {
  async.parallel(
    {
      get_player(callback) {
        models.player.findOne({ where: { player_id: req.params.id }})
        .then(player => {
          callback(null, player);
        });
      }
    },
    (err, results) => {
      res.render("player_delete", {
        title: "Delete Account",
        error: err,
        player: results.get_player,
      });
    }
  )
};


exports.user_delete_post = (req, res, next) => {
  async.parallel(
    {
      player_to_delete(callback) {
        models.player.findOne({ where: { player_id: req.params.id }})
        .then(player => {
          callback(null, player);
        });
      }
    },
    (err, results) => {
      results.player_to_delete.destroy()
      .then()
      .catch(err => {
        return next(err);
      });
      res.redirect('/home');
    }
  );
}
