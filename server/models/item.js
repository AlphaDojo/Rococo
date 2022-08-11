module.exports = (sequelize, DataTypes) => {
    const inventory = require('../models/inventory');
    const supplier = require('../models/supplier');
    const borrowing = require('../models/supplier');
    const item = sequelize.define("item", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        }, 
        item_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        item_description: {
            type: DataTypes.STRING,
            allowNull: true
        }
    });
    item.associate = (models) => {
        item.belongsTo(models.inventory, {
            foreignKey: 'inventoryId',
            as: "inventoryDetails",
            allowNull: true
        });
        item.belongsTo(models.supplier, {
            foreignKey: 'supplierId',
            as: "supplierDetails",
            allowNull: true
        });
        item.hasMany(models.borrowing,{
            onDelete: "cascade"
        });
    };
    return item;
  };