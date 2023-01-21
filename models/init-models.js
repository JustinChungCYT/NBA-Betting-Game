var DataTypes = require("sequelize").DataTypes;
var _contract = require("./contract");
var _game = require("./game");
var _player = require("./player");
var _temp = require("./temp");

function initModels(sequelize) {
  var contract = _contract(sequelize, DataTypes);
  var game = _game(sequelize, DataTypes);
  var player = _player(sequelize, DataTypes);
  var temp = _temp(sequelize, DataTypes);

  player.belongsToMany(player, { as: 'contractee_id_players', through: contract, foreignKey: "contractor_id", otherKey: "contractee_id" });
  player.belongsToMany(player, { as: 'contractor_id_players', through: contract, foreignKey: "contractee_id", otherKey: "contractor_id" });
  contract.belongsTo(player, { as: "contractor", foreignKey: "contractor_id"});
  player.hasMany(contract, { as: "contracts", foreignKey: "contractor_id"});
  contract.belongsTo(player, { as: "contractee", foreignKey: "contractee_id"});
  player.hasMany(contract, { as: "contractee_contracts", foreignKey: "contractee_id"});
  game.belongsTo(player, { as: "player", foreignKey: "player_id"});
  player.hasMany(game, { as: "games", foreignKey: "player_id"});

  return {
    contract,
    game,
    player,
    temp,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
