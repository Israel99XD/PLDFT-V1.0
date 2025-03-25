import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import * as xml2js from 'xml2js'; // Asegúrate de esta importación

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = 'http://localhost:8080'; // URL del backend
  private apiUrl = 'https://sanctionslistservice.ofac.treas.gov';

  constructor(private http: HttpClient) { }

  // Configuración de headers con el encabezado 'Accept: application/json'
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json', // Asegura que se espera JSON
    });
  }

  private parseXmlToJson(xml: string): Observable<any> {
    return new Observable((observer) => {
      xml2js.parseString(xml, { explicitArray: false }, (err, result) => {
        if (err) {
          observer.error('Error al procesar XML');
        } else {
          observer.next(result);
          observer.complete();
        }
      });
    });
  }


  private getJsonResponse(url: string): Observable<any> {
    return new Observable((observer) => {
      this.http.get(url, { headers: this.getHeaders(), responseType: 'text' }).subscribe(
        (xmlResponse) => {
          this.parseXmlToJson(xmlResponse).subscribe(
            (json) => observer.next(json),
            (error) => observer.error(error)
          );
        },
        (error) => observer.error('Error al obtener datos')
      );
    });
  }

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

    return this.http.get(
      `${this.baseUrl}/getPerfilT/${codigo}/${perfil}`, { headers });
  }

  getAllCountries(): Observable<any> {
    return this.getJsonResponse('https://restcountries.com/v3.1/independent?status=true&fields=languages,capital'); //para información geográfica y económica.
  }

  getEntities(): Observable<any> {
    return this.getJsonResponse(`${this.apiUrl}/entities`);
  }

  getPrograms(): Observable<any> {
    return this.http.get(`${this.apiUrl}/sanctions-programs`);
  }

  getEntityById(entityId: string): Observable<any> {
    return this.getJsonResponse(`${this.apiUrl}/entities?id=${entityId}`);
  }

  getEntitiesByList(listName: string): Observable<any> {
    return this.getJsonResponse(`${this.apiUrl}/entities?list=${listName}`);
  }
  
  getEntitiesByName(entityName: string) {
    return this.http.get<any>(`${this.apiUrl}/entities/search?name=${entityName}`);
  }
  

  getEntitiesByProgram(programName: string): Observable<any> {
    return this.getJsonResponse(`${this.apiUrl}/entities?program=${programName}`);
  }

  checkServiceStatus(): Observable<any> {
    return this.getJsonResponse(`${this.apiUrl}/alive`);
  }

  getEntityByIdAndProgram(entityId: string, programName: string): Observable<any> {
    return this.getJsonResponse(`${this.apiUrl}/entities?Id=${entityId}&Program=${programName}`);
  }

  getEntitiesByType(entityType: string): Observable<any> {
    return this.getJsonResponse(`${this.apiUrl}/entities?type=${entityType}`);
  }

  getEntitiesByAddress(address: string): Observable<any> {
    return this.getJsonResponse(`${this.apiUrl}/entities?address=${address}`);
  }

  getEntityByListAndProgram(listName: string, programName: string): Observable<any> {
    return this.getJsonResponse(`${this.apiUrl}/entities?list=${listName}&program=${programName}`);
  }
}
