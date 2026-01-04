import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonDirective } from 'primeng/button';

interface Membro {
  id: string;
  nome: string;
  cargo: string;
  periodo?: string;
  foto: string;
  email: string;
  icone: string;
}

@Component({
  selector: 'app-equipe',
  templateUrl: './equipe.component.html',
  styleUrl: './equipe.component.scss',
  standalone: true,
  imports: [CommonModule, ButtonDirective]
})
export class EquipeComponent {
  membros: Membro[] = [
    {
      id: 'ueliton',
      nome: 'Ueliton Gomes',
      cargo: 'Professor',
      periodo: 'Disciplina: Análise do comportamento Básica',
      foto: 'assets/images/fotoueliton.PNG',
      email: 'ueliton@unialfa.com.br',
      icone: 'pi pi-graduation-cap'
    },
    {
      id: 'rafael',
      nome: 'Rafael Brandão',
      cargo: 'Técnico de laboratório',
      periodo: 'Funcionário Psicologia UNIALFA',
      foto: 'assets/images/fotorafaelperfil.jpeg',
      email: 'rafael.brandao@unialfa.com.br',
      icone: 'pi pi-wrench'
    },
    // {
    //   id: 'amanda',
    //   nome: 'Amanda',
    //   cargo: 'Monitora de Análise do Comportamento',
    //   periodo: 'Cursando 5º período',
    //   foto: 'assets/images/fotoamanda.PNG',
    //   email: 'amanda@unialfa.com.br',
    //   icone: 'pi pi-user'
    // },
    // {
    //   id: 'catharine',
    //   nome: 'Catharine Roman',
    //   cargo: 'Monitora de Análise do Comportamento',
    //   periodo: 'Cursando 5º período',
    //   foto: 'assets/images/fotocatharine.PNG',
    //   email: 'catharine@unialfa.com.br',
    //   icone: 'pi pi-user'
    // },
    // {
    //   id: 'hadassa',
    //   nome: 'Hadassa Liryell',
    //   cargo: 'Monitora de Análise do Comportamento',
    //   periodo: 'Cursando 5º período',
    //   foto: 'assets/images/fotohadassa.PNG',
    //   email: 'hadassa@unialfa.com.br',
    //   icone: 'pi pi-user'
    // },
    // {
    //   id: 'julia',
    //   nome: 'Julia Bettencourt',
    //   cargo: 'Monitora de Análise do Comportamento',
    //   periodo: 'Cursando 5º período',
    //   foto: 'assets/images/fotojulia.PNG',
    //   email: 'julia@unialfa.com.br',
    //   icone: 'pi pi-user'
    // },
    // {
    //   id: 'matheus',
    //   nome: 'Matheus Rocha',
    //   cargo: 'Monitor de Análise do Comportamento',
    //   periodo: 'Cursando 5º período',
    //   foto: 'assets/images/fotomatheus.PNG',
    //   email: 'matheus@unialfa.com.br',
    //   icone: 'pi pi-user'
    // },
    // {
    //   id: 'milenna',
    //   nome: 'Milenna Beirigo',
    //   cargo: 'Monitora de Análise do Comportamento',
    //   periodo: 'Cursando 5º período',
    //   foto: 'assets/images/fotomilena.PNG',
    //   email: 'milenna@unialfa.com.br',
    //   icone: 'pi pi-user'
    // }
  ];

  enviarEmail(email: string): void {
    window.location.href = `mailto:${email}`;
  }
}

