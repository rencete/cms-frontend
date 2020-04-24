import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Subject, Observable } from 'rxjs';

import { ErrorDisplayComponent } from './error-display.component';
import { ErrorStoreService } from '@app/error/services/error-store.service';
import { ErrorModel } from '@app/error/models/error.model';
import { AngularMaterialModule } from '@app/core/angular-material/angular-material.module';

xdescribe('ErrorDisplayComponent', () => {
  let component: ErrorDisplayComponent;
  let fixture: ComponentFixture<ErrorDisplayComponent>;
  let mockErrorDisplayService: {
    getUnreadErrors : jasmine.Spy;
    subj : Subject<ErrorModel>;
    newErrorAdded$ : Observable<ErrorModel>;
  };
  let componentNativeElement: HTMLElement;

  beforeEach(async(() => {
    mockErrorDisplayService = jasmine.createSpyObj("ErrorDisplayService", ["getUnreadErrors"]);
    mockErrorDisplayService.subj = new Subject<ErrorModel>();
    mockErrorDisplayService.newErrorAdded$ = mockErrorDisplayService.subj.asObservable();
    mockErrorDisplayService.getUnreadErrors.and.callFake(() => {
      return [
        new ErrorModel(new TypeError("Error 1")),
        new ErrorModel(new SyntaxError("Error 2")),
        new ErrorModel(new URIError("Error 3"))
      ]
    });

    TestBed.configureTestingModule({
      declarations: [ErrorDisplayComponent],
      imports: [
        AngularMaterialModule
      ],
      providers: [
        { provide: ErrorStoreService, useValue: mockErrorDisplayService }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    componentNativeElement = fixture.debugElement.nativeElement;
  });

  beforeEach(() => {
    component.ngOnInit();
    fixture.detectChanges();
  });

  it('should display retrieved errors from service on init', () => {
    const cards = componentNativeElement.querySelectorAll(".errors-container__card");
    expect(cards.length).toBe(3);
  });

  it('updates errors when a new one is added', () => {
    const errorToAdd = new Error("New error");
    mockErrorDisplayService.getUnreadErrors.and.callFake(() => {
      return [
        new ErrorModel(new TypeError("Error 1")),
        new ErrorModel(new SyntaxError("Error 2")),
        new ErrorModel(new URIError("Error 3")),
        new ErrorModel(errorToAdd)
      ]
    });
    mockErrorDisplayService.subj.next(new ErrorModel(errorToAdd));
    fixture.detectChanges();

    const cards = componentNativeElement.querySelectorAll(".errors-container__card");
    expect(cards.length).toBe(4);
  });

  xit('updates errors when an error is dismissed', () => {
    const buttons = componentNativeElement.querySelectorAll(".errors-container__card button");
    mockErrorDisplayService.getUnreadErrors.and.callFake(() => {
      return [
        new ErrorModel(new TypeError("Error 1")),
        new ErrorModel(new URIError("Error 3"))
      ]
    });
    (<HTMLButtonElement> buttons[1]).click();
    fixture.detectChanges();

    const cards = componentNativeElement.querySelectorAll(".errors-container__card");
    expect(cards.length).toBe(2);
  });
});
