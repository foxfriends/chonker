export default class Chonkee {
  constructor(iterator) {
    this.iterator = iterator;
    this.result = undefined;
  }

  get alive() { return !this.result?.done && !this.result?.error; }

  async next(input) {
    if (!this.alive) { return this.result; }
    try {
      this.result = await this.iterator.next(input);
    } catch (error) {
      this.result = { error };
    }
    return this.result;
  }
}
