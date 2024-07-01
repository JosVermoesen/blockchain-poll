import { Component } from '@angular/core';
import { PollService } from './poll-service/poll.service';
import { Poll, PollForm, PollVote } from './poll-vote/models/types';
import { Web3Service } from './blockchain/web3.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  showFormCreatePoll = false;

  ownerIsUser = false;
  
  createPollCaption = 'Toggle New Poll';
  activePoll: Poll | undefined;
  polls = this.ps.getPolls();

  constructor(private ps: PollService, private ws: Web3Service) {}

  ngOnInit() {
    this.ws.ownerIsUser().then((result) => {
      this.ownerIsUser = result;
    });

    this.ps.onEvent('PollCreated').subscribe(() => {
      this.showFormCreatePoll = false;
      this.polls = this.ps.getPolls();
    });

    this.ps.onEvent('PollVoted').subscribe(() => {
      console.log('ok voted');
      this.activePoll = undefined;
      this.polls = this.ps.getPolls();
    });
  }

  setActivePoll(poll: Poll | undefined) {
    this.activePoll = undefined;

    setTimeout(() => {
      this.activePoll = poll;
    }, 100);
  }

  handlePollCreate(poll: PollForm) {
    this.ps.createPoll(poll);
  }

  handlePollVote(pollVoted: PollVote) {
    this.ps.vote(pollVoted.id, pollVoted.vote);
  }
}
