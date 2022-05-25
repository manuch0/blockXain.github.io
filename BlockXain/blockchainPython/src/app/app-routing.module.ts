import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MinerComponent } from './miner/miner.component';
import { HomeComponent } from './home/home.component';
import { MainComponent } from './node/main/main.component';
import { VoteComponent } from './node/vote/vote.component';



const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'miner', component: MinerComponent, pathMatch: 'full'},
  {path: 'home', component: HomeComponent, pathMatch: 'full'},
  {path: 'main', component: MainComponent, pathMatch: 'full'},
  {path: 'vote', component: VoteComponent, pathMatch: 'full'}
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
