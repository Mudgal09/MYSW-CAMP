const mongoose = require('mongoose');
const Campground = require('../models/campground')
mongoose.connect('mongodb://localhost:27017/mysw-camp')
const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection.error:"));
db.once("open", () => {
    console.log("Database Connected");
})
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers')
const sample = array => array[Math.floor(Math.random() * array.length)]
const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000)
        const price = Math.floor(Math.random() * 20) + 10
        const camp = new Campground({
            location: ` ${cities[random1000].city} ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)} `,
            images: [
                {
                    url: 'https://res.cloudinary.com/dw817zpc0/image/upload/v1774597472/MYSWCamp/pmsktxwr7nfho7ypes49.jpg',
                    filename: 'MYSWCamp/pmsktxwr7nfho7ypes49'
                }
            ],
              geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            },
            description: "  Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat quam fugiat vitae, rem ipsa laudantium delectus inventore, ullam ducimus atque soluta? Modi nihil ullam, ipsam fugit expedita eius iusto dolor.",
            price: price,
            author: "69be742301ab3ca753d866c5"
        })
        await camp.save();
    }
}
seedDB().then(() => {
    mongoose.connection.close()
})