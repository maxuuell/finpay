import { Sequelize, DataTypes } from 'sequelize'

export const initUserScopes = (sequelize: Sequelize) => {
    const UserClientScope = sequelize.define('user_client_scope', {
        userClientScopeId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        clientId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        clientName: {
            type: DataTypes.STRING,
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
    }, {
        underscored: true
    });
    return UserClientScope
}

