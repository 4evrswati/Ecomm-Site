const mongoose = require('mongoose');

const connectDB = () => {
    return(
        mongoose.connect(process.env.DB_URL).then((x) => {
            console.log('Database connected successfully');
        }).catch((err) => {
            console.log('Database not connected');
        })
    )
}

module.exports = connectDB;