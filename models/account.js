const Sequelize = require('sequelize');

module.exports = class Account extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            account_num: {
                type: Sequelize.STRING(10),
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
