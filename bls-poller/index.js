const nodemailer = require('nodemailer');
const fetch = require('node-fetch');

const transporter = nodemailer.createTransport({
    service: 'gmail', // Use your email provider
    auth: {
        user: 'blschecker@gmail.com',
        pass: 'tumy eyzc akhc plvp'
    }
});

const locationMap = {
    "Brampton": "4",
    "Calgary": "8",
    "Edmonton": "9",
    "Halifax": "14",
    "Mississauga": "15",
    "Montreal": "2",
    "Ottawa": "1",
    "Regina": "16",
    "Surrey": "7",
    "Toronto": "3",
    "Vancouver": "6",
    "Winnipeg": "5"
};

const types = {
    "Passport": "Passport",
    "Visa": "Visa",
    "OCI": "OCI",
    "Interview-With-Mission": "Interview with mission",
    "Premium Lounge": "Premium-Lounge",
    "Attestation Service": "Attestation-Service",
}

const doesExist = async (location, type) => {

    var myHeaders = {};
    myHeaders["Accept"]= "*/*"
    myHeaders["Accept-Language"] = "en-CA,en;q=0.9,fr-CA;q=0.8,fr;q=0.7,hi-IN;q=0.6,hi;q=0.5,en-GB;q=0.4,en-US;q=0.3";
    myHeaders["Connection"] = "keep-alive";
    myHeaders["Content-Type"] = "application/x-www-form-urlencoded; charset=UTF-8";
    myHeaders["Cookie"] = "PHPSESSID=18b8695a9e12fe1a594d83e78b91d4d8; PHPSESSID=411a5983cbd9b25e027ecfd979a3ba23";
    myHeaders["DNT"] = "1";
    myHeaders["Origin"] = "https://www.blsindia-canada.com";
    myHeaders["Referer"] = "https://www.blsindia-canada.com/appointmentbls/appointment.php";
    myHeaders["Sec-Fetch-Dest"] = "empty";
    myHeaders["Sec-Fetch-Mode"] = "cors";
    myHeaders["Sec-Fetch-Site"] = "same-origin";
    myHeaders["User-Agent"] = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML] = like Gecko) Chrome/122.0.0.0 Safari/537.36";
    myHeaders["X-Requested-With"] = "XMLHttpRequest";

    var raw = `gofor=show_apt_date&location=${location}&service_type=${type}`;

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    const res = await fetch("https://www.blsindia-canada.com/appointmentbls/ajax.php", requestOptions);
    const obj = await res.text();
    const dates = obj.split("~");
    return !!dates[4];
}

const getLocationString = (location) => {
    for(const prop in locationMap) {
        if(locationMap[prop] === location) {
            return prop;
        }
    }
}

const email = async (location, type) => {
    let mailOptions = {
        from: 'rohan.cesc@gmail.com',
        to: 'rohan.cesc@gmail.com,kanchankulkarni28@gmail.com,rishi.bhattacharya01@gmail.com',
        subject: `Appointment Available for ${location} - ${type}`,
        text: 'https://www.blsindia-canada.com/appointmentbls/appointment.php'
    };
    const response = await transporter.sendMail(mailOptions);
}

const process = async (location, type) => {
    const exists = await doesExist(location, type);
    const locationStr = getLocationString(location);
    if (exists) {
        await email(locationStr, type);
    }
    console.log(`${locationStr}-${type} appointment exists ? - ${exists}`);
}

const main = async () => {
    try {
        const currentLocations = [locationMap.Brampton, locationMap.Mississauga, locationMap.Toronto];
        const currentTypes = [types.Passport, types.OCI];
        for (let i = 0; i < currentLocations.length; i++) {
            const currentLocation = currentLocations[i];
            for (let j = 0; j < currentTypes.length; j++) {
                const currentType = currentTypes[j];
                await process(currentLocation, currentType);
            }

        }
    } catch (err) {
        console.error(err);
    }
    return true;
}

module.exports = async function (context, myTimer) {
    const res = await main();
    console.log(res);
};