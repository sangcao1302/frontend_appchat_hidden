import axios from 'axios';

const getLocation = async () => {
    try {
        const response = await axios.get('https://api.ipgeolocation.io/ipgeo?apiKey=0d04b9614d52415fb04e7cd2f625ad11');
        // console.log('IP Address:', response.data.query); // Log the IP address
        // console.log('Location Data:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching location:', error);
        return null;
    }
};

export default getLocation;