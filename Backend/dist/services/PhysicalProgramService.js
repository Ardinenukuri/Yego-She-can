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
exports.PhysicalProgramService = void 0;
const db_1 = __importDefault(require("../config/db"));
exports.PhysicalProgramService = {
    getNextUpcomingProgram: () => __awaiter(void 0, void 0, void 0, function* () {
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
        const result = yield db_1.default.query(query);
        return result.rows[0] || null;
    }),
};
