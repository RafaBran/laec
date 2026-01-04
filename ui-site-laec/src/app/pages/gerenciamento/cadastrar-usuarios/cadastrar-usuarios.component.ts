import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonDirective } from 'primeng/button';
import { Select } from 'primeng/select';
import { InputText } from 'primeng/inputtext';
import { Password } from 'primeng/password';
import { Message } from 'primeng/message';
import type { Usuario } from '../../../services/usuario.service';
import { UsuarioService } from '../../../services/usuario.service';

interface TipoUsuario {
  label: string;
  value: string;
}

@Component({
  selector: 'app-cadastrar-usuarios',
  standalone: true,
  templateUrl: './cadastrar-usuarios.component.html',
  styleUrl: './cadastrar-usuarios.component.scss',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonDirective,
    Select,
    InputText,
    Password,
    Message
  ]
})
export class CadastrarUsuariosComponent implements OnInit {
  @Input() isEmbedded: boolean = false; // Se true, está embutido em outra página
  @Output() usuarioCadastrado = new EventEmitter<void>();
  
  usuarioForm!: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  tiposUsuario: TipoUsuario[] = [
    { label: 'Aluno', value: 'aluno' },
    { label: 'Professor', value: 'professor' },
    { label: 'Técnico', value: 'tecnico' },
    { label: 'Monitor', value: 'monitor' },
    { label: 'Administrador', value: 'admin' }
  ];

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.usuarioForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      confirmarSenha: ['', [Validators.required]],
      tipo: ['', [Validators.required]],
      telefone: [''],
      curso: [''],
      periodo: [''],
      fotoUrl: ['']
    }, {
      validators: this.passwordMatchValidator
    });

    // Mostrar campos específicos para alunos
    this.usuarioForm.get('tipo')?.valueChanges.subscribe(tipo => {
      if (tipo === 'aluno') {
        this.usuarioForm.get('curso')?.setValidators([Validators.required]);
        this.usuarioForm.get('periodo')?.setValidators([Validators.required]);
      } else {
        this.usuarioForm.get('curso')?.clearValidators();
        this.usuarioForm.get('periodo')?.clearValidators();
      }
      this.usuarioForm.get('curso')?.updateValueAndValidity();
      this.usuarioForm.get('periodo')?.updateValueAndValidity();
    });
  }

  passwordMatchValidator(form: FormGroup) {
    const senha = form.get('senha')?.value;
    const confirmarSenha = form.get('confirmarSenha')?.value;
    
    if (senha !== confirmarSenha) {
      form.get('confirmarSenha')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    return null;
  }

  onSubmit(): void {
    if (this.usuarioForm.invalid) {
      this.errorMessage = 'Por favor, preencha todos os campos obrigatórios corretamente.';
      Object.keys(this.usuarioForm.controls).forEach(key => {
        this.usuarioForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const formValue = this.usuarioForm.value;
    const usuarioData = {
      nome: formValue.nome,
      email: formValue.email,
      username: formValue.username,
      senha: formValue.senha,
      tipo: formValue.tipo,
      telefone: formValue.telefone || null,
      curso: formValue.curso || null,
      periodo: formValue.periodo || null,
      fotoUrl: formValue.fotoUrl || null
    };

    this.usuarioService.criar(usuarioData).subscribe({
      next: (response: Usuario) => {
        this.isLoading = false;
        this.successMessage = `Usuário ${response.nome} cadastrado com sucesso!`;
        
        // Limpar formulário
        this.usuarioForm.reset();
        
        // Se estiver embutido, emitir evento
        if (this.isEmbedded) {
          setTimeout(() => {
            this.usuarioCadastrado.emit();
          }, 1500);
        } else {
          // Se for página standalone, redirecionar
          setTimeout(() => {
            this.router.navigate(['/gerenciamento']);
          }, 2000);
        }
      },
      error: (error: any) => {
        this.isLoading = false;
        console.error('Erro ao cadastrar usuário:', error);
        
        if (error.error?.message) {
          this.errorMessage = error.error.message;
        } else if (error.status === 400) {
          this.errorMessage = 'Dados inválidos. Verifique os campos e tente novamente.';
        } else if (error.status === 0) {
          this.errorMessage = 'Não foi possível conectar ao servidor. Verifique se o user-service está rodando na porta 8082.';
        } else {
          this.errorMessage = 'Erro ao cadastrar usuário. Tente novamente.';
        }
      }
    });
  }

  onCancel(): void {
    if (this.isEmbedded) {
      // Se estiver embutido, apenas emitir evento
      this.usuarioCadastrado.emit();
    } else {
      // Se for página standalone, navegar
      this.router.navigate(['/gerenciamento']);
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.usuarioForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.usuarioForm.get(fieldName);
    
    if (field?.hasError('required')) {
      return 'Este campo é obrigatório';
    }
    if (field?.hasError('email')) {
      return 'Email inválido';
    }
    if (field?.hasError('minlength')) {
      const minLength = field.getError('minlength').requiredLength;
      return `Mínimo de ${minLength} caracteres`;
    }
    if (field?.hasError('passwordMismatch')) {
      return 'As senhas não coincidem';
    }
    
    return '';
  }

  get isAluno(): boolean {
    return this.usuarioForm.get('tipo')?.value === 'aluno';
  }
}
