module.exports = (sequelize, Sequelize) => {
    const missing = sequelize.define(
        "missing",
        {
            name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            from: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            to: {
                type: Sequelize.STRING,
                allowNull: false,
            }
        },
        {
            charset: "utf8mb4",
            collate: "utf8mb4_bin",
        }
    );

    return missing;
};