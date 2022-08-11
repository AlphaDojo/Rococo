module.exports = (sequelize, DataTypes) => {
    const user = sequelize.define("user", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        }, 
        usr_fname: {
            type: DataTypes.STRING,
            allowNull: false
        },
        usr_lname: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });

    user.associate = (models) => {
        user.hasMany(models.borrowing,{
            onDelete: "cascade"
        });
    };

    return user;
};