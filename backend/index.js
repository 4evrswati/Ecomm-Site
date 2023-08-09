const express = require('express');
const app = express();
require('dotenv').config();
const dbConnect = require('./config/dbConnect')
const authRoutes = require('./routes/authRoute')
const categoryRoutes = require('./routes/categoryRoutes')
const productRoutes = require('./routes/productRoutes')
const cors = require('cors')

const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
dbConnect();

app.use('/api/user', authRoutes);
app.use('/api/category', categoryRoutes)
app.use('/api/product', productRoutes)

app.use('/',(req, res) => {
    res.send('Hi..')
})



app.listen(PORT, () => {
    console.log('Server is listening at port ' + PORT);
})