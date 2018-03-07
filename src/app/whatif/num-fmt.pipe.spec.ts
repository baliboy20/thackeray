import { NumFmtPipe } from './num-fmt.pipe';

xdescribe('NumFmtPipe', () => {
  it('create an instance', () => {
    const pipe = new NumFmtPipe();
    expect(pipe).toBeTruthy();
  });
});
