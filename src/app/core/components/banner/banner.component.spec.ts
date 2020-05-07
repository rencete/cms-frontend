import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { Subject } from 'rxjs';

import { BannerComponent } from './banner.component';
import { BannerData } from '@app/core/models/banner-data.model';

describe('BannerComponent', () => {
  let component: BannerComponent;
  let fixture: ComponentFixture<BannerComponent>;
  let componentNativeElement: HTMLElement;
  let messageText: string = "This is a test banner text.";
  let iconText: string = "Icon";
  let confirmBtnText: string = "CONFIRM TEXT";
  let dismissBtnText: string = "DISMISS TEXT";
  let input$: Subject<BannerData>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        MatIconModule
      ],
      declarations: [
        BannerComponent
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BannerComponent);
    component = fixture.componentInstance;
    input$ = new Subject<BannerData>();
    component.message$ = input$.asObservable();
    componentNativeElement = fixture.debugElement.nativeElement;
    fixture.detectChanges();
  });

  it('should not display if message.show = false', () => {
    input$.next({ show: false });
    fixture.detectChanges();
    const divElement = componentNativeElement.querySelector("div");
    expect(divElement).toBeFalsy();
  });

  it('should display if message.show = true', () => {
    input$.next({
      show: true
    });
    fixture.detectChanges();

    const divElement = componentNativeElement.querySelector("div");
    expect(divElement).toBeTruthy();
  });

  it('should display correct texts', () => {
    input$.next({
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

  it('should not display icon if icon text is not provided', () => {
    input$.next({
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

  it('should not display dismiss button if dismiss text is not provided', () => {
    input$.next({
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

  it('should not display confirm button if confirm text is not provided', () => {
    input$.next({
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

  it('should emit dismiss event when clicking dismiss button', async(() => {
    let count = 0;
    component.dismiss.subscribe(
      () => {
        count++;
      },
      (err) => {
        fail("Should not error, err = " + err);
      }
    )

    input$.next({
      show: true,
      text: messageText,
      dismissBtnTxt: dismissBtnText
    });
    fixture.detectChanges();
    const dismissBtnElement = componentNativeElement.querySelector("button");
    dismissBtnElement.click();
    fixture.detectChanges();
    expect(count).toBe(1);
  }));

  it('should emit confirm event when clicking confirm button', () => {
    let count = 0;
    component.confirm.subscribe(
      () => {
        count++;
      },
      (err) => {
        fail("Should not error, err = " + err);
      }
    )

    input$.next({
      show: true,
      text: messageText,
      confirmBtnTxt: confirmBtnText
    });
    fixture.detectChanges();
    const confirmBtnElement = componentNativeElement.querySelector("button");
    confirmBtnElement.click();
    fixture.detectChanges();

    expect(count).toBe(1);
  });
});
