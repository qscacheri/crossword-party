"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = void 0;
const app_1 = require("./app");
const main = () => {
    const server = (0, app_1.createApp)();
    const port = 3002;
    server.listen(port, () => {
        console.log(`Server listening on port ${port}`);
    });
};
exports.main = main;
(0, exports.main)();
//# sourceMappingURL=index.js.map