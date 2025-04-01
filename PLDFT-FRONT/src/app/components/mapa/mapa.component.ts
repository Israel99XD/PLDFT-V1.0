import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as Papa from 'papaparse';
import * as L from 'leaflet';

interface Coordenadas {
  lat: number;
  lon: number;
}

interface CSVData {
  estado: any;
  Entidad: string;
  'Tipo de delito': string;
}

const iconoPersonalizado = L.icon({
  iconUrl: 'assets/marker-icon.png',
  shadowUrl: 'assets/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const coordenadasEstadosRaw: { [key: string]: Coordenadas } = {
  "aguascalientes": { lat: 21.8853, lon: -102.2916 },
  "baja california": { lat: 32.6548, lon: -115.4523 },
  "baja california sur": { lat: 24.1426, lon: -110.3128 },
  "campeche": { lat: 19.8301, lon: -90.5349 },
  "chiapas": { lat: 16.7569, lon: -93.1292 },
  "chihuahua": { lat: 28.6326, lon: -106.0691 },
  "ciudad de mexico": { lat: 19.4326, lon: -99.1332 },
  "coahuila de zaragoza": { lat: 27.0587, lon: -101.7068 },
  "colima": { lat: 19.2452, lon: -103.7241 },
  "durango": { lat: 24.5593, lon: -104.6588 },
  "estado de mexico": { lat: 19.3587, lon: -99.7591 },
  "guanajuato": { lat: 21.019, lon: -101.2574 },
  "guerrero": { lat: 17.4392, lon: -99.5451 },
  "hidalgo": { lat: 20.0911, lon: -98.7624 },
  "jalisco": { lat: 20.6595, lon: -103.3496 },
  "michoacan de ocampo": { lat: 19.5665, lon: -101.7068 },
  "morelos": { lat: 18.6813, lon: -99.1013 },
  "nayarit": { lat: 21.7514, lon: -104.8455 },
  "nuevo leon": { lat: 25.5922, lon: -99.9962 },
  "oaxaca": { lat: 17.0732, lon: -96.7266 },
  "puebla": { lat: 19.0414, lon: -98.2063 },
  "queretaro": { lat: 20.5888, lon: -100.3899 },
  "quintana roo": { lat: 19.1817, lon: -88.4791 },
  "san luis potosi": { lat: 22.1565, lon: -100.9855 },
  "sinaloa": { lat: 25.1721, lon: -107.4795 },
  "sonora": { lat: 29.0729, lon: -110.9559 },
  "tabasco": { lat: 18.0043, lon: -92.9391 },
  "tamaulipas": { lat: 24.2669, lon: -98.8363 },
  "tlaxcala": { lat: 19.3139, lon: -98.2401 },
  "veracruz de ignacio de la llave": { lat: 19.1738, lon: -96.1342 },
  "yucatan": { lat: 20.7099, lon: -89.0943 },
  "zacatecas": { lat: 22.7709, lon: -102.5832 }
};


const coordenadasEstados: { [key: string]: Coordenadas } = Object.keys(coordenadasEstadosRaw).reduce((acc, estado) => {
  acc[estado] = coordenadasEstadosRaw[estado];
  return acc;
}, {} as { [key: string]: Coordenadas });

@Component({
  selector: 'app-mapa',
  standalone: true,
  imports: [ CommonModule], 
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.scss']
})
export class MapaComponent implements OnInit, AfterViewInit {
  datosCSV: CSVData[] = [];
  mapa: any;
  datosAgrupados: { [estado: string]: CSVData[]; } | undefined;
  delitos: any;

  constructor() { }

  ngOnInit() {
    this.cargarCSV();
  }

  ngAfterViewInit() {
    this.inicializarMapa();
  }

  inicializarMapa() {
    this.mapa = L.map('mapa').setView([23.6345, -102.5528], 6); // Inicia el mapa en la posición central de México

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.mapa);
  }

  async cargarCSV() {
    try {
      const response = await fetch('assets/IDEFC_NM_feb25.csv');
      if (!response.ok) throw new Error('No se pudo cargar el archivo CSV');

      const csvText = await response.text();

      Papa.parse(csvText, {
        header: true,
        dynamicTyping: true,
        complete: (result) => {
          this.datosCSV = result.data as CSVData[];
          console.log("Datos CSV cargados:", this.datosCSV);
          this.agruparDelitosPorEstado();
        },
        error: (error: any) => {
          console.error("Error al procesar el CSV:", error);
        },
        encoding: "UTF-8"
      });
    } catch (error) {
      console.error("Error al obtener el archivo CSV:", error);
    }
  }

  agruparDelitosPorEstado() {
    const delitosPorEstado: { [estado: string]: string[] } = {};
  
    this.datosCSV.forEach((fila) => {
      const estado = fila.Entidad ? this.normalizarTexto(String(fila.Entidad)) : "desconocido";
  
      if (!delitosPorEstado[estado]) {
        delitosPorEstado[estado] = [];
      }
  
      const tipoDeDelito = fila['Tipo de delito'];
      if (tipoDeDelito && !delitosPorEstado[estado].includes(tipoDeDelito)) {
        delitosPorEstado[estado].push(tipoDeDelito);
      }
    });
  
    this.marcarEstados(delitosPorEstado);
  }
  

  marcarEstados(delitosPorEstado: { [key: string]: string[] }) {
    Object.keys(delitosPorEstado).forEach((estado) => {
      const coordenadas = coordenadasEstados[estado];
      if (coordenadas) {
        const delitos = delitosPorEstado[estado].map(delito => `<br>• ${this.normalizarTexto(delito)}`).join("");

        const contenidoPopup = `
          <b>${estado.toUpperCase()}</b><br>
          <div class="delitos-container">
            Delitos:${delitos}
          </div>
        `;

        L.marker([coordenadas.lat, coordenadas.lon], { icon: iconoPersonalizado })
          .addTo(this.mapa)
          .bindPopup(contenidoPopup);
      } else {
        console.warn(`No se encontraron coordenadas para: ${estado}`);
      }
    });
  }

  normalizarTexto(texto: string): string {
    return texto
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim();
  }
}
