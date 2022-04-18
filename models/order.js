const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            order_status: {
                type: Sequelize.STRING(5),
                allowNull: false,
                // unique: true, -> 이거 왜 넣음?
            },
            memo: {
                type: Sequelize.STRING(1000),
                allowNull: false,
            },
        }, {
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'Order',
            tableName: 'orders',
            paranoid: true,
            charset: 'utf8', // 한글 지원
            collate: 'utf8_general_ci', // 한글 지원
        });
    }

    static associate(db) {
        db.Order.hasOne(db.Payment, {
            foreignKey: 'OrderId', 
            sourceKey: 'id',
        });
        db.Order.belongsTo(db.User, {
            foreignKey: 'UserId',
            targetKey : 'id',
        });
        db.Order.hasOne(db.Order_detail, {
            foreignKey: 'OrderId', 
            sourceKey: 'id',
        });
    }
};
