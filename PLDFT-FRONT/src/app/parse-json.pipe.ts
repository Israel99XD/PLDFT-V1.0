// Importamos los decoradores Pipe y PipeTransform de Angular
import { Pipe, PipeTransform } from '@angular/core';

// Definimos un Pipe con el nombre 'parseJson' y lo marcamos como standalone
@Pipe({
  name: 'parseJson', // Nombre con el que utilizaremos el Pipe en el template
  standalone: true   // Permite usar este Pipe sin necesidad de declararlo en un módulo
})
export class ParseJsonPipe implements PipeTransform {
  // Implementamos la interfaz PipeTransform, que requiere el método transform

  transform(value: any): any {
    // Imprimimos en consola el valor recibido para depuración
   // console.log("Valor recibido en el Pipe:", value);

    // Verificamos si el valor es un string
    if (typeof value === 'string') {
      try {
        // Intentamos convertir el string a un objeto JSON
        return JSON.parse(value);
      } catch (e) {
        // Si ocurre un error (por ejemplo, si el string no es un JSON válido),
        // devolvemos el valor original sin modificarlo
        return value;
      }
    }

    // Si el valor no es un string, simplemente lo devolvemos sin modificarlo
    return value;
  }
}
