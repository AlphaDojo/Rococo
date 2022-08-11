const express = require('express');
const db = require('./models');
const morgan = require('morgan');
const bodyParser = require ('body-parser');
const cors = require('cors');
const borrowingRoute = require('./routes/Borrowing');
const itemRoute = require('./routes/item');
const returnsRoute = require('./routes/returns');
const inventoryRoute = require('./routes/inventory');
const supplierRoute = require('./routes/supplier');
const employeeRoute = require('./routes/employee');
const userRoute = require('./routes/user');
const signinRoute = require('./routes/signin');
const cookieParser = require('cookie-parser');
const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(cookieParser())
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

db.sequelize.sync().then(() => {
    app.listen(process.env.PORT || '5000', () => {
        console.log(`Server is running on port: ${process.env.PORT || '5000'}`)
    })
});  

app.use('/borrowing', borrowingRoute);
app.use('/item', itemRoute);
app.use('/returns', returnsRoute);
app.use('/inventory', inventoryRoute);
app.use('/employee', employeeRoute);
app.use('/supplier', supplierRoute);
app.use('/user', userRoute);
app.use('/signin', signinRoute);

app.get('/api/hello', (req, res) => {
    res.send({ express: 'Hello From Express' });
});

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
})