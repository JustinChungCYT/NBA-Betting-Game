const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('game', {
    game_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    player_id: {
      type: DataTypes.STRING(10),
      allowNull: true,
      references: {
        model: 'player',
        key: 'player_id'
      }
    },
    stake: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    gain: {
      type: DataTypes.FLOAT,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'game',
    hasTrigger: true,
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "game_id" },
        ]
      },
      {
        name: "player_id",
        using: "BTREE",
        fields: [
          { name: "player_id" },
        ]
      },
    ]
  });
};
