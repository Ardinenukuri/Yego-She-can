import pool from '../config/db';
import { QueryResult } from 'pg';
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { Response } from 'express';


interface CertificateRecord {
    id: number;
    learner_id: number;
    course_id: number;
    issued_date: string;
    certificate_url: string;
    created_at: string;
}
interface UserData {
    first_name: string;
    last_name: string;
}
interface CourseData {
    name: string;
}
export interface IssuedCertificate extends CertificateRecord {
    courseName: string;
}
export interface MyCertificate {
    id: number;
    courseName: string;
    issuedDate: string;
    certificateUrl: string;
}

// --- Service Functions ---

export const issueCertificate = async (
    learnerId: number, 
    courseId: number
): Promise<{ id: number }> => { 
    const existingCert: QueryResult<{ id: number }> = await pool.query(
        'SELECT id FROM certificates WHERE learner_id = $1 AND course_id = $2',
        [learnerId, courseId]
    );

    if ((existingCert.rowCount ?? 0) > 0) {
        throw new Error('Certificate already issued for this learner and course.');
    }

    const issuedDate = new Date().toISOString().split('T')[0];

    const insertQuery = `
        INSERT INTO certificates (learner_id, course_id, issued_date)
        VALUES ($1, $2, $3)
        RETURNING id;
    `;
    const newCertificateResult = await pool.query(insertQuery, [learnerId, courseId, issuedDate]);
    
    return newCertificateResult.rows[0];
};


export const getMyCertificates = async (learnerId: number): Promise<MyCertificate[]> => {
    const query = `
        SELECT 
            c.id, 
            co.name as "courseName",
            c.issued_date as "issuedDate", 
            c.certificate_url as "certificateUrl"
        FROM certificates c
        JOIN courses co ON c.course_id = co.id
        WHERE c.learner_id = $1
        ORDER BY c.issued_date DESC;
    `;
    const result: QueryResult<MyCertificate> = await pool.query(query, [learnerId]);
    return result.rows;
};

export const generateCertificatePdfStream = async (
    res: Response,
    learnerName: string,
    courseName: string,
    issuedDate: string
) => {
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-dev-shm-usage'] });
    const page = await browser.newPage();
    
    const frontendUrl = process.env.FRONTED_URL || 'http://host.docker.internal:3000';
    
    const certificatePageUrl = `${frontendUrl}/user-dashboard/components/${encodeURIComponent(learnerName)}?courseName=${encodeURIComponent(courseName)}&issuedDate=${issuedDate}`;
    
    console.log(`[Certificate Service] Puppeteer is attempting to visit: ${certificatePageUrl}`);

    try {
        await page.goto(certificatePageUrl, { waitUntil: 'networkidle0', timeout: 30000 });

        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            landscape: true,
        });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="certificate-${learnerName.replace(/\s/g, '_')}.pdf"`);
        res.send(pdfBuffer);

    } catch (error) {
        console.error(`[Certificate Service] Puppeteer failed to load the page. Error:`, error);
        if (!res.headersSent) {
            res.status(500).json({ message: 'Failed to generate certificate PDF. The certificate page could not be loaded.' });
        }
    } finally {
        await browser.close();
    }
    };