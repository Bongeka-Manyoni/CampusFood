import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
 
import { Subject,Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  subject =new Subject<number>();
  constructor(private http:HttpClient) { }

  //register user
  addUser(data){
    return this.http.post("http://CampusFood/api/addUser.php", data, {responseType: 'text'});
  }

  getProducts(){
    return this.http.get("http://locahost/CampusFood/api/retrieve.php");
  }


sendItem(num: number){
  this.subject.next(num);
}

receiveItem():Observable<number>{
  return this.subject.asObservable();
}

}
