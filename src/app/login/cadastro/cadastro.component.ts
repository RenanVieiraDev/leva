import { Component, OnInit,ViewChild } from '@angular/core';
import { AlertController } from '@ionic/angular';
import {FormGroup,FormControl} from '@angular/forms';
import {Router} from '@angular/router'
import {Cadastros} from '../../shared/services/cadastros.service';
import {ValidacoesForm} from '../../shared/services/validacoesform.service';
import {authService} from '../../shared/services/auth.service';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.scss'],
})
export class CadastroComponent implements OnInit {

  @ViewChild('imgPerf',{static:false}) public imgPerf;

  private imgPerfilMotor = {base64:null,blob:null};
  public loadingButton = false;
  public telaConfEmail = false;
  public dadosClientes = new FormGroup({
    nome:new FormControl(null),
    sexo:new FormControl(null),
    dataNascimento:new FormControl(null),
    cpf:new FormControl(null),
    email:new FormControl(null),
    senha:new FormControl(null),
    confSenha:new FormControl(null)
  })
  constructor(
    public cadastro:Cadastros,
    public validacoes:ValidacoesForm,
    public alertController: AlertController,
    public rota:Router,
    public auth:authService
    ) { }

  ngOnInit() {}

  public cadastroCliente():void{
    this.loadingButton = true;
    let arquivo = {nomeImagem:'perfil.jpeg',arquivo:this.imgPerfilMotor.blob,tipo:'perfil'};
    this.validacoes.validarFormularioCadastroCliente(this.dadosClientes.value,arquivo)
    .then((retorno)=>{
        this.cadastro.cadastrarCliente(this.dadosClientes.value,arquivo)
        .then((resposta)=>{
          this.imgPerfilMotor.base64 = null
          this.dadosClientes.reset();
          this.loadingButton = false;
          this.telaConfEmail = true;
        })
        .catch((err)=>{
          let msg = this.validacoes.tradutorCode(err.code);
          this.presentAlert('ops...',`${err.code}`,msg);
          this.loadingButton = false;
        })
    })
    .catch((err)=>{
      this.loadingButton = false;
      switch(err){
        case 1:
          this.presentAlert('Dado incorreto','Nome','O nome informado é invalido.');
        break;
        case 2:
          this.presentAlert('Dado incorreto','Genero','Por favor informe o genero sexual.');
        break;
        case 3:
          this.presentAlert('Dado incorreto','Nascimento','Data de nascimento invalida.');
        break;
        case 4:
          this.presentAlert('Dado incorreto','CPF','CPF invalido por favor insira um cpf valido.');
        break;
        case 5:
          this.presentAlert('Dado incorreto','Email','Email invalido, Por favor informe um email valido.');
        break;
        case 6:
          this.presentAlert('Dado incorreto','Senha','Senha incorreta,revisa as senhas');
        break;
        case 7:
          this.presentAlert('Dado incorreto','Imagem perfil','Por favor, carregue uma imagem para seu perfil para continuar o cadastro.');
        break;
      }
    })
  }

  async presentAlert(titulo,subTitulo,msg) {
    const alert = await this.alertController.create({
      header: titulo,
      subHeader: subTitulo,
      message: msg,
      buttons: ['Volta']
    });
    await alert.present();
  }
  public inicioCof():void{
    this.telaConfEmail = false;
    this.rota.navigate(['/login']);
  }

  public clickUploadImagem():void{
    (this.imgPerf.nativeElement).click();
  }

  public converteImagemParaBlob(arquivo):Promise<any>{
    return new Promise<any>((resolve,reject)=>{
      let readerBlob = new FileReader();
      readerBlob.onload =  () => {
        let blob = new Blob([readerBlob.result], { type: "image/jpeg" });
        resolve(blob);
      }
      readerBlob.readAsArrayBuffer(arquivo);
    })
   
  }

  public converteImagemParaBase64(arquivo):Promise<any>{
    return new Promise<any>((resolve,reject)=>{
      let readerBase64 = new FileReader();
      readerBase64.onload = ()=> {
        resolve(readerBase64.result);
      }
      readerBase64.readAsDataURL(arquivo);
    }); 
  }
 
  async eviarImgPerf(){
    this.imgPerfilMotor.blob = await this.converteImagemParaBlob(this.imgPerf.nativeElement.files[0])
    this.imgPerfilMotor.base64 = await this.converteImagemParaBase64(this.imgPerf.nativeElement.files[0]);
  }

}
