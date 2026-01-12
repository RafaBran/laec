import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonDirective } from 'primeng/button';
import { Select } from 'primeng/select';
import { InputText } from 'primeng/inputtext';
import { DatePicker } from 'primeng/datepicker';
import { Textarea } from 'primeng/textarea';
import { Message } from 'primeng/message';
import { AulaPraticaService } from '../../../services/aula-pratica.service';
import { TurmaService } from '../../../services/turma.service';
import type { Turma } from '../../../models/turma.model';

@Component({
  selector: 'app-cadastrar-aulas',
  standalone: true,
  templateUrl: './cadastrar-aulas.component.html',
  styleUrl: './cadastrar-aulas.component.scss',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonDirective,
    Select,
    InputText,
    DatePicker,
    Textarea,
    Message
  ]
})
export class CadastrarAulasComponent implements OnInit {
  @Input() isEmbedded: boolean = false;
  @Output() aulaCadastrada = new EventEmitter<void>();
  @Output() cancelado = new EventEmitter<void>();
  
  aulaForm!: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  turmas: Turma[] = [];
  turmasFiltradas: { label: string, value: number }[] = [];

  constructor(
    private fb: FormBuilder,
    private aulaPraticaService: AulaPraticaService,
    private turmaService: TurmaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.carregarTurmas();
  }

  initForm(): void {
    this.aulaForm = this.fb.group({
      turmaId: ['', [Validators.required]],
      dataAula: ['', [Validators.required]],
      numeroAula: [''],
      tema: ['', [Validators.required]],
      procedimento: [''],
      observacoes: ['']
    });
  }

  carregarTurmas(): void {
    this.turmaService.getTurmas().subscribe({
      next: (turmas) => {
        this.turmas = turmas;
        this.turmasFiltradas = turmas.map(t => ({
          label: t.nomeTurma,
          value: t.turmaId
        }));
      },
      error: (error) => {
        console.error('Erro ao carregar turmas:', error);
        this.errorMessage = 'Erro ao carregar turmas. Tente novamente.';
      }
    });
  }

  onSubmit(): void {
    if (this.aulaForm.invalid) {
      this.errorMessage = 'Por favor, preencha todos os campos obrigatórios.';
      Object.keys(this.aulaForm.controls).forEach(key => {
        this.aulaForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const formValue = this.aulaForm.value;
    const aulaData = {
      turmaId: formValue.turmaId,
      dataAula: this.formatDateToString(formValue.dataAula),
      numeroAula: formValue.numeroAula ? parseInt(formValue.numeroAula) : undefined,
      tema: formValue.tema,
      procedimento: formValue.procedimento || undefined,
      observacoes: formValue.observacoes || undefined
    };

    this.aulaPraticaService.criarAula(aulaData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = 'Aula prática cadastrada com sucesso!';
        
        // Limpar formulário
        this.aulaForm.reset();
        
        if (this.isEmbedded) {
          setTimeout(() => {
            this.aulaCadastrada.emit();
          }, 1500);
        } else {
          setTimeout(() => {
            this.router.navigate(['/gerenciamento']);
          }, 2000);
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Erro ao cadastrar aula:', error);
        
        if (error.error?.message) {
          this.errorMessage = error.error.message;
        } else if (error.status === 400) {
          this.errorMessage = 'Dados inválidos. Verifique os campos e tente novamente.';
        } else if (error.status === 0) {
          this.errorMessage = 'Não foi possível conectar ao servidor. Verifique se o lab-service está rodando.';
        } else {
          this.errorMessage = 'Erro ao cadastrar aula. Tente novamente.';
        }
      }
    });
  }

  onCancel(): void {
    if (this.isEmbedded) {
      this.cancelado.emit();
    } else {
      this.router.navigate(['/gerenciamento']);
    }
  }

  formatDateToString(date: Date): string {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.aulaForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.aulaForm.get(fieldName);
    
    if (field?.hasError('required')) {
      return 'Este campo é obrigatório';
    }
    
    return 'Campo inválido';
  }
}
