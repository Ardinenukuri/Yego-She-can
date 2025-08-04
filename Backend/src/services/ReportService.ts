import puppeteer from 'puppeteer';
import { MentorService } from './MentorService'; 
import { DashboardService } from './DashboardService';

export const ReportService = {
    
    generateMentorReportPDF: async (mentorId: number, mentorName: string): Promise<Buffer> => {
       
        const dashboardData = await MentorService.getDashboardData(mentorId);
        const { kpis, courses, quizzes, bookings } = dashboardData;
        const timestamp = new Date().toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
        });

        
        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Mentor Dashboard Report</title>
                <style>
                    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; margin: 40px; color: #333; line-height: 1.5; font-size: 10px; }
                    .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #7c34ab; padding-bottom: 15px; }
                    .header h1 { color: #4b1c88; margin: 0; font-size: 28px; }
                    .header .meta { color: #666; font-size: 14px; margin-top: 5px; }
                    .stats-section { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 20px; margin: 25px 0; }
                    .stat-card { background: #f3f4f6; padding: 15px; border-radius: 8px; text-align: center; }
                    .stat-card h3 { margin: 0 0 5px 0; font-size: 12px; color: #6b7280; text-transform: uppercase; }
                    .stat-card p { margin: 0; font-size: 22px; font-weight: bold; color: #4b1c88; }
                    .section { margin-top: 30px; page-break-inside: avoid; }
                    .section h2 { color: #4b1c88; font-size: 20px; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px; margin-bottom: 15px; }
                    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                    th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
                    th { background-color: #f9fafb; color: #374151; font-weight: 600; }
                    .passed { color: #16a34a; font-weight: bold; }
                    .failed { color: #dc2626; font-weight: bold; }
                    .missed { color: #d97706; font-weight: bold; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>Mentor Dashboard Report</h1>
                    <div class="meta">For: ${mentorName} | Generated on: ${timestamp}</div>
                </div>
                <div class="stats-section">
                    <div class="stat-card"><h3>Total Courses</h3><p>${kpis.totalCourses}</p></div>
                    <div class="stat-card"><h3>Total Students</h3><p>${kpis.totalStudents}</p></div>
                    <div class="stat-card"><h3>Total Chapters</h3><p>${kpis.totalChapters}</p></div>
                    <div class="stat-card"><h3>Completed Courses</h3><p>${kpis.completedCourses}</p></div>
                </div>
                <div class="section">
                    <h2>Your Courses (${courses.length})</h2>
                    <table><thead><tr><th>Title</th><th>Level</th><th>Duration</th><th>Chapters</th><th>Students</th></tr></thead>
                    <tbody>${courses.map((c: { title: any; level: any; duration: any; chapters: any; studentsEnrolled: any; }) => `<tr><td>${c.title}</td><td>${c.level}</td><td>${c.duration}</td><td>${c.chapters}</td><td>${c.studentsEnrolled}</td></tr>`).join('')}</tbody></table>
                </div>
                <div class="section">
                    <h2>Student Quiz Overview (${quizzes.length})</h2>
                    <table><thead><tr><th>Quiz Title</th><th>Course</th><th>Expected</th><th>Attempted</th><th>Passed</th><th>Failed</th></tr></thead>
                    <tbody>${quizzes.map((q: { title: any; course: any; expected: any; attempted: any; passed: any; failed: any; }) => `<tr><td>${q.title}</td><td>${q.course}</td><td>${q.expected}</td><td>${q.attempted}</td><td class="passed">${q.passed}</td><td class="failed">${q.failed}</td></tr>`).join('')}</tbody></table>
                </div>
                <div class="section">
                    <h2>Booked Meetings (${bookings.length})</h2>
                    <table><thead><tr><th>Student</th><th>Course</th><th>Time Slot</th><th>Topic</th></tr></thead>
                    <tbody>${bookings.map((b: { student: any; course: any; time: any; topic: any; }) => `<tr><td>${b.student}</td><td>${b.course}</td><td>${b.time}</td><td>${b.topic}</td></tr>`).join('')}</tbody></table>
                </div>
            </body>
            </html>
        `;

       
        const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
        const page = await browser.newPage();
        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
        const pdfUint8Array = await page.pdf({ format: 'A4', printBackground: true });
        const pdfBuffer = Buffer.from(pdfUint8Array);
        await browser.close();

        return pdfBuffer;
    },

    generateAdminReportPDF: async (pmName: string): Promise<Buffer> => {
       
        const dashboardData = await DashboardService.getDashboardData();
        const { kpis, courses, mentors, students } = dashboardData;
        const timestamp = new Date().toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
        });

        
        const htmlContent = `
            <!DOCTYPE html><html><head><meta charset="UTF-8"><title>Program Manager Dashboard Report</title>
            <style>
                body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; margin: 40px; color: #333; line-height: 1.5; font-size: 10px; }
                .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #7c34ab; padding-bottom: 15px; }
                h1 { color: #4b1c88; margin: 0; font-size: 28px; } .meta { color: #666; font-size: 14px; margin-top: 5px; }
                .stats-section { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 20px; margin: 25px 0; }
                .stat-card { background: #f3f4f6; padding: 15px; border-radius: 8px; text-align: center; }
                .stat-card h3 { margin: 0 0 5px 0; font-size: 12px; color: #6b7280; text-transform: uppercase; }
                .stat-card p { margin: 0; font-size: 22px; font-weight: bold; color: #4b1c88; }
                .section { margin-top: 30px; page-break-inside: avoid; }
                .section h2 { color: #4b1c88; font-size: 20px; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px; margin-bottom: 15px; }
                table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
                th { background-color: #f9fafb; color: #374151; font-weight: 600; }
            </style></head>
            <body>
                <div class="header"><h1>Platform Overview Report</h1><div class="meta">Generated by: ${pmName} | On: ${timestamp}</div></div>
                <div class="stats-section">
                    <div class="stat-card"><h3>Total Courses</h3><p>${kpis.totalCourses}</p></div>
                    <div class="stat-card"><h3>Active Mentors</h3><p>${kpis.activeMentors}</p></div>
                    <div class="stat-card"><h3>Enrolled Students</h3><p>${kpis.enrolledStudents}</p></div>
                </div>
                <div class="section"><h2>Courses Overview (${courses.length})</h2>
                    <table><thead><tr><th>Title</th><th>Mentor Name</th><th>Mentor Status</th></tr></thead>
                    <tbody>${courses.map(c => `<tr><td>${c.title}</td><td>${c.mentorName || 'N/A'}</td><td>${c.mentorStatus}</td></tr>`).join('')}</tbody></table></div>
                <div class="section"><h2>Mentors Overview (${mentors.length})</h2>
                    <table><thead><tr><th>Name</th><th>Status</th><th>Assigned Courses</th></tr></thead>
                    <tbody>${mentors.map(m => `<tr><td>${m.name || 'Pending'}</td><td>${m.status}</td><td>${m.assignedCourses}</td></tr>`).join('')}</tbody></table></div>
                <div class="section"><h2>Students Overview (${students.length})</h2>
                    <table><thead><tr><th>Name</th><th>Enrolled Course</th><th>Progress</th></tr></thead>
                    <tbody>${students.map(s => `<tr><td>${s.name}</td><td>${s.enrolledCourse}</td><td>${s.progress}%</td></tr>`).join('')}</tbody></table></div>
            </body></html>
        `;

       
        const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
        const page = await browser.newPage();
        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
        const pdfUint8Array = await page.pdf({ format: 'A4', printBackground: true });
        await browser.close();

        return Buffer.from(pdfUint8Array);
    }
};