import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { BannerService } from './banner.service';
import { BannerData } from '@app/core/models/banner-data.model';

describe('BannerService', () => {
  let service: BannerService;
  let msgText: string;
  let iconText: string;
  let confirmText: string;
  let dismissText: string;
  let confirmCb: jasmine.Spy;
  let dismissCb: jasmine.Spy;
  let delayBetMsgs: number;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BannerService);
  });

  beforeEach(() => {
    msgText = "test message";
    iconText = "icon";
    confirmText = "Confirm button";
    dismissText = "Dismiss button";
    confirmCb = jasmine.createSpy();
    dismissCb = jasmine.createSpy();
    delayBetMsgs = service.DISMISS_TO_NEXT_DATA_DELAY;
  });

  it('should have display = false for initial message value', fakeAsync(() => {
    checkObservableValue(false);
  }));

  function checkObservableValue(isShow: boolean): void {
    let checked = false;
    const subs = service.message$.subscribe(
      (msg) => {
        if (isShow) {
          checkMsgContent(msg);
        } else {
          expect(msg.show).toBe(false);
        }
        checked = true;
      },
      (err) => {
        fail("Should not fail, err = " + err);
      }
    );
    subs.unsubscribe();

    if(!checked) {
      fail("did not check the observed value.");
    }
  }

  function checkMsgContent(msg: BannerData) {
    expect(msg.show).toBe(true);
    expect(msg.text).toBe(msgText);
    expect(msg.icon).toBe(iconText);
    expect(msg.confirmBtnTxt).toBe(confirmText);
    expect(msg.dismissBtnTxt).toBe(dismissText);
  }

  it('should show the message when adding new message', fakeAsync(() => {
    service.addMessage(msgText, iconText, confirmText, confirmCb, dismissText, dismissCb);
    checkObservableValue(true);
  }));

  it('should dismiss the message when dismissing message', fakeAsync(() => {
    service.addMessage(msgText, iconText, confirmText, confirmCb, dismissText, dismissCb);
    tick();
    service.dismissMessage();
    checkObservableValue(false);
    tick();
  }));

  it('should call dismiss callback function when dismissing message', fakeAsync(() => {
    service.addMessage(msgText, iconText, confirmText, confirmCb, dismissText, dismissCb);
    tick();
    service.dismissMessage();
    expect(dismissCb).toHaveBeenCalledTimes(1);
    tick();
  }));

  it('should call confirm callback function when confirming message', fakeAsync(() => {
    service.addMessage(msgText, iconText, confirmText, confirmCb, dismissText, dismissCb);
    service.confirmMessage();
    expect(confirmCb).toHaveBeenCalledTimes(1);
  }));

  it('should send next message after dismiss', fakeAsync(() => {
    service.addMessage("msg1", "msg1", "msg1", () => {});
    service.addMessage(msgText, iconText, confirmText, confirmCb, dismissText, dismissCb);
    tick();
    service.dismissMessage();
    checkObservableValue(false);
    tick();
    checkObservableValue(true);
  }));

  it('should return false for hasMessage if it does not have a message with that ID', () => {
    const msgId = service.addMessage(msgText, iconText, confirmText, confirmCb, dismissText, dismissCb);
    expect(service.hasMessage("id that should not match")).toBe(false);
  });

  it('should return true for hasMessage if it has a message with that ID (current message)', () => {
    const msgId = service.addMessage(msgText, iconText, confirmText, confirmCb, dismissText, dismissCb);
    expect(service.hasMessage(msgId)).toBe(true);
  });

  it('should return true for hasMessage if it has a message with that ID (queued message)', () => {
    service.addMessage("msg1", "msg1", "msg1", () => {});
    const msgId = service.addMessage(msgText, iconText, confirmText, confirmCb, dismissText, dismissCb);
    expect(service.hasMessage(msgId)).toBe(true);
  });

  it('should dismiss the message when cancelling active message', fakeAsync(() => {
    const msgId = service.addMessage(msgText, iconText, confirmText, confirmCb, dismissText, dismissCb);
    tick();
    service.cancelMessage(msgId);
    checkObservableValue(false);
    tick();
  }));

  it('should send next message after cancelling active message', fakeAsync(() => {
    const msgId = service.addMessage("msg1", "msg1", "msg1", () => {});
    service.addMessage(msgText, iconText, confirmText, confirmCb, dismissText, dismissCb);
    tick();
    service.cancelMessage(msgId);
    checkObservableValue(false);
    tick();
    checkObservableValue(true);
  }));

  it('should cancel an item in the queue', fakeAsync(() => {
    service.addMessage("msg1", "msg1", "msg1", () => {});
    const msgId = service.addMessage("msg2", "msg2", "msg2", () => {});
    service.addMessage(msgText, iconText, confirmText, confirmCb, dismissText, dismissCb);
    tick();
    service.cancelMessage(msgId);
    service.dismissMessage();
    tick();
    checkObservableValue(true);
  }));

  it('should send next message with delay after dismiss', fakeAsync(() => {
    tick(delayBetMsgs);
    service.addMessage("msg1", "msg1", "msg1", () => {});
    service.addMessage(msgText, iconText, confirmText, confirmCb, dismissText, dismissCb);
    tick();

    service.dismissMessage();
    let count = 0;
    let startDate;
    const sub = service.message$.subscribe(
      () => {
        count++;
        if (count === 1) {
          startDate = Date.now()
        } else if (count === 2) {
          expect(Date.now() - startDate).toBe(delayBetMsgs);
        }
      },
      (err) => {
        fail("Should not fail, err = " + err);
      }
    )
    tick(2 * delayBetMsgs);
    sub.unsubscribe();
    expect(count).toBe(2);
  }));

  it('should ignore messages during the delay except the last', fakeAsync(() => {
    tick(delayBetMsgs);
    service.addMessage("msg1", "msg1", "msg1", () => {});
    const msgId1 = service.addMessage("msg2", "msg2", "msg2", () => {});
    const msgId2 = service.addMessage("msg2", "msg2", "msg2", () => {});
    const msgId3 = service.addMessage("msg2", "msg2", "msg2", () => {});
    service.addMessage(msgText, iconText, confirmText, confirmCb, dismissText, dismissCb);
    tick();

    service.dismissMessage();
    let count = 0;
    const sub = service.message$.subscribe(
      (msg) => {
        count++;
        if (count === 2) {
          expect(msg.show).toBe(true);
          expect(msg.text).toBe(msgText);
          expect(msg.icon).toBe(iconText);
          expect(msg.confirmBtnTxt).toBe(confirmText);
          expect(msg.dismissBtnTxt).toBe(dismissText);
        }
      },
      (err) => {
        fail("Should not fail, err = " + err);
      }
    )
    tick(10);
    service.cancelMessage(msgId1);
    tick(10);
    service.cancelMessage(msgId2);
    tick(10);
    service.cancelMessage(msgId3);
    tick(delayBetMsgs - 30);

    sub.unsubscribe();
    expect(count).toBe(2);
  }));

  it('should ignore messages if all of them were cancelled', fakeAsync(() => {
    tick(delayBetMsgs);
    service.addMessage("msg1", "msg1", "msg1", () => {});
    const msgId1 = service.addMessage("msg2", "msg2", "msg2", () => {});
    const msgId2 = service.addMessage("msg3", "msg3", "msg3", () => {});
    const msgId3 = service.addMessage("msg4", "msg4", "msg4", () => {});
    tick();

    service.dismissMessage();
    let count = 0;
    const sub = service.message$.subscribe(
      (msg) => {
        count++;
        expect(msg.show).toBe(false);
      },
      (err) => {
        fail("Should not fail, err = " + err);
      }
    )
    tick(10);
    service.cancelMessage(msgId1);
    tick(10);
    service.cancelMessage(msgId2);
    tick(10);
    service.cancelMessage(msgId3);
    tick(delayBetMsgs);

    sub.unsubscribe();
    expect(count).toBe(1);
  }));
});
