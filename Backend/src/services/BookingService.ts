import pool from '../config/db';

export const BookingService = {
    
    getBookingsForUser: async (userId: number) => {
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
        
        const { rows } = await pool.query(query, [userId]);

        return rows.map(row => ({...row, menteeName: row.participantName}));
    },

    updateBookingStatus: async (userId: number, bookingId: number, newStatus: 'completed' | 'cancelled') => {
        const query = `
            UPDATE bookings
            SET status = $1
            WHERE 
                id = $2 AND (learner_id = $3 OR mentor_id = $3)
            RETURNING id;
        `;
        
        const result = await pool.query(query, [newStatus, bookingId, userId]);

        if (result.rowCount === 0) {
            throw new Error('Booking not found or you are not authorized to modify it.');
        }

        return { success: true, bookingId, newStatus };
    }
};