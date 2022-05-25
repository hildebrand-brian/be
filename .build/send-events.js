"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const messages_1 = require("./messages");
const axios_1 = __importDefault(require("axios"));
async function main() {
    for (let i = 0; i < messages_1.messages.length; i++) {
        const message = messages_1.messages[i];
        let endpoint = 'shipment';
        if (message.type === 'ORGANIZATION') {
            endpoint = 'organization';
        }
        try {
            await axios_1.default.post(`http://localhost:3000/${endpoint}`, message);
        }
        catch (error) {
            console.error(error.code);
        }
    }
}
main();
//# sourceMappingURL=send-events.js.map