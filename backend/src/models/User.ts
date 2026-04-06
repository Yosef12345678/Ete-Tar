import 'dotenv/config';
import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';

class User extends Model {
  declare id: string;
  declare email: string;
  declare password_hash: string;
  declare role: string;
  declare refresh_token: string | null;
  declare readonly created_at: Date;
  declare readonly updated_at: Date;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING(50),
      defaultValue: 'user',
      validate: {
        isIn: [['user', 'admin']],
      },
    },
    refresh_token: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: true, // Automatically adds created_at and updated_at
    underscored: true, // Uses snake_case (created_at) instead of camelCase (createdAt)
  }
);

export default User;
