import { construct, curry } from 'ramda';
import Chonkee from './Chonkee.js';

async function chonk(coordinator, processor, data) {
  const chonkees = data
    .map(processor)
    .map(construct(Chonkee));
  const chonker = coordinator(data);

  for (let output;;) {
    const { value, done } = await chonker.next(output);
    if (done) { return value; }
    if (typeof value !== 'function') {
      throw new TypeError('chonk coordinator must yield strategies by which to run the chonkees');
    }
    output = await value(chonkees);
  }
}

const parallel = (input) => (chonkees) => Promise.all(chonkees.map((chonkee) => chonkee.next(input)));
const sequential = (input) => async (chonkees) => {
  const output = [];
  for (const chonkee of chonkees) {
    output.push(await chonkee.next(input));
  }
  return output;
}

const all = (outputs) => {
  for (const output of outputs) {
    if (output.error) {
      throw output.error;
    }
  }
  return outputs.map(({ value }) => value);
};

const successful = (output) => output
  .filter(({ error }) => !error)
  .map(({ value }) => value);

export default curry(chonk);
export { parallel, sequential, all, successful };
