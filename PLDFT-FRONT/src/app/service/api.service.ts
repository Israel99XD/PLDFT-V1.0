import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = 'http://localhost:8080'; // URL del backend

  constructor(private http: HttpClient) {}

  // Método para obtener los datos de un cliente específico
  getClienteData(codigo: string, perfil: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get(`${this.baseUrl}/getClienteData/${codigo}/${perfil}`, {
      headers,
    });
  }

  // Método para obtener los clientes del perfil M
  getClientesM(codigo: string, perfil: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get(`${this.baseUrl}/getClientesM/${codigo}/${perfil}`, {
      headers,
    });
  }

  // Método para obtener los movimientos de clientes
  getMovimientos(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get(`${this.baseUrl}/getMovimientos`, { headers });
  }

  // Método para obtener las transacciones
  getTransacciones(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get(`${this.baseUrl}/getTransacciones`, { headers });
  }

  // Método para obtener el tipo de cambio de moneda desde el backend
  getTipoCambio(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get(`${this.baseUrl}/getTipoCambio`, { headers });
  }

  // **Nuevo método para contar clientes por perfil**
  contarClientesFisicos(codigo: string, perfil: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get(
      `${this.baseUrl}/contarClientesFisicos/${codigo}/${perfil}`,
      { headers }
    );
  }

  // **Nuevo método para el perfil transaccional**
  getPerfilT(codigo: string, perfil: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get(`${this.baseUrl}/getPerfilT/${codigo}/${perfil}`, {
      headers,
    });
  }
}
