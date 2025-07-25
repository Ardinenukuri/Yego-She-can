import { Router } from 'express';
import { BookingController } from '../controllers/booking.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

router.use(protect);


router.get('/', BookingController.getBookings);


router.put('/:id/status', BookingController.updateBookingStatus);

export default router;