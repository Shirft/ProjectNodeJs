const ProductManager=require('../ProductManager');
const express=require('express');
const router=express.Router();

const pm=new ProductManager();

//get all products
router.get('/', async(req, res)=>{

    const products=await pm.getProducts();
    let limit = req.query.limit;

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

    res.status(200).send({products});
})

//get products by id
router.get('/:pid', async(req,res)=>{
    let id=parseInt(req.params.pid)
    const productsId= await pm.getProductById(id);

    if(isNaN(Number(id))){
        return res.status(400).send({status: 'error', message:'Product not found'})
    }

    if(productsId.status=='error'){
        return res.status(400).send(productsId);
    }

    return res.status(200).send(productsId);
})

//post new product
router.post('/', async(req, res)=>{
    const pbody=req.body;

    const empty=Object.values(pbody).find(e=>e=='');
    console.log(empty)
    if(empty){
        return res.status(400).send({status:"error", message:"falta completar un campo"})
    }
    const{
      title,
      description,
      price,
      thumbnail,
      code,
      status,
      category, 
      stock,
    } = pbody;

    const addP=await pm.addProduct(title, description, price, thumbnail, code, status, category, stock);
    if(addP.status=="error"){
        return res.status(400).send({addP});
    }
    res.status(200).send({pbody});

})

//put product
router.put('/:pid', async(req,res)=>{
    let putP=req.params.pid;
    const putB=req.body;
    const upgP=await pm.updateProduct(putP, putB);
    res.status(200).send({upgP});

})

//delete product
router.delete('/:pid', async(req, res)=>{
    let delP=req.params.pid;
    
    const deleteP= await pm.deleteProducts(delP);
    if(deleteP.error){
        return res.status(400).send({deleteP});
    }
    res.status(200).send({deleteP});
})

module.exports=router;