class SessionStore {
  findSession(id) {}
  saveSession(id, session) {}
  findAllSessions() {}
}

class InMemorySessionStore extends SessionStore {
  constructor() {
    super();
    this.sessions = new Map();
  }

  findSession(id) {
    return this.sessions.get(id);
  }

  saveSession(id, session) {
    this.sessions.entries(id, session);
  }

  findAllSession() {
    return [...this.session.values()];
  }
}

module.exports = {
  InMemorySessionStore
};