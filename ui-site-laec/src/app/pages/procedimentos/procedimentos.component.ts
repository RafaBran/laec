import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface MenuItem {
  id: string;
  numero: string;
  label: string;
  icon: string;
  descricao?: string;
  objetivo?: string;
  detalhes?: string;
}

@Component({
  selector: 'app-procedimentos',
  imports: [CommonModule],
  templateUrl: './procedimentos.component.html',
  styleUrl: './procedimentos.component.scss',
  standalone: true
})
export class ProcedimentosComponent {
  // Menu items com procedimentos
  menuItems: MenuItem[] = [
    {
      id: 'linha-base',
      numero: '1',
      label: 'Linha de Base',
      icon: 'pi pi-chart-line',
      descricao: 'Registro inicial do comportamento sem intervenção experimental.',
      objetivo: 'Estabelecer um padrão de referência para comparações futuras',
      detalhes: 'A linha de base é fundamental para avaliar os efeitos das manipulações experimentais subsequentes.'
    },
    {
      id: 'treino-bebedouro',
      numero: '2',
      label: 'Treino ao Bebedouro',
      icon: 'pi pi-volume-up',
      descricao: 'Condicionamento do animal ao som do bebedouro como estímulo associado ao reforço.',
      objetivo: 'Associar o som do bebedouro à liberação de água',
      detalhes: 'Procedimento inicial essencial para estabelecer o reforço secundário.'
    },
    {
      id: 'modelagem',
      numero: '3',
      label: 'Modelagem',
      icon: 'pi pi-directions',
      descricao: 'Reforçamento diferencial de aproximações sucessivas do comportamento alvo.',
      objetivo: 'Ensinar comportamentos novos através de aproximações gradativas',
      detalhes: 'Técnica utilizada para instalar comportamentos que dificilmente ocorreriam espontaneamente.'
    },
    {
      id: 'crf',
      numero: '4',
      label: 'CRF',
      icon: 'pi pi-sync',
      descricao: 'Cada resposta é seguida de reforço (Reforçamento Contínuo).',
      objetivo: 'Estabelecer e fortalecer o comportamento operante',
      detalhes: 'Esquema de reforçamento mais simples, ideal para aquisição inicial de respostas.'
    },
    {
      id: 'extincao',
      numero: '5A',
      label: 'Extinção Operante',
      icon: 'pi pi-ban',
      descricao: 'Suspensão do reforço para um comportamento previamente reforçado.',
      objetivo: 'Diminuir a frequência de um comportamento',
      detalhes: 'Processo gradual que demonstra a dependência do comportamento em relação ao reforço.'
    },
    {
      id: 'recondicionamento',
      numero: '5B',
      label: 'Recondicionamento',
      icon: 'pi pi-replay',
      descricao: 'Restabelecimento do reforço após extinção.',
      objetivo: 'Recuperar o comportamento após extinção',
      detalhes: 'Demonstra que o comportamento pode ser rapidamente recuperado após extinção.'
    },
    {
      id: 'razao-fixa',
      numero: '6',
      label: 'Razão Fixa',
      icon: 'pi pi-calculator',
      descricao: 'Reforço liberado após um número fixo de respostas.',
      objetivo: 'Manter alta taxa de resposta com padrão previsível',
      detalhes: 'Esquema que produz padrão característico de pausa pós-reforço seguida de alta taxa de resposta.'
    },
    {
      id: 'razao-variavel',
      numero: '7',
      label: 'Razão Variável',
      icon: 'pi pi-question-circle',
      descricao: 'Reforço liberado após um número variável de respostas.',
      objetivo: 'Manter taxa de resposta constante e resistente à extinção',
      detalhes: 'Produz resposta constante e é altamente resistente à extinção.'
    },
    {
      id: 'intervalo-fixo',
      numero: '8',
      label: 'Intervalo Fixo',
      icon: 'pi pi-clock',
      descricao: 'Reforço disponível após um tempo fixo desde o último reforço.',
      objetivo: 'Estudar padrão temporal de respostas',
      detalhes: 'Produz padrão em "festonamento" com pausa pós-reforço e aceleração gradual.'
    },
    {
      id: 'intervalo-variavel',
      numero: '9',
      label: 'Intervalo Variável',
      icon: 'pi pi-hourglass',
      descricao: 'Reforço disponível após intervalos variáveis de tempo.',
      objetivo: 'Manter taxa de resposta estável ao longo do tempo',
      detalhes: 'Produz taxa de resposta moderada e constante, resistente à extinção.'
    },
    {
      id: 'treino-discriminativo',
      numero: '10',
      label: 'Treino Discriminativo',
      icon: 'pi pi-eye',
      descricao: 'Ensinar o animal a responder apenas na presença de um estímulo específico.',
      objetivo: 'Desenvolver controle de estímulos sobre o comportamento',
      detalhes: 'Estabelece controle discriminativo através do reforçamento diferencial na presença de estímulos.'
    },
    {
      id: 'encadeamento',
      numero: '11',
      label: 'Encadeamento de Respostas',
      icon: 'pi pi-link',
      descricao: 'Sequência de respostas onde cada resposta serve como estímulo discriminativo para a próxima.',
      objetivo: 'Ensinar sequências complexas de comportamento',
      detalhes: 'Técnica para ensinar sequências comportamentais complexas através de elos.'
    }
  ];

  // Procedimento selecionado
  selectedProcedimento: MenuItem | null = null;

  // Selecionar procedimento
  selectProcedimento(item: MenuItem): void {
    this.selectedProcedimento = item;
  }
}
