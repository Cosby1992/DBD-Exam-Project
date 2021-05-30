const fetch = require('node-fetch');
const faker = require('faker');


exports.createUser = (url = '') => {

    const age = faker.datatype.number({
        'min': 18,
        'max': 80
    }),

    const gender = age < 49 ? "MALE" : "FEMALE";


    const user = {
        id: faker.datatype.uuid(),
        age: age,
        gender: gender
    }


    const response = fetch(url, {
        method: "POST",
        body: JSON.stringify(user)
    }).then(res => {
        console.log(res.json()); 
    }).catch(err => {
        console.log(err);
    })

    return response.json();
}


