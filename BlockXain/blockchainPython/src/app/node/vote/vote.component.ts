import { Component, OnInit } from '@angular/core';
import { ConnectionService } from '../../services/connection.service';

@Component({
  selector: 'app-vote',
  templateUrl: './vote.component.html',
  styleUrls: ['./vote.component.css']
})
export class VoteComponent implements OnInit {

  data: any;
  nodeValue: any;
  prefix = "http://"

  constructor(private api: ConnectionService) { }

  ngOnInit(): void {
  }

  getCandidate(value: string): void {
    this.data = value;
    //console.log(this.data)
  }

  sendVote(): void {
    this.nodeValue = sessionStorage.getItem("voteNode")
    //console.log(this.data)
    //console.log(this.prefix+this.nodeValue)
    this.api.addVote(this.prefix+this.nodeValue, this.data).subscribe(data => {
      if(data['Message'] === 'El usuario ya ha realizado una votacion'){
        alert('This user is already done a vote!');
      }

      console.log(data)
    })
  }

}
