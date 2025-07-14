import pdf from 'pdf-parse';
import mammoth from 'mammoth';

interface Chapter {
    title: string;
    content: string;
}

async function getTextFromDoc(buffer: Buffer, mimetype: string): Promise<string> {
    if (mimetype === 'application/pdf') {
        const data = await pdf(buffer);
        return data.text;
    } else if (
        mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
        mimetype === 'application/msword'
    ) {
        const { value } = await mammoth.extractRawText({ buffer: buffer });
        return value;
    }
    throw new Error('Unsupported file type for text extraction.');
}


function parseTextToChapters(rawText: string): Chapter[] {
    const chapters: Chapter[] = [];
    const lines = rawText.split('\n').filter(line => line.trim() !== ''); 

    if (lines.length === 0) {
        return [];
    }
    
    let currentChapter: Chapter | null = null;

    for (const line of lines) {
        const trimmedLine = line.trim();
  
        const isLikelyTitle = trimmedLine.length < 100 && !trimmedLine.endsWith('.') && isNaN(parseInt(trimmedLine));

        if (isLikelyTitle) {
            if (currentChapter && currentChapter.content.trim()) {
                chapters.push(currentChapter);
            }
            currentChapter = { title: trimmedLine, content: '' };
        } else if (currentChapter) {
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

    return chapters.map(ch => ({ ...ch, content: ch.content.trim() }));
}


export async function extractChaptersFromFile(file: Express.Multer.File): Promise<Chapter[]> {
    if (!file || !file.buffer) {
        throw new Error("File buffer is missing.");
    }
    const rawText = await getTextFromDoc(file.buffer, file.mimetype);
    return parseTextToChapters(rawText);
}