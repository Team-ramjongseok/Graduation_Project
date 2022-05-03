const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            nickname: {
                type: Sequelize.STRING(10),
                allowNull: false,
                unique: true,
            },
            email: {
                type: Sequelize.STRING(20),
                allowNull: false,
            },
            phone: {
                type: Sequelize.STRING(20), 
                allowNull: false,
            },
            password: {
                type: Sequelize.STRING(100),
                allowNull: false,
            },
            latitude: {
                type: Sequelize.DOUBLE,
                allowNull: true,
                defaultValue: null,
                validate: { min: -90, max: 90 }
            },
            longitude: {
                type: Sequelize.DOUBLE,
                allowNull: true,
                defaultValue: null,
                validate: { min: -180, max: 180 }
            },
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
        db.User.hasMany(db.Account, { 
            foreignKey: 'UserId', 
            sourceKey: 'id',
        });
        db.User.hasMany(db.Order, { 
            foreignKey: 'UserId', 
            sourceKey: 'id',
        });
    }
};

// hello world