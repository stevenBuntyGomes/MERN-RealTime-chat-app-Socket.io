const mongoose = require('mongoose');
// const bodyParser = require('body-parser');

const connect_database = () => {
    // updated for production purpose
    mongoose.connect(process.env.DB_URI, {
        useNewUrlParser: true,
        // useCreateIndex: true,
        // useUnifiedTopology: true
    }).then((data) => {
        console.log(`MongoDB connected with: ${data.connection.host}`);
    })
    .catch((error) => {
        console.log(error);
    });
}

module.exports = connect_database;