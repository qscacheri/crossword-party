import { Cell } from './types';

class SessionManager {
  private sessions: Map<string, Cell[]> = new Map();

  updateSession(id: string, cells: Cell[]) {
    this.sessions.set(id, cells);
  }
  getSession(id: string) {
    return this.sessions.get(id);
  }
  getSessions() {
    return this.sessions;
  }
}

export const sessionManager = new SessionManager();
