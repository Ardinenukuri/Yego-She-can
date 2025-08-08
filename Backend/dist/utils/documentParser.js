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
exports.extractChaptersFromFile = extractChaptersFromFile;
const pdf_parse_1 = __importDefault(require("pdf-parse"));
const mammoth_1 = __importDefault(require("mammoth"));
function getTextFromDoc(buffer, mimetype) {
    return __awaiter(this, void 0, void 0, function* () {
        if (mimetype === 'application/pdf') {
            const data = yield (0, pdf_parse_1.default)(buffer);
            return data.text;
        }
        else if (mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
            mimetype === 'application/msword') {
            const { value } = yield mammoth_1.default.extractRawText({ buffer: buffer });
            return value;
        }
        throw new Error('Unsupported file type for text extraction.');
    });
}
function parseTextToChapters(rawText) {
    const chapters = [];
    const lines = rawText.split('\n').filter(line => line.trim() !== '');
    if (lines.length === 0) {
        return [];
    }
    let currentChapter = null;
    for (const line of lines) {
        const trimmedLine = line.trim();
        const isLikelyTitle = trimmedLine.length < 100 && !trimmedLine.endsWith('.') && isNaN(parseInt(trimmedLine));
        if (isLikelyTitle) {
            if (currentChapter && currentChapter.content.trim()) {
                chapters.push(currentChapter);
            }
            currentChapter = { title: trimmedLine, content: '' };
        }
        else if (currentChapter) {
            currentChapter.content += line + '\n';
        }
    }
    if (currentChapter && currentChapter.content.trim()) {
        chapters.push(currentChapter);
    }
    if (chapters.length === 0 && rawText.trim()) {
        chapters.push({
            title: 'Full Document Content',
            content: rawText.trim()
        });
    }
    return chapters.map(ch => (Object.assign(Object.assign({}, ch), { content: ch.content.trim() })));
}
function extractChaptersFromFile(file) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!file || !file.buffer) {
            throw new Error("File buffer is missing.");
        }
        const rawText = yield getTextFromDoc(file.buffer, file.mimetype);
        return parseTextToChapters(rawText);
    });
}
