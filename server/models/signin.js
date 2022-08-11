module.exports = (sequelize, DataTypes) => {
    const signin = sequelize.define("signin", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        }, 
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            required: true,
            unique: true,
            validate: {
                is: /^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/i
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            required: true
        }
    });

    /*signin.associate = (models) => {
        signin.belongsTo(models.employee,{
            onDelete: "cascade"
        });
    };*/

    return signin;
};