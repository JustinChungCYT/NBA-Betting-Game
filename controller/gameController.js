const initModels = require('../models/init-models');
var sequelize = require('../config')
const async = require("async");
const models = initModels(sequelize);

exports.game_stats = (req, res) => {
    async.parallel(
      {
        game_count(callback) {
          models.game.count().then(game => {
            callback(null, game);
          });
        },
        game_history(callback) {
            models.game.findAll().then(game => {
              callback(null, game)
          });
        }
      },
      (err, results) => {
        res.render("game", {
          title: "Game History",
          error: err,
          data: results,
        });
      }
    );
  };

  exports.specific_history = (req, res) => {
    async.parallel(
        {
          game_played(callback) {
            models.game.count({ where: { player_id: req.params.id }})
            .then(count => {
              callback(null, count);
          });
          },
            game_list(callback) {
                models.game.findAll({ where: { player_id: req.params.id }})
                .then(list => {
                  callback(null, list);
                });
            },
        },
        (err, results) => {
            res.render("game_history", {
              title: "Game History",
              game_played: results.game_played,
              game_list: results.game_list,
              player_name: req.params.id
            })
        }
    )
};