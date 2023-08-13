const express = require('express');
const app = express();
require('dotenv').config();
const dbConnect = require('./config/dbConnect')
const authRoutes = require('./routes/authRoute')
const categoryRoutes = require('./routes/categoryRoutes')
const productRoutes = require('./routes/productRoutes')
const cors = require('cors')
const path = require('path')

//middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, './frontend/build')))

dbConnect();

//routes
app.use('/api/user', authRoutes);
app.use('/api/category', categoryRoutes)
app.use('/api/product', productRoutes)

//rest API
app.use('*',function(req, res){
    res.sendFile(path.join(__dirname, './frontend/build/index.html'))
})

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log('Server is listening at port ' + PORT);
})