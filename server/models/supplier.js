module.exports = (sequelize, DataTypes) => {
    const supplier = sequelize.define("supplier", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        }, 
        supplier_name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });

    supplier.associate = (models) => {
        supplier.hasMany(models.item,{
            onDelete: "cascade"
        });
    };

    return supplier;
};