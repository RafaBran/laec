import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ButtonDirective } from 'primeng/button';

interface Aula {
  id?: number;
  disciplina: string;
  professor: string;
  data: Date;
  horario: string;
  turma: string;
  numeroAlunos: number;
  observacoes?: string;
}

@Component({
  selector: 'app-listar-aulas',
  standalone: true,
  templateUrl: './listar-aulas.component.html',
  styleUrl: './listar-aulas.component.scss',
  imports: [CommonModule, ButtonDirective, RouterLink]
})
export class ListarAulasComponent implements OnInit {
  aulas: Aula[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.carregarAulas();
  }

  carregarAulas(): void {
    const aulasStorage = localStorage.getItem('aulas');
    if (aulasStorage) {
      this.aulas = JSON.parse(aulasStorage).map((aula: any) => ({
        ...aula,
        data: new Date(aula.data)
      }));
    }
  }

  formatarData(data: Date): string {
    return new Date(data).toLocaleDateString('pt-BR');
  }

  voltar(): void {
    this.router.navigate(['/gerenciamento']);
  }

  editarAula(id: number): void {
    this.router.navigate(['/gerenciamento/cadastrar-aulas'], { 
      queryParams: { editId: id } 
    });
  }
}
