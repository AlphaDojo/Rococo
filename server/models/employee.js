module.exports = (sequelize, DataTypes) => {
    const employee = sequelize.define("employee", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        }, 
        emp_fname: {
            type: DataTypes.STRING,
            allowNull: false
        },
        emp_lname: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });

   /* employee.associate = (models) => {
        employee.hasMany(models.signin,{
            onDelete: "cascade"
        });
    };*/

    employee.associate = (models) => {
        employee.hasMany(models.borrowing,{
            onDelete: "cascade"
        });
    };

    return employee;
};