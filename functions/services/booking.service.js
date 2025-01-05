const admin = require('firebase-admin');
const db = admin.firestore();

const GSTService = require('../services/gst.service');

class BookingService {
    async createBooking(bookingData) {
        const bookingRef = await db.collection('bookings').add(bookingData);
        return { id: bookingRef.id, ...bookingData };
    }

    async getBookings() {
        const snapshot = await db.collection('bookings').get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }

    async updateBooking(id, bookingData) {
        await db.collection('bookings').doc(id).update(bookingData);
        return { id, ...bookingData };
    }

    async processGST(bookingData, bookingId) {
        console.log(bookingId);
        const totalBookingAmount = bookingData.totalBookingAmount;
        const gstComponents = this.calculateGST(totalBookingAmount);
        await GSTService.fileGST(bookingData, gstComponents);
    }

    calculateGST(amount) {
        const gstRate = 0.18; // 18%
        const igst = amount * gstRate; // For inter-state
        const sgst = igst / 2; // For intra-state
        const cgst = sgst; // Same as SGST

        return {
            igst,
            sgst,
            cgst,
        };
    }
}

module.exports = BookingService;