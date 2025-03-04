const mongoose = require('mongoose');

const connectDB = async () => {
    console.log('Attempting to connect to MongoDB...'); // Debug log
    try {
        console.log('entered'); // Debug log
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            //useNewUrlParser: true,
           // useCreateIndex:true,
           // useFindAndModify:true,
           // useUnifiedTopology:true
        });
        console.log(`MongoDB connected: ${conn.connection.host}`.cyan.bold);

    } catch (error) {
        console.error(`Error:: ${error.message}`.red.bold);
        process.exit(1); // Exit the process with failure
    }
};

module.exports = connectDB;