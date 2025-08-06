"use strict";
"use client";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CourseCard;
const react_1 = __importStar(require("react"));
const fi_1 = require("react-icons/fi");
const ai_1 = require("react-icons/ai");
function CourseCard({ course }) {
    const [bookmarked, setBookmarked] = (0, react_1.useState)(false);
    return (<div className="course-card">
      <div className="course-img-wrapper">
        <img src={course.image} alt={course.title} className="course-image"/>
        <button className="bookmark-icon" onClick={() => setBookmarked(!bookmarked)}>
          {bookmarked ? (<ai_1.AiFillStar size={20} color="#FFD700"/>) : (<fi_1.FiBookmark size={20}/>)}
        </button>
      </div>

      <div className="course-card-header">
        <span className="course-level">{course.level}</span>
        <span className="course-price">{course.price}</span>
      </div>

      <h3 className="course-title">{course.title}</h3>
      <p className="course-desc">{course.description}</p>

      <div className="course-meta">
        <span><fi_1.FiClock /> {course.duration}</span>
        <span><fi_1.FiBookOpen /> {course.lessons} lessons</span>
      </div>

      <div className="course-learn">
        <strong>What you'll learn:</strong>
        <ul>
          {course.features.slice(0, 3).map((feature, i) => (<li key={i}>✅ {feature}</li>))}
          {course.features.length > 3 && (<li>+{course.features.length - 3} more topics</li>)}
        </ul>
      </div>

      <button className="course-btn">Start Course</button>
    </div>);
}
