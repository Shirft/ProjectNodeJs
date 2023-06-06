/*const ProductManager=require('./ProductManager');
const express=require('express');
const app=express();
const pm= new ProductManager();
const port=8080

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//all products and query
app.get('/products', async(req, res)=>{

    let limit = req.query.limit;

    const products= await pm.getProducts();

    if(!limit){
        return res.status(200).send({products})
    }

    if(isNaN(Number(limit))){
        return res.status(400).send({status: 'error', message:'Limit not found'});
    }

    if(products.length>limit){
        const productsLimit=products.slice(0, limit);
        return res.status(200).send({productsLimit});
    }

    return res.status(200).send({products})


});

//params id
app.get('/products/:pid', async (req, res)=>{

    const id=parseInt(req.params.pid)
    const productsId= await pm.getProductById(id);

    if(isNaN(Number(id))){
        return res.status(400).send({status: 'error', message:'Product not found'})
    }

    if(productsId.status=='error'){
        return res.status(400).send(productsId);
    }

    return res.status(200).send(productsId);

});

app.listen(port, ()=> console.log(`Port ${port} listening.`));
*/
const ProductManager=require('../src/ProductManager');
const express=require('express');
const products=require('./Routers/products');
const carts=require('./Routers/carts');
const handlebars=require('express-handlebars');
const Server=require('socket.io');
const app=express();

const port=8080;

const pm= new ProductManager();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/api/products', products)
app.use('/api/carts', carts);
app.use('/realTimeProducts', (req, res) => {
    res.render('realTimeProducts', {})
})

app.engine('handlebars', handlebars.engine())
app.set('views', __dirname+'/views')
app.set('view engine', 'handlebars') 


const httpServer = app.listen(port, () => {
    try {
        console.log(`Listening to the port ${port}`);
        console.log("http://localhost:8080/")
        console.log("http://localhost:8080/realtimeproducts");
    }
    catch (err) {
        console.log(err);
    }
});

const socketServer = Server(httpServer)

socketServer.on('connection', async socket => {
    console.log('Client connection');
    const data =  await pm.getProducts()

    socket.emit('products', {data, style: 'index.css'})

    socket.on('product', async data => {
        
        try{
            const {
            title,
            description,
            price,
            status,
            category,
            thumbnail,
            code,
            stock
        } = data

        const valueReturned = await pm.addProduct(title, description, price, status,category, thumbnail, code, stock)
        console.log(valueReturned)
        }
        catch (err){
            console.log(err);
        }

})
})