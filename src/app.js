const ProductManager=require('./ProductManager');
const express=require('express');
const app=express();
const pm= new ProductManager();
const port=8080

app.use(express.urlencoded({ extended: true }))

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

app.listen(port, ()=> console.log('port 8080 listening.'));