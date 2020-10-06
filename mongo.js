const mongoose = require('mongoose');

const url = process.env.MONGODB_URI;

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
}).then(result => {
    console.log('connected to mongoDB')
    
}).catch((error) => {
    console.log('error connecting MongoDB', error.message)
    
});

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});


personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

//const Person = mongoose.model("Person", personSchema);



// if (process.argv.length === 3) {
//   Person.find({}).then((result) => {
//       console.log('Phonebook:')
      
//     result.forEach((pers) => {
//       console.log(`${pers.name} ${pers.number}`);
      
      
//     });
//     mongoose.connection.close();
//   });
// } else {
//   person.save().then((response) => {
//     console.log(`added ${name} number ${number} to phonebook`);
//     mongoose.connection.close();
//   });
// }

module.exports = mongoose.model('Person', personSchema)