import { Sequelize } from 'sequelize'
import { initUsers } from './models/Users';
import { initUserScopes } from './models/UserScopes';

const {
    DB_NAME,
    DB_HOST,
    DB_USER_NAME,
    DB_DIALECT,
    DB_PASSWORD,
    DB_PORT
} = process.env;

export const loadSequelize = async () => {
    const sequelize = new Sequelize(`${DB_DIALECT}://${DB_USER_NAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`, {
        pool: {
            max: 2,
            min: 0,
            idle: 0,
            acquire: 3000,
        }
    });

    const Users = initUsers(sequelize)
    const UserClientScope = initUserScopes(sequelize)

    Users.hasMany(UserClientScope, { foreignKey: "userId" })
    UserClientScope.belongsTo(Users, { foreignKey: "userId" })

    try {
        await sequelize.authenticate();
    } catch (error) {
        console.log('error :>> ', error);
    }
    return sequelize;
}

