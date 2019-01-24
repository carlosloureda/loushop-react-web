#

## Módulo 3. Server Side GraphQL

### GraphQL

Es un spec.
Frontned : Apollo Cliente
Backend: Prisma y GraphQL-Yoga
Lenguaje tipado

Prisma:

- 100% Open-source layer encima de la BBDD parecida a ORM que nos da CRUDS para
  MySQL, Postgress o MongoDB.

  TODO: Montar mi propio Prisma con un Docker, pero aquí usaremos prisma demo server.
  Leer documentacion de prisma.

  - https://www.prisma.io/
  - npm install -g prisma
  - En el backend introducimos 'prisma init'
  - Le damos a que no nos genere nada

          datamodel.prisma (en el ejemplo usa datamodel.sql)
          prisma.yml

    Para subir nuestro servicio prisma sería prisma deploy
    Creamos un .env para prisma.yml (secret lo dejamos comentado para desarrollo)
    Configuramos el hook post-deploy para subir
    Nos da la URL del playground: https://eu1.prisma.sh/carlos-loureda-8b31b2/loushop-backend/dev

- GraphQL types:

  - Int
  - Float
  - String
  - Boolean
  - ID

- No vamos a estar interactuando directamente con ese playground dado que cualquiera que tenga ese URL va a poder jugar con nuestros datos, aquí es donde entra en juego GraphQL- Yoga

** ¿Qué hace Yoga exactamente? **
En Prisma no hay capa de seguridad (permisos), no hay hashing de contraseñas ...
Esto es a lo que llamará Apollo Cliente desde el Cliente. Yoga se encargará de hablar con
Prisma. Y nos va a permitir hacer queries desde JS,

Es un express server, (va encima de Apollo Server)
//TODO: Pasar este formato a usar Apollo Server 2.0

Creamos Unas Queries y unas Mutations de prueba, pero ahora tenemos que conectarlo todo
para que realmente se una a la DB y podamos trabajar, es un poco liante esta parte

- datamodel.prisma -> for Prisma to deploy to database (the models and generate)
- prisma.grpahql -> generated from Prisma server (the Operations ...)
  (prisma nos genera unos filtros que graphQL no tien por defecto, todas esas cosas
  extras del prisma.graphql)
- schema.graphql -> [public facing API] Para GraphQL Yoga, para nuestro JS.
  Para no repetir datos del prims.graphql podemos importar sus tipos, con una forma
  extraña, con # import \* from './generated/prisma.graphql', por ejemplo
- Si nuestras queries en yoga son las mismas que en prisma (imagina que no tenemos
  que añadir autenticación, ni ningún tipo de lógica ...) podemos importar y usar las
  queries de prisma en yoga:
  const { forwardTo } = require("prisma-binding");

      const Query = {
            items: forwardTo("db")
      }

## Módulo 4. Client Side GraphQL

- Apollo nos va a usar Redux, nos va a hacer el caching de los datos, va a manejar
  las mutaciones y las queries montadas con GraphQL. Maneja errores y loading UI
  states.

      - 'apollo-boost': Trae muchas librerías que vas a querer usar con apollo-client.
      Cache, y esas cosas ...
      - withApollo nos da el ApolloClient en next con lo que nos beneficiamos del poder de
      renderizado desde el backend con Next.js
      - Creamos components/Items, vamos a usar Query y gql para hacer consultas.
      - Se usaban HOC para hacer las consultas hasta ahora (en plan export default
      withItems(items)) pero lo que se está haciendo más popular es el renderProp.
      - Vamos a montar también Item para mostrar la parte bonita de Items
      - Next ahora mismo no tiene 'pretty urls' que lo iran metiendo ... sino paquetes

- 4.3. Creating itenms with Mutations

  - Creamos el componente CreateItem, contamos cosas sobre los eventos (el
    handler al usar arrow funcions no necesita el bind)
  - Ahora tenemos que usar GraphQL para guardar nuestros datos: Escribimos una 'query'
    apara la mutacion (CREATE_ITEM_MUTATION), nos recomienda exportarlos (named exports),
    vamos al backend y miramos en schema.graphql para ver como es el método y copiar sus parametros.
    Creamos un método wrapper que le pasa la varibale a la mutacion y luego retornamos los campos
    que queramos.

    Ahora tenemos que exponer esa mutacion con nuestro Componente Mutation. Wes prefiere mandar
    las variables en el mismo Mutation. El hijo de esta Mutation es una funcion.
    Implicit return ( ()). Metemos el Formulario dentro del componente Mutation

-4.5 Uploading Images

Vamos a usar Cloudinary para subir las imagenes a un servidor remoto, podemos
usar el nuestro o Amazon S3. Le gusta al creador.
TODO: Estudiar funcionamiento y precios. Tenemos 10GB for free. Y referral program
Metemos un preset para aplicar transformaciones a las imagenes.

Vamos a subir un método que nos maneje todas las subidas de nuestras imágenes

Hacemos el formulario de subida de imagees (TODO: comprobar y añadir muchos cambios a esto)

-4.6 Uploading Items with Queries and Mutations - Creamos un query y una mutacion
en el backend para item y updateItem.
Creamos la página UpdateItem para actualizar cosas TODO: Actualizar imagenes

-4.7 Delete

- Vemos que con Apollo se ha borrado del cache un elemento pero tenemos que borrarlo
  de la caché. Vamos a usar uno de los 3 argumentos de la mutacion, update
  TODO: Read Apollo doc for updating cache
  TODO: borrar la imagen del servidor cuando borramos un artículo

- 4.8 Display Items
  Sabemos que nos falta el detalle de un item (lo vemos al crear uno nuevo y ver
  el error en la nueva página de redirección). El backend lo tenemos listo.
  Creamos el item.js y el SingleItem, no tiene muchas novedades. Nos indica como
  cambiar el título de la página con sideeffects (con next) Nos cuenta como sobreescribir
  los Head con next. Podemos tener múltiples tags de Head con los que vamos sobreescribiendo
  el Head definido en Meta.

-4.9 Pagination
Creamos un componente y nos habla del backend de las consultas itemsConnection que es
la que nos da mas informacion para la paginacion: Nos devuelve el ItemConnection:
"""Information to aid in pagination."""
pageInfo: PageInfo!

"""A list of edges."""
edges: [ItemEdge]!
aggregate: AggregateItem!
}
pageInfo y edges es bueno para infinite pagination
//TODO: Hacer infinite pagination
En la pagiancion en los botones de Link nos dice que pongamos un 'prefetch'
para que nos haga un pre-render de las previous y next pages, (solo funciona
en producción)
Hemos conseguido que funcione nuestro pagiandor con las urls pero no nos
actualiza los items, eso en el siguiente punto.

-4.10: Pagination and Cache Invalidation
Tenemos que tocar en el backend el query de items. Arreglamos para pasar
skip, first y poder paginar.
Cuando añadimos un nuevo item, no lo vemos en el catálogo porque ya está cacheada
la página, necesitamos invalidar el caché cuando pase eso. (lo mismo va pasar con el
borrado):
fetchPolicy="network-only" --> Eso hace que nunca use el caché (no mola porque perdemos
el caché).

<Query
query={ALL_ITEMS_QUERY}
fetchPolicy="network-only"
variables={{
      skip: this.props.page * perPage - perPage,
      first: perPage
}} >

> Opcion 1. usar el refetchQuery, pero no sabriamos que query usar ..
> Borrar de cache los elementos del cache y meterlos (por el momento no
> podemos borrar solo ciertos elementos del caché y borrar todos es horrible ...
> ) //TODO En el futuro lo resolveremos asdasd

## Módulo 5. Client Side GraphQL

### 5.1 User Signup and Permission Flow

- Añadimos atributos al type USer en datamodel.prisma, por ejemplo los Permisos,
  vamos a usar los enumerandos de graphQL. Actualizamos prisma y creamos un nuevo
  método signup en schema.graphql.
  TODO: Va a user cookies para mandar el JWT. Podriamos usar local storage en vez
  de cookies ( lo hace asi porque quiere que se haga server side rendering the
  la parte del loggedin y con local storage no se hace automatico). Las activa
  como middleware de express.

  Para añadir un permiso usamos: permissions: { set: ["USER"] } --> asi porque
  es un enum y hay que usar el set.

  //TODO: fix the playground

### 5.2 User signup in React

### 5.3 Currently Logged in User with MiddleWare and Rejder Props

- Nos muestra el token JWT que hemos colocado en las cookies. Vamos a decodificar
  el ID para meterlo en todas las peticiones que entren.

- Creamos una consulta me para saber si estoy logueado.
- Creamos el componente User con el que creamos nuestras propio 'Render Props
  Component'. Y ese User lo usaremos en el Nav.

### 5.4 Sign in Form and Custom Error Handling

- Vamos a hacer la mutation Signin. Vemos que al loguearnos no aparece nuestro nombre.
  No es reactivo el Nav, ahora es cuando el refetchQuery dentro de la mutacion nos viene
  de puta madre:
  refetchQueries={[{ query: CURRENT_USER_QUERY }]}
  Y por ello el exportar desde User nos viene genial. (Hacemos lo mismo para Signup)

### 5.5 Sign out Button

- Siguiendo los pasos anteriores es sencillo

### 5.6 Backend Password Reset Flow

Nos comenta que la informacion que tenemos en el usuario por defecto creado en el
prisma.graphql hay datos que no queremos que se vean desde el cliente (el resetToken
y cosas asi). Lo copiamos al schema.graphql y quitamos lo que no queramos.

Nos enseña que las queries sobre Users tiene mas metodos/filtros que User:
const [user] = await ctx.db.query.users({ where: { resetToken ...

### 5.7 Frontend Password Reset Flow

### 5.8 Sending Email

Vamos a user MailTrap para testear desde Dev ops
Para producción el usa Postmark ... (yo sendGrid)
Nos hacemos una cuenta de Mailtrap y metemos las KEYS en .env
Vamos a usar nodemailer y tambien templates (mjml para react ... : https://mjml.io/) (usa pac y juice en otro curso)

### 5.9 Data Relationshipts

Tenemos que crear una relacion entre el Item y el usuario que lo ha subido para venderlo.
Añadimos al modelo de Iteme el User y hacemos una relacion en la mutacion para que se guarde:
user: {
connect: {
id: ctx.request.userId
}
}
(He creado un script para cargar datos automaticamente a la BBDD para no tener que ir
manualmente)

### 5.10 Creating a Gated Sign in Component

Componet wrapper para comprobar si está logeado el usuari (PleaseSignin)
lo utilizamos en la vista de /sell para comprobar que vaya todo ok

### 5.11 Permissions Management

Vamos a hacer un formulario para manejar los permisos de los usuarios
Vamos a necesitar meter middleware para tener en el request los permisos del usuario

### 5.12 Updating Permissions in Local Stage

Creando una vista par aver los permisos

### 5.13 Updating Permissions on the Server

### 5.14 Locking Down DeleteItem Permissions

Ahora debemos permitir borrar elementos solo a los que posseen ese elemnto
o a los que tienen permisos.

## 6. Shopping Cart

### 6.1. Creating our cart in React

Creamos la modal (sidebar modal) para mostrar el carrito de forma básica en
Cart.js

### 6.2. Apollo Local State Queries and Mutations

Vamos a usar Apoll Locar State para guardar los datos asi podremos usar nuestros
datos de servidor en local
En withData añadimos el Local State y en Cart.js usaremos la directiva @client
en las mutaciones y consultas que queramos que se hagan solo en el cliente y
obvien las del servidor. En clientState de withData indicamos los defaults. en
resolvers mete la mutación por ejemplo para togglear el varlo de CartOpen

### 6.3. Server Side Add To Cart

Creamos un tipo de CartItem en el data model de prisma y declaramos la mutacion
addToCart y el campo cart a User. Relanzamos prisma para que genere el resto
de elementos (CartItemToUser, CartItemToItem)

Vamos a crear esa mutacion, nos indica que siempre es mejor hacer queries sobre
elementos plurales más que elementos simples ya que prisma nos da mas formatos
de búsqueda.

Ahora deberiamos acabar pudiendo darle a añadir un elemento de la tienda al carro
y ver que el servidor responde perfectamente y en la bbdd en prisma veremos que
el user tiene datos del cart.

### 6.4. Display Cart Items and Tools

Vamos a añadir el carrito del usuario en la consulta de user y vamos a mostrar los
datos del carrito como son nombre iamgen y precio

### 6.5. Removing Cart Items

Procedemos a crear la mutacion en el backend y el componente del frontend para
eliminar esto.

### 6.6. Optimistic Response && Cache Updates with Apollo

Como hay un espacio de tiempo de unos milisegundos desde que elimnamos un item
hasta que se ve desaparecer vamos a ahcer optimistic reponses para actualizar
el cache de Apollo Client además de actualizar la caché

### 6.7. Animating our Cart Count Component

Vamos a animar el carrito que sale en el Nav para no tener que estar abriendo
la modal para saber cuantos elementos tenemos.
ReactTransitionGroup: Nos duplica elmentos, mete uno nuevo con la nueva cuenta
y elmina el viejo. Ahora transicionamos.

### 6.8 Dealing with Deleted Items in CartItems

Si intentamos borrar un elmento de la tienda que tenemos en el carrito nos salta
error, y que hacemos si otra persona lo tiene en su carrito?

## 7. Advanced UI and Code Quality

### 7.1 Cleaning Up This Render Prop Mess

Tenemos varios Queries y varios Mutations anidados y mejor solucionarlo con ReactAdopt.
Creamos componente Composed, para cargarnos El Mutation y query y meternos en un solo
componente en Cart.js. Usa el ({render}) para evitar los warnings de que no se pasan
children a los componentes Mutation, Query y tal.

### 7.2 Search Dropdown Autocomplete

Downshift (paquete buscador de paypal) para busquedar en la web. Es todo funcionalidad,
no tiene nada de UI, por eso se muestra el poder de las render props.

En este caso nos enseña como acceder directamente a las consultas de Apollo Client
sin usar render props. No queremos cargar la query de busqueda cada vez que se carge la
web sino cuando se busque

### 7.3 Autocomplete with DownShift

Vamos a hacer el autocompletado de la búsqueda con DownShift

## 9 (former 8) Credit Card

### 9.1 Credit Card Processing with Stripe Checkout

Vamos a añadir Stripe a nuestra web, creamos una cuenta 'LouShop' en nuestra cuenta de
email. Lo que hacemos es cargar el componente por defecto de pago de Stripe (StripeCheckout)
y mandamos los datos de la tarjeta de crédito al servidor de Stripe para que nos de el token

### 9.2 Charging Cards on the Server Side

Creamos en el server la mutation para empezar a cobrar la cantidad, en este caso
recuperamos el usuario, recalculamos el total y creamos un cargo en stripe

### 9.3 Saving Orders to the Database

Debemos convertir los cartItems a orderItems

### 9.4 Displaying Single Orders

Creamos query para consultar Order y el componente de Orders ...

### 9.5 Orders Page

Vamos a crear la página de pedidos.
TODO: Paginate orders in order page

## 10. Testing

### 10.1. Unit Testing

Jest: Testing framework y test runner (buscar los tests y los ejecuta). Ademas
aloja 'expect', comprueba valores ...

Enzyme: De AirBnb y nos permite renderizar el componente React y hacer cosas sobre
ese componente (por shallow rendering o montandolo). Hay un paquete para cada versión
de React.

Zero Config. Aqui vamos a meter los tests en un unico directorio en vez de crear carpetas
para compoenentes.

Tenemos una serie de variables globales por lo que no tenemos que importarlas.
Creamos un test de ejemplo y lo ejecutamos con npm run test (lo vemos en package.json)

### 10.2. Mocking

Creamos mocks de funciones, por ejemplo para llamadas a APIs para no tener que esperar.

### 10.3 First Tests and Shallow Rendering

Shallow rendering solo renderiza los componentes padre (podemo ir indicando que entre
en uno con dive() o que entre en todos los hijos de uno: children ...)
Snapshot testing nos va a ayudar mas mas adelante. Actualmente si hacemos un test
y luego cambiamos la estructura del componente tendremos que cambiar todo el test

### 10.4 Snapshot Testing

Nos permite sacar una foto de un componente y nos avisa de si algo ha cambiado.
No hay que hacer un finding loco como en los casos anteriores.
Al usar snapshots, dentro de la carpeta **test** tenemos una carpeta **snapshots**
con el snapshot (item.test.js.snap).
En cuanto cambie algo nos avisa del error y nos da la opción de ejecutar de nuevo
la captura.

Para que los snapshots de los componentes sea coherete podemos usar el JSON del
paquete enzyme-to-json.

Vemos que muchos componentes tienen esqueletos comunes en sus tests: TODO: Buscar
paquete o crear uno que genere los tests automaticos de cada componente en su
estructura.

Nos comentan la diferencia entre shallow o montar, lo ideal es montar, porque se
está usando como lo usaría nuestro usuario y que además se monta todo.
TODO: mount vs shallow.

Ha creado un paquete (waait) que ahora está siendo usado por Apollo en la documentación

### 10.5 Testing and Mocking Apollo Queries

Vamos a usar una serie de liberías, el testUtils que tiene dummy data para fakeElements
y tb usamos la librería casual.
Para hacer snapshots cuando usamos mount no usemos snapshots totaltes ya que nos
va a meter todo el Mocked Apollo Provider.
Para coger ciertos elementos en los tests, añade el tag: [data-test= que es buena idea

### 10.6 More Apollo Query Testing

### 10.7 Testing Pagination

La paginación tiene una serie de características que no tienen los elementos
vistos hasta ahora.
En la teoria daria problemas el router con los prefetch de los Links pero parece
todo solucionado.

### 10.8 Testing Mutations

### 10.9 More Apollo Client Mutation Testing

## 11. Deployment

En nuestro proyecto tenemos 3 cosas que lanzar :).

- 1.  Prisma Server con BD MySQL
- 2.  Yoga Server: Resolvers con Mutation and Query Resolvers
- 3.  React app: next.js

Cogeremos heroku porque nos sirve para todos.
TODO: Usar AWS.

### 11.1 Desploying a Prisma Server to Heroku

Vamos a usar Prisma para crear el heroku server. Creamos DB en heroku desde alli.
Tambien creamos otro server en heroku desde Prisma.
Una vez creados, vemos que no tenemos lanzada nuestra app (nuestra parte de prisma y db)
npm run deploy -- -n
Nos pregunta si queremos enlazar al server que acabamos de montar en heroku y luego
nos dice que nombremos el servicio y la fase del mismo

### 11.2 Deploying Yoga Server to Heroku or Now

### 11.3 Deploying Frontend to Heroku and Now
