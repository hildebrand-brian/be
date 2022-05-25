import axios from 'axios';

async function main() {
    const totalWeightKilograms = await axios.get('http://localhost:3000/shipments/weight/KILOGRAMS');
    console.log(totalWeightKilograms.status);
    console.log(totalWeightKilograms.data);
    // // should be 22,731

    const totalWeightPounds = await axios.get('http://localhost:3000/shipments/weight/POUNDS');
    console.log(totalWeightPounds.status);
    console.log(totalWeightPounds.data);
    // // should be 50,113

    const totalWeightOunces = await axios.get('http://localhost:3000/shipments/weight/OUNCES');
    console.log(totalWeightOunces.status);
    console.log(totalWeightOunces.data);
    // should be 801,808
}

main()