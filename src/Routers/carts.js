const CartManager=require('../CartManager');
const express=require('express');
const routerCar=express.Router();

const carts = new CartManager();

routerCar.get("/:cid", async (req, res) => {
  const { cid } = req.params;

  const valueReturned = await carts.getCartById(cid);
  if (valueReturned.error)
    return res.status(200).send({ status: "Sin carritos", valueReturned });

  res.status(200).send({ status: "Carrito", valueReturned });
});

routerCar.post("/", async (req, res) => {
  const cart = req.body;

  await carts.addCart(cart);
  res.status(200).send({ status:'suscess', message:'carrito generado correctamente', cart });
  
});

//No esta del todo funcional
routerCar.post("/:cid/product/:pid", async (req, res) => {
  let producto = req.body;
  const { cid, pid } = req.params;
  //const carrito=await carts.getCartById(cid);
  const{
    product,
    quantity,
  } = producto;

  producto.product=pid;
  

 /* const{
    product,
    quantity,
  }=producto;

  producto['product'] == pid;
*/
  const carrito = await carts.getCartById(cid);
  if (carrito.error) return res.status(400).send({ carrito });

  let productoEncontrado = carrito.products.findIndex(
    (prod) => prod.product == pid
  );

  if (productoEncontrado !== -1) {
    carrito.products[productoEncontrado].quantity =
      Number(carrito.products[productoEncontrado].quantity) +
      Number(producto.quantity);
    await carts.updateCart(cid, carrito);
    return res
      .status(200)
      .send({ statusbar: "success", message: "producto agregado" });
  }

  carrito.products.push(producto);
  await carts.updateCart(cid, carrito);
  res
    .status(200)
    .send({
      status: "success",
      message: "producto agregado",
      carrito: carrito.products,
    });

});

module.exports=routerCar;
