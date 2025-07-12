import {
  Model,
  DataTypes,
  Sequelize,
  Optional
} from 'sequelize';

// Interface for attributes
interface WalletAttributes {
  id: number;
  userId: number;
  address: string;
  privateKey: string;
  uuid?: string;
  user_type?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// Optional attributes for `create` calls
interface WalletCreationAttributes extends Optional<WalletAttributes, 'id' | 'uuid' | 'user_type'> {}

module.exports = (sequelize: Sequelize) => {
  class walletAddresses
    extends Model<WalletAttributes, WalletCreationAttributes>
    implements WalletAttributes {
    public id!: number;
    public userId!: number;
    public address!: string;
    public privateKey!: string;
    public uuid?: string;
    public user_type?: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    static associate(models: any) {
      // Example:
      // walletAddresses.belongsTo(models.User, { foreignKey: 'userId' });
    }
  }

  walletAddresses.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      privateKey: {
        type: DataTypes.STRING,
        allowNull: false
      },
      uuid: {
        type: DataTypes.STRING
      },
      user_type: {
        type: DataTypes.INTEGER
      }
    },
    {
      sequelize,
      modelName: 'walletAddresses',
      tableName: 'wallet_addresses',
      timestamps: true,
      underscored: true
    }
  );

  return walletAddresses;
};
