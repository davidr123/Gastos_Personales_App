const d = document,
    $form = d.getElementById("agregar-gasto"),
    $gastos = d.querySelector("#gastos ul"),
    $modal = d.getElementById("cerrar"),
    $dinero = d.getElementById("dinero"),
    $formodal = d.querySelector(".formodal"),
    $cerrar = d.getElementById("cerrar"),
    $btnagregar = d.querySelector('.btnagregar');

// d.addEventListener('DOMContentLoaded', PreguntarPresupuesto);
d.addEventListener("DOMContentLoaded", ModalDefect);
$formodal.addEventListener("submit", PreguntarPresupuesto);

$form.addEventListener('submit', agregarGasto)

function ModalDefect(e) {
    $modal.click();
}

class Presupuesto {
    constructor(presupuesto) {
        this.presupuesto = presupuesto;
        this.restante = presupuesto;
        this.gasto = [];
    }

    nuevoGasto(gasto){
        this.gasto= [...this.gasto, gasto];
        console.log(this.gasto);
        $form.reset();
        this.CalcularRestante()
    }

    CalcularRestante(){
       const gastado= this.gasto.reduce((el, gasto)=> el + gasto.cantidad, 0);
       this.restante= this.presupuesto - gastado;
       console.log(this.restante);
    }

    eliminarGasto(id){
        this.gasto = this.gasto.filter(el=> el.id !==id);
        this.CalcularRestante();
    }
}

class UI {
    insertarPresupuesto(cantidad) {
        const { presupuesto, restante } = cantidad;



        d.getElementById("total").textContent = presupuesto;
        d.getElementById("restante").textContent = restante;

        // if(presupuesto.textContent==='' || restante.textContent===''){
        //     $btnagregar.disabled= true;
        // }

       
    }

    comprobarPresupuesto(presupuestoObj){
        const {presupuesto, restante}=presupuestoObj;
const restanteDiv = d.querySelector('.restante');
        if((presupuesto / 4)> restante){
            restanteDiv.classList.remove('alert-success', 'alert-warning');
            restanteDiv.classList.add('alert-danger')
        }else if((presupuesto / 2)> restante){
            restanteDiv.classList.remove('alert-success')
            restanteDiv.classList.add('alert-warning')
        }else{
            restanteDiv.classList.remove('alert-danger', 'alert-warning');
            restanteDiv.classList.add('alert-success');
        }


        if(restante <=0){
            ui.imprimirAlerta('El presupuesto se ha agotado', 'error');
            $btnagregar.disabled=true;
        }

    }

    actualizarRestante(restante){
        d.getElementById("restante").textContent = restante;
            
    }

    imprimirAlerta(mensaje, tipo){
        const divMensaje = d.createElement('div');
        divMensaje.classList.add('text-center', 'alert');
        if(tipo==='error'){
            divMensaje.classList.add('alert-danger')
        }else{
            divMensaje.classList.add('alert-success');
        }

        divMensaje.textContent= mensaje;

      
        d.querySelector('.primario').insertBefore(divMensaje, $form)
            
        setTimeout(() => {
            divMensaje.remove();
        }, 2000);
    


    }


    mostrarGasto(gasto){

        $gastos.innerHTML='';

       gasto.forEach(el=> {
           const {cantidad, nombre, id}= el
        const $nuevoGasto = d.createElement('li');
        $nuevoGasto.className='list-group-item d-flex justify-content-between align-items-center';
        $nuevoGasto.dataset.id= id;

        $nuevoGasto.innerHTML=`${nombre} <span class="badge text-bg-primary badge-pill">$${cantidad}</span>`;

        const $btnBorrar = d.createElement('span');
        // <span class="material-icons">
        // delete
        // </span>

        $btnBorrar.classList.add('material-icons', 'borrar-gasto');
        $btnBorrar.textContent='delete'
        $btnBorrar.style.color='red';
        
        // $btnBorrar.style.fontSize='30px';
        $btnBorrar.onclick=()=>{
            eliminarGasto(id);
        }

        $nuevoGasto.appendChild($btnBorrar);

        $gastos.appendChild($nuevoGasto);
       
       })
    }
}

// function InsertarHtml(cantidad) {
//     const { presupuesto, restante } = cantidad;

//     d.getElementById("total").textContent = presupuesto;
//     d.getElementById("restante").textContent = restante;


// }

const ui = new UI();
let presupuesto;

function PreguntarPresupuesto(e) {
    e.preventDefault();
    $cerrar.click();
    // console.log($dinero.value);
    const PresupuestoIngresado = Number($dinero.value);
    console.log(PresupuestoIngresado);

    if (
        PresupuestoIngresado === "" ||
        isNaN(PresupuestoIngresado) ||
        PresupuestoIngresado === null ||
        PresupuestoIngresado <= 0
    ) {
        $form.querySelector('button[type="submit"]').disabled= true;
        location.reload();
    }

    presupuesto = new Presupuesto(PresupuestoIngresado);
    console.log(presupuesto);

    ui.insertarPresupuesto(presupuesto);

    // InsertarHtml(presupuesto);
}


function agregarGasto(e){
e.preventDefault();

const nombre = d.getElementById('gasto').value;
const cantidad = Number(d.getElementById('cantidad').value) ;

if(nombre === '' || cantidad===''){
   ui.imprimirAlerta('Ambos campos son obligatorios', 'error');
   return;
}else if( cantidad <=0 || isNaN(cantidad)){
    ui.imprimirAlerta('No puede ingresar prespuesto menores o iguales a $0', 'error');
    return;
}

const gastos ={nombre, cantidad, id:Date.now()};

presupuesto.nuevoGasto(gastos);
ui.imprimirAlerta('Correcto');

const {gasto, restante}= presupuesto;
// console.log(gasto);

ui.actualizarRestante(restante);

ui.mostrarGasto(gasto);

ui.comprobarPresupuesto(presupuesto)
}

function eliminarGasto(id){
    presupuesto.eliminarGasto(id);
    const {gasto, restante} = presupuesto;
    ui.mostrarGasto(gasto);
    ui.actualizarRestante(restante);
    ui.comprobarPresupuesto(presupuesto)
}