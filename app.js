const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


const productRoutes = require('./api/routes/products');
const ordersRoutes = require('./api/routes/orders');
const usersRoutes = require('./api/routes/users');


// set mongoDB database connection through cluster
mongoose.connect('mongodb+srv://mikalov:'+ process.env.MONGO_ATLAS_PW +'@cluster0-ptlrl.mongodb.net/test?retryWrites=true&w=majority',{
    useNewUrlParser: true,
    useUnifiedTopology: true
});
mongoose.Promise = global.Promise;

// morgan for log informations 
//+ body-parser to render a well formatted Json data
app.use(morgan('dev'));

// make folder public accessible to display images on browser
app.use('/uploads',express.static('uploads'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// CORS
app.use((req, res, next)=>{
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-allow-Headers",
    "Origin, X-Rquested-With, Content-type, Accept, Authorization");

    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods','PUT, POST, PATCH, DELETE, GET')
        return res.status(200).json({});
    }
    next();
});



app.use('/products',productRoutes);
app.use('/orders',ordersRoutes);
 app.use('/users',usersRoutes);

// handle incoming requests with non valid URL
app.use((req, res, next)=> {
    const error = new Error('Not Found');
    error.status= 404;
    next(error);
});


app.use((error, req, res, next)=> {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
});

module.exports = app;

//mongodb+srv://mikalov:<password>@cluster0-ptlrl.mongodb.net/test?retryWrites=true&w=majority