import config from '../../config';

describe('config', () => {
  it('exports two directives', () => {
    expect(config.length).toBe(2);
  });
});
