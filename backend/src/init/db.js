const { prisma } = require("../generated//prisma-client");
const bcrypt = require("bcryptjs");
/* Populate items for development*/

const Items = [
  {
    title: "Una sudadera sport",
    description: "Sudadera Marrón",
    price: 30001,
    image:
      "https://res.cloudinary.com/carloslorueda/image/upload/v1543369426/loushop/gwmx6qq79pnpq9k89uza.png",
    largeImage:
      "https://res.cloudinary.com/carloslorueda/image/upload/c_scale,q_auto,w_1000/v1543369426/loushop/gwmx6qq79pnpq9k89uza.png",
    user: {
      connect: {
        id: "TO_BE_FILLED"
      }
    }
  },
  {
    title: "Elegante gorro mácara romano",
    description: "Lo vas a petar con este gorro",
    price: 24990,
    image:
      "https://res.cloudinary.com/carloslorueda/image/upload/v1543459317/loushop/nv2ae55j9ctxtzwoew4o.webp",
    largeImage:
      "https://res.cloudinary.com/carloslorueda/image/upload/c_scale,q_auto,w_1000/v1543459317/loushop/nv2ae55j9ctxtzwoew4o.webp",
    user: {
      connect: {
        id: "TO_BE_FILLED"
      }
    }
  },
  {
    title: "Cazadora Adidas",
    description: "Una sexy cazadora para mujer",
    price: 55200,
    image:
      "https://res.cloudinary.com/carloslorueda/image/upload/v1543508047/loushop/zjtdtblx52m9r6qrmeux.jpg",
    largeImage:
      "https://res.cloudinary.com/carloslorueda/image/upload/c_scale,q_auto,w_1000/v1543508047/loushop/zjtdtblx52m9r6qrmeux.jpg",
    user: {
      connect: {
        id: "TO_BE_FILLED"
      }
    }
  },
  {
    title: "Jersey cool",
    description: "Un cool jersey de entretiempo",
    price: 37500,
    image:
      "https://res.cloudinary.com/carloslorueda/image/upload/v1543508097/loushop/avbywgotkp68casfnsfq.jpg",
    largeImage:
      "https://res.cloudinary.com/carloslorueda/image/upload/c_scale,q_auto,w_1000/v1543508097/loushop/avbywgotkp68casfnsfq.jpg",
    user: {
      connect: {
        id: "TO_BE_FILLED"
      }
    }
  },
  {
    title: "Camisa leñador",
    description: "Camiseta leñador para ser un machirulo opersor camuflado",
    price: 7000,
    image:
      "https://res.cloudinary.com/carloslorueda/image/upload/v1543508145/loushop/trkoofnzcit9kiqjyff1.jpg",
    largeImage:
      "https://res.cloudinary.com/carloslorueda/image/upload/c_scale,q_auto,w_1000/v1543508145/loushop/trkoofnzcit9kiqjyff1.jpg",
    user: {
      connect: {
        id: "TO_BE_FILLED"
      }
    }
  },
  {
    title: "Camiseta Versage",
    description: "No se te escaparan!",
    price: 80000,
    image:
      "https://res.cloudinary.com/carloslorueda/image/upload/v1543508506/loushop/g4louvmkp8ndcsvaqbri.jpg",
    largeImage:
      "https://res.cloudinary.com/carloslorueda/image/upload/c_scale,q_auto,w_1000/v1543508506/loushop/g4louvmkp8ndcsvaqbri.jpg",
    user: {
      connect: {
        id: "TO_BE_FILLED"
      }
    }
  },
  {
    title: "Camisa estampada",
    description:
      "Reciclando las mesillas de noche de la abuela nos hemos sacado una linda camisa",
    price: 15000,
    image:
      "https://res.cloudinary.com/carloslorueda/image/upload/v1543508728/loushop/a6lohmnqieyjnk75wgcf.jpg",
    largeImage:
      "https://res.cloudinary.com/carloslorueda/image/upload/c_scale,q_auto,w_1000/v1543508728/loushop/a6lohmnqieyjnk75wgcf.jpg",
    user: {
      connect: {
        id: "TO_BE_FILLED"
      }
    }
  },
  {
    title: "Una camiseta cool",
    description: "Camiseta larga",
    price: 15990,
    image:
      "https://res.cloudinary.com/carloslorueda/image/upload/v1543508933/loushop/ihwqngvzaz57jxdijzya.jpg",
    largeImage:
      "https://res.cloudinary.com/carloslorueda/image/upload/c_scale,q_auto,w_1000/v1543508933/loushop/ihwqngvzaz57jxdijzya.jpg",
    user: {
      connect: {
        id: "TO_BE_FILLED"
      }
    }
  },
  {
    title: "Jeresy navideño",
    description: "Ideal para estas navidades",
    price: 67990,
    image:
      "https://res.cloudinary.com/carloslorueda/image/upload/v1543508983/loushop/chnqzsmmcsrbab0qemax.jpg",
    largeImage:
      "https://res.cloudinary.com/carloslorueda/image/upload/c_scale,q_auto,w_1000/v1543508983/loushop/chnqzsmmcsrbab0qemax.jpg",
    user: {
      connect: {
        id: "TO_BE_FILLED"
      }
    }
  }
];

const initDevelopmentDatabase = async () => {
  try {
    let user = await prisma.createUser({
      // name: "Carlos Lou",
      // email: "carloslouredaparrado@gmail.com",
      // password: await bcrypt.hash("nomeinteresa", 10),
      // permissions: { set: ["USER", "ADMIN"] }
    });
    console.log("user: ", user);
    initDevItems(user.id);
  } catch (error) {
    console.log("-> error: ", error);
  }
  console.log(">>>>>>>> END OF DB POPULATING <<<<<<<<");
};

const initDevItems = async userId => {
  if (await itemsAreFilled()) return;
  console.log("[DB populating ...] Items");
  Items.forEach(async item => {
    item.user.connect.id = userId;
    await prisma.createItem(item);
  });
  console.log("[DB populating FINISHED] Items");
};
const itemsAreFilled = async () => {
  const items = await prisma.items();
  return items && items.length ? true : false;
};

module.exports = initDevelopmentDatabase;
