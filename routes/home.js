var express = require('express');
var router = express.Router();

// Controller modules
const player_controller = require('../controller/playerController');
const game_controller = require('../controller/gameController');
const nba_controller = require('../controller/nbaController');
const player = require('../models/player');
const game = require('../models/game');

/* GET home page. */
router.get("/", player_controller.index);

// GET request for player list
router.get("/player", player_controller.get_players);

// GET request for specific player
router.get("/player/detail/:id", player_controller.player_detail);

// GET request for specific player game history
router.get("/player/detail/:id/gamehistory", game_controller.specific_history);

// GET request for game history of specific player
router.get("/player/:id/gamehistory", game_controller.specific_history);

// GET request for user sign up
router.get("/player/create", player_controller.user_create_get);

// POST request for user sign up
router.post("/player/create", player_controller.user_create_post);

// GET request for user log in
router.get("/player/login", player_controller.user_login_get);

// POST request for user log in
router.post("/player/login", player_controller.user_login_post);

// GET request for deleting account
router.get("/player/detail/:id/delete", player_controller.user_delete_get);

// POST request for deleting account
router.post("/player/detail/:id/delete", player_controller.user_delete_post);
  
// GET request for game history
router.get("/game", game_controller.game_stats);

// GET request for nba
router.get("/nba/:id", nba_controller.nba_data_get);

// POST request for nba
router.post("/nba/process/:id", nba_controller.nba_data_post);

module.exports = router;