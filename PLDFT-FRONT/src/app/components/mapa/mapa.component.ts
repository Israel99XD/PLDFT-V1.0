import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as Papa from 'papaparse';
import * as L from 'leaflet';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);


// Interfaz para definir las coordenadas geográficas (latitud y longitud)
interface Coordenadas {
  lat: number;
  lon: number;
}

// Interfaz que describe la estructura de los datos del CSV
interface CSVData {
  "Año": string;
  "Clave_Ent": string;
  "Entidad": string;
  "Bien jurídico afectado": string;
  "Tipo de delito": string;
  "Subtipo de delito": string;
  "Modalidad": string;
}

// Definición de un icono personalizado para los marcadores en el mapa
const iconoPersonalizado = L.icon({
  iconUrl: 'assets/marker-icon.png', // URL del ícono
  shadowUrl: 'assets/marker-shadow.png', // URL de la sombra del marcador
  iconSize: [25, 41], // Tamaño del ícono
  iconAnchor: [12, 41], // Anclaje del ícono
  popupAnchor: [1, -34], // Ubicación del pop-up respecto al ícono
  shadowSize: [41, 41] // Tamaño de la sombra
});

// Coordenadas geográficas de los estados de México
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


// Conversión del objeto de coordenadas en un objeto inmutable
const coordenadasEstados: { [key: string]: Coordenadas } = Object.keys(coordenadasEstadosRaw).reduce((acc, estado) => {
  acc[estado] = coordenadasEstadosRaw[estado];
  return acc;
}, {} as { [key: string]: Coordenadas });

@Component({
  selector: 'app-mapa',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.scss']
})
export class MapaComponent implements OnInit, AfterViewInit {
  // Propiedades del componente
  datosCSV: CSVData[] = []; // Almacena los datos leídos del CSV
  mapa: any; // Variable que contiene el objeto mapa de Leaflet
  datosAgrupados: { [estado: string]: CSVData[]; } | undefined; // Datos agrupados por estado
  delitos: any; // Información sobre delitos agrupados

  constructor() { }

  ngOnInit() {
    this.cargarCSV()
  }

  ngAfterViewInit() {
    this.inicializarMapa();
  }

  // Método para inicializar el mapa
  inicializarMapa() {
    // Se crea un mapa centrado en México
    this.mapa = L.map('mapa').setView([23.6345, -102.5528], 6); // Latitud y longitud central de México

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.mapa);
  }

  async cargarCSV() {
    try {
      const response = await fetch('assets/IDEFC_NM_feb25.csv');
      if (!response.ok) throw new Error('No se pudo cargar el archivo CSV');

      const csvText = await response.text(); // Convierte la respuesta en texto

      // Usamos la librería PapaParse para procesar el CSV
      Papa.parse(csvText, {
        header: true, // El primer renglón contiene los nombres de las columnas
        dynamicTyping: true, // Convierte automáticamente los tipos de datos
        complete: (result) => {
          if (!result.data || result.data.length === 0) {
            console.error('El archivo CSV está vacío.');
            return;
          }
          this.datosCSV = result.data as CSVData[]; // Almacena los datos del CSV en la propiedad
          console.log("Datos CSV cargados:", this.datosCSV);
          this.agruparDelitosPorEstado(); // Llama a la función para agrupar los delitos por estado
        },
        error: (error: any) => {
          console.error("Error al procesar el CSV:", error);
        },
        encoding: "UTF-8" // Establece la codificación
      });

    } catch (error) {
      console.error("Error al obtener el archivo CSV:", error);
    }
  }

  /*
  // Agrupa los delitos por estado
  agruparDelitosPorEstado() {
    const delitosPorEstado: { [estado: string]: Set<string> } = {}; // Usa un Set para evitar duplicados

    this.datosCSV.forEach((fila) => {
      if (!fila.Entidad || !fila['Subtipo de delito']) return; // Salta filas vacías

      const estado = this.normalizarTexto(String(fila.Entidad)); // Normaliza el nombre del estado
      const subtipoDelito = String(fila['Subtipo de delito']); // Obtiene el subtipo de delito

      // Si no existe el estado en el objeto, lo inicializa
      if (!delitosPorEstado[estado]) {
        delitosPorEstado[estado] = new Set();
      }

      // Añade el subtipo de delito al Set para evitar duplicados
      delitosPorEstado[estado].add(subtipoDelito);
    });

    // Convierte los Set en arrays antes de pasarlos
    const delitosPorEstadoArray: { [estado: string]: string[] } = {};
    Object.keys(delitosPorEstado).forEach((estado) => {
      delitosPorEstadoArray[estado] = Array.from(delitosPorEstado[estado]);
    });

    // Llama a la función para marcar los estados en el mapa
    this.marcarEstados(delitosPorEstadoArray);
  }
*/

  // Función para agrupar los delitos por estado y asegurarse de que los subtipos de delitos no se dupliquen.
  public agruparDelitosPorEstado(): void {
    const delitosPorEstado: { [estado: string]: Set<string> } = {}; // Usa un Set para evitar duplicados.

    this.datosCSV.forEach((fila) => {
      const estado = this.normalizarTexto(String(fila.Entidad));
      const subtipoDelito = this.normalizarTexto(String(fila['Subtipo de delito']));
      if (!estado || !subtipoDelito) return; // Salta filas vacías.
      // Si no existe el estado en el objeto, lo inicializa.
      if (!delitosPorEstado[estado]) {
        delitosPorEstado[estado] = new Set();
      }

      // Añade el subtipo de delito al Set para evitar duplicados.
      delitosPorEstado[estado].add(subtipoDelito);
    });

    // Convierte los Set en arrays antes de pasarlos.
    const delitosPorEstadoArray: { [estado: string]: string[] } = {};
    Object.keys(delitosPorEstado).forEach((estado) => {
      delitosPorEstadoArray[estado] = Array.from(delitosPorEstado[estado]);
    });

    // Llama a la función para marcar los estados en el mapa (debe ser implementada según el caso de uso).
    this.marcarEstados(delitosPorEstadoArray);
  }

  /*
    // Marca los estados en el mapa con los delitos correspondientes
    marcarEstados(delitosPorEstado: { [key: string]: string[] }) {
      Object.keys(delitosPorEstado).forEach((estado) => {
        const coordenadas = coordenadasEstados[estado]; // Obtiene las coordenadas del estado
  
        if (coordenadas) {
          const delitosLista = delitosPorEstado[estado].join("<br>"); // Convierte los delitos en una lista HTML
  
          // Contenido del popup que se mostrará al hacer clic en el marcador
          const contenidoPopup = `
            <b>${estado.toUpperCase()}</b><br>
            <div class="delitos-container">
              <b>Subtipos de delitos:</b><br>${delitosLista}
            </div>
          `;
  
          // Crea un marcador en las coordenadas correspondientes y lo añade al mapa
          L.marker([coordenadas.lat, coordenadas.lon], { icon: iconoPersonalizado })
            .addTo(this.mapa) // Añade el marcador al mapa
            .bindPopup(contenidoPopup); // Añade el contenido al popup del marcador
        } else {
          console.warn(`No se encontraron coordenadas para: ${estado}`); // Si no hay coordenadas para un estado, muestra advertencia
        }
      });
    }
  */

  // Marca los estados en el mapa con los delitos correspondientes
  marcarEstados(delitosPorEstado: { [key: string]: string[] }) {
    Object.keys(delitosPorEstado).forEach((estado) => {
      const coordenadas = coordenadasEstados[estado]; // Obtiene las coordenadas del estado

      if (coordenadas) {
        const delitosLista = delitosPorEstado[estado].join("<br>"); // Convierte los delitos en una lista HTML

        // Contenido del popup que se mostrará al hacer clic en el marcador
        const contenidoPopup = `
          <b>${estado.toUpperCase()}</b><br>
          <div class= "delitos-container">
            <b> Subtipos de delitos:</b><br>${delitosLista}
          </div>
        `;
        const popup = L.popup({
          maxWidth: 400,
          maxHeight: 200
        }).setContent(contenidoPopup);
        // Crea un marcador en las coordenadas correspondientes y lo añade al mapa
        L.marker([coordenadas.lat, coordenadas.lon], { icon: iconoPersonalizado })
          .addTo(this.mapa) // Añade el marcador al mapa
          .bindPopup(popup); // Añade el contenido al popup del marcador
      } else {
        console.warn(`No se encontraron coordenadas para: ${estado}`); // Si no hay coordenadas para un estado, muestra advertencia
      }
    });
  }

  // Normaliza un texto (eliminando acentos y convirtiendo a minúsculas)
  normalizarTexto(texto: string): string {
    return texto
      .normalize("NFD") // Normaliza el texto a forma canónica de descomposición
      .replace(/[\u0300-\u036f]/g, "") // Elimina los acentos y diacríticos
      .toLowerCase() // Convierte todo a minúsculas
      .replace(/\s+/g, " ") // Sustituye múltiples espacios por uno solo
      .trim(); // Elimina los espacios al inicio y al final
  }
}
