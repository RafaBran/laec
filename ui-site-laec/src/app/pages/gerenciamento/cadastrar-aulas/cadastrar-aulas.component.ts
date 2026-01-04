import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonDirective } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { DatePicker } from 'primeng/datepicker';
import { Select } from 'primeng/select';
import { Toast } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';

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
  selector: 'app-cadastrar-aulas',
  standalone: true,
  templateUrl: './cadastrar-aulas.component.html',
  styleUrl: './cadastrar-aulas.component.scss',
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonDirective,
    InputText,
    DatePicker,
    Select,
    Toast,
    TooltipModule
  ],
  providers: [MessageService]
})
export class CadastrarAulasComponent implements OnInit {
  aulas: Aula[] = [];
  
  novaAula: Aula = {
    disciplina: '',
    professor: '',
    data: new Date(),
    horario: '',
    turma: '',
    numeroAlunos: 0,
    observacoes: ''
  };

  horarios = [
    { label: '07:00 - 08:40', value: '07:00 - 08:40' },
    { label: '08:50 - 10:30', value: '08:50 - 10:30' },
    { label: '10:40 - 12:20', value: '10:40 - 12:20' },
    { label: '13:00 - 14:40', value: '13:00 - 14:40' },
    { label: '14:50 - 16:30', value: '14:50 - 16:30' },
    { label: '16:40 - 18:20', value: '16:40 - 18:20' },
    { label: '18:30 - 20:10', value: '18:30 - 20:10' },
    { label: '20:20 - 22:00', value: '20:20 - 22:00' }
  ];

  constructor(
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.carregarAulas();
  }

  carregarAulas(): void {
    // Carregar aulas do localStorage ou serviço
    const aulasStorage = localStorage.getItem('aulas');
    if (aulasStorage) {
      this.aulas = JSON.parse(aulasStorage).map((aula: any) => ({
        ...aula,
        data: new Date(aula.data)
      }));
    }
  }

  adicionarAula(): void {
    if (this.validarAula()) {
      const aula = {
        ...this.novaAula,
        id: Date.now()
      };
      
      this.aulas.push(aula);
      this.salvarAulas();
      
      this.messageService.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Aula cadastrada com sucesso!'
      });
      
      this.limparFormulario();
    }
  }

  validarAula(): boolean {
    if (!this.novaAula.disciplina || !this.novaAula.professor || 
        !this.novaAula.data || !this.novaAula.horario || 
        !this.novaAula.turma || this.novaAula.numeroAlunos <= 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Por favor, preencha todos os campos obrigatórios!'
      });
      return false;
    }
    return true;
  }

  editarAula(aula: Aula): void {
    this.novaAula = { ...aula };
  }

  excluirAula(aula: Aula): void {
    this.aulas = this.aulas.filter(a => a.id !== aula.id);
    this.salvarAulas();
    
    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: 'Aula excluída com sucesso!'
    });
  }

  salvarAulas(): void {
    localStorage.setItem('aulas', JSON.stringify(this.aulas));
  }

  limparFormulario(): void {
    this.novaAula = {
      disciplina: '',
      professor: '',
      data: new Date(),
      horario: '',
      turma: '',
      numeroAlunos: 0,
      observacoes: ''
    };
  }

  voltar(): void {
    this.router.navigate(['/gerenciamento']);
  }
}
