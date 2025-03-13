import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mapToProperty',
  standalone: true
})
export class MapToPropertyPipe implements PipeTransform {
  transform(value: any[], property: string): string {
    if (!value || !Array.isArray(value)) {
      return '';
    }
    return value.map(item => item[property]).join(', ');
  }
}
