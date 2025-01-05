const axios = require('axios');

async function fileGST(bookingData, gstComponents) {
    const apiUrl = ''
    const apiKey = ''

    const payload = {
        name: bookingData.name,
        totalBookingAmount: bookingData.totalBookingAmount,
        igst: gstComponents.igst,
        sgst: gstComponents.sgst,
        cgst: gstComponents.cgst,
    };

    try {
        const response = await axios.post(apiUrl, payload, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
        });
        console.log('GST filed successfully:', response.data);
    } catch (error) {
        console.error('Error filing GST:', error);
    }
}

module.exports = { fileGST };