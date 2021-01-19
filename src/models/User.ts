// import * as Sequelize from 'sequelize';
// import { SequelizeAttributes } from '../typings/SequelizeAttributes/index';

// export interface UserAttributes {
//     id?: number;
//     firstName: string;
//     lastName: string;
//     createdAt?: Date;
//     updatedAt?: Date;
// };

// export interface UserInstance extends Sequelize.Instance<UserAttributes>, UserAttributes {
// }

// export const UserFactory = (sequelize: Sequelize.Sequelize, DataTypes: Sequelize.DataType): Sequelize.Model<UserInstance, UserAttributes> => {
//     const attributes: SequelizeAttributes<UserAttributes> = {
//       name: {
//         type: DataTypes.STRING
//       }
//     };

//     const User = sequelize.define<UserInstance, UserAttributes>('User', attributes);

//     return User;
// };