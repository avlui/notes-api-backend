/*
Dependencias del proyecto:
    -nodemon: Refresca el servidor si se detecta algun cambio en este --> (npm install nodemon -D)

    -express: Permite crear un servidor con diferentes rutas y midlewares --> (npm install express)

    -eslint:  Detecta el code styling y señala errores o da sugerencias para el código --> (npm install eslint -D)

    -standard: Cumple la misma función que eslint pero dando un estilo diferente al código --> (npm install standard -D)

    -cors: Permite que un user agent obtenga permiso para acceder a recursos seleccionados desde un servidor,
          en un origen distinto (dominio) al que pertenece el servidor.Con su configuración por defecto permite
          que cualquier tipo de origen funcione en nuestra API--> (npm install cors )
*/

// Importación de modulos
const express = require('express')
const cors = require('cors')

// Importando midleware
const logger = require('./loggerMD')

let notes = [
  {
    userId: 1,
    id: 1,
    title: 'delectus aut autem',
    body: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam, quam.',
    completed: false
  },
  {
    userId: 1,
    id: 2,
    title: 'quis ut nam facilis et officia qui',
    body: '...Lorem ipsum dolor sit amet consectetur.',
    completed: false
  },
  {
    userId: 1,
    id: 3,
    title: 'quis ut nam facilis et officia qui',
    body: 'amet consectetur adipisicing elit. Ipsam, quam.',
    completed: false
  },
  {
    userId: 1,
    id: 4,
    title: 'fugiat veniam minus',
    body: 'Lorem ipsum dolor sit amet.',
    completed: false
  }
]

const app = express()
app.use(express.json())
/*
Un MidleWare es una función que intercepta una petición (de cualquier tipo) que este pasando por una API.
Un MidelWare se declara con "use" y recibe un callback en el que se especifica que se hará con la petición.
En el callback debe haber una sentencia next() para que la petición siga su curso y no se quede en el midleware.
*/
app.use(logger) // usando un midleware que creamos en otro modulo
app.use(cors())
/*
En este caso cada petición tiene:
    -reques: donde se guarda la petición al servidor y su información
    -response: donde se guarda la información de la respuesta del servidor
    -next: permite que las peticiones sigan buscando otro midleware o petrición por la cual pasar (es util para el control de errore)
*/
app.get('/', (request, response, next) => {
  response.send('<h1>Hello from the Express server</h1>')
  next()
})

app.get('/api/notes', (request, response, next) => {
  response.json(notes)
  next()
})
// El ":id" es una porción dinámica del path.
app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id) // Guardamos la parte dinámica del path como un número.
  const note = notes.find(note => note.id === id)// Recuperando elem. que tiene una id igual a la porción dinámica del path.
  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})

// delete es otra petición usada especialmente para borrar algún dato de nuestro servidor.
app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  notes = notes.find(note => note.id !== id)
  response.status(204).end()
})

// post es una petición que nos permite crear un recurso en nuestro servidor.
app.post('/api/notes', (request, response) => {
  const note = request.body

  // Contron de error para cuando faltan atributos en el objeto.
  if (!note || !note.title) {
    return response.status(400).json({
      error: 'content missing...'
    })
  }

  const ids = notes.map(note => note.id)
  const MaxId = Math.max(...ids) // Generando la id para el nuevo objeto.

  const newNote = {
    id: MaxId + 1,
    title: note.title,
    body: note.body,
    userId: note.userId,
    completed: typeof note.completed !== 'undefined' ? note.completed : false
  }

  notes = [...notes, newNote] // Agregando la nueva nota al arreglo

  response.status(201).json(newNote)
})

// Cuando se esta en una de las rutas ya definidas y se hace una petición sin respuesta se entra a este midleware.
app.use((reqest, resposnse) => {
  console.log('404')
  resposnse.status(404).json({
    error: 'not found'
  })
})

const PORT = process.env.PORT || 3002 // El puerto lo asigna Heroku. E caso de error se usa el 3002

app.listen(PORT, () => {
  console.log(`server running in port ${PORT}`)
})
