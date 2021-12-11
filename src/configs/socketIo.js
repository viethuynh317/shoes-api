var Socket = require("socket.io");
export class MySocket {
  constructor(server) {
    this.socket = Socket(server.getServer(), {
      core: {
        origin: "*",
      },
    });
  }
  getInstance() {
    return this.socket;
  }
}
