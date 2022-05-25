import { Component, OnInit } from '@angular/core';
import { ConnectionService } from '../../services/connection.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  nodeValue = '';
  test: any;
  trans: any;
  infoBC: any;
  bcNodes: any;
  prefix = "http://"
  syncNode: any;

  constructor(private api: ConnectionService) { }

  ngOnInit(): void {
    //this.api.clearLS();
  }

  getNodeValue(){
    //console.log(this.nodeValue)
    return this.nodeValue;
  }

  setSessionStorage() {
    this.getNodeValue()
    this.api.pushNode(this.nodeValue)
    
    //localStorage.setItem("node", this.nodeValue)
  }

  sendSessionStorageNode() {
    sessionStorage.setItem("voteNode", this.nodeValue)
  }

  infoChain() {
    this.test = sessionStorage.getItem("voteNode")
    console.log(this.prefix+this.test)
    this.api.getChain(this.prefix+this.test).subscribe(
      (element: any) => {
        this.infoBC = element['Chain'];
        //this.trans = this.infoBC[1]["Transactions"].length
        //console.log(this.infoBC)
        //console.log(this.trans)
      }
    )
  }

  sychronize() {
    this.bcNodes = sessionStorage.getItem("node")
    //this.syncNode = sessionStorage.getItem("voteNode")
    //console.log(this.bcNodes)
    //console.log(this.syncNode)
    this.api.connectNodes(this.bcNodes).subscribe( response => {
      console.log(response)
    });

    this.api.replaceChains(this.bcNodes).subscribe( response => {
      console.log(response)
      alert("All nodes has been sychronized!")
    });
  }
  
  /*
  getCurrentChain() {
    this.test = sessionStorage.getItem("voteNode")
    this.api.getChain(this.prefix+this.test).subscribe(
      (element: any) => {
        this.infoBC = element['Chain'];
        //this.trans = this.infoBC[1]["Transactions"].length
        //console.log(this.infoBC)
        //console.log(this.trans)
      }
    )
  }
  */
  

}
