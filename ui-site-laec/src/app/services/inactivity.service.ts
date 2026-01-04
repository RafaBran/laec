import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, fromEvent, merge, timer } from 'rxjs';
import { debounceTime, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class InactivityService {
  private readonly INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutos em ms
  private readonly WARNING_TIME = 5 * 60 * 1000; // Aviso 5 minutos antes
  
  private inactivityTimer: any;
  private warningTimer: any;
  
  public onWarning = new Subject<number>(); // Emite segundos restantes
  public onTimeout = new Subject<void>();
  
  private isMonitoring = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private ngZone: NgZone
  ) {}

  /**
   * Inicia o monitoramento de inatividade
   */
  startMonitoring(): void {
    if (this.isMonitoring) {
      return;
    }

    this.isMonitoring = true;
    this.resetTimer();

    // Eventos que indicam atividade do usuário
    const events = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click'
    ];

    // Observar todos os eventos de atividade
    this.ngZone.runOutsideAngular(() => {
      merge(...events.map(event => fromEvent(document, event)))
        .pipe(
          debounceTime(1000), // Evita muitas chamadas
          tap(() => {
            this.ngZone.run(() => this.resetTimer());
          })
        )
        .subscribe();
    });
  }

  /**
   * Para o monitoramento de inatividade
   */
  stopMonitoring(): void {
    this.isMonitoring = false;
    this.clearTimers();
  }

  /**
   * Reseta o timer de inatividade
   */
  private resetTimer(): void {
    this.clearTimers();

    // Timer de aviso (5 minutos antes do logout)
    this.warningTimer = setTimeout(() => {
      this.showWarning();
    }, this.INACTIVITY_TIMEOUT - this.WARNING_TIME);

    // Timer de logout por inatividade
    this.inactivityTimer = setTimeout(() => {
      this.handleTimeout();
    }, this.INACTIVITY_TIMEOUT);
  }

  /**
   * Limpa todos os timers
   */
  private clearTimers(): void {
    if (this.warningTimer) {
      clearTimeout(this.warningTimer);
      this.warningTimer = null;
    }
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
      this.inactivityTimer = null;
    }
  }

  /**
   * Mostra aviso de inatividade
   */
  private showWarning(): void {
    const secondsRemaining = this.WARNING_TIME / 1000;
    this.onWarning.next(secondsRemaining);
    
    console.warn(`⚠️ Você será deslogado em ${secondsRemaining / 60} minutos por inatividade.`);
    
    // Countdown
    let remaining = secondsRemaining;
    const countdown = setInterval(() => {
      remaining--;
      if (remaining > 0) {
        this.onWarning.next(remaining);
      } else {
        clearInterval(countdown);
      }
    }, 1000);
  }

  /**
   * Lida com timeout de inatividade
   */
  private handleTimeout(): void {
    console.log('🔒 Logout automático por inatividade (30 minutos)');
    this.onTimeout.next();
    this.stopMonitoring();
    
    // Fazer logout
    this.authService.logout();
    
    // Redirecionar para login com mensagem
    this.router.navigate(['/login'], {
      queryParams: { reason: 'inactivity' }
    });
  }

  /**
   * Estende a sessão (chamado quando usuário clica em "Continuar conectado")
   */
  extendSession(): void {
    console.log('✅ Sessão estendida pelo usuário');
    this.resetTimer();
  }
}
