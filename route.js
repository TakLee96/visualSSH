/**
 * Created by lijiahang on 14-10-3.
 */

module.exports = function(app) {
    var controller = require("./app/controllers/controller");

    app.get("/connect/:host/:user/:pass", controller.connect);

    app.get("/command/:command", controller.execute);
};