import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AulaPratica, GrupoAula, AulaUtils } from '../../models/aula-pratica.model';

@Component({
  selector: 'app-aula-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './aula-card.component.html',
  styleUrl: './aula-card.component.scss'
})
export class AulaCardComponent {
  @Input() aula!: AulaPratica;
  @Input() modoVisualizacao: boolean = true;
  @Output() detalhesClick = new EventEmitter<number>();

  readonly AulaUtils = AulaUtils;

  get turno1(): GrupoAula[] {
    return AulaUtils.getGruposPorTurno(this.aula, 1);
  }

  get turno1Presentes(): GrupoAula[] {
    return this.turno1.filter(g => g.presente === true);
  }

  get turno1Faltas(): GrupoAula[] {
    return this.turno1.filter(g => g.presente === false);
  }

  get turno2(): GrupoAula[] {
    return AulaUtils.getGruposPorTurno(this.aula, 2);
  }

  get turno2Presentes(): GrupoAula[] {
    return this.turno2.filter(g => g.presente === true);
  }

  get turno2Faltas(): GrupoAula[] {
    return this.turno2.filter(g => g.presente === false);
  }

  get presentes(): number {
    return AulaUtils.contarPresentes(this.aula);
  }

  get faltas(): number {
    return AulaUtils.contarFaltas(this.aula);
  }

  onDetalhes(): void {
    this.detalhesClick.emit(this.aula.aulaId);
  }
}
