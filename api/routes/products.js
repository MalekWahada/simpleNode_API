const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

// import contoller
const productsController = require('../controllers/products_controller');

// multer used to upload files + mkdirp to create directory
const mkdirp = require('mkdirp');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function(req, file, callback){
        const dir = './uploads/';

        mkdirp(dir, err => callback(err, dir))
        //callback(null, './uploads/');
    },
    filename: function(req, file, callback){
        callback(null,  new Date().toISOString().replace(/:/g, '-') + file.originalname );
    },
    
});
const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null,true);
    }
    else {
        cb(null,false);
    }
};

const upload = multer({storage: storage, limits: {
    fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
 }) ;




router.get('/',productsController.get_all_products);

router.post('/' ,checkAuth, upload.single('productImage'), productsController.products_create_product);

router.get('/:productId',productsController.products_get_product);

router.patch('/:productId',checkAuth,productsController.products_patch_product);

router.delete('/:productId', checkAuth,productsController.products_delete_product);

module.exports = router;
