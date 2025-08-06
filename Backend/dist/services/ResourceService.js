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
exports.ResourceService = void 0;
const db_1 = __importDefault(require("../config/db"));
const documentParser_1 = require("../utils/documentParser");
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const resourceUploadDir = 'uploads/resources';
const imageUploadDir = 'uploads/images';
exports.ResourceService = {
    addCourseResource: (mentorId, courseId, data, files) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        const resourceFile = (_a = files.resourceFile) === null || _a === void 0 ? void 0 : _a[0];
        const courseImage = (_b = files.courseImage) === null || _b === void 0 ? void 0 : _b[0];
        if (!resourceFile)
            throw new Error('A resource document file is required.');
        if (!courseImage)
            throw new Error('A course image file is required.');
        const assignmentCheck = yield db_1.default.query('SELECT * FROM course_mentors WHERE mentor_id = $1 AND course_id = $2', [mentorId, courseId]);
        if (assignmentCheck.rowCount === 0) {
            throw new Error('Forbidden: You are not assigned to this course.');
        }
        const chapters = yield (0, documentParser_1.extractChaptersFromFile)(resourceFile);
        if (chapters.length === 0) {
            throw new Error('Could not extract any chapters from the document. Please check its format.');
        }
        const resourceFilename = `resource-${Date.now()}${path_1.default.extname(resourceFile.originalname)}`;
        const imageFilename = `course-img-${Date.now()}${path_1.default.extname(courseImage.originalname)}`;
        const resourceDiskPath = path_1.default.resolve(resourceUploadDir, resourceFilename);
        const imageDiskPath = path_1.default.resolve(imageUploadDir, imageFilename);
        const resourceUrl = `/uploads/resources/${resourceFilename}`;
        const imageUrl = `/uploads/images/${imageFilename}`;
        yield promises_1.default.mkdir(resourceUploadDir, { recursive: true });
        yield promises_1.default.mkdir(imageUploadDir, { recursive: true });
        yield promises_1.default.writeFile(resourceDiskPath, resourceFile.buffer);
        yield promises_1.default.writeFile(imageDiskPath, courseImage.buffer);
        const client = yield db_1.default.connect();
        try {
            yield client.query('BEGIN');
            const resourceInsertQuery = `
            INSERT INTO resources (course_id, mentor_id, description, timeline, level, file_path, image_url, original_filename, video_link)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING id
        `;
            const resourceResult = yield client.query(resourceInsertQuery, [
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
                yield client.query('INSERT INTO chapters (resource_id, chapter_number, title, content) VALUES ($1, $2, $3, $4)', [newResourceId, i + 1, chapter.title, chapter.content]);
            }
            yield client.query('COMMIT');
            return { resourceId: newResourceId, chaptersCount: chapters.length };
        }
        catch (error) {
            yield client.query('ROLLBACK');
            yield promises_1.default.unlink(resourceDiskPath).catch(err => console.error("Cleanup failed for resource file:", err));
            yield promises_1.default.unlink(imageDiskPath).catch(err => console.error("Cleanup failed for image file:", err));
            throw error;
        }
        finally {
            client.release();
        }
    })
};
