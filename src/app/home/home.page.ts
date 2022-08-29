import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore} from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  
  constructor(
    private auth:AngularFireAuth,
    private router:Router,
    private fstore:AngularFirestore
  ) {}

  loggedUser:any =[];
  userEmail:any;
  count=0;
  ready:any;

  ngOnInit() {
    this.userEmail = JSON.parse(localStorage.getItem("email"));

    this.fstore.collection("Orders").valueChanges().subscribe((res) => {
      this.count = 0;
      var orders:any = res;
      for(let order of orders){
        if(order.Status == "Ready"){
          this.count++;
        }
      }
      this.ready = this.count;
    })
  }

  //get user personal details from firestore database

  logOut(){
    this.auth.signOut()
    .then(() => {
      localStorage.removeItem("email");
      //window.location.reload();
      this.router.navigate(['login']);
    })
  }
}
