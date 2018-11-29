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
  cambiar el título de la página con sideeffects (con next)
