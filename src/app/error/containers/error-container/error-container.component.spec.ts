import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs';

import { ErrorContainerComponent } from './error-container.component';
import { ErrorFacade } from '@app/error/services/error-facade.service';
import { ErrorData } from '@app/error/models/error-data.model';
import { By } from '@angular/platform-browser';

describe('ErrorContainerComponent', () => {
  let component: ErrorContainerComponent;
  let fixture: ComponentFixture<ErrorContainerComponent>;

  const testData: ErrorData[] = [
    {
      id: "id1",
      name: "Error 1",
      message: "This is the 1st sample generated error."
    },
    {
      id: "id2",
      name: "Error 2",
      message: "This is the 2nd sample generated error."
    },
    {
      id: "id3",
      name: "Error 3",
      message: "This is the 3rd sample generated error."
    }
  ];
  let mockFacade: {
    getUnreadErrors: jasmine.Spy,
    markErrorAsRead: jasmine.Spy
  };

  beforeEach(async(() => {
    mockFacade = jasmine.createSpyObj("ErrorFacade", ["getUnreadErrors", "markErrorAsRead"]);
    mockFacade.getUnreadErrors.and.callFake(() => {
      return new Observable<ErrorData[]>((subs) => {
        subs.next(testData);
      });
    });

    TestBed.configureTestingModule({
      declarations: [ ErrorContainerComponent ],
      providers: [
        { provide: ErrorFacade, useValue: mockFacade }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should retrieve unread errors from observable', (done) => {
    const obs = component.errors$;
    obs.subscribe(
      (values) => {
        expect(values).toEqual(testData);
        done();
      },
      (err) => {
        fail("Should not error, error received = " + err)
      }
    );
  });

  it('should handle dismiss event and sent to facade to markAsRead', () => {
    const testId = "test-id";
    const debugElement = fixture.debugElement.query(By.css("error-list"));
    debugElement.triggerEventHandler("dismiss", testId);
    fixture.detectChanges;
    expect(mockFacade.markErrorAsRead).toHaveBeenCalledWith(testId);
  });
});
