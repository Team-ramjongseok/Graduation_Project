const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            order_status: {
                type: Sequelize.STRING(5),
                allowNull: false,
                unique: true,
            },
            memo: {
                type: Sequelize.STRING(1000),
                allowNull: false,
            },
            menu_id: {
                type: Sequelize.INTEGER,
                allowNull: true,
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
        db.Order.hasOne(db.Payment);
        db.Order.belongsTo(db.User);
        db.Order.hasOne(db.Order_detail);
    }
};
