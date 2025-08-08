import pool from '../config/db'; 

export const PhysicalProgramService = {
  getNextUpcomingProgram: async () => {
    const query = `
      -- Define the effective start time once in a common table expression (CTE)
      -- This makes the query cleaner and more efficient.
      WITH next_program_with_time AS (
        SELECT
          title,
          -- This line is the core of the logic:
          -- 1. It takes the date part of the session (e.g., '2024-10-20')
          -- 2. It adds 9 hours to it, effectively setting the time to 09:00:00
          (next_session::date + INTERVAL '9 hours') AS effective_start_time
        FROM
          physical_programs
      )
      SELECT
        title,
        effective_start_time AS next_session -- Return it with the original name
      FROM
        next_program_with_time
      WHERE
        effective_start_time > NOW() -- Compare using the adjusted time
      ORDER BY
        effective_start_time ASC     -- Sort using the adjusted time
      LIMIT 1;
    `;

    const result = await pool.query(query);

    return result.rows[0] || null;
  },
};