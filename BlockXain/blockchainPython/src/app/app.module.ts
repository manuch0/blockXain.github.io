import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { ConnectionService } from './services/connection.service';
import { MinerComponent } from './miner/miner.component';
import { HomeComponent } from './home/home.component';
import { MainComponent } from './node/main/main.component';
import { VoteComponent } from './node/vote/vote.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    MinerComponent,
    HomeComponent,
    MainComponent,
    VoteComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [ ConnectionService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
