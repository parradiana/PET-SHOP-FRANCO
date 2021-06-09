//FETCHEO DE LA API//
function fetchearProductos() {
    fetch("https://apipetshop.herokuapp.com/api/articulos", {
    })
        .then(response => response.json())
        .then(data => miPrograma(data))
        .catch(error => console.log(error))
}
if (document.querySelector("#farmacia")) {
    fetchearProductos()
}
if (document.querySelector("#juguetes")) {
    fetchearProductos()
}
let carrito = []
if (localStorage.getItem("carrito")) {
    carrito = JSON.parse(localStorage.getItem("carrito"))
}
// pintarCarrito()
//FUNCIONALIDAD TARJETAS DE PRODUCTOS//
function miPrograma(data) {
    const articulos = data.response
    var juguetes = articulos.filter((juguete) => juguete.tipo == "Juguete")
    var medicamentos = articulos.filter((medicamento) => medicamento.tipo == "Medicamento")
    function mostrarTarjetas(array) {
        array.map(producto => {
            const tarjeta = document.createElement("div")
            tarjeta.className = ("col-sm-4 contenedorTarjetas")
            tarjeta.innerHTML = `
            <div class="card frente">
            <img src="${producto.imagen}" class="card-img-top tarjetas" alt="..."></img>
            <div class="card-body text-center">           
                <h5 class="card-title" id="${producto.nombre}">${producto.nombre}</h5>               
                <ul class="list-group list-group-flush">
                <li class="list-group-item fs-3 border-bottom">$ ${producto.precio}</li>
                </ul>
                <p class="ultimasUnidades text-light">${producto.stock < 5 ? "¡ÚLTIMAS UNIDADES!" : ""}</p>
            </div>
            <div class="card dorso text-center">
                <h5 class="card-title">Descripción del producto:</h5>  
                <p class="card-text">${producto.descripcion}</p>
            </div>
            </div>
            `
            const comprar = document.createElement("div")
            comprar.className = ("col-sm-4")
            comprar.innerHTML = `
            <button id="${producto._id}" class=" btn text-light botonAgregarAlCarrito">AÑADIR AL CARRITO</button>
            `
            document.getElementById("productos").appendChild(tarjeta)
            tarjeta.appendChild(comprar)
            var nombreAgregado = document.getElementById(producto.nombre)
            document.getElementById(producto._id).addEventListener("click", () => {
                agregarAlCarrito(producto, nombreAgregado)
            })        
        })        
    }
    function notificacionesToast(textoint,clase) {        
        let notifToast = document.getElementById("liveToast")
        let toast =  new bootstrap.Toast(notifToast)
        let texto = document.getElementById("texto")
        texto.textContent= `${textoint}`
        toast._element.classList.add(`${clase}`)
        toast._config.delay = 1000
        toast.show()

    }
    function agregarAlCarrito(producto, nombreAgregado) {
        if (producto.stock <= 0) {
            notificacionesToast('No hay stock para poder comprar', 'bg-info')
            return false
        }
        let productoAgregado = carrito.some(producto => producto.nombre === nombreAgregado.textContent)
        if (productoAgregado) {
            notificacionesToast('¡Este producto ya fue agregado al carrito!','bg-danger')


        } else {
            carrito.push({
                ...producto,
                unidades: 1

            })
            notificacionesToast('¡Has añadido un producto al carrito!','bg-success')
        }
        localStorage.setItem("carrito", JSON.stringify(carrito))
        pintarCarrito()
    }
    function pintarCarrito() {
        document.getElementById("carrito").innerHTML = ""
        carrito.map(producto => {
            const cajita = document.createElement("div")
            cajita.className = "row d-flex  d-flex align-items-center border-bottom"
            cajita.innerHTML = `
            <div class="col"><img src="${producto.imagen}" class="imgCarrito" alt="..."></img> </div>
            <div class="col-4"><p>${producto.nombre}<p></div>
            <div class="col-3 d-flex justify-content-around d-flex align-items-center ">             
            <button class="botonUnidades" id="+${producto._id}">+</button>
            <h5>${producto.unidades} </h5>
            <button class="botonUnidades" id="-${producto._id}">-</button> 
            </div>
            <div class="col-2"><h5 class="text-center">$ ${producto.unidades * producto.precio}</h5> </div>
            <div class="col"><i class="bi bi-trash-fill fs-2"id="B${producto._id}"></i> </div>            
            `
            document.getElementById("carrito").appendChild(cajita)
            document.getElementById(`+${producto._id}`).addEventListener("click", () => sumarCantidades(producto._id))
            document.getElementById(`-${producto._id}`).addEventListener("click", (e) => restarCantidades(producto._id, e))
            document.getElementById(`B${producto._id}`).addEventListener("click", (e) => borrarProducto(e))

        })
        const nCantidad = carrito.reduce((acc, { unidades }) => acc + unidades, 0)
        localStorage.setItem("carrito", JSON.stringify(carrito))
        const nPrecio = carrito.reduce((acc, { unidades, precio }) => acc + unidades * precio, 0)
        localStorage.setItem("carrito", JSON.stringify(carrito))
        const cajaFooter = document.createElement("div")
        cajaFooter.className = "row d-flex  d-flex align-items-center"
        cajaFooter.innerHTML = `
        <div class="col-5"><h3>Total Productos</h3></div>
        <div class="col-4"><h5 class="text-center cantidadTotal">${nCantidad} u.</h5></div>
        <div class="col"><h5 class="fs-3">$ ${nPrecio}</h5></div>       
        `
        document.getElementById("carrito").appendChild(cajaFooter)
    }
    function sumarCantidades(id) {
        const nuevoCarrito = carrito.map(producto => {
            if (producto._id === id) {
                if (producto.stock < producto.unidades + 1) {
                    notificacionesToast('¡No hay más stock disponible en la tienda!', 'bg-danger' )
                    return producto
                }
                producto.unidades++
            }
            return producto
        })
        carrito = nuevoCarrito
        pintarCarrito()
        localStorage.setItem("carrito", JSON.stringify(carrito))
    }
    function restarCantidades(id, e) {
        carrito.map(producto => {
            if (producto._id === id) {
                if (producto.unidades > 1) {
                    producto.unidades--

                    return producto
                } else {
                    let idProducto = e.target.getAttribute("id")
                    carrito = carrito.filter((producto) => `-${producto._id}` !== idProducto)
                }
            }
        })
        pintarCarrito()
        localStorage.setItem("carrito", JSON.stringify(carrito))
    }
    function borrarProducto(e) {
        let idProducto = e.target.getAttribute("id")
        carrito = carrito.filter((producto) => `B${producto._id}` !== idProducto)
        pintarCarrito()
        localStorage.setItem("carrito", JSON.stringify(carrito))
    }
    document.getElementById("boton-vaciar").addEventListener("click", () => vaciarCarrito())
    function vaciarCarrito() {
        carrito = [];
        pintarCarrito();
        localStorage.clear();
    }
    document.getElementById("boton-finalizar").addEventListener("click", () => finalizarCompra())
    function finalizarCompra() {
        notificacionesToast('¡Finalizaste tu compra! ¡Gracias por elegirnos!', 'bg-success')
        carrito = [];
        pintarCarrito();
        localStorage.clear();
    }
    if (document.querySelector("#farmacia")) {
        mostrarTarjetas(medicamentos)
        pintarCarrito()
    } else if (document.querySelector("#juguetes")) {
        mostrarTarjetas(juguetes)
        pintarCarrito()
    }
}
//VALIDACIÓN FORMULARIO//
function contacto() {
    var forms = document.querySelectorAll('.needs-validation')
    forms.forEach(function (form) {
        form.addEventListener('submit', function (event) {
            if (form.checkValidity()) {
                event.preventDefault()
                Swal.fire('Tu mensaje ha sido enviado! Gracias por escribirnos! Le responderemos a la brevedad', '', "success")
            }
            if (!form.checkValidity()) {
                event.preventDefault()
                Swal.fire('No se han cargado todos los campos requeridos!', '', "info")
                form.classList.add('was-validated'), false
            }
            form.reset()
        }
        )
    })
}
if (document.querySelector("#contacto")) {
    contacto()
}

