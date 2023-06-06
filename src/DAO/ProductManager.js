const fs = require("fs");

class ProductManager {
  constructor() {
    try {
      this.path = "./Products.json";
      const prod = fs.readFile(this.path);
      this.products = JSON.parse(prod);
    } catch (error) {
      this.products = [];
    }
  }

  addProduct = async (
    title,
    description,
    price,
    thumbnail,
    code,
    status,
    category,
    stock
  ) => {
    const id = this.products.length + 1;

    const product = {
      id,
      title,
      description,
      price,
      thumbnail,
      code,
      status,
      category,
      stock,
    };

    const validation = this.products.find((e) => e.code == product.code);
    if (validation) {
      return {
        status: "error",
        message: "El producto no se pudo agregar porque el codigo es repetido",
      };
    }

    if (Object.values(product).every((e) => e)) {
      product.status === "false"
        ? (product.status = false)
        : (product.status = true);

      product.price = Number(product.price);
      product.stock = Number(product.stock);
      product.thumbnail = [product.thumbnail];
      this.products.push(product);
      await fs.promises.writeFile(this.path, JSON.stringify(this.products));
      return {
        status: "succes",
        message: "El producto se registro",
        producto: product,
      };
    }
    return { status: "error", message: "Todos los campos son obligatorios" };
  };

  getProductById = async (idProduct) => {
    try {
      const readProducts = await fs.promises.readFile(this.path, "utf-8");
      const products = JSON.parse(readProducts);
      const search = products.find((e) => e.id == idProduct);
      if (search) {

        return search;
      }
      return { status: "error", message: "Product not found" };
    } catch (error) {
      console.log(error);
    }
  };

  deleteProducts = async (idD) => {
    const readProducts = await fs.promises.readFile(this.path, "utf-8");
    const products = JSON.parse(readProducts);
    const productId = products.findIndex((e) => e.id == idD);
    if (productId === -1)
      return {
        status: "error",
        message: `Producto con id: ${idD} no encontrado`,
      };

      const product = products.filter((idP) => idP.id !== idD);

      this.products = product;
  
      await fs.promises.writeFile(this.path, JSON.stringify(this.products));
  
      return {
        status: "sucess",
        message: `Se elimino el producto de id: ${idD}`,
      };

  };

  updateProduct = async (id, body) => {
    const productsUp = await fs.promises.readFile(this.path, "utf-8");
    const productsUpParse = JSON.parse(productsUp);
    let update = Object.assign(productsUpParse[id - 1], body);

    productsUpParse[id - 1] = update;
    this.products = productsUpParse;
    await fs.promises.writeFile(this.path, JSON.stringify(this.products));
    return update;
  };

  getProducts = async () => {
    try {
      const result = await fs.promises.readFile(this.path, "utf-8");
      let resultParse = JSON.parse(result);
      return resultParse;
    } catch {
      console.log(error);
    }
  };
}

module.exports = ProductManager;