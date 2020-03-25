import * as firebase from 'firebase';

export class Cadastros{

    public cadastrarCliente(dadosCliente,arquivo):Promise<any>{
        dadosCliente.nivel = 2;
        dadosCliente.horaDataRegistro = this.retornaHoraDataAtual();
        dadosCliente.verificacao = false;
        dadosCliente.saldo = 0;
        return new Promise((resolve,reject)=>{
            firebase.auth().createUserWithEmailAndPassword(dadosCliente.email,dadosCliente.senha)
            .then((ok)=>{
                firebase.database().ref(`clientes/${ok.user.uid}`)
                .set(dadosCliente)
                .then(()=>{
                    this.salvaImgStorage(`imagensUsuarios/${ok.user.uid}/${arquivo.nomeImagem}`,arquivo.arquivo);
                    var use = firebase.auth().currentUser;
                    use.sendEmailVerification()
                    .then(()=>{
                      resolve(dadosCliente)
                    })
                    .catch((err)=>{
                        reject(err)
                    })
                })
                .catch((err)=>{
                    reject(err)
                })
            })
            .catch((err)=>{
                reject(err);
            })
        })
    }

    public salvaImgStorage(pathNome,arquivo):void{
        firebase.storage().ref()
        .child(pathNome)
        .put(arquivo);
    }

    public cadastrarPedidoCorrida(dadosMotorista,dadosCorrida):Promise<any>{
        //console.log(dadosCorrida)
        dadosCorrida.cancelamentoVisto = false;
        dadosCorrida.corridaAntiga = false;
        return new Promise<any>((resolve,reject)=>{
            firebase.database().ref(`motoristas/${dadosMotorista.dadosMotorista.UIDMotorista}/corridas/${localStorage.getItem('UID')}`)
            .set(dadosCorrida)
            .then(res=>{resolve(`motoristas/${dadosMotorista.dadosMotorista.UIDMotorista}/corridas/${localStorage.getItem('UID')}`);})
            .catch(err=>{reject(err)})
        })
    }

    public retornaHoraDataAtual():any{
        const data= new Date();
        return data.getDate()+'/'+data.getMonth()+1+'/'+data.getFullYear()+' '+ data.getHours()+':'+data.getMinutes()
    }

    public cadastraSaldoEmConta(valor):Promise<any>{
        return new Promise<any>((resolve,reject)=>{
            firebase.database().ref(`clientes/${localStorage.getItem('UID')}/saldo`)
            .set(valor)
            .then((ok)=>{
               resolve(ok);
            })
            .catch(err=>{
               reject(err);
            })
        })
    }

    public cadastrarEstrelasParaMotorista(UidMotorista,valorEstrela,comentario):Promise<any>{
        return new Promise<any>((resolve,reject)=>{
            firebase.database().ref(`motoristas/${UidMotorista}/saldoClassificacao/`)
            .push({quantidadeEstrelas:valorEstrela,comentario:comentario})
            .then(()=>{
                resolve('ok');
            })
            .catch((err)=>{
                reject(err);
            });
        });
    }

    async contraPropostaAceitaPedido(UIDMotorista){
        try{
            await firebase.database().ref(`motoristas/${UIDMotorista}/corridas/${localStorage.getItem('UID')}/pedidoAceito`).set('ok');
            await firebase.database().ref(`motoristas/${UIDMotorista}/corridas/${localStorage.getItem('UID')}/contraPropostaMotorista/contraPropostaAceita`).set('ok');
        }catch{
            console.log('erro!');
        }       
    }

    async contraPropostaNegarPedido(UIDMotorista,arrayPedidoNegados){
        arrayPedidoNegados.push(UIDMotorista)
        try{
            await firebase.database().ref(`motoristas/${UIDMotorista}/corridas/${localStorage.getItem('UID')}/pedidoAceito`).set('nao');
            await firebase.database().ref(`motoristas/${UIDMotorista}/corridas/${localStorage.getItem('UID')}/pedidoNegadoPor`).set(arrayPedidoNegados);
            await firebase.database().ref(`motoristas/${UIDMotorista}/corridas/${localStorage.getItem('UID')}/contraPropostaMotorista/contraPropostaAceita`).set('nao');
            return 'ok';
        }catch{
            return 'erro!';
        }       
    }


    public salvarRotaDestino(rota):Promise<any>{
        return new Promise<any>((resolve,reject)=>{
            firebase.database().ref(`clientes/${localStorage.getItem('UID')}/rotasSalvas`)
            .push(rota)
            .then(()=>{resolve('salvo')})
            .catch((err)=>{reject(err)})
        });
    }

    public cancelamentoDeCorrida(UIDMotorista):Promise<any>{
        return new Promise<any>((resolve,reject)=>{
            firebase.database().ref(`motoristas/${UIDMotorista}/corridas/${localStorage.getItem('UID')}/statusDeCorrida`)
            .set('cancelada')
            .then(()=>{resolve('ok')})
            .catch((err)=>{reject(err)})
        });
    }

}