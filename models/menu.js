const Sequelize = require('sequelize');

module.exports = class Menu extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            name: {
                type: Sequelize.STRING(15),
                allowNull: false,
            },
            price: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
        }, {
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'Menu',
            tableName: 'menus',
            paranoid: true,
            charset: 'utf8', // 한글 지원
            collate: 'utf8_general_ci', // 한글 지원
        });
    }

    // static associate(db) {
    //     db.User.hasMany(db.Post);
    //     db.User.belongsToMany(db.User, {
    //         foreignKey: 'followingId',
    //         as: 'Followers',
    //         through: 'Follow',
    //     });
    //     db.User.belongsToMany(db.User, {
    //         foreignKey: 'followerId',
    //         as: 'Followings',
    //         through: 'Follow',
    //     });
    // }
};
