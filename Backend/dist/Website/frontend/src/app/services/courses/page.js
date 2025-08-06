"use strict";
'use client';
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
exports.default = CoursesPage;
const link_1 = __importDefault(require("next/link"));
require("../../../styles/courses.css");
const react_1 = require("react");
const api_1 = __importDefault(require("@/lib/api"));
const services_jpg_1 = __importDefault(require("../../../../public/services.jpg"));
function CoursesPage() {
    const [allCourses, setAllCourses] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [searchQuery, setSearchQuery] = (0, react_1.useState)("");
    const [filter, setFilter] = (0, react_1.useState)("All");
    const [sortOrder, setSortOrder] = (0, react_1.useState)("asc");
    const [currentPage, setCurrentPage] = (0, react_1.useState)(1);
    const coursesPerPage = 3;
    (0, react_1.useEffect)(() => {
        const fetchCourses = () => __awaiter(this, void 0, void 0, function* () {
            try {
                setLoading(true);
                const response = yield api_1.default.get('/api/courses/public');
                setAllCourses(response.data);
            }
            catch (error) {
                console.error("Failed to fetch courses:", error);
            }
            finally {
                setLoading(false);
            }
        });
        fetchCourses();
    }, []);
    const filteredCourses = allCourses
        .filter(course => {
        return course.title.toLowerCase().includes(searchQuery.toLowerCase());
    })
        .sort((a, b) => {
        // A more robust sort for durations like "4 weeks"
        const aWeeks = parseInt(a.duration.split(' ')[0]) || 0;
        const bWeeks = parseInt(b.duration.split(' ')[0]) || 0;
        return sortOrder === "asc" ? aWeeks - bWeeks : bWeeks - aWeeks;
    });
    const indexOfLastCourse = currentPage * coursesPerPage;
    const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
    const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);
    const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);
    return (<div className="courses-page">
      {/* Hero Section (remains the same) */}
      <section className="hero long-hero" style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${services_jpg_1.default.src})`,
        }}>
        <div className="hero-content backdrop">
          <div className="hero-text">
            <h1>Empowering Women Entrepreneurs</h1>
            <p>
              Master the fundamentals of entrepreneurship with our comprehensive
              online curriculum.
            </p>
            <div className="hero-buttons">
              <link_1.default href="/auth/register">
                <button className="btn-primary">Enroll now</button>
              </link_1.default>
              <a href="#courses" className="btn-secondary">Browse Courses</a>
            </div>
          </div>
        </div>
      </section>

      {/* Course List Section */}
      <section id="courses" className="courses">
        <h2>Courses</h2>

        <div className="filter-bar">
          <input type="text" placeholder="Search courses..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/>
          {/* Category filter is removed for now */}
          <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
            <option value="asc">Duration: Short to Long</option>
            <option value="desc">Duration: Long to Short</option>
          </select>
        </div>

        {loading ? (<div className="loading-state">Loading courses...</div>) : (<>
            <div className="courses-grid">
              {currentCourses.map((course) => (<div key={course.id} className="course-card fade-in">
                  {/* Use next/image for optimized images, but ensure backend URL is configured */}
                  <img src={`${process.env.NEXT_PUBLIC_API_URL}${course.image}`} alt={course.title} className="course-image"/>
                  <div className="course-info">
                    <h3>{course.title}</h3>
                    <p>{course.description}</p>
                    <div className="course-meta">
                      <span>{course.duration}</span> | <span>{course.lessons} lessons</span> | <span>{course.level}</span>
                    </div>
                    {/* The 'features' are now the chapter titles */}
                    <ul>
                      {course.features.map((feature, index) => (<li key={index}> {feature}</li>))}
                    </ul>
                    <link_1.default href="/auth/register">
                      <button className="course-btn">Start Course</button>
                    </link_1.default>
                  </div>
                </div>))}
            </div>

            <div className="pagination">
              {Array.from({ length: totalPages }, (_, i) => (<button key={i + 1} className={currentPage === i + 1 ? "active" : ""} onClick={() => setCurrentPage(i + 1)}>
                  {i + 1}
                </button>))}
            </div>
          </>)}
      </section>
    </div>);
}
