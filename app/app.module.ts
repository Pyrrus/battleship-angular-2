import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { AppComponent }   from './app.component';
import { HttpModule, JsonpModule } from '@angular/http';
import { AvgPipe } from './avg.pipe'; // import our pipe here
@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    JsonpModule
  ],
  declarations: [
    AppComponent,
    AvgPipe
  ],
  bootstrap:    [ AppComponent ]
})

export class AppModule { }
