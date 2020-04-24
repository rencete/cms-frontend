import { ErrorModel } from './error.model';

describe('ErrorDisplayModel', () => {
  it('should accept an Error to create an instance', () => {
    expect(new ErrorModel(new Error("test"))).toBeTruthy();
  });

  it('should accept custom Error when creating an instance', () => {
    class TestCustomError extends Error {
      constructor(msg: string) {
        super(msg);
      }
    }

    expect(new ErrorModel(new TestCustomError("test"))).toBeTruthy();
  });

  it('has a toString method which uses the error message', () => {
    const testMessage = "test message";
    const testModel = new ErrorModel(new Error(testMessage));

    expect(testModel.toString()).toMatch(testMessage);
  });

  it("is not read at first", () => {
    expect(new ErrorModel(new Error("test")).isRead).toBe(false);
  });

  it("can be marked as read", () => {
    const testModel = new ErrorModel(new Error("test"));
    testModel.markAsRead();

    expect(testModel.isRead).toBe(true);
  });
});
