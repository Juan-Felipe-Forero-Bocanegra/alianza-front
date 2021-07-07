import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ClienteModel } from "../models/cliente.model";
import { map } from 'rxjs/operators';
import { plainToClass } from "class-transformer";
import { retry, catchError } from 'rxjs/operators';
import { throwError } from "rxjs";

@Injectable({providedIn: 'root'})
export class ClienteService {
   
    clientes: ClienteModel[]; 

    constructor(private http: HttpClient){}

    getAllPersonas(){
        return this.http.get('/api/clientes').pipe(map(
             responseData => {               
                  this.clientes = plainToClass(ClienteModel, responseData as []);                             
                 return this.clientes; 
             }           
         ));
     }

     saveCliente(cliente: ClienteModel){
        return  this.http.post('/api/clientes', cliente).pipe(
            retry (3),
      	    catchError(this.handleError)
        )
      }

      getClienteSharedKey(shared_key: String){
        return this.http.get('/api/clientes/2/'+ shared_key); 
      }

    deleteCliente(id: number){
        return  this.http.delete('/api/clientes/delete/' + id);
      }


      handleError(err: { error: any; message: any; status: any; }) {
        let errorMessage = '';
    	if (err.error instanceof ErrorEvent) {
      	// if error is client-side error
      	errorMessage = `Error: ${err.message}`;
    	} else {
      	// if error is server-side error
      	errorMessage = `Shared_key ya registrada`;
    	}
    	alert(errorMessage);
    	return throwError(errorMessage);
      }


}