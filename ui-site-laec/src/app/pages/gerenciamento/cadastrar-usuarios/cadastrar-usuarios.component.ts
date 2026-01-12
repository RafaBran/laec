import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonDirective } from 'primeng/button';
import { Select } from 'primeng/select';
import { InputText } from 'primeng/inputtext';
import { Password } from 'primeng/password';
import { Message } from 'primeng/message';
import { Checkbox } from 'primeng/checkbox';
import type { Usuario } from '../../../services/usuario.service';
import { UsuarioService } from '../../../services/usuario.service';
import { TurmaService } from '../../../services/turma.service';
import { GrupoService } from '../../../services/grupo.service';
import type { Grupo } from '../../../models/grupo.model';
import type { Turma } from '../../../models/turma.model';

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
    FormsModule,
    ButtonDirective,
    Select,
    InputText,
    Password,
    Message,
    Checkbox
  ]
})
export class CadastrarUsuariosComponent implements OnInit {
  @Input() isEmbedded: boolean = false; // Se true, está embutido em outra página
  @Input() modoEdicao: boolean = false; // Se true, está editando um usuário existente
  @Input() usuarioParaEditar?: Usuario; // Usuário a ser editado
  @Output() usuarioCadastrado = new EventEmitter<void>();
  @Output() cancelado = new EventEmitter<void>();
  
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

  turmas: Turma[] = [];
  grupos: Grupo[] = [];
  turmasFiltradas: { label: string, value: number }[] = [];
  gruposFiltrados: { label: string, value: number }[] = [];
  alterarSenha: boolean = false;
  formularioModificado: boolean = false;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private turmaService: TurmaService,
    private grupoService: GrupoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.carregarTurmas();
    
    if (this.modoEdicao && this.usuarioParaEditar) {
      this.preencherFormulario(this.usuarioParaEditar);
    }
  }

  initForm(): void {
    // No modo de edição, senha não é obrigatória (apenas se quiser alterar)
    const senhaValidators = this.modoEdicao ? [] : [Validators.required, Validators.minLength(6)];
    const confirmarSenhaValidators = this.modoEdicao ? [] : [Validators.required];
    
    this.usuarioForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      senha: [{value: '', disabled: this.modoEdicao}, senhaValidators],
      confirmarSenha: [{value: '', disabled: this.modoEdicao}, confirmarSenhaValidators],
      tipo: ['', [Validators.required]],
      telefone: [''],
      curso: [''],
      periodo: [''],
      turmaId: [''],
      grupoId: [''],
      fotoUrl: ['']
    }, {
      validators: this.passwordMatchValidator.bind(this)
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

    // Carregar grupos quando a turma for selecionada
    this.usuarioForm.get('turmaId')?.valueChanges.subscribe(turmaId => {
      if (turmaId) {
        this.carregarGruposPorTurma(turmaId);
      } else {
        this.grupos = [];
        this.gruposFiltrados = [];
      }
    });

    // Monitorar mudanças no formulário (no modo de edição)
    if (this.modoEdicao) {
      this.usuarioForm.valueChanges.subscribe(() => {
        this.formularioModificado = true;
      });
    }
  }

  toggleAlterarSenha(): void {
    this.alterarSenha = !this.alterarSenha;
    
    if (this.alterarSenha) {
      // Habilitar e tornar obrigatórios os campos de senha
      this.usuarioForm.get('senha')?.setValidators([Validators.required, Validators.minLength(6)]);
      this.usuarioForm.get('confirmarSenha')?.setValidators([Validators.required]);
      this.usuarioForm.get('senha')?.enable();
      this.usuarioForm.get('confirmarSenha')?.enable();
    } else {
      // Desabilitar e limpar os campos de senha
      this.usuarioForm.get('senha')?.clearValidators();
      this.usuarioForm.get('confirmarSenha')?.clearValidators();
      this.usuarioForm.get('senha')?.setValue('');
      this.usuarioForm.get('confirmarSenha')?.setValue('');
      this.usuarioForm.get('senha')?.disable();
      this.usuarioForm.get('confirmarSenha')?.disable();
    }
    
    this.usuarioForm.get('senha')?.updateValueAndValidity();
    this.usuarioForm.get('confirmarSenha')?.updateValueAndValidity();
  }

  passwordMatchValidator(form: FormGroup) {
    const senha = form.get('senha')?.value;
    const confirmarSenha = form.get('confirmarSenha')?.value;
    
    // No modo de edição, se ambos estiverem vazios ou desabilitados, não validar
    if (this.modoEdicao && (!this.alterarSenha || (!senha && !confirmarSenha))) {
      return null;
    }
    
    // Se apenas um estiver preenchido, erro
    if ((senha && !confirmarSenha) || (!senha && confirmarSenha)) {
      form.get('confirmarSenha')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    // Se ambos preenchidos, devem ser iguais
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
      senha: this.usuarioForm.get('senha')?.value,
      tipo: formValue.tipo,
      telefone: formValue.telefone || null,
      curso: formValue.curso || null,
      periodo: formValue.periodo || null,
      grupoId: formValue.grupoId || null,
      fotoUrl: formValue.fotoUrl || null
    };

    // Se está em modo de edição, não enviar senha vazia
    if (this.modoEdicao && !usuarioData.senha) {
      delete usuarioData.senha;
    }

    const request$ = this.modoEdicao && this.usuarioParaEditar
      ? this.usuarioService.atualizar(this.usuarioParaEditar.id, usuarioData)
      : this.usuarioService.criar(usuarioData);

    request$.subscribe({
      next: (response: Usuario) => {
        this.isLoading = false;
        const acao = this.modoEdicao ? 'atualizado' : 'cadastrado';
        this.successMessage = `Usuário ${response.nome} ${acao} com sucesso!`;
        
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
        console.error('Erro ao salvar usuário:', error);
        
        if (error.error?.message) {
          this.errorMessage = error.error.message;
        } else if (error.status === 400) {
          this.errorMessage = 'Dados inválidos. Verifique os campos e tente novamente.';
        } else if (error.status === 0) {
          this.errorMessage = 'Não foi possível conectar ao servidor. Verifique se o user-service está rodando na porta 8082.';
        } else {
          const acao = this.modoEdicao ? 'atualizar' : 'cadastrar';
          this.errorMessage = `Erro ao ${acao} usuário. Tente novamente.`;
        }
      }
    });
  }

  onCancel(): void {
    if (this.isEmbedded) {
      // Se estiver embutido, emitir evento de cancelamento
      this.cancelado.emit();
    } else {
      // Se for página standalone, navegar
      this.router.navigate(['/gerenciamento']);
    }
  }

  preencherFormulario(usuario: Usuario): void {
    // Resetar estado de alteração de senha
    this.alterarSenha = false;
    
    // Preencher campos básicos
    this.usuarioForm.patchValue({
      nome: usuario.nome,
      email: usuario.email,
      username: usuario.username,
      tipo: usuario.tipo,
      telefone: usuario.telefone || '',
      curso: usuario.curso || '',
      periodo: usuario.periodo || '',
      fotoUrl: usuario.fotoUrl || ''
    });

    // Se o usuário tem um grupoId, buscar o grupo para pegar a turmaId
    if (usuario.grupoId) {
      this.grupoService.getGrupoById(usuario.grupoId).subscribe({
        next: (grupo) => {
          this.usuarioForm.patchValue({
            turmaId: grupo.turmaId,
            grupoId: grupo.grupoId
          });
          // Carregar os grupos da turma
          this.carregarGruposPorTurma(grupo.turmaId);
        },
        error: (error) => {
          console.error('Erro ao carregar grupo do usuário:', error);
        }
      });
    }
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
      }
    });
  }

  carregarGruposPorTurma(turmaId: number): void {
    this.grupoService.getGruposByTurma(turmaId).subscribe({
      next: (grupos) => {
        this.grupos = grupos;
        this.gruposFiltrados = grupos
          .sort((a, b) => a.numeroGrupo - b.numeroGrupo)
          .map(g => ({
            label: `Grupo ${g.numeroGrupo}`,
            value: g.grupoId
          }));
      },
      error: (error) => {
        console.error('Erro ao carregar grupos:', error);
        this.grupos = [];
        this.gruposFiltrados = [];
      }
    });
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
