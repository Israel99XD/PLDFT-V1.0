import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilTComponent } from './perfil-t.component';

describe('PerfilTComponent', () => {
  let component: PerfilTComponent;
  let fixture: ComponentFixture<PerfilTComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerfilTComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerfilTComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
