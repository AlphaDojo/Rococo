module.exports = (sequelize, DataTypes) => {
    const returns = sequelize.define("returns", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        return_date_real: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        return_dmgstatus: {
            type: DataTypes.STRING,
            allowNull: false
        },
        return_status: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });

    returns.associate = (models) => {
        returns.belongsTo(models.borrowing, {
            foreignKey: 'borrowingId',
            as: "borrowingDetails",
            allowNull: false
        });
    };

    return returns;
  };