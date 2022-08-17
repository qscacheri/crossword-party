"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionManager = exports.printCells = void 0;
const typescript_map_1 = require("typescript-map");
const randomcolor_1 = __importDefault(require("randomcolor"));
class SessionManager {
    constructor() {
        this.sessions = new typescript_map_1.TSMap();
    }
    gameToString(cells) {
        let game = '';
        for (let i = 0; i < 15; i++) {
            for (let j = 0; j < 15; j++) {
                const cell = cells[i * 15 + j];
                if (cell.type === 0) {
                    game += '[*]';
                }
                else {
                    game += `[${cell.value}]` || '[  ]';
                }
            }
            game += '\n';
        }
        return game;
    }
    createSession(id, memberId) {
        const session = {
            members: [{ id: memberId, color: (0, randomcolor_1.default)(), cursorIndex: -1 }],
            id,
            cells: [],
        };
        this.sessions.set(id, session);
        return this.sessions.get(id);
    }
    addMember(id, memberId) {
        const session = this.sessions.get(id);
        if (session) {
            session.members.push({
                id: memberId,
                color: (0, randomcolor_1.default)(),
                cursorIndex: -1,
            });
        }
        return session;
    }
    removeMember(memberId) {
        this.sessions.forEach((session) => {
            if (!!session.members.find(({ id }) => id === memberId)) {
                session.members = session.members.filter((member) => member.id !== memberId);
                if (session.members.length === 0) {
                    console.log('empty session, removing');
                    this.sessions.delete(session.id);
                }
            }
        });
    }
    updateSessionData(id, cells, memberId, cursorIndex) {
        const session = this.sessions.get(id);
        if (session) {
            session.cells = cells;
            const member = session.members.find((member) => member.id === memberId);
            if (member)
                member.cursorIndex = cursorIndex;
        }
        return session;
    }
    getSession(id) {
        return this.sessions.get(id);
    }
    getSessions() {
        return this.sessions;
    }
}
function printCells(cells) {
    const output = [];
    for (let i = 0; i < 15; i++) {
        const column = [];
        for (let j = 0; j < 15; j++) {
            const cell = cells[i * 15 + j];
            if (cell.type === 0) {
                column.push('*');
            }
            else {
                column.push(cell.value);
            }
        }
        output.push(column);
    }
    console.table(output);
}
exports.printCells = printCells;
exports.sessionManager = new SessionManager();
//# sourceMappingURL=SessionManager.js.map