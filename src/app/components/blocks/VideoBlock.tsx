import { VideoBlock as VideoBlockType } from '@/types/blocks';

export default function VideoBlock({
    provider,
    videoId,
    width,
    height,
}: VideoBlockType) {
    return (
        <iframe
            src={`https://player.vimeo.com/video/${encodeURIComponent(videoId)}?dnt=1`}
            title={`${provider === 'vimeo' ? 'Vimeo' : 'Video'} player`}
            width={width ?? undefined}
            height={height ?? undefined}
            loading="lazy"
            allow="autoplay; fullscreen; picture-in-picture"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
        />
    );
}
