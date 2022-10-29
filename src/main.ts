import { promises as fs, existsSync, createReadStream } from 'fs';
import { Request, Response } from 'express';
import { fileTypeFromFile } from "file-type";

const isValidFormat = (format: string): boolean => {
    const supportedFormats = new Set([
        'audio/webm',
        'video/webm',
        'audio/opus',
        'audio/ogg',
        'video/ogg',
        'audio/flac',
        'audio/x-flac',
        'audio/mpeg',
        'audio/MPA',
        'audio/mpa-robust',
        'video/mp4',
    ]);
    return supportedFormats.has(format);
};

const mediaStreamer = async (req: Request, res: Response): Promise<void | Response> => {
    const filePath = decodeURIComponent(req.url.split('?filePath=')[1]);
    if (filePath === 'undefined') {
        return res.status(400).send({
            error: "Request must be sent with a valid 'filePath' as a query",
        });
    }
    if (!existsSync(filePath)) {
        return res.status(404).send({ error: 'File not found' });
    }
    // @ts-ignore
    const {mime}:{mime:string} = await fileTypeFromFile(filePath);
    if (!isValidFormat(mime)) {
        return res.status(406).send({ error: 'Unsupported media format' });
    }

    const { size } = await fs.stat(filePath);
    const { range } = req.headers;
    if (range) {
        let [start, end]: number[] | string[] = range.replace(/bytes=/, '').split('-');
        start = parseInt(start, 10);
        end = end ? parseInt(end, 10) : size - 1;
        res.writeHead(206, {
            'Content-Range': `bytes ${start}-${end}/${size}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': end - start + 1,
            'Content-Type': mime,
        });

        createReadStream(filePath, { start, end }).pipe(res);
    } else {
        res.writeHead(200, {
            'Content-Length': size,
            'Content-Type': mime,
        });
        createReadStream(filePath).pipe(res);
    }
};

export default mediaStreamer;
