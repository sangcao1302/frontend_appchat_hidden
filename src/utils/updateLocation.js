import axios from 'axios';

const getLocation = async () => {
    try {
        // Step 1: Get the real user's IP address (Not Vercel's/Render's IP)
        const ipResponse = await axios.get('https://api64.ipify.org?format=json');
        const userIp = ipResponse.data.ip;

        // Step 2: Use that IP to get location info
        const response = await axios.get(`https://api.ipgeolocation.io/ipgeo?apiKey=0d04b9614d52415fb04e7cd2f625ad11&ip=${userIp}`);

        console.log("Detected IP:", userIp);
        console.log("Location Data:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching location:", error);
        return null;
    }
};

export default getLocation;