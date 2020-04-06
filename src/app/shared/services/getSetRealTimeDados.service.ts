import * as firebase from 'firebase';
import { Observable } from 'rxjs';
import {ValidacoesForm} from './validacoesform.service';
import { Injectable } from '@angular/core';

@Injectable()
export class GetRealTimeDados{

    constructor(
        public validacao:ValidacoesForm
    ){}

    public getListaMotoristaOnlines():Promise<any>{
        return new Promise<any>((resolve,reject)=>{
            let motoristasOnlines=[],listaTodosOsMotoristas=[];
            firebase.database().ref(`motoristas/`)
            .once('value')
            .then(resposta=>{
                for(let key in resposta.val()){
                  if(this.validacao.verificaStatusOnline(resposta.val()[key].online)){
                    motoristasOnlines.push(resposta.val()[key]);
                  }

            }
                resolve(motoristasOnlines);
            })
            .catch(err=>{
                reject(err);
            })
        });
    }

    public setMsgChat(uidMotorista,msg):Promise<any>{
        return new Promise<any>((resolve,reject)=>{
            firebase.database().ref(`motoristas/${uidMotorista}/chat/${localStorage.getItem('UID')}/`)
            .push({de:localStorage.getItem('UID'),para:uidMotorista,msg:msg})
            .then(ok=>{resolve(ok)})
            .catch(err=>{reject(err)});
        });
    }
    
    public pegaSaldoEmConta():Promise<any>{
        return new Promise<any>((resolve,reject)=>{
            firebase.database().ref(`clientes/${localStorage.getItem('UID')}/saldos`)
            .once('value')
            .then((resposta)=>{
                resolve(resposta.val());
            })
            .catch(err=>{reject(err)})
        });
    }

    public getDadosUser():Promise<any>{
        return new Promise<any>((resolve,reject)=>{
            firebase.database().ref(`clientes/${localStorage.getItem('UID')}`)
            .once('value')
            .then((res)=>{
                resolve(res.val())
            })
            .catch(err=>{
                reject(err);
            })
        });
    }
    public pegaImagemPerfilUsuario():Promise<any>{
        return new Promise<any>((resolve,reject)=>{
            firebase.storage().ref()
            .child(`imagensUsuarios/${localStorage.getItem('UID')}/perfil.jpeg`)
            .getDownloadURL()
            .then((urlImagem)=>{
                resolve(urlImagem);
            })
            .catch((err)=>{reject(err)});
        });
    }

    public pegaNomeUsuario():Promise<any>{
        return new Promise<any>((resolve,reject)=>{
            firebase.database().ref(`clientes/${localStorage.getItem('UID')}`)
            .once('value')
            .then((res)=>{
                resolve(res.val().nome)
            })
            .catch(err=>{
                reject(err);
            })
        });
    }

    public pegaListaRotasSalvas():Promise<any>{
        return new Promise<any>((resolve,reject)=>{
            firebase.database().ref(`clientes/${localStorage.getItem('UID')}/rotasSalvas`)
            .once('value')
            .then((res)=>{
                resolve(res.val())
            })
            .catch((err)=>{
                reject(err)
            })
        });
    }
}