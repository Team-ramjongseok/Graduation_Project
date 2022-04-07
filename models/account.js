const Sequelize = require('sequelize');

module.exports = class Account extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            account_num: {
                type: Sequelize.STRING(20),
                allowNull: false,
                unique: true,
            },
            bank: {
                type: Sequelize.STRING(20),
                allowNull: false,
            },
        }, {
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'Account',
            tableName: 'accounts',
            paranoid: true,
            charset: 'utf8', // 한글 지원
            collate: 'utf8_general_ci', // 한글 지원
        });
    }

    static associate(db) {
        db.Account.belongsTo(db.User, {
            foreignKey: 'id',
            as: 'users',
            through: 'User',
        });

    }
};
