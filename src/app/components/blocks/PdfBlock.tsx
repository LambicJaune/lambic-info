import { PdfBlock as PdfBlockType } from '@/types/blocks';

export default function PdfBlock({ url, title, sizeBytes }: PdfBlockType) {
    return (
        <p>
            {/* Display the PDF title as an external link and open it safely
                in a new tab without giving the new page access to this one. */}
            <a href={url} target="_blank" rel="noopener noreferrer">
                {title}
            </a>

            {/* Show a readable file size only when the source provides one. */}
            {sizeBytes !== null && ` (${formatFileSize(sizeBytes)})`}
        </p>
    );
}

// Convert the contract's byte count into a compact, human-readable value.
function formatFileSize(sizeBytes: number) {
    if (sizeBytes < 1024) {
        return `${sizeBytes} B`;
    }

    const units = ['KB', 'MB', 'GB'];
    let size = sizeBytes / 1024;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex += 1;
    }

    return `${size.toFixed(size >= 10 ? 0 : 1)} ${units[unitIndex]}`;
}
