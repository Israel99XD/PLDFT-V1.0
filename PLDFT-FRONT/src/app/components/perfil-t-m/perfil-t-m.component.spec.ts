import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilTMComponent } from './perfil-t-m.component';

describe('PerfilTMComponent', () => {
  let component: PerfilTMComponent;
  let fixture: ComponentFixture<PerfilTMComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerfilTMComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerfilTMComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
