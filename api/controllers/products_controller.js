// import MongoDb model
const Product = require('../models/product');
const mongoose = require('mongoose');


exports.get_all_products = (req, res, next)=>
{
    Product.find().select("name price _id productImage")
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                products: docs.map(doc =>{
                    return {
                        name: doc.name,
                        price: doc.price,
                        _id: doc._id,
                        productImage: doc.productImage,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/products/'+doc._id
                        }
                    }
                })
             }
            res.status(200).json(response);
            
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
    
}

exports.products_create_product = (req, res, next)=>
{
    console.log(req.file);
    /*const product = {
        name: req.body.name,
        price: req.body.price
    };*/

    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });
    product
        .save()
        .then(result =>{
            res.status(201).json({
                message:'Created product successfully',
                createdProduct: {
                    name: result.name,
                    price: result.price,
                    _id: result._id,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/products/'+result._id
                    }
                }
            });
    }).catch(err =>{
        res.status(500).json({
            error: err
        });
    })
   
}

exports.products_get_product = (req, res, next)=>{
    const id = req.params.productId;
    Product.findById(id).select("name price _id productImage")
        .exec()
        .then(doc =>{
            if(doc){
                res.status(200).json({
                    product: doc,
                    request: {
                        type: 'GET',
                        description: 'Get_all_products',
                        url: 'http://localhost:3000/products'
                    }
                });
            }
            else{
                res.status(404).json({message: 'No valid entry for the provided ID'})
            }
        })
        .catch(err => {
            res.status(500).json({error: err});
            }); 
}

exports.products_patch_product = (req, res, next)=>{
        
    const id = req.params.productId;

    // chage only name or price or both
    const updateOps ={};
    for(const ops of req.body)
    {
        updateOps[ops.propName] = ops.value;
    }
    Product.update({_id: id}, {$set: updateOps}).exec()
        .then(result => {
            res.status(200).json({
                message: 'Product updated',
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/products/'+id
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
   
}

exports.products_delete_product = (req, res, next)=>{
    const id = req.params.productId;
    Product.remove({_id: id}).exec()
        .then(result => {
            res.status(200).json({
                message: 'Product deleted',
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/products',
                    data: {name: 'String', price: 'Number'}
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
}