const async = require("async");
const nba = require('nba-api-client');
const { body, validationResult } = require("express-validator");
const initModels = require('../models/init-models');
var sequelize = require('../config')
const models = initModels(sequelize);

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}
  

exports.nba_data_get = (req, res) => {
    res.render("nba", {
        title: "NBA betting game",
        player_id: req.params.id
    });
};

exports.nba_data_post = [

    body("player_first_name", "Name must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
    body("player_last_name", "Name must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),

    (req, res, next) => {
        const errors = validationResult(req);
        
        if(!errors.isEmpty()) {
            
        }
        else {
            const name = req.body.player_first_name + ' ' + req.body.player_last_name;
            const id = nba.getPlayerID(name).PlayerID;
            async.parallel(
                {
                    get_player(callback) {
                        models.player.findOne({ where: { player_id: req.body.player_id }})
                        .then(p => {
                            callback(null, p.dataValues);
                        });
                    },

                    get_stats(callback) {
                        nba.playerBoxScores({
                            DateTo: req.body.date,
                            LastNGames: req.body.num_games,
                            PlayerID: id,
                            Season: "2022-23",
                        })
                        .then(data => {
                            callback(null, data);
                        });
                    }
                },
                (err, results) => {
                    if(err) {
                        return next(err);
                    }

                    // Check if player has sufficient balance
                    if(results.get_player.balance < req.body.stake) {
                        res.render("nba", {
                            title: "Not enough balance",
                        });
                    }

                    // Get avg pts
                    var ppg = 0.0;
                    const len = Object.keys(results.get_stats.PlayerGameLogs).length;
                    for(let i = 0; i < len; i++){
                        ppg += results.get_stats.PlayerGameLogs[i].PTS;
                    }
                    ppg = parseFloat(ppg/len).toFixed(1);
                    
                    // Calculate profit rate
                    var profit_rate = req.body.num_games > 10 ? 1.75 : 1.0 + (req.body.num_games/3) * 0.25;

                    // Compare player and bot points
                    var winner = 'You win!';
                    const player_choice = getRandomInt(0, len);
                    const bot_choice = getRandomInt(0, len);
                    if(results.get_stats.PlayerGameLogs[player_choice].PTS < results.get_stats.PlayerGameLogs[bot_choice].PTS){
                        winner =  'You lose!'
                        profit_rate = 0;
                    }
                    else if(results.get_stats.PlayerGameLogs[player_choice].PTS == results.get_stats.PlayerGameLogs[bot_choice].PTS){
                        winenr = 'Draw!'
                        profit_rate = 1.0;
                    }

                    // Create game instance and save it to the db
                    const game = models.game.build({
                        player_id: req.body.player_id,
                        stake: req.body.stake,
                        gain: req.body.stake * profit_rate,
                    });

                    game.save()
                    .then()
                    .catch(err => { 
                        return next(err)
                    });

                    res.render("nba_data", {
                        title: "Results",
                        data: results.get_stats,
                        num_games: len,
                        avg_pts: ppg,
                        name: name,
                        player_choice: player_choice,
                        bot_choice: bot_choice,
                        winner: winner,
                        player_id: req.params.id
                    });
                }
            );
        }
    }
];