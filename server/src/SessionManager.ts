import { Cell, Session } from './types';
import { TSMap } from 'typescript-map';
import randomColor from 'randomcolor';

class SessionManager {
  private sessions: TSMap<string, Session> = new TSMap();

  gameToString(cells: Cell[]) {
    let game = '';
    for (let i = 0; i < 15; i++) {
      for (let j = 0; j < 15; j++) {
        const cell = cells[i * 15 + j];
        if (cell.type === 0) {
          game += '[*]';
        } else {
          game += `[${cell.value}]` || '[  ]';
        }
      }
      game += '\n';
    }
    return game;
  }

  createSession(id: string, memberId: string) {
    const session: Session = {
      members: [{ id: memberId, color: randomColor(), cursorIndex: -1 }],
      id,
      cells: [],
    };
    this.sessions.set(id, session);
    return this.sessions.get(id);
  }

  addMember(id: string, memberId: string) {
    const session = this.sessions.get(id);
    if (session) {
      session.members.push({
        id: memberId,
        color: randomColor(),
        cursorIndex: -1,
      });
    }
    return session;
  }

  removeMember(memberId: string) {
    this.sessions.forEach((session: Session) => {
      if (!!session.members.find(({ id }) => id === memberId)) {
        session.members = session.members.filter(
          (member) => member.id !== memberId
        );
        if (session.members.length === 0) {
          console.log('empty session, removing');
          this.sessions.delete(session.id);
        }
      }
    });
  }

  updateSessionData(
    id: string,
    cells: Cell[],
    memberId: string,
    cursorIndex: number
  ) {
    const session = this.sessions.get(id);
    if (session) {
      session.cells = cells;
      const member = session.members.find((member) => member.id === memberId);
      if (member) member.cursorIndex = cursorIndex;
    }
    return session;
  }

  getSession(id: string) {
    return this.sessions.get(id);
  }

  getSessions() {
    return this.sessions;
  }
}

export function printCells(cells: Cell[]) {
  const output: string[][] = [];
  for (let i = 0; i < 15; i++) {
    const column = [];
    for (let j = 0; j < 15; j++) {
      const cell = cells[i * 15 + j];
      if (cell.type === 0) {
        column.push('*');
      } else {
        column.push(cell.value);
      }
    }
    output.push(column);
  }
  console.table(output);
}

export const sessionManager = new SessionManager();
