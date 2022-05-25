import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConnectionService } from '../services/connection.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-miner',
  templateUrl: './miner.component.html',
  styleUrls: ['./miner.component.css']
})
export class MinerComponent implements OnInit {
  
  trans: any;
  infoBC: any;
  minerNode: any;
  prefix = "http://";


  constructor(private api: ConnectionService, private http: HttpClient) { }

  ngOnInit(): void {
  }

  infoChain() {
    this.minerNode = sessionStorage.getItem("voteNode")
    this.api.getChain(this.prefix+this.minerNode).subscribe(
      (element: any) => {
        this.infoBC = element['Chain'];
        //let trans = this.infoBC[2]["Transactions"]
        console.log(this.infoBC)
        //console.log(trans)
      }
    )
  }
  
  
  mineBlock() {
    this.minerNode = sessionStorage.getItem("voteNode")
    this.api.mineBlock(this.prefix+this.minerNode).subscribe(
      (result: any) => {
        alert("The new block has been added to the blockchain!")
        console.log(result)
      }
    )
  }

  
  validChain() {
    this.minerNode = sessionStorage.getItem("voteNode")
    //console.log(this.prefix+this.minerNode)
    this.api.validChain(this.prefix+this.minerNode).subscribe(
      (result: any) => {
        alert("The blockchain has been validated!")
        console.log(result)
      }
    )
  }
  

}
