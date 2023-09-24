const colors = require("colors");
const db = require("./db");
const { loadApp } = require("./app");

const init = async () => {
    
    let startTime = Date.now();
    await db.sequelize
    .sync({
      alter: true,
      logging: false,
    })
    .then(() => {
      finishTime = Date.now();
      console.log("[" + "LOADING".green + "]" + "[" + "MYSQL".yellow + "] " + "Database loaded in " + (finishTime - startTime) + "ms");
    });

    loadApp();

}

init();