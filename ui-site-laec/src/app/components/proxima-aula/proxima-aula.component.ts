import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrioridadeGrupos } from '../../models/aula-pratica.model';

@Component({
  selector: 'app-proxima-aula',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './proxima-aula.component.html',
  styleUrl: './proxima-aula.component.scss'
})
export class ProximaAulaComponent {
  @Input() prioridade: PrioridadeGrupos | null = null;

  get turno1() {
    if (!this.prioridade) return [];
    return this.prioridade.gruposOrdenados.filter(g => g.turnoSugerido === 1);
  }

  get turno2() {
    if (!this.prioridade) return [];
    return this.prioridade.gruposOrdenados.filter(g => g.turnoSugerido === 2);
  }

  getTotalPrimeiroTurno(grupo: any): number {
    return grupo.totalPrimeiroTurno || 0;
  }

  getTotalSegundoTurno(grupo: any): number {
    return grupo.totalSegundoTurno || 0;
  }
}
