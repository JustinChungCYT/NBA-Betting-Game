const Sequelize = require('sequelize');
const { get } = require('../routes/home');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('player', {
    player_id: {
      type: DataTypes.STRING(10),
      allowNull: false,
      primaryKey: true
    },
    passcode: {
      type: DataTypes.STRING(15),
      allowNull: false
    },
    balance: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 1000
    },
    total_stake: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0
    },
    total_gain: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0
    },
    profit_percent: {
      type: DataTypes.DECIMAL(4,3),
      allowNull: true,
      defaultValue: 0.000
    },
    is_golded: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0
    },
    url: {
      type: DataTypes.VIRTUAL,
      get() {
        return `/home/player/detail/${this.player_id}`
      },
      set(value){
        throw new Error('Setting the url is not allowed')
      }
    }
  }, {
    sequelize,
    tableName: 'player',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "player_id" },
        ]
      },
    ]
  });
};
