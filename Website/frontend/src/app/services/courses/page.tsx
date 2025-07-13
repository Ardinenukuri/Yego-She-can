import Link from "next/link";
import "../../../styles/courses.css";
import { spec } from "node:test/reporters";
import { FiClock, FiBookOpen, FiAward, FiUsers } from "react-icons/fi"; // Feather Icons

// import CourseCard from "../../../components/coursecard";
export default function CoursesPage() {
  const courses = [
    {
      id: 1,
      title: "Accounting & Finance Fundamentals",
      description:
        "Master the basics of accounting, budgeting, and financial planning for women entrepreneurs.",
      duration: "4 weeks",
      lessons: 12,
      level: "Beginner",
      price: "Free",
      image:
        "https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=800&q=60",
      features: [
        "Bookkeeping principles",
        "Managing budgets",
        "Understanding financial statements",
        "Small business taxes",
        "Cash flow management",
      ],
      category: "Most Taken",
    },
    {
      id: 2,
      title: "Sales & Customer Relations",
      description:
        "Learn effective sales strategies and build lasting customer relationships.",
      duration: "3 weeks",
      lessons: 10,
      level: "Beginner",
      price: "Free",
      image:
        "https://images.unsplash.com/photo-1556741533-f6acd647d2fb?auto=format&fit=crop&w=800&q=60",
      features: [
        "Sales psychology",
        "Customer service excellence",
        "Building loyalty",
        "Handling objections",
        "Digital sales techniques",
      ],
      category: "Recent",
    },
    {
      id: 3,
      title: "Marketing & Brand Building",
      description:
        "Build your brand and master marketing for small businesses.",
      duration: "4 weeks",
      lessons: 14,
      level: "Intermediate",
      price: "Free",
      image:
        "https://images.unsplash.com/photo-1591696205602-2a5b5b0c3b52?auto=format&fit=crop&w=800&q=60",
      features: [
        "Brand development",
        "Social media marketing",
        "Content creation",
        "Email marketing",
        "Local marketing",
      ],
      category: "Most Taken",
    },
    {
      id: 4,
      title: "Design Thinking & Innovation",
      description:
        "Apply design thinking to solve business problems creatively.",
      duration: "3 weeks",
      lessons: 9,
      level: "Intermediate",
      price: "Free",
      image:
        "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=60",
      features: [
        "Design thinking process",
        "Problem analysis",
        "Creative solutions",
        "Prototyping",
        "Small business innovation",
      ],
      category: "Recent",
    },
  ];

  return (
    <div className="courses-page">
      {/* Hero Section */}
      <section
        className="hero"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=60')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          marginTop: "-94px", // Adjust for fixed navbar
        }}
      >
        <div className="hero-content backdrop">
          <div className="hero-text">
            <p className="tagbanner">Yego She can</p>
            <h1>
              Empowering Women <br />
              Entrepreneurs
            </h1>
            <p>
              Master the fundamentals of entrepreneurship with our comprehensive
              online curriculum. <br />
              Learn at your own pace with expert-designed courses and earn
              certificates upon completion.
            </p>
            <div className="hero-buttons">
              <Link href="/register">
                <button className="btn-primary">Enroll now</button>
              </Link>
              <Link href="#courses">
                <button className="btn-secondary">Browse Courses</button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section>
       
      </section>
          <h2>Program Overview</h2>
<section className="hero-details">
  <div className="hero-left">
    <img
      src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=60"
      alt="Empowering"
    />
  </div>

  <div className="hero-right">
    <div className="card-grid">
      <div className="card">
        <div className="card-header">
          <FiClock className="card-icon" />
          <h3 className="card-title">1 Month Timeline</h3>
        </div>
        <div className="card-content">
          <p>Complete all four courses in just one month with our structured learning path</p>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <FiBookOpen className="card-icon" />
          <h3 className="card-title">45 Lessons</h3>
        </div>
        <div className="card-content">
          <p>Comprehensive curriculum covering all essential entrepreneurship topics</p>
        </div>
      </div>

      <div className="card dark-card">
        <div className="card-header">
          <FiAward className="card-icon" />
          <h3 className="card-title">Certification</h3>
        </div>
        <div className="card-content">
          <p>Earn certificates for each course and a completion certificate for the full program</p>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <FiUsers className="card-icon" />
          <h3 className="card-title">Expert Support</h3>
        </div>
        <div className="card-content">
          <p>Get help from our expert instructors and connect with fellow learners</p>
        </div>
      </div>
    </div>
  </div>
</section>



      {/* Courses Section */}
      <section id="courses" className="courses">
        <h2> Courses </h2>

        <h3>Most Taken Courses</h3>
        <div className="courses-grid">
          {courses
            .filter((c) => c.category === "Most Taken")
            .map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
        </div>

        <h3>Recent Courses</h3>
        <div className="courses-grid">
          {courses
            .filter((c) => c.category === "Recent")
            .map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
        </div>

        <h3>All Courses</h3>
        <div className="courses-grid">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>

      {/* Physical Workshops Notice */}
      <section className="physical-notice">
        <h2>Physical Workshops</h2>
        <p>
          Soap making and coffee processing workshops are conducted in-person.
          Register now to reserve your spot!
        </p>
        <Link href="/register">
          <button className="btn-primary">Register for Workshops</button>
        </Link>
      </section>

      
    </div>
  );
}

type Course = {
  id: number;
  title: string;
  description: string;
  duration: string;
  lessons: number;
  level: string;
  price: string;
  image: string;
  features: string[];
  category: string;
};

function CourseCard({ course }: { course: Course }) {
  return (
    <div className="course-card">
      <img src={course.image} alt={course.title} className="course-image" />
      <div className="course-info">
        <h3>{course.title}</h3>
        <p>{course.description}</p>
        <div className="course-meta">
          <span>{course.duration}</span> | <span>{course.lessons} lessons</span>{" "}
          | <span>{course.level}</span>
        </div>
        <ul>
          {course.features.map((feature: string, index: number) => (
            <li key={index}>✔ {feature}</li>
          ))}
        </ul>
        <button className="course-btn">Start Course</button>
      </div>
    </div>
  );
}