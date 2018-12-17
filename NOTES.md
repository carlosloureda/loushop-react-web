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

### 6.6. Optimistic Response && Cache Updates with Apollo

### 6.7. Animating our Cart Count Component

### 6.8 Dealing with Deleted Items in CartItems
