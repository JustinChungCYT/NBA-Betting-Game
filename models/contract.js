const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('contract', {
    contract_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    contractor_id: {
      type: DataTypes.STRING(10),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'player',
        key: 'player_id'
      }
    },
    contractee_id: {
      type: DataTypes.STRING(10),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'player',
        key: 'player_id'
      }
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    interest_rate: {
      type: DataTypes.DECIMAL(4,2),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'contract',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "contractor_id" },
          { name: "contractee_id" },
          { name: "contract_id" },
        ]
      },
      {
        name: "contract_id",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "contract_id" },
        ]
      },
      {
        name: "contractee_id",
        using: "BTREE",
        fields: [
          { name: "contractee_id" },
        ]
      },
    ]
  });
};
