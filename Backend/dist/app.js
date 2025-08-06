"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const course_routes_1 = __importDefault(require("./routes/course.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const resource_routes_1 = __importDefault(require("./routes/resource.routes"));
const quiz_routes_1 = __importDefault(require("./routes/quiz.routes"));
const dashboard_routes_1 = __importDefault(require("./routes/dashboard.routes"));
const mentor_routes_1 = __importDefault(require("./routes/mentor.routes"));
const certificateRoutes_1 = __importDefault(require("./routes/certificateRoutes"));
const public_routes_1 = __importDefault(require("./routes/public.routes"));
const learner_routes_1 = __importDefault(require("./routes/learner.routes"));
const booking_routes_1 = __importDefault(require("./routes/booking.routes"));
const programManager_routes_1 = __importDefault(require("./routes/programManager.routes"));
const physicalProgramRoutes_1 = __importDefault(require("./routes/physicalProgramRoutes"));
const app = (0, express_1.default)();
const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
app.use(express_1.default.static(path_1.default.join(__dirname, '..', 'public')));
app.get('/api/healthcheck', (req, res) => res.status(200).json({ message: 'Server is running' }));
app.use('/api/auth', auth_routes_1.default);
app.use('/api/courses', course_routes_1.default);
app.use('/api/users', user_routes_1.default);
app.use('/api/resources', resource_routes_1.default);
app.use('/api/quizzes', quiz_routes_1.default);
app.use('/api/dashboard', dashboard_routes_1.default);
app.use('/api/mentor', mentor_routes_1.default);
app.use('/api/certificates', certificateRoutes_1.default);
app.use('/api/public', public_routes_1.default);
app.use('/api/learner', learner_routes_1.default);
app.use('/api/bookings', booking_routes_1.default);
app.use('/api/pm', programManager_routes_1.default);
app.use('api/', physicalProgramRoutes_1.default);
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});
exports.default = app;
