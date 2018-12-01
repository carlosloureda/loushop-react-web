const { prisma } = require("../generated//prisma-client");

/* Populate items for development*/

const Items = [
  {
    title: "Una sudadera sport",
    description: "Sudadera Marrón",
    price: 30001,
    image:
      "https://res.cloudinary.com/carloslorueda/image/upload/v1543369426/loushop/gwmx6qq79pnpq9k89uza.png",
    largeImage:
      "https://res.cloudinary.com/carloslorueda/image/upload/c_scale,q_auto,w_1000/v1543369426/loushop/gwmx6qq79pnpq9k89uza.png"
  },
  {
    title: "Elegante gorro mácara romano",
    description: "Lo vas a petar con este gorro",
    price: 24990,
    image:
      "https://res.cloudinary.com/carloslorueda/image/upload/v1543459317/loushop/nv2ae55j9ctxtzwoew4o.webp",
    largeImage:
      "https://res.cloudinary.com/carloslorueda/image/upload/c_scale,q_auto,w_1000/v1543459317/loushop/nv2ae55j9ctxtzwoew4o.webp"
  },
  {
    title: "Cazadora Adidas",
    description: "Una sexy cazadora para mujer",
    price: 55200,
    image:
      "https://res.cloudinary.com/carloslorueda/image/upload/v1543508047/loushop/zjtdtblx52m9r6qrmeux.jpg",
    largeImage:
      "https://res.cloudinary.com/carloslorueda/image/upload/c_scale,q_auto,w_1000/v1543508047/loushop/zjtdtblx52m9r6qrmeux.jpg"
  },
  {
    title: "Jersey cool",
    description: "Un cool jersey de entretiempo",
    price: 37500,
    image:
      "https://res.cloudinary.com/carloslorueda/image/upload/v1543508097/loushop/avbywgotkp68casfnsfq.jpg",
    largeImage:
      "https://res.cloudinary.com/carloslorueda/image/upload/c_scale,q_auto,w_1000/v1543508097/loushop/avbywgotkp68casfnsfq.jpg"
  },
  {
    title: "Camisa leñador",
    description: "Camiseta leñador para ser un machirulo opersor camuflado",
    price: 7000,
    image:
      "https://res.cloudinary.com/carloslorueda/image/upload/v1543508145/loushop/trkoofnzcit9kiqjyff1.jpg",
    largeImage:
      "https://res.cloudinary.com/carloslorueda/image/upload/c_scale,q_auto,w_1000/v1543508145/loushop/trkoofnzcit9kiqjyff1.jpg"
  },
  {
    title: "Camiseta Versage",
    description: "No se te escaparan!",
    price: 80000,
    image:
      "https://res.cloudinary.com/carloslorueda/image/upload/v1543508506/loushop/g4louvmkp8ndcsvaqbri.jpg",
    largeImage:
      "https://res.cloudinary.com/carloslorueda/image/upload/c_scale,q_auto,w_1000/v1543508506/loushop/g4louvmkp8ndcsvaqbri.jpg"
  },
  {
    title: "Camisa estampada",
    description:
      "Reciclando las mesillas de noche de la abuela nos hemos sacado una linda camisa",
    price: 15000,
    image:
      "https://res.cloudinary.com/carloslorueda/image/upload/v1543508728/loushop/a6lohmnqieyjnk75wgcf.jpg",
    largeImage:
      "https://res.cloudinary.com/carloslorueda/image/upload/c_scale,q_auto,w_1000/v1543508728/loushop/a6lohmnqieyjnk75wgcf.jpg"
  },
  {
    title: "Una camiseta cool",
    description: "Camiseta larga",
    price: 15990,
    image:
      "https://res.cloudinary.com/carloslorueda/image/upload/v1543508933/loushop/ihwqngvzaz57jxdijzya.jpg",
    largeImage:
      "https://res.cloudinary.com/carloslorueda/image/upload/c_scale,q_auto,w_1000/v1543508933/loushop/ihwqngvzaz57jxdijzya.jpg"
  },
  {
    title: "Jeresy navideño",
    description: "Ideal para estas navidades",
    price: 67990,
    image:
      "https://res.cloudinary.com/carloslorueda/image/upload/v1543508983/loushop/chnqzsmmcsrbab0qemax.jpg",
    largeImage:
      "https://res.cloudinary.com/carloslorueda/image/upload/c_scale,q_auto,w_1000/v1543508983/loushop/chnqzsmmcsrbab0qemax.jpg"
  }
];

const initDevelopmentDatabase = () => {
  initDevItems();
};

const initDevItems = async () => {
  if (await itemsAreFilled()) return;
  console.log("[DB populating ...] Items");
  Items.forEach(async item => {
    await prisma.createItem(item);
  });
};
const itemsAreFilled = async () => {
  const items = await prisma.items();
  return items && items.length ? true : false;
};

module.exports = initDevelopmentDatabase;
