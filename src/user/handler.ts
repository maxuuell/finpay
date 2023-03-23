import { APIGatewayProxyEvent } from 'aws-lambda';
import { Sequelize } from 'sequelize';
import { loadSequelize } from '../db/db'

let sequelize: null | Sequelize = null;

const generateScopes = (scopes) => {
    if (Array.isArray(scopes)) {
        return scopes.map((scope) => {
            return {
                clientId: scope.dataValues.clientId,
                clientName: scope.dataValues.clientName
            }
        })
    } else {
        return [{ clientId: scopes.dataValues.clientId, clientName: scopes.dataValues.clientName }]
    }
}

export const getUserById = async (event: APIGatewayProxyEvent) => {
    try {
        if (event.pathParameters && event.pathParameters.userId) {
            const { userId } = event.pathParameters;

            if (!sequelize) {
                sequelize = await loadSequelize();
            }

            const user = await sequelize.models.users.findOne({ where: { userId } })
            const scopes = await sequelize.models.user_client_scope.findAll({ where: { userId } })

            const body = {
                firstName: user?.dataValues.firstName,
                lastName: user?.dataValues.lastName,
                mobilePhone: user?.dataValues.mobilePhone,
                userName: user?.dataValues.userName,
                allowedClients: generateScopes(scopes)
            }

            return {
                statusCode: 200,
                body: JSON.stringify(body),
                headers: {
                    "Content-Type": "application/json"
                }
            }
        }
    } catch (error: any) {
        console.log('error :>> ', error);
    }
}

export const createUser = async (event: APIGatewayProxyEvent) => {
    try {
        if (event.body) {
            const { firstName, lastName, mobilePhone, userName, allowedClients } = JSON.parse(event.body)

            if (!sequelize) {
                sequelize = await loadSequelize();
            }

            const transaction = await sequelize.transaction();

            const user = await sequelize.models.users.create({
                lastName,
                firstName,
                mobilePhone,
                userName
            }, { transaction })

            const bulkRecords = allowedClients.map(({ clientId, clientName }) => {
                return {
                    userId: user.dataValues.userId,
                    clientId,
                    clientName
                }
            })

            await sequelize.models.user_client_scope.bulkCreate(bulkRecords, { transaction })

            await transaction.commit();

            return {
                statusCode: 200,
                body: JSON.stringify({ message: `User created` }),
                headers: {
                    "Content-Type": "application/json"
                }
            }
        }

    } catch (error: any) {
        return {
            statusCode: 500,
            message: error.mesage,
            headers: {
                "Content-Type": "application/json"
            }
        }

    }
}

export const updateUser = async (event: APIGatewayProxyEvent) => {
    try {
        if (event.body && event.pathParameters && event.pathParameters.userId) {
            const { userId } = event.pathParameters;
            const { allowedClients, ...rest } = JSON.parse(event.body)

            if (!sequelize) {
                sequelize = await loadSequelize();
            }

            const transaction = await sequelize.transaction();

            const user = await sequelize.models.users.findOne({ where: { userId } })

            if (user) {
                await sequelize.models.users.update({
                    ...rest
                }, { where: { userId }, transaction })

                // if (allowedClients) {
                //     const bulkRecords = allowedClients.map(({ clientId, clientName }) => {
                //         return {
                //             userId: user.dataValues.userId,
                //             clientId,
                //             clientName
                //         }
                //     })
                //     // cant seem to update the scope in place. 
                //     // creates new scope entries with the userId, but leaves the old ones
                //     await sequelize.models.user_client_scope.bulkCreate(bulkRecords, { updateOnDuplicate: ["user_id", "client_id", "client_name"], transaction })

                // }

                await transaction.commit();
            }


            return {
                statusCode: 200,
                body: JSON.stringify({ message: `User updated` }),
                headers: {
                    "Content-Type": "application/json"
                }
            }
        }
    } catch (error: any) {
        return {
            statusCode: 500,
            message: error.mesage,
            headers: {
                "Content-Type": "application/json"
            }
        }

    }
}

export const deleteUser = async (event: APIGatewayProxyEvent) => {
    try {
        if (event.pathParameters && event.pathParameters.userId) {
            const { userId } = event.pathParameters;

            if (!sequelize) {
                sequelize = await loadSequelize();
            }

            const user = await sequelize.models.users.destroy({ where: { userId } })
            // returns 0 🤷‍♂️
            await sequelize.models.user_client_scope.destroy({ where: { userId } })

            if (user > 0) {
                return {
                    statusCode: 200,
                    body: JSON.stringify({ message: `User by user id ${userId} was deleted` }),
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            }
        }
    } catch (error: any) {
        console.log('error :>> ', error);
    }
}