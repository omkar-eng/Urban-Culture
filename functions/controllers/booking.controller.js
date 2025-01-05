const BookingService = require('../services/booking.service');

class BookingController {
    constructor() {
        this.bookingService = new BookingService();
    }

    async createBooking(req, res) {
        try {
            const bookingData = req.body;
            const booking = await this.bookingService.createBooking(bookingData);
            res.status(201).send(booking);
        } catch (error) {
            console.error('Error creating booking:', error);
            res.status(500).send({ error: 'Error creating booking' });
        }
    }

    async getBookings(req, res) {
        try {
            const bookings = await this.bookingService.getBookings();
            res.status(200).send(bookings);
        } catch (error) {
            console.error('Error retrieving bookings:', error);
            res.status(500).send({ error: 'Error retrieving bookings' });
        }
    }

    async updateBooking(req, res) {
        try {
            const { id } = req.params;
            const bookingData = req.body;
            const updatedBooking = await this.bookingService.updateBooking(id, bookingData);
            res.status(200).send(updatedBooking);
        } catch (error) {
            console.error('Error updating booking:', error);
            res.status(500).send({ error: 'Error updating booking' });
        }
    }

    async handleStatusChange(change, context) {
        try {
            const newValue = change.after.data();
            const previousValue = change.before.data();

            // Check if the status has changed to "finished"
            if (newValue.status === 'finished' && previousValue.status !== 'finished') {
                const bookingId = context.params.bookingId;
                await this.bookingService.processGST(newValue, bookingId);
                console.log(`Processed GST for booking ${bookingId}.`);
            }
        } catch (error) {
            console.error('Error handling status change:', error);
        }
    }
}

module.exports = BookingController;