import { TestBed } from '@angular/core/testing';

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
  });

  it('should have display = false for initial message value', (done) => {
    service.message$.subscribe(
      (msg) => {
        expect(msg.show).toBe(false);
        done();
      },
      (err) => {
        fail("Should not fail, err = " + err);
      }
    )
  });

  it('should show the message when adding new message', (done) => {
    let countMsgs = 0;
    service.message$.subscribe(
      (msg) => {
        countMsgs++;
        if (countMsgs === 2) {
          checkMsgContent(msg);
          done();
        }
      },
      (err) => {
        fail("Should not fail, err = " + err);
      }
    )
    service.addMessage(msgText, iconText, confirmText, confirmCb, dismissText, dismissCb);
  });

  function checkMsgContent(msg: BannerData) {
    expect(msg.show).toBe(true);
    expect(msg.text).toBe(msgText);
    expect(msg.icon).toBe(iconText);
    expect(msg.confirmBtnTxt).toBe(confirmText);
    expect(msg.dismissBtnTxt).toBe(dismissText);
  }

  it('should dismiss the message when dismissing message', (done) => {
    let countMsgs = 0;
    service.message$.subscribe(
      (msg) => {
        countMsgs++;
        if (countMsgs === 3) {
          expect(msg.show).toBe(false);
          done();
        }
      },
      (err) => {
        fail("Should not fail, err = " + err);
      }
    )
    service.addMessage(msgText, iconText, confirmText, confirmCb, dismissText, dismissCb);
    service.dismissMessage();
  });

  it('should call dismiss callback function when dismissing message', (done) => {
    dismissCb.and.callFake(() => {
      expect(dismissCb).toHaveBeenCalledTimes(1);
      done();
    });
    service.message$.subscribe(
      (msg) => {
      },
      (err) => {
        fail("Should not fail, err = " + err);
      }
    )
    service.addMessage(msgText, iconText, confirmText, confirmCb, dismissText, dismissCb);
    service.dismissMessage();
  });

  it('should call confirm callback function when confirming message', (done) => {
    confirmCb.and.callFake(() => {
      expect(confirmCb).toHaveBeenCalledTimes(1);
      done();
    });
    service.message$.subscribe(
      (msg) => {
      },
      (err) => {
        fail("Should not fail, err = " + err);
      }
    )
    service.addMessage(msgText, iconText, confirmText, confirmCb, dismissText, dismissCb);
    service.confirmMessage();
  });

  it('should send next message after dismiss', (done) => {
    let countMsgs = 0;
    service.message$.subscribe(
      (msg) => {
        countMsgs++;
        if (countMsgs === 4) {
          checkMsgContent(msg);
          done();
        }
      },
      (err) => {
        fail("Should not fail, err = " + err);
      }
    )
    service.addMessage("msg1", "msg1", "msg1", () => {});
    service.addMessage(msgText, iconText, confirmText, confirmCb, dismissText, dismissCb);
    service.dismissMessage();
  });

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

  it('should dismiss the message when cancelling active message', (done) => {
    let countMsgs = 0;
    service.message$.subscribe(
      (msg) => {
        countMsgs++;
        if (countMsgs === 3) {
          expect(msg.show).toBe(false);
          done();
        }
      },
      (err) => {
        fail("Should not fail, err = " + err);
      }
    )
    const msgId = service.addMessage(msgText, iconText, confirmText, confirmCb, dismissText, dismissCb);
    service.cancelMessage(msgId);
  });

  it('should send next message after cancelling active message', (done) => {
    let countMsgs = 0;
    service.message$.subscribe(
      (msg) => {
        countMsgs++;
        if (countMsgs === 4) {
          checkMsgContent(msg);
          done();
        }
      },
      (err) => {
        fail("Should not fail, err = " + err);
      }
    )
    const msgId = service.addMessage("msg1", "msg1", "msg1", () => {});
    service.addMessage(msgText, iconText, confirmText, confirmCb, dismissText, dismissCb);
    service.cancelMessage(msgId);
  });

  it('should cancel an item in the queue', (done) => {
    let countMsgs = 0;
    service.message$.subscribe(
      (msg) => {
        countMsgs++;
        if (countMsgs === 4) {
          checkMsgContent(msg);
          done();
        }
      },
      (err) => {
        fail("Should not fail, err = " + err);
      }
    )
    service.addMessage("msg1", "msg1", "msg1", () => {});
    const msgId = service.addMessage("msg2", "msg2", "msg2", () => {});
    service.addMessage(msgText, iconText, confirmText, confirmCb, dismissText, dismissCb);
    service.cancelMessage(msgId);
    service.dismissMessage();
  });
});
