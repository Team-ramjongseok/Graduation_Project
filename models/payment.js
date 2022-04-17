const Sequelize = require('sequelize');

module.exports = class Payment extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            order_time: {
                type: 'TIMESTAMP',
                allowNull: false,
            },
            amount: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
        }, {
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'payment',
            tableName: 'payments',
            paranoid: true,
            charset: 'utf8', // 한글 지원
            collate: 'utf8_general_ci', // 한글 지원
        });
    }

    static associate(db) {
        db.Payment.belongsTo(db.Order,{
            foreignKey: 'OrderId',
            targetKey : 'id',
        });
        db.Payment.belongsTo(db.Cafe,{
            foreignKey: 'CafeId',
            targetKey : 'id',
        });
    }
};
