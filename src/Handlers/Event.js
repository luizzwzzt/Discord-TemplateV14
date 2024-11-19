export default class Event {
  constructor(client, options) {
    this.client = client;
    this.name = options.name;

    if (this.run && typeof this.run === "function") {
      this.run = this.run.bind(this);
    }
  }
}
