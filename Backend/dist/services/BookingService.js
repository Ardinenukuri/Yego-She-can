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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingService = void 0;
const db_1 = __importDefault(require("../config/db"));
exports.BookingService = {
    getBookingsForUser: (userId) => __awaiter(void 0, void 0, void 0, function* () {
        const query = `
            SELECT
                b.id,
                -- Determine the "other person" in the meeting
                CASE
                    WHEN b.learner_id = $1 THEN (SELECT first_name || ' ' || last_name FROM users WHERE id = b.mentor_id)
                    ELSE (SELECT first_name || ' ' || last_name FROM users WHERE id = b.learner_id)
                END as "participantName",
                to_char(b.created_at, 'YYYY-MM-DD') as date,
                b.time_slot as time,
                b.status,
                b.topic,
                -- We'll use the course name as notes for now
                c.name as notes
            FROM
                bookings b
            JOIN
                courses c ON b.course_id = c.id
            WHERE
                b.learner_id = $1 OR b.mentor_id = $1
            ORDER BY
                b.created_at DESC;
        `;
        const { rows } = yield db_1.default.query(query, [userId]);
        return rows.map(row => (Object.assign(Object.assign({}, row), { menteeName: row.participantName })));
    }),
    updateBookingStatus: (userId, bookingId, newStatus) => __awaiter(void 0, void 0, void 0, function* () {
        const query = `
            UPDATE bookings
            SET status = $1
            WHERE 
                id = $2 AND (learner_id = $3 OR mentor_id = $3)
            RETURNING id;
        `;
        const result = yield db_1.default.query(query, [newStatus, bookingId, userId]);
        if (result.rowCount === 0) {
            throw new Error('Booking not found or you are not authorized to modify it.');
        }
        return { success: true, bookingId, newStatus };
    })
};
