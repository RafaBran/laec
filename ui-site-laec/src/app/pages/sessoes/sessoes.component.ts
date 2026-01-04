import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sessoes',
  standalone: true,
  templateUrl: './sessoes.component.html',
  styleUrl: './sessoes.component.scss',
  imports: [CommonModule, FormsModule]
})
export class SessoesComponent implements OnInit {
  isAuthenticated: boolean = false;
  isAluno: boolean = false;
  usuario: any = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Verificar autenticação e tipo de usuário
    this.authService.currentUser$.subscribe(user => {
      this.isAuthenticated = !!user;
      this.usuario = user;
      this.isAluno = user?.tipo?.toLowerCase() === 'aluno';
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
