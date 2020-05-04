import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, timer, empty, asapScheduler } from 'rxjs';
import { map, distinctUntilChanged, throttle } from 'rxjs/operators';
import { nanoid } from "nanoid";

import { BannerData } from '@app/core/models/banner-data.model';

@Injectable({
  providedIn: 'root'
})
export class BannerService {
  public readonly DISMISS_TO_NEXT_DATA_DELAY = 550;
  public message$: Observable<BannerData>;

  private currentMsg: BehaviorSubject<BannerMessage>;
  private queuedMsgs: Array<BannerMessage>;

  constructor() {
    this.queuedMsgs = new Array<BannerMessage>();
    this.currentMsg = new BehaviorSubject<BannerMessage>(null);
    this.message$ = this.buildMessageObservable();
  }

  private buildMessageObservable(): Observable<BannerData> {
    const source$ = this.currentMsg.asObservable();
    const throttledObs$ = source$.pipe(
      throttle((val) => {
        if (val === null) {
          return timer(this.DISMISS_TO_NEXT_DATA_DELAY);
        } else {
          return empty(asapScheduler)
        }
      }, { leading: true, trailing: true }),
      distinctUntilChanged(),
      map((msg) => this.mapMessageToData(msg))
    );
    return throttledObs$;
  }

  private mapMessageToData(msg: BannerMessage): BannerData {
    if (msg) {
      return {
        show: true,
        icon: msg.icon,
        text: msg.text,
        dismissBtnTxt: msg.dismissBtnTxt,
        confirmBtnTxt: msg.confirmBtnTxt
      }
    }
    return {
      show: false
    }
  }

  addMessage(
    msgTxt: string, iconName: string,
    confirmTxt: string, confirmCb: () => void,
    dismissText: string = "", dissmissCb: () => void = undefined
  ): string {
    const msgId = nanoid();
    const msg: BannerMessage = {
      id: msgId,
      icon: iconName,
      text: msgTxt,
      confirmBtnTxt: confirmTxt,
      confirmCallback: confirmCb,
      dismissBtnTxt: dismissText,
      dismissCallback: dissmissCb
    }
    this.queuedMsgs.push(msg);
    this.sendNextMessage();
    return msgId;
  }

  private sendNextMessage(): void {
    if (!this.hasActiveMessage() && this.queuedMsgs.length) {
      const nextMsg = this.queuedMsgs.shift();
      this.currentMsg.next(nextMsg);
    }
  }

  private hasActiveMessage(): boolean {
    return this.currentMsg.value ? true : false;
  }

  dismissMessage(): void {
    if (this.hasActiveMessage()) {
      const msg = this.currentMsg.value;
      this.currentMsg.next(null);
      if (msg.dismissCallback) {
        msg.dismissCallback();
      }
      setTimeout(() => {
        this.sendNextMessage();
      });
    }
  }

  confirmMessage(): void {
    if (this.hasActiveMessage()) {
      const msg = this.currentMsg.value;
      if (msg.confirmCallback) {
        msg.confirmCallback();
      }
    }
  }

  hasMessage(id: string): boolean {
    if (this.currentMsg.value && this.currentMsg.value.id === id) {
      return true;
    }
    return this.queuedMsgs.some((msg) => msg.id === id);
  }

  cancelMessage(id: string): void {
    if (this.currentMsg.value && this.currentMsg.value.id === id) {
      this.dismissMessage();
    }
    else {
      const index = this.queuedMsgs.findIndex((msg) => msg.id === id)
      if (index !== undefined) {
        this.queuedMsgs.splice(index, 1);
      }
    }
  }
}

class BannerMessage {
  id: string;
  icon: string;
  text: string;
  confirmBtnTxt: string;
  confirmCallback: () => void;
  dismissBtnTxt: string;
  dismissCallback: () => void;
}
