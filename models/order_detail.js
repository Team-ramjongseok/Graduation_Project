const Sequelize = require('sequelize');

module.exports = class Order_detail extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
        }, {
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'User',
            tableName: 'users',
            paranoid: true,
            charset: 'utf8', // 한글 지원
            collate: 'utf8_general_ci', // 한글 지원
        });
    }

    static associate(db) {
        db.User.belongsTo(db.Order);
        db.User.belongsTo(db.Menu);
    }
};
