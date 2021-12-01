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
    console.log('store:saveSession:id', id, session)
    this.sessions.set(id, session);
  }
  
  findAllSessions() {
    console.log('store:findAllSessions:sessions', this.sessions.values())
    return [...this.sessions.values()];
  }
}

module.exports = {
  InMemorySessionStore
};