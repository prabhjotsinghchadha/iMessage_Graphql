"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const user_1 = tslib_1.__importDefault(require("./user"));
const conversation_1 = tslib_1.__importDefault(require("./conversation"));
const message_1 = tslib_1.__importDefault(require("./message"));
const scalars_1 = tslib_1.__importDefault(require("./scalars"));
const lodash_merge_1 = tslib_1.__importDefault(require("lodash.merge"));
const resolvers = (0, lodash_merge_1.default)({}, user_1.default, conversation_1.default, message_1.default, scalars_1.default);
exports.default = resolvers;
//# sourceMappingURL=index.js.map