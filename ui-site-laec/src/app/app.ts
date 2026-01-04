import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Header } from './components/layout/header/header';
import { Footer } from './components/layout/footer/footer';
import { AuthService } from './services/auth.service';
import { InactivityService } from './services/inactivity.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ButtonModule, Header, Footer, ToastModule],
  providers: [MessageService],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit, OnDestroy {
  protected readonly title = signal('ui-site-laec');
  private subscriptions = new Subscription();
  
  constructor(
    private authService: AuthService,
    private inactivityService: InactivityService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Iniciar monitoramento se usuário estiver logado
    if (this.authService.isAuthenticated()) {
      this.inactivityService.startMonitoring();
    }

    // Observar mudanças de autenticação
    this.subscriptions.add(
      this.authService.currentUser$.subscribe(user => {
        if (user) {
          this.inactivityService.startMonitoring();
        } else {
          this.inactivityService.stopMonitoring();
        }
      })
    );

    // Observar aviso de inatividade
    this.subscriptions.add(
      this.inactivityService.onWarning.subscribe(secondsRemaining => {
        const minutes = Math.floor(secondsRemaining / 60);
        if (secondsRemaining === 300) { // Primeiro aviso aos 5 minutos
          this.messageService.add({
            severity: 'warn',
            summary: 'Inatividade Detectada',
            detail: `Você será deslogado em ${minutes} minutos por inatividade.`,
            life: 10000,
            sticky: false
          });
        }
      })
    );

    // Observar timeout
    this.subscriptions.add(
      this.inactivityService.onTimeout.subscribe(() => {
        this.messageService.add({
          severity: 'info',
          summary: 'Sessão Encerrada',
          detail: 'Você foi deslogado por inatividade.',
          life: 5000
        });
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.inactivityService.stopMonitoring();
  }
  
  toggleDarkMode() {
    const element = document.documentElement;
    element.classList.toggle('my-app-dark');
  }

}


