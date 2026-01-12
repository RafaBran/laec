import { Component, OnInit, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { Toast } from 'primeng/toast';
import { TurmaService } from '../../../services/turma.service';
import { Turma } from '../../../models/turma.model';

@Component({
  selector: 'app-cadastrar-turmas',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputText,
    Select,
    Toast
  ],
  providers: [MessageService],
  templateUrl: './cadastrar-turmas.component.html',
  styleUrl: './cadastrar-turmas.component.scss'
})
export class CadastrarTurmasComponent implements OnInit, OnChanges {
  @Input() turmaIdParaEditar?: number;
  @Output() voltarParaListagem = new EventEmitter<void>();
  
  turmaForm: FormGroup;
  modoEdicao = false;
  turmaId?: number;
  salvando = false;

  // Opções para dropdowns
  anos: { label: string; value: number }[] = [];
  semestres = [
    { label: '1º Semestre', value: 'primeiro' },
    { label: '2º Semestre', value: 'segundo' }
  ];
  turnos = [
    { label: 'Matutino', value: 'matutino' },
    { label: 'Vespertino', value: 'vespertino' },
    { label: 'Noturno', value: 'noturno' }
  ];
  unidades = [
    { label: 'Bueno', value: 'bueno' },
    { label: 'Perimetral', value: 'perimetral' }
  ];
  diasSemana = [
    { label: 'Segunda-feira', value: 'segunda' },
    { label: 'Terça-feira', value: 'terca' },
    { label: 'Quarta-feira', value: 'quarta' },
    { label: 'Quinta-feira', value: 'quinta' },
    { label: 'Sexta-feira', value: 'sexta' }
  ];

  constructor(
    private fb: FormBuilder,
    private turmaService: TurmaService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.turmaForm = this.fb.group({
      ano: [null, [Validators.required]],
      semestre: [null, [Validators.required]],
      turno: [null, [Validators.required]],
      unidade: [null, [Validators.required]],
      diaSemana: [null, [Validators.required]],
      nomeTurma: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]]
    });
  }

  ngOnInit(): void {
    this.gerarAnosDisponiveis();
    
    // Verificar se há ID via Input ou Route
    if (this.turmaIdParaEditar) {
      this.modoEdicao = true;
      this.turmaId = this.turmaIdParaEditar;
      if (this.turmaId) {
        this.carregarTurma(this.turmaId);
      }
    } else {
      // Fallback para rota direta (se acessado via URL)
      this.route.params.subscribe(params => {
        if (params['id']) {
          this.modoEdicao = true;
          this.turmaId = +params['id'];
          if (this.turmaId) {
            this.carregarTurma(this.turmaId);
          }
        }
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['turmaIdParaEditar'] && changes['turmaIdParaEditar'].currentValue) {
      this.modoEdicao = true;
      this.turmaId = changes['turmaIdParaEditar'].currentValue;
      if (this.turmaId) {
        this.carregarTurma(this.turmaId);
      }
    }
  }

  gerarAnosDisponiveis(): void {
    const anoAtual = new Date().getFullYear();
    this.anos = [];
    for (let i = anoAtual - 2; i <= anoAtual + 5; i++) {
      this.anos.push({ label: i.toString(), value: i });
    }
  }

  carregarTurma(id: number): void {
    this.turmaService.getTurmaById(id).subscribe({
      next: (turma) => {
        this.turmaForm.patchValue({
          ano: turma.ano,
          semestre: turma.semestre,
          turno: turma.turno,
          unidade: turma.unidade,
          diaSemana: turma.diaSemana,
          nomeTurma: turma.nomeTurma
        });
      },
      error: (error) => {
        console.error('Erro ao carregar turma:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao carregar dados da turma'
        });
        this.voltarListagem();
      }
    });
  }

  salvar(): void {
    if (this.turmaForm.invalid) {
      this.marcarCamposComoTocados();
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Preencha todos os campos obrigatórios'
      });
      return;
    }

    this.salvando = true;
    const dadosTurma = this.turmaForm.value;

    if (this.modoEdicao && this.turmaId) {
      this.atualizarTurma(this.turmaId, dadosTurma);
    } else {
      this.criarTurma(dadosTurma);
    }
  }

  criarTurma(dados: Partial<Turma>): void {
    this.turmaService.criarTurma(dados as Omit<Turma, 'turmaId' | 'createdAt' | 'updatedAt'>).subscribe({
      next: (turma) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Turma cadastrada com sucesso'
        });
        setTimeout(() => {
          this.voltarListagem();
        }, 1500);
      },
      error: (error) => {
        console.error('Erro ao criar turma:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: error.error?.message || 'Erro ao cadastrar turma'
        });
        this.salvando = false;
      }
    });
  }

  atualizarTurma(id: number, dados: Partial<Turma>): void {
    this.turmaService.atualizarTurma(id, dados).subscribe({
      next: (turma) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Turma atualizada com sucesso'
        });
        setTimeout(() => {
          this.voltarListagem();
        }, 1500);
      },
      error: (error) => {
        console.error('Erro ao atualizar turma:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: error.error?.message || 'Erro ao atualizar turma'
        });
        this.salvando = false;
      }
    });
  }

  marcarCamposComoTocados(): void {
    Object.keys(this.turmaForm.controls).forEach(key => {
      this.turmaForm.get(key)?.markAsTouched();
    });
  }

  campoInvalido(campo: string): boolean {
    const control = this.turmaForm.get(campo);
    return !!(control && control.invalid && control.touched);
  }

  getMensagemErro(campo: string): string {
    const control = this.turmaForm.get(campo);
    if (!control || !control.errors) return '';

    if (control.errors['required']) {
      return 'Campo obrigatório';
    }
    if (control.errors['minlength']) {
      return `Mínimo de ${control.errors['minlength'].requiredLength} caracteres`;
    }
    if (control.errors['maxlength']) {
      return `Máximo de ${control.errors['maxlength'].requiredLength} caracteres`;
    }
    return 'Campo inválido';
  }

  limparFormulario(): void {
    this.turmaForm.reset();
  }

  voltarListagem(): void {
    this.voltarParaListagem.emit();
  }

  voltarGerenciamento(): void {
    this.router.navigate(['/gerenciamento']);
  }
}
