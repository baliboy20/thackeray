import { NumFmtPipe } from './num-fmt.pipe';

describe('NumFmtPipe', () => {
  it('create an instance', () => {
    const pipe = new NumFmtPipe();
    expect(pipe).toBeTruthy();
  });
});
