import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { Subject } from 'rxjs';

import { BannerComponent } from './banner.component';
import { BannerData } from '@app/core/models/banner-data.model';
import { BannerService } from '@app/core/services/banner/banner.service';

describe('BannerComponent', () => {
  let component: BannerComponent;
  let fixture: ComponentFixture<BannerComponent>;
  let componentNativeElement: HTMLElement;
  let mockService: {
    message$: Subject<BannerData>,
    dismissMessage: jasmine.Spy,
    confirmMessage: jasmine.Spy
  }
  let messageText: string = "This is a test banner text.";
  let iconText: string = "Icon";
  let confirmBtnText: string = "CONFIRM TEXT";
  let dismissBtnText: string = "DISMISS TEXT";

  beforeEach(async(() => {
    mockService = jasmine.createSpyObj("BannerService", ["dismissMessage", "confirmMessage"]);
    mockService.message$ = new Subject<BannerData>();

    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        MatIconModule
      ],
      declarations: [
        BannerComponent
      ],
      providers: [
        { provide: BannerService, useValue: mockService }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BannerComponent);
    component = fixture.componentInstance;
    componentNativeElement = fixture.debugElement.nativeElement;
    fixture.detectChanges();
  });

  it('should not display if message.show = false', () => {
    mockService.message$.next({ show: false });
    fixture.detectChanges();
    const divElement = componentNativeElement.querySelector("div");
    expect(divElement).toBeFalsy();
  });

  it('should display if message.show = true', () => {
    mockService.message$.next({
      show: true
    });
    fixture.detectChanges();

    const divElement = componentNativeElement.querySelector("div");
    expect(divElement).toBeTruthy();
  });

  it('should display correct texts', () => {
    mockService.message$.next({
      show: true,
      icon: iconText,
      text: messageText,
      confirmBtnTxt: confirmBtnText,
      dismissBtnTxt: dismissBtnText
    });
    fixture.detectChanges();

    const iconElement = componentNativeElement.querySelector("mat-icon");
    const pElement = componentNativeElement.querySelector("p");
    const buttonElements = componentNativeElement.querySelectorAll("button");
    expect(iconElement.textContent).toEqual(iconText);
    expect(pElement.textContent).toEqual(messageText);
    expect(buttonElements[0].textContent).toEqual(dismissBtnText);
    expect(buttonElements[1].textContent).toEqual(confirmBtnText);
  });

  it('should display not display icon if icon text is not provided', () => {
    mockService.message$.next({
      show: true,
      icon: "",
      text: messageText,
      confirmBtnTxt: confirmBtnText,
      dismissBtnTxt: dismissBtnText
    });
    fixture.detectChanges();

    const iconElement = componentNativeElement.querySelector("mat-icon");
    expect(iconElement).toBeFalsy();
  });

  it('should display not display dismiss button if dismiss text is not provided', () => {
    mockService.message$.next({
      show: true,
      icon: iconText,
      text: messageText,
      confirmBtnTxt: confirmBtnText,
      dismissBtnTxt: ""
    });
    fixture.detectChanges();

    const buttonElements = componentNativeElement.querySelectorAll("button");
    expect(buttonElements.length).toBe(1);
    expect(buttonElements[0].textContent).toEqual(confirmBtnText);
  });

  it('should display not display confirm button if confirm text is not provided', () => {
    mockService.message$.next({
      show: true,
      icon: iconText,
      text: messageText,
      confirmBtnTxt: "",
      dismissBtnTxt: dismissBtnText
    });
    fixture.detectChanges();

    const buttonElements = componentNativeElement.querySelectorAll("button");
    expect(buttonElements.length).toBe(1);
    expect(buttonElements[buttonElements.length-1].textContent).toEqual(dismissBtnText);
  });

  it('should call banner service dismissMessage when clicking dismiss button', () => {
    mockService.message$.next({
      show: true,
      text: messageText,
      dismissBtnTxt: dismissBtnText
    });
    fixture.detectChanges();
    const dismissBtnElement = componentNativeElement.querySelector("button");
    dismissBtnElement.click();
    fixture.detectChanges();

    expect(mockService.dismissMessage).toHaveBeenCalledTimes(1);
  });

  it('should call banner service confirmMessage when clicking confirm button', () => {
    mockService.message$.next({
      show: true,
      text: messageText,
      confirmBtnTxt: confirmBtnText
    });
    fixture.detectChanges();
    const confirmBtnElement = componentNativeElement.querySelector("button");
    confirmBtnElement.click();
    fixture.detectChanges();

    expect(mockService.confirmMessage).toHaveBeenCalledTimes(1);
  });
});
