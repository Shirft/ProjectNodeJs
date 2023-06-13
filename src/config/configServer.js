import mongoose from 'mongoose';

const url = 'mongodb+srv://mygue0908:UtM4Zu0rTztLaw6A@cluster7.sssws2v.mongodb.net/?retryWrites=true&w=majority'


const connectToDB = () => {
    try {
        mongoose.connect(url)
        console.log('connected to DB e-commerce')
    } catch (error) {
        console.log(error);
    }
};

export default connectToDB