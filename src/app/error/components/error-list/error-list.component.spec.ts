import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorListComponent } from './error-list.component';
import { ErrorData } from '@app/error/models/error-data.model';
import { By } from '@angular/platform-browser';

describe('ErrorListComponent', () => {
  let component: ErrorListComponent;
  let fixture: ComponentFixture<ErrorListComponent>;
  let componentNativeElement: HTMLElement;

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

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ErrorListComponent
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorListComponent);
    component = fixture.componentInstance;
    componentNativeElement = fixture.debugElement.nativeElement;
    component.errors = testData;
    fixture.detectChanges();
  });

  it('should create error-data for each in input', () => {
    const errorDatas = componentNativeElement.querySelectorAll("error-data");
    expect(errorDatas.length).toEqual(3);
  });

  it('should emit event when click dismiss (through triggerEventHandler)', (done) => {
    const testId = "test-id";
    const index = 1;
    component.dismiss.subscribe(
      (id) => {
        expect(id).toEqual(testId);
        done();
      },
      (err) => {
        fail("Should not error, received error = " + err);
      }
    );

    const debugElement = fixture.debugElement.queryAll(By.css("error-data"));
    debugElement[index].triggerEventHandler("dismiss", testId);
    fixture.detectChanges();
  });
});
