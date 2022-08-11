module.exports = (sequelize, DataTypes) => {
    const user = require('../models/user');
    const employee = require('../models/employee');
    const item = require('../models/item');
    const returns = require('../models/returns');
    const borrowing = sequelize.define("borrowing", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        }, 
        borrow_date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        return_date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        borrow_status: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });

    borrowing.associate = (models) => {
        borrowing.belongsTo(models.user, {
            foreignKey: 'userId',
            as: "userDetails",
            allowNull: false
        });
        borrowing.belongsTo(models.employee, {
            foreignKey: 'employeeId',
            as: "employeeDetails",
            allowNull: false
        });
        borrowing.belongsTo(models.item, {
            foreignKey: 'itemId',
            as: "itemDetails",
            allowNull: false
        });
        borrowing.hasMany(models.returns,{
            onDelete: "cascade"
        });
    };

    return borrowing;
};