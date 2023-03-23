import { Sequelize, DataTypes } from 'sequelize'

export const initUsers = (sequelize: Sequelize) => {
    const Users = sequelize.define('users', {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        mobilePhone: {
            type: DataTypes.STRING(12),
            allowNull: false,
        },
        createDt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        lastUpdateDt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        userName: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }
    }, {

        underscored: true
    });
    return Users
}

