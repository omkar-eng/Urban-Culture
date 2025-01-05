const admin = require('firebase-admin');
admin.initializeApp();
const functions = require("firebase-functions/v1");
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const BookingController = require('./controllers/booking.controller');

const app = express();
app.use(cors({ origin: true }));
app.use(bodyParser.json());

// Booking routes
const bookingController = new BookingController();
app.post('/bookings', (req, res) => bookingController.createBooking(req, res));
app.get('/bookings', (req, res) => bookingController.getBookings(req, res));
app.put('/bookings/:id', (req, res) => bookingController.updateBooking(req, res));

// Firestore trigger for booking status change
exports.onBookingStatusChange = functions.firestore.document('/bookings/{bookingId}')
    .onUpdate((change, context) => { bookingController.handleStatusChange(change, context) });

// Export the Express app as a Cloud Function
exports.api = functions.https.onRequest(app);
