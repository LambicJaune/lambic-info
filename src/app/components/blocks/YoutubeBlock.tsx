import { YoutubeBlock as YoutubeBlockType } from '@/types/blocks';

export default function YoutubeBlock({
    videoId,
    width,
    height,
}: YoutubeBlockType) {
    return (
        <iframe
            src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}`}
            title="YouTube video player"
            width={width ?? undefined}
            height={height ?? undefined}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
        />
    );
}
