//Variables
const carrito = document.getElementById('carrito');
const cursos = document.getElementById('lista-cursos');
const listaCursos = document.querySelector('#lista-carrito tbody');
const vaciarCarrito = document.querySelector('#vaciar-carrito');





//Listeners

//Acordase de llamar a la función de eventListeners, si no, no funciona desde el principio!!
cargarEventListeners();// <<<<--------

function cargarEventListeners() {
    //dispara cuando se presiona agregar carrito
    cursos.addEventListener('click',comprarCursos);

    //elimina curso del carrito
    carrito.addEventListener('click', eliminaCurso);

    //elimina todo del carrito
    vaciarCarrito.addEventListener('click', eliminarTodosCursos);

    //al cargar documento, muestra local storage
    document.addEventListener('DOMContentLoaded', leerLocalStorage);
}




//FUNCIONEs
//funcion que añade el curso al carrito
function comprarCursos(e) {
    e.preventDefault();
    //delegation para class agregar-carrito ( clase de los botones para agregar al carrito )
    if(e.target.classList.contains('agregar-carrito')) {
        const curso = e.target.parentElement.parentElement;
        //para seleccionar toda la información del curso en cuestión
        leerDatosCurso(curso);
        //se llama a la función que nos proveerá de los datos del curso para agregar al carrito
    };
}



//Lee los datos del curso
function leerDatosCurso(curso) {
    //se crea un objeto que almacene toda la informacion requerida del curso
    const cursoInfo = {
        imagen: curso.querySelector('img').src,
        titulo: curso.querySelector('h4').textContent,
        precio: curso.querySelector('.precio span').textContent,
        id: curso.querySelector('a').getAttribute('data-id')
    }
    insertarCarrito(cursoInfo); 
}

//muestra el curso seleccionado en el carrito en el DOM

function insertarCarrito(curso) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td><img src="${curso.imagen}" width=100 /></td>
        <td> ${curso.titulo}</td>
        <td> ${curso.precio}</td>
        <td> <a href="#" class="borrar-curso" data-id="${curso.id}">X</a></td>
    `;

    listaCursos.appendChild(row);
    guardarCursoLocalStorage(curso);
}

//elimina curso del carrito en el DOM
function eliminaCurso(e) {
    e.preventDefault();
    let curso, cursoId;
    if(e.target.classList.contains('borrar-curso')) { // delegas el listener hacia la clase
        //borrar-curso que la posee el boton "x" de eliminar
        e.target.parentElement.parentElement.remove(); //remueves todo desde el padre 
        //del padre de la "x"(todo el item del curso en el carrito);
        curso = e.target.parentElement.parentElement;
        cursoId= curso.querySelector('a').getAttribute('data-id');
        console.log(cursoId);
    }

    eliminarCursoLocalStorage(cursoId);
}

//funcion que elimina todos los elementos del carrito en el DOM

function eliminarTodosCursos(e) {
    //forma 1
    //listaCursos.innerHTML = '';
    //forma 2
    while(listaCursos.firstChild) {
        listaCursos.removeChild(listaCursos.firstChild);
    }

    //elimina todos los cursos del LocalStorage
    vaciarLocalStorage();


    return false;
}

//LOCAL STORAGES FUNCTIONS

function guardarCursoLocalStorage(curso) {
    let cursos;
    //toma los valores del local storage si existen, si no retorna un array vacio
    cursos = obtenerCursoLocalStorage();

    //el curso que se selecciona se agrega al arreglo del LocalStorage
    cursos.push(curso);

    //se devuelve el nuevo array al localStorage con la información actualizada
    localStorage.setItem('cursos', JSON.stringify(cursos));
}


//comprueba que hay elementos en local Storage
function obtenerCursoLocalStorage() {
    let cursosLS;
    //comprobamos si hay algo en local storage
    if(localStorage.getItem('cursos') === null) {
        cursosLS = [];
    } else { //JSON.parse transforma lo que viene como string del LS, en un array.
        cursosLS = JSON.parse(localStorage.getItem('cursos'));
    }
    
    return cursosLS;
}

//imprime los cursos de local storage

function leerLocalStorage() {
    let cursosLS;

    cursosLS = obtenerCursoLocalStorage();

    cursosLS.forEach(function(curso) {
        const row = document.createElement('tr');
    row.innerHTML = `
        <td><img src="${curso.imagen}" width=100 /></td>
        <td> ${curso.titulo}</td>
        <td> ${curso.precio}</td>
        <td> <a href="#" class="borrar-curso" data-id="${curso.id}">X</a></td>
    `;

    listaCursos.appendChild(row);
    })
    
}


//elimina el curso por el ID de localStorage
function eliminarCursoLocalStorage(curso) {
    let cursosLS;

    cursosLS = obtenerCursoLocalStorage();

    cursosLS.forEach(function(cursoLS,index) {
        if(cursoLS.id === curso) {
            cursosLS.splice(index,1);
        }
    });

    console.log(cursosLS);
    //Arreglo actual al storage
    localStorage.setItem('cursos', JSON.stringify(cursosLS));

}

//elimina todos los cursos del Local Storage

function vaciarLocalStorage() {
    localStorage.clear();
}