import { Component, OnInit } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ActivatedRoute } from '@angular/router';
import { ParseJsonPipe } from '../../parse-json.pipe';
import { MapToPropertyPipe } from '../../map-to-service.pipe';

@Component({
  selector: 'app-perfil-t',
  standalone: true,
  imports: [
    MapToPropertyPipe,
    ParseJsonPipe, 
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatCheckboxModule],
  templateUrl: './perfil-t.component.html',
  styleUrl: './perfil-t.component.scss'
})
export class PerfilTComponent implements OnInit{
  clienteData: any = {};

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const clienteData = sessionStorage.getItem('clienteData');
    if (clienteData) {
      this.clienteData = JSON.parse(clienteData);
    }
  }
  
}
