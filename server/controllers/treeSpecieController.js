const axios = require('axios');

const detectTreeSpecies = async (req, res) => {
    try {
        const { imageBase64 } = req.body;
        const response = await axios({
            method: 'POST',
            url: `https://detect.roboflow.com/tree-species-5vszi/6`,
            params: {
                api_key: process.env.TREESPECIE_API_KEY,
                confidence: 0, // Set minimum confidence to 0%
                overlap: 0,
            },
            data: imageBase64,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error detecting tree species:', error);
        res.status(500).json({ error: 'Failed to detect tree species' });
    }
};

module.exports = { detectTreeSpecies };