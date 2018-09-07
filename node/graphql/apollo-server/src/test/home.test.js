import Nightmare from 'nightmare';
import { BASE_URL } from './test_config';

beforeAll(() => {
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
});

describe('The home page', () => {
  it('has title "React Apollo Koa Example"', async () => {
    const title = await Nightmare()
      .goto(`${BASE_URL}`)
      .evaluate(() => document.title)
      .end();
    expect(title).toEqual('React Apollo Koa Example');
  });
});
