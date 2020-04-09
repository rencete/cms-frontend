import { ErrorDisplayModel } from './error-display-model';

describe('ErrorDisplayModel', () => {
  it('should accept an Error to create an instance', () => {
    expect(new ErrorDisplayModel(new Error("test"))).toBeTruthy();
  });

  it('should accept custom Error when creating an instance', () => {
    class TestCustomError extends Error {
      constructor(msg: string) {
        super(msg);
      }
    }

    expect(new ErrorDisplayModel(new TestCustomError("test"))).toBeTruthy();
  });

  it('has a toString method which uses the error message', () => {
    const testMessage = "test message";
    const testModel = new ErrorDisplayModel(new Error(testMessage));

    expect(testModel.toString()).toMatch(testMessage);
  });

  it("is not read at first", () => {
    expect(new ErrorDisplayModel(new Error("test")).isRead).toBe(false);
  });

  it("can be marked as read", () => {
    const testModel = new ErrorDisplayModel(new Error("test"));
    testModel.markAsRead();

    expect(testModel.isRead).toBe(true);
  });
});
