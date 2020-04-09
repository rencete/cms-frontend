import { ErrorDisplayModel } from './error-display-model';

describe('ErrorDisplayModel', () => {
  it('should accept an Error to create an instance', () => {
    expect(new ErrorDisplayModel(new Error("test"))).toBeTruthy();
  });
});
