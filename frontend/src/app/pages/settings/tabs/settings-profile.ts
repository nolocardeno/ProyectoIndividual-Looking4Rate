import { Component, signal } from '@angular/core';
import { CanComponentDeactivate } from '../../../guards/can-deactivate.guard';

@Component({
  selector: 'app-settings-profile',
  template: `
    <div style="padding: 2rem; text-align: center;">
      <h3>Tab: Editar Perfil</h3>
      <p>Aquí se editaría el perfil del usuario.</p>
      <button (click)="hasUnsavedChanges.set(true)">Simular cambios no guardados</button>
    </div>
  `,
  styles: []
})
export default class SettingsProfileTab implements CanComponentDeactivate {
  hasUnsavedChanges = signal(false);

  canDeactivate(): boolean {
    if (this.hasUnsavedChanges()) {
      return confirm('¿Tienes cambios sin guardar. ¿Deseas salir de todos modos?');
    }
    return true;
  }
}
