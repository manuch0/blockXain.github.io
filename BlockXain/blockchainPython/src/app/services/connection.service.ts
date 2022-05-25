import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ConnectionService implements OnInit{

  apiValue: any;
  chainNodes: string[] = [];
  bodyVote: any;
  prefixNode = "http://";
  defaultNode = "127.0.0.1:5000"
  x: any;
  b: any;
  c: any;
  observables: any;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    
  }

  pushNode(value: any) {

    let nodosAntiguos = sessionStorage.getItem("node")
    if (nodosAntiguos === null) {
      console.log("Vacio")
      this.chainNodes.push("127.0.0.1:5000")
      this.chainNodes.push(value)
      sessionStorage.setItem("node", JSON.stringify(this.chainNodes))
    } else {
      console.log("No vacio")
      this.chainNodes = []
      let nodosAntiguosF = JSON.parse(nodosAntiguos)
      for (let element of nodosAntiguosF) {
        console.log("Element: " + element)
        this.chainNodes.push(element)
      }
      this.chainNodes.push(value)
      sessionStorage.setItem("node", JSON.stringify(this.chainNodes))
    }
  }

  mineBlock(node: any): Observable<any> {
    return this.http.get(node + "/mine_block")
  }

  getChain(value: string): Observable<any> {
    //console.log(value + "/get_chain")
    return this.http.get(value + "/get_chain");
  }

  addVote(node: string, value: string): Observable<any> {
    //console.log(value)
    //console.log(node+"/add_transaction")
    this.bodyVote = JSON.stringify({ "Value": value })
    this.bodyVote = JSON.parse(this.bodyVote)
    //console.log(this.bodyVote)
    return this.http.post<any>(node + "/add_vote", this.bodyVote)
  }

  connectNodes(arrayNodes: any): Observable<any> {
    this.observables = [];
    //this.observables2 = [];
    this.x = JSON.parse(arrayNodes)
    for (let node of this.x) {
      this.observables.push(this.connectNode(node, arrayNodes))
      //this.observables2.push(this.replaceChain(node))
    }
    return forkJoin(this.observables);
  }

  connectNode(node: any, chainNodes: any): Observable<any> {
    //console.log(this.prefixNode+node+"/connect_node")
    //console.log(chainNodes)
    this.b = JSON.parse(chainNodes)
    this.c = []
    for(let element of this.b){
      this.c.push(this.prefixNode+element)
    }
    //console.log(this.c)

    return this.http.post<any>(this.prefixNode+node+"/connect_node", {
      "Nodes" : this.c
    })
  }

  replaceChains(arrayNodes: any): Observable<any> {
    this.observables = [];
    this.x = JSON.parse(arrayNodes)
    for(let node of this.x){
      this.observables.push(this.replaceChain(node))
    }

    return forkJoin(this.observables);    
  }

  replaceChain(node: any): Observable<any> {
    return this.http.get(this.prefixNode+node+"/replace_chain");
  }

  
  validChain(node: any): Observable<any> {
    return this.http.get(node + "/is_valid");
  }

  
}
