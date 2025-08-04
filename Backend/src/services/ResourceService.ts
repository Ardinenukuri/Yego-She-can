import pool from '../config/db';
import { extractChaptersFromFile } from '../utils/documentParser';
import fs from 'fs/promises';
import path from 'path';

const resourceUploadDir = 'uploads/resources';
const imageUploadDir = 'uploads/images';

export const ResourceService = {
   addCourseResource: async (
    mentorId: number,
    courseId: number,
    data: { description: string, timeline: string, level: 'beginner' | 'intermediate' | 'advanced', videoLink?: string },
    files: { resourceFile?: Express.Multer.File[], courseImage?: Express.Multer.File[] }
) => {
    const resourceFile = files.resourceFile?.[0];
    const courseImage = files.courseImage?.[0];

    if (!resourceFile) throw new Error('A resource document file is required.');
    if (!courseImage) throw new Error('A course image file is required.');

    const assignmentCheck = await pool.query(
        'SELECT * FROM course_mentors WHERE mentor_id = $1 AND course_id = $2',
        [mentorId, courseId]
    );
    if (assignmentCheck.rowCount === 0) {
        throw new Error('Forbidden: You are not assigned to this course.');
    }

    const chapters = await extractChaptersFromFile(resourceFile);
    if (chapters.length === 0) {
        throw new Error('Could not extract any chapters from the document. Please check its format.');
    }

    const resourceFilename = `resource-${Date.now()}${path.extname(resourceFile.originalname)}`;
    const imageFilename = `course-img-${Date.now()}${path.extname(courseImage.originalname)}`;

    const resourceDiskPath = path.resolve(resourceUploadDir, resourceFilename);
    const imageDiskPath = path.resolve(imageUploadDir, imageFilename);

    const resourceUrl = `/uploads/resources/${resourceFilename}`;
    const imageUrl = `/uploads/images/${imageFilename}`;

    await fs.mkdir(resourceUploadDir, { recursive: true });
    await fs.mkdir(imageUploadDir, { recursive: true });
    await fs.writeFile(resourceDiskPath, resourceFile.buffer);
    await fs.writeFile(imageDiskPath, courseImage.buffer);

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const resourceInsertQuery = `
            INSERT INTO resources (course_id, mentor_id, description, timeline, level, file_path, image_url, original_filename, video_link)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING id
        `;
        const resourceResult = await client.query(resourceInsertQuery, [
            courseId,
            mentorId,
            data.description,
            data.timeline,
            data.level,
            resourceUrl,
            imageUrl,
            resourceFile.originalname,
            data.videoLink || null 
        ]);
        const newResourceId = resourceResult.rows[0].id;

        for (let i = 0; i < chapters.length; i++) {
            const chapter = chapters[i];
            await client.query(
                'INSERT INTO chapters (resource_id, chapter_number, title, content) VALUES ($1, $2, $3, $4)',
                [newResourceId, i + 1, chapter.title, chapter.content]
            );
        }

        await client.query('COMMIT');
        return { resourceId: newResourceId, chaptersCount: chapters.length };

    } catch (error) {
        await client.query('ROLLBACK');
        await fs.unlink(resourceDiskPath).catch(err => console.error("Cleanup failed for resource file:", err));
        await fs.unlink(imageDiskPath).catch(err => console.error("Cleanup failed for image file:", err));
        throw error;
    } finally {
        client.release();
    }
}};