import { Component, OnInit } from '@angular/core';
import { ClienteModel } from '../shared/models/cliente.model';
import { ClienteService } from '../shared/Services/cliente.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { plainToClass } from 'class-transformer';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {

  clientes: ClienteModel[];
  cliente: ClienteModel; 
  clientesForm: FormGroup; 
  shared_keyForm: FormGroup; 
  date: Date;
  shared_key: String; 
  message: String; 
  response: Boolean =  false; 


  constructor(private clienteService: ClienteService) { }

  ngOnInit(): void {
    this.date = new Date;
    this.clienteService.getAllPersonas().subscribe(responseData => {
       this.clientes = responseData; 
    });
    this.clientesForm = new FormGroup({ 
      'shared_key': new FormControl('', Validators.required ),
      'bussines_id': new FormControl('', Validators.required),
      'email': new FormControl('', [Validators.required, Validators.email]),
      'phone': new FormControl('', Validators.required),
      'date_added': new FormControl(this.date, Validators.required),
      });
      this.shared_keyForm = new FormGroup({ 
        'shared_key': new FormControl('', Validators.required ),
        });

  }

  onSubmit() {

    this.cliente = plainToClass(ClienteModel, this.clientesForm.value);
    console.log(this.clientesForm.value)
    console.log(this.cliente);
    this.clienteService.saveCliente(this.cliente).subscribe(responseData => {
      this.response = true; 
      this.message = "Cliente registrado";      
    });     
    }

    shared_keyOnSubmit(){
      console.log(this.shared_keyForm.value.shared_key);
      this.shared_key = this.shared_keyForm.value.shared_key;
      this.clienteService.getClienteSharedKey(this.shared_key).subscribe(
        responseData => {
          console.log(responseData); 
          this.clientes = [];
          this.cliente = plainToClass(ClienteModel, responseData);
          this.clientes.push(this.cliente); 
        }
      );
    }


  onDelete(id: number){

    console.log("on delete works");
    
    for(var item in this.clientes){

      if(id == this.clientes[item].id){
          console.log(this.clientes[item]);
          const index: number = this.clientes.indexOf(this.clientes[item]);
           this.clientes.splice(index, 1);          
      }
    }
    this.clienteService.deleteCliente(id).subscribe();
    console.log(this.clientes);
  
  }

  get getControl(){
   return this.clientesForm.controls;
  } 
  get shared_keyGetControl(){
    return this.shared_keyForm.controls;
   }

}
