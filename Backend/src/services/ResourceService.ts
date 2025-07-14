import pool from '../config/db';
import { extractChaptersFromFile } from '../utils/documentParser';
import fs from 'fs/promises'; 
import path from 'path';


const uploadDir = 'uploads/resources';

export const ResourceService = {
    addCourseResource: async (
        mentorId: number, 
        courseId: number, 
        description: string, 
        timeline: string, 
        file: Express.Multer.File
    ) => {

        const assignmentCheck = await pool.query(
            'SELECT * FROM course_mentors WHERE mentor_id = $1 AND course_id = $2',
            [mentorId, courseId]
        );
        if (assignmentCheck.rowCount === 0) {
            throw new Error('Forbidden: You are not assigned to this course.');
        }


        const chapters = await extractChaptersFromFile(file);
        if (chapters.length === 0) {
            throw new Error('Could not extract any chapters from the document. Please check its format.');
        }
        

        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const filename = `resource-${uniqueSuffix}${path.extname(file.originalname)}`;
        const fullDiskPath = path.resolve(uploadDir, filename);
        const webAccessiblePath = `/uploads/resources/${filename}`;
        

        await fs.mkdir(uploadDir, { recursive: true });
        

        await fs.writeFile(fullDiskPath, file.buffer);
        const client = await pool.connect();
        try {
            await client.query('BEGIN');


            const resourceInsertQuery = `
                INSERT INTO resources (course_id, mentor_id, description, timeline, file_path, original_filename)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING id
            `;
            const resourceResult = await client.query(resourceInsertQuery, [
                courseId,
                mentorId,
                description,
                timeline,
                webAccessiblePath, 
                file.originalname
            ]);
            const newResourceId = resourceResult.rows[0].id;


            for (let i = 0; i < chapters.length; i++) {
                const chapter = chapters[i];
                const chapterInsertQuery = `
                    INSERT INTO chapters (resource_id, chapter_number, title, content)
                    VALUES ($1, $2, $3, $4)
                `;
                await client.query(chapterInsertQuery, [newResourceId, i + 1, chapter.title, chapter.content]);
            }
            
            await client.query('COMMIT');
            return { resourceId: newResourceId, chaptersCount: chapters.length };
            
        } catch (error) {
            await client.query('ROLLBACK');
            await fs.unlink(fullDiskPath).catch(err => console.error("Failed to delete orphaned file:", err));
            throw error;
        } finally {
            client.release();
        }
    }
};