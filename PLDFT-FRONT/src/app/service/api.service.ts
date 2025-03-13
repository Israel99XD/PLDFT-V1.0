import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import * as xml2js from 'xml2js'; // Asegúrate de esta importación

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = 'http://localhost:8080'; // URL del backend
  private baseUrls = 'https://sanctionslistservice.ofac.treas.gov';
  private apiUrl = 'https://sanctionslistservice.ofac.treas.gov/entities';

  constructor(private http: HttpClient) { }

  // Configuración de headers con el encabezado 'Accept: application/json'
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json', // Asegura que se espera JSON
    });
  }

  // Método para obtener los datos de un cliente específico
  getClienteData(codigo: string, perfil: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get(`${this.baseUrl}/getClienteData/${codigo}/${perfil}`, { headers });
  }

  // Método para obtener los clientes del perfil M
  getClientesM(codigo: string, perfil: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get(`${this.baseUrl}/getClientesM/${codigo}/${perfil}`, { headers });
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

  // **Nuevo método para contar clientes por perfil**
  contarClientesFisicos(codigo: string, perfil: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get(
      `${this.baseUrl}/contarClientesFisicos/${codigo}/${perfil}`, { headers });
  }

  // **Nuevo método para el perfil transaccional**
  getPerfilT(codigo: string, perfil: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get(
      `${this.baseUrl}/getPerfilT/${codigo}/${perfil}`, { headers });
  }

  // Obtener todas las entidades
  getEntities(): Observable<any> {
    return this.http.get(`${this.baseUrls}/entities`, { headers: this.getHeaders() });
  }

  // Obtener entidad por ID
  getEntityById(entityId: string): Observable<any> {
    return this.http.get(`${this.baseUrls}/entities/${entityId}`, { headers: this.getHeaders() });
  }

  // Buscar entidades por lista
  getEntitiesByList(listName: string): Observable<any> {
    return this.http.get(`${this.baseUrls}/entities?list=${listName}`, { headers: this.getHeaders() });
  }

  // Buscar entidades por programa
  getEntitiesByProgram(programName: string): Observable<any> {
    return this.http.get(`${this.baseUrls}/entities?program=${programName}`, { headers: this.getHeaders() });
  }

  // Verificar si la API está funcionando
  checkServiceStatus(): Observable<any> {
    return this.http.get(`${this.baseUrls}/alive`, { headers: this.getHeaders() });
  }

  getEntityByIdAndProgram(entityId: string, programName: string): Observable<any> {
    const url = `${this.apiUrl}?Id=${entityId}&Program=${programName}`;
    return new Observable<any>((observer) => {
      this.http.get(url, { headers: new HttpHeaders(), responseType: 'text' }).subscribe(
        (xmlResponse) => {
          xml2js.parseString(xmlResponse, { explicitArray: false }, (err, result) => {
            if (err) {
              observer.error('Error al procesar XML');
            } else {
              observer.next(result); // Devuelve el JSON convertido
            }
          });
        },
        (error) => {
          observer.error('Error al obtener datos');
        }
      );
    });
  }

}
