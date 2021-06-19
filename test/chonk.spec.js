import { expect } from 'chai';
import chonk, { parallel, all } from '../src/index.js';

describe('chonk', function () {
  // NOTE: this is a pretty lacking test suite, but who really wants to test this thing...
  it('should work', async function () {
    async function* processor(item) {
      // complicated computation
      const double = item * 2;
      const sum = yield double;
      return sum + item;
    }

    async function* sequencer() {
      const results = all(yield parallel());
      return all(yield parallel(results.reduce((a, b) => a + b, 0)));
    }

    const chonker = chonk(sequencer, processor);
    expect(await chonker([1, 2, 3])).to.deep.equal([13, 14, 15]);
  });
});
