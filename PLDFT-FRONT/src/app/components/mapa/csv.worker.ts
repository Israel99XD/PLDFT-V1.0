/// <reference lib="webworker" />

import * as Papa from 'papaparse';

addEventListener('message', ({ data }) => {
  fetch(data)
    .then(response => response.text())
    .then(csvData => {
      Papa.parse(csvData, {
        header: true,
        skipEmptyLines: true,
        // Procesar en trozos para evitar el bloqueo de la UI
        chunkSize: 500, // Ajusta este valor según el tamaño de tu archivo CSV
        chunk: (results: { data: any; }, parser: any) => {
          // Aquí se envía cada "trozo" de datos procesados
          postMessage(results.data);
        },
        complete: (result) => {
          // Esto se ejecuta al finalizar el procesamiento
          console.log("Procesamiento completo");
          postMessage(result.data);
        },
        error: (error: any) => {
          console.error('Error al procesar el CSV:', error);
          postMessage({ error });
        }
      });
    })
    .catch(error => {
      console.error('Error al obtener el archivo CSV:', error);
      postMessage({ error });
    });
});
