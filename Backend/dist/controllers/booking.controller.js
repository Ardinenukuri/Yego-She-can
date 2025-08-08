"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingController = void 0;
const BookingService_1 = require("../services/BookingService");
exports.BookingController = {
    getBookings: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userId = req.user.id;
            const bookings = yield BookingService_1.BookingService.getBookingsForUser(userId);
            res.status(200).json(bookings);
        }
        catch (error) {
            next(error);
        }
    }),
    updateBookingStatus: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userId = req.user.id;
            const bookingId = parseInt(req.params.id, 10);
            const { status } = req.body;
            if (status !== 'completed' && status !== 'cancelled') {
                return res.status(400).json({ message: "Invalid status provided." });
            }
            yield BookingService_1.BookingService.updateBookingStatus(userId, bookingId, status);
            res.status(200).json({ message: 'Booking status updated successfully.' });
        }
        catch (error) {
            next(error);
        }
    }),
};
