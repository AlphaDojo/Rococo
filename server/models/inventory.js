module.exports = (sequelize, DataTypes) => {
    const inventory = sequelize.define("inventory", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        }, 
        inv_quantity: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        inv_availability: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });

    inventory.associate = (models) => {
        inventory.hasMany(models.item,{
            onDelete: "cascade"
        });
    };

    return inventory;
  };