import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faClipboardList, faPlusSquare } from '@fortawesome/free-solid-svg-icons';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

//URL de nuestra API
const url="http://localhost:8080/api/";

class App extends Component {
state={
  //aqui se guarda la informacion obtenida por el metodo GET
  data:[],
  cuentas:[],
  idCliente:'',


  modalInsertar: false,
  modalEliminar: false,
  modalCuentas: false,
  modalInsertarCuenta: false,


  form:{
    id: '',
    nombre: '',
    apellidoMaterno: '',
    apellidoPaterno: '',
    curp: '',
    rfc: '',
    fechaAlta: ''
  },

  formCuenta:{
    id: '',
    saldoActual: '',
    fechaContratacion: '',
    fechaUltimoMovimiento: '',
    idCliente: '',
    idCuenta: ''
  }

}

peticionGet=()=>{
axios.get(url+"cliente/").then(response=>{
  this.setState({data: response.data});
}).catch(error=>{
  console.log(error);
})
}

peticionPost=async()=>{
  if (this.state.tipoModal=='insertar') {
    delete this.state.form.id;
  }
  await axios.post(url+"cliente/",this.state.form).then(response=>{
    this.modalInsertar();
    this.peticionGet();
  }).catch(error=>{
    console.log(error);
  })
}


peticionDelete=()=>{
  axios.delete(url+"cliente/"+this.state.form.id).then(response=>{
    this.setState({modalEliminar: false});
    this.peticionGet();
  }).catch(error=>{
    console.log(error);
  })
}

getCuentas=(idCliente)=>{
axios.get(url+"clientecuenta/cliente/"+idCliente).then(response=>{
  this.setState({cuentas: response.data});
}).catch(error=>{
  console.log(error);
})
}

iniciar

guardarCuenta=async()=>{

  await axios.post(url+"clientecuenta/",this.state.formCuenta).then(response=>{
    this.modalInsertarCuenta();
    this.peticionGet();
  }).catch(error=>{
    console.log(error);
  })
}

modalInsertar=()=>{
  this.setState({modalInsertar: !this.state.modalInsertar});
}

modalCuentas=()=>{
  this.setState({modalCuentas: !this.state.modalCuentas});
}

modalInsertarCuenta=()=>{
  this.setState({modalInsertarCuenta: !this.state.modalInsertarCuenta});
}

seleccionarCliente=(cliente)=>{
  this.setState({
    idCliente: ''+cliente.id,
    tipoModal: 'actualizar',
    form: {
      id: cliente.id,
      nombre: cliente.nombre,
      apellidoPaterno: cliente.apellidoPaterno,
      apellidoMaterno: cliente.apellidoMaterno,
      curp: cliente.curp,
      rfc: cliente.rfc,
      fechaAlta: cliente.fechaAlta
    },
    formCuenta:{
      id: '',
      saldoActual: '',
      fechaContratacion: '',
      fechaUltimoMovimiento: '',
      idCliente: ''+cliente.id,
      idCuenta: ''
    }
  })
}

handleChange=async e=>{
e.persist();
await this.setState({
  form:{
    ...this.state.form,
    [e.target.name]: e.target.value
  }
});
console.log(this.state.form);
}

handleChangeCuenta=async e=>{
e.persist();
await this.setState({
  formCuenta:{
    ...this.state.formCuenta,
    [e.target.name]: e.target.value
  }
});
console.log(this.state.formCuenta);
}

  componentDidMount() {
    this.peticionGet();
  }


  render(){
    const {form}=this.state;
  return (
    <div className="App">

    <br /><br /><br />

    <button className="btn btn-success" onClick={()=>{this.setState({form: null, tipoModal: 'insertar'}); this.modalInsertar()}}>Agregar Cliente</button>

    <br /><br />

    <table className="table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Apellido Paterno</th>
          <th>Apellido Materno</th>
          <th>CURP</th>
          <th>RFC</th>
          <th>Fecha ALta</th>
          <th>Ver Cuentas</th>
          <th>Cuenta Nueva</th>
          <th>Editar Cliente</th>
          <th>Eliminar Cliente</th>
        </tr>
      </thead>
      <tbody>
        {this.state.data.map(cliente=>{
          return(
            <tr>
              <td>{cliente.id}</td>
              <td>{cliente.nombre}</td>
              <td>{cliente.apellidoPaterno}</td>
              <td>{cliente.apellidoMaterno}</td>
              <td>{cliente.curp}</td>
              <td>{cliente.rfc}</td>
              <td>{cliente.fechaAlta}</td>
              <td>
                <button className="btn btn-primary" onClick={()=>{this.seleccionarCliente(cliente); this.modalCuentas(); this.getCuentas(cliente.id) }}><FontAwesomeIcon icon={faClipboardList}/></button>
              </td>
              <td>
                <button className="btn btn-primary" onClick={()=>{this.seleccionarCliente(cliente); this.modalInsertarCuenta(); this.setState({idCliente: ''+cliente.id}); }}><FontAwesomeIcon icon={faPlusSquare}/></button>
              </td>
              <td>
                <button className="btn btn-primary" onClick={()=>{this.seleccionarCliente(cliente); this.modalInsertar()}}><FontAwesomeIcon icon={faEdit}/></button>
              </td>
              <td>
                <button className="btn btn-danger" onClick={()=>{this.seleccionarCliente(cliente); this.setState({modalEliminar: true})}}><FontAwesomeIcon icon={faTrashAlt}/></button>
              </td>
          </tr>
          )
        })}
      </tbody>
    </table>



    <Modal isOpen={this.state.modalInsertar}>
                <ModalHeader style={{display: 'block'}}>
                  <span style={{float: 'right'}} onClick={()=>this.modalInsertar()}>x</span>
                </ModalHeader>
                <ModalBody>
                  <div className="form-group">
                    <label htmlFor="id">ID</label>
                    <input className="form-control" type="text" name="id" id="id" readOnly onChange={this.handleChange} value={form?form.id: ''}/>
                    <br />
                    <label htmlFor="nombre">Nombre</label>
                    <input className="form-control" type="text" name="nombre" id="nombre" onChange={this.handleChange} value={form?form.nombre: ''}/>
                    <br />
                    <label htmlFor="apellidoPaterno">Apellido Paterno</label>
                    <input className="form-control" type="text" name="apellidoPaterno" id="apellidoPaterno" onChange={this.handleChange} value={form?form.apellidoPaterno: ''}/>
                    <br />
                    <label htmlFor="apellidoMaterno">Apellido Materno</label>
                    <input className="form-control" type="text" name="apellidoMaterno" id="apellidoMaterno" onChange={this.handleChange} value={form?form.apellidoMaterno: ''}/>
                    <br />
                    <label htmlFor="curp">CURP</label>
                    <input className="form-control" type="text" name="curp" id="curp" onChange={this.handleChange} value={form?form.curp: ''}/>
                    <br />
                    <label htmlFor="rfc">RFC</label>
                    <input className="form-control" type="text" name="rfc" id="rfc" onChange={this.handleChange} value={form?form.rfc: ''}/>
                    <br />
                    <label htmlFor="fechaAlta">Fecha Alta</label>
                    <input className="form-control" type="Date" name="fechaAlta" id="fechaAlta" onChange={this.handleChange} value={form?form.fechaAlta: ''}/>
                  </div>
                </ModalBody>

                <ModalFooter>
                  <button className="btn btn-success" onClick={()=>this.peticionPost()}>
                    Guardar
                  </button>
                  <button className="btn btn-danger" onClick={()=>this.modalInsertar()}>
                    Cancelar
                  </button>
                </ModalFooter>
          </Modal>


          <Modal isOpen={this.state.modalEliminar}>
            <ModalBody>
               Estás seguro que deseas eliminar al cliente {form && form.nombre}
            </ModalBody>
            <ModalFooter>
              <button className="btn btn-danger" onClick={()=>this.peticionDelete()}>Sí</button>
              <button className="btn btn-secundary" onClick={()=>this.setState({modalEliminar: false})}>No</button>
            </ModalFooter>
          </Modal>


          <Modal isOpen={this.state.modalCuentas}>
            <ModalHeader style={{display: 'block'}}>
              <span style={{float: 'right'}} onClick={()=>this.modalCuentas()}>x</span>
            </ModalHeader>
            <ModalBody>
              <div className="form-group">
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Saldo Actual</th>
                    <th>Fecha Contratación</th>
                    <th>Ultimo Movimiento</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.cuentas.map(cuenta=>{
                    return(
                      <tr>
                        <td>{cuenta.id}</td>
                        <td>{cuenta.saldoActual}</td>
                        <td>{cuenta.fechaContratacion}</td>
                        <td>{cuenta.fechaUltimoMovimiento}</td>
                    </tr>
                    )
                  })}
                </tbody>
              </table>
              </div>
            </ModalBody>
            <ModalFooter>
              <button className="btn btn-danger" onClick={()=>this.modalCuentas()}>
                Cancelar
              </button>
            </ModalFooter>
          </Modal>


          <Modal isOpen={this.state.modalInsertarCuenta}>
                      <ModalHeader style={{display: 'block'}}>
                        <span style={{float: 'right'}} onClick={()=>this.modalInsertarCuenta()}>x</span>
                      </ModalHeader>
                      <ModalBody>
                        <div className="form-group">

                          <label htmlFor="saldoActual">Saldo Actual</label>
                          <input className="form-control" type="text" name="saldoActual" id="saldoActual" onChange={this.handleChangeCuenta} />
                          <br />
                          <label htmlFor="fechaContratacion">Fecha Contratación</label>
                          <input className="form-control" type="Date" name="fechaContratacion" id="fechaContratacion" onChange={this.handleChangeCuenta} />
                          <br />
                          <label htmlFor="fechaUltimoMovimiento">Fecha Ultimo Movimiento</label>
                          <input className="form-control" type="Date" name="fechaUltimoMovimiento" id="fechaUltimoMovimiento" onChange={this.handleChangeCuenta} />
                        </div>
                      </ModalBody>

                      <ModalFooter>
                        <button className="btn btn-success" onClick={()=>this.guardarCuenta()}>
                          Guardar
                        </button>
                        <button className="btn btn-danger" onClick={()=>this.modalInsertarCuenta()}>
                          Cancelar
                        </button>
                      </ModalFooter>
                </Modal>
  </div>



  );
}
}
export default App;
