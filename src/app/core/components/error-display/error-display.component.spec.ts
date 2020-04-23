import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Subject, Observable } from 'rxjs';

import { ErrorDisplayComponent } from './error-display.component';
import { ErrorDisplayService } from '@app/core/services/error-display/error-display.service';
import { ErrorDisplayModel } from '@app/core/models/error-display/error-display-model';
import { AngularMaterialModule } from '@app/core/angular-material/angular-material.module';

describe('ErrorDisplayComponent', () => {
  let component: ErrorDisplayComponent;
  let fixture: ComponentFixture<ErrorDisplayComponent>;
  let mockErrorDisplayService: {
    getUnreadErrors : jasmine.Spy;
    subj : Subject<ErrorDisplayModel>;
    newErrorAdded$ : Observable<ErrorDisplayModel>;
  };
  let componentNativeElement: HTMLElement;

  beforeEach(async(() => {
    mockErrorDisplayService = jasmine.createSpyObj("ErrorDisplayService", ["getUnreadErrors"]);
    mockErrorDisplayService.subj = new Subject<ErrorDisplayModel>();
    mockErrorDisplayService.newErrorAdded$ = mockErrorDisplayService.subj.asObservable();
    mockErrorDisplayService.getUnreadErrors.and.callFake(() => {
      return [
        new ErrorDisplayModel(new TypeError("Error 1")),
        new ErrorDisplayModel(new SyntaxError("Error 2")),
        new ErrorDisplayModel(new URIError("Error 3"))
      ]
    });

    TestBed.configureTestingModule({
      declarations: [ErrorDisplayComponent],
      imports: [
        AngularMaterialModule
      ],
      providers: [
        { provide: ErrorDisplayService, useValue: mockErrorDisplayService }
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
        new ErrorDisplayModel(new TypeError("Error 1")),
        new ErrorDisplayModel(new SyntaxError("Error 2")),
        new ErrorDisplayModel(new URIError("Error 3")),
        new ErrorDisplayModel(errorToAdd)
      ]
    });
    mockErrorDisplayService.subj.next(new ErrorDisplayModel(errorToAdd));
    fixture.detectChanges();

    const cards = componentNativeElement.querySelectorAll(".errors-container__card");
    expect(cards.length).toBe(4);
  });

  xit('updates errors when an error is dismissed', () => {
    const buttons = componentNativeElement.querySelectorAll(".errors-container__card button");
    mockErrorDisplayService.getUnreadErrors.and.callFake(() => {
      return [
        new ErrorDisplayModel(new TypeError("Error 1")),
        new ErrorDisplayModel(new URIError("Error 3"))
      ]
    });
    (<HTMLButtonElement> buttons[1]).click();
    fixture.detectChanges();

    const cards = componentNativeElement.querySelectorAll(".errors-container__card");
    expect(cards.length).toBe(2);
  });
});
