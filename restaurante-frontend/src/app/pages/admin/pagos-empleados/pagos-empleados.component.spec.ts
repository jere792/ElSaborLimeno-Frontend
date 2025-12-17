import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagosEmpleadosComponent } from './pagos-empleados.component';

describe('PagosEmpleadosComponent', () => {
  let component: PagosEmpleadosComponent;
  let fixture: ComponentFixture<PagosEmpleadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PagosEmpleadosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PagosEmpleadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
