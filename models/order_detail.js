const Sequelize = require('sequelize');

module.exports = class Order_detail extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
        }, {
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'order_detail',
            tableName: 'order_details',
            paranoid: true,
            charset: 'utf8', // 한글 지원
            collate: 'utf8_general_ci', // 한글 지원
        });
    }

    static associate(db) {
        db.Order_detail.belongsTo(db.Order,{
            foreignKey: 'OrderId',
            targetKey : 'id',
        });
        db.Order_detail.belongsTo(db.Menu,{
            foreignKey: 'MenuId',
            targetKey : 'id',
        });
    }
};
