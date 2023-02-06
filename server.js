const EventEmitter = require("events");

class Server extends EventEmitter {
  constructor(client) {
    super();
    this.tasks = {};
    this.taskId = 1;
    client.on("command", (command, args) => {
      switch (command) {
        case "help":
        case "add":
        case "ls":
        case "del":
          this[command](args);
          break;
        default:
          this.emit("response", "Unknown command...");
      }
    });
  }

  tasksString() {
    return Object.keys(this.tasks)
      .map((key) => {
        return `${key}: ${this.tasks[key]}`;
      })
      .join("\n");
  }

  help() {
    this.emit("response", "help add ls del");
  }
  add(args) {
    this.tasks[this.taskId] = args.join(" ");
    this.emit("response", args.join(" "));
    this.taskId++;
  }
  ls() {
    this.emit("response", `Tasks:\n${this.tasksString()}`);
  }
  del(args) {
    delete this.tasks[args[0]];
    this.emit("response", `Deleted task ${args[0]}`);
  }
}

module.exports = (client) => new Server(client);
