
const fs=require('fs');

class CartManager {
    constructor() {
        try {
            this.path = "./Carrito.json";
            const cartt = fs.readFile(this.path);
            this.carts = JSON.parse(cartt);
          } catch (error) {
            this.carts = [];
          }
    }

    addCart = async (products) => {
        const id = this.carts.length + 1;
        const cart={
            id,
            products,
        };
        
        if (Object.values(cart).every(value => value)) {
            cart.products = [cart.products];
            this.carts.push(cart);
            await fs.promises.writeFile(this.path, JSON.stringify(this.carts))
         }

         return [];
    };

    getCartById = async (id) => {
        try {
            const getFileCarts = await fs.promises.readFile(this.path, 'utf-8')
            const parseCarts = JSON.parse(getFileCarts);

            if (!parseCarts[id - 1]) return { error: 'Error! El carrito No existe' }

            return parseCarts[id - 1]
        }
        catch (err) {
            console.log(err);
        }
    };

    updateCart = async (pid, data) => {
        try {
            const getFileCarts = await fs.promises.readFile(this.path, 'utf-8')
            const parseCarts = JSON.parse(getFileCarts);
            
            if (isNaN(Number(pid))) return { status: "error", message: 'No es un id válido' };

            const findId = parseCarts.findIndex(product => product.id == pid)
            if (findId === -1) return { status: "error", message: 'No se encontró el id' };

            const returnedTarget = Object.assign(parseCarts[pid - 1], data);

            parseCarts[pid - 1] = returnedTarget;

            this.carts = parseCarts
            const toJSON = JSON.stringify(this.carts, null, 2);
            await fs.promises.writeFile(this.path, toJSON)
            return returnedTarget
        }
        catch (err) {
            console.log(err);
        }

    }

}

module.exports=CartManager;