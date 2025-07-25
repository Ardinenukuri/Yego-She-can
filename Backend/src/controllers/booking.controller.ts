import { Request, Response, NextFunction } from 'express';
import { BookingService } from '../services/BookingService';

export const BookingController = {
    getBookings: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = (req as any).user.id;
            const bookings = await BookingService.getBookingsForUser(userId);
            res.status(200).json(bookings);
        } catch (error) { next(error); }
    },
    
    updateBookingStatus: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = (req as any).user.id;
            const bookingId = parseInt(req.params.id, 10);
            const { status } = req.body; 
            
            if (status !== 'completed' && status !== 'cancelled') {
                return res.status(400).json({ message: "Invalid status provided." });
            }
            
            await BookingService.updateBookingStatus(userId, bookingId, status);
            res.status(200).json({ message: 'Booking status updated successfully.' });
        } catch (error) { next(error); }
    },
};