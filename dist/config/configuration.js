"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = () => {
    var _a, _b;
    return ({
        port: parseInt((_a = process.env.PORT) !== null && _a !== void 0 ? _a : '3000', 10),
        database: {
            url: (_b = process.env.DATABASE_URL) !== null && _b !== void 0 ? _b : '',
        },
    });
};
//# sourceMappingURL=configuration.js.map