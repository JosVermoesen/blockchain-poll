import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { Web3Service } from './blockchain/web3.service';
import { PollCreateComponent } from './poll-create/poll-create.component';
import { PollService } from './poll-service/poll.service';
import { PollVoteComponent } from './poll-vote/poll-vote.component';
import { PollComponent } from './poll/poll.component';

@NgModule({
  declarations: [
    AppComponent,
    PollCreateComponent,
    PollComponent,
    PollVoteComponent,
  ],
  imports: [BrowserModule, FormsModule, ReactiveFormsModule],
  providers: [PollService, Web3Service],
  bootstrap: [AppComponent],
})
export class AppModule {}
