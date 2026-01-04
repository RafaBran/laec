import { Component } from '@angular/core';
import { Tabs, TabList, Tab, TabPanels, TabPanel } from 'primeng/tabs';

@Component({
  selector: 'app-informacoes',
  imports: [Tabs, TabList, Tab, TabPanels, TabPanel],
  templateUrl: './informacoes.component.html',
  styleUrl: './informacoes.component.scss',
  standalone: true
})
export class InformacoesComponent {

}
