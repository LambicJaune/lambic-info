import { AudioBlock as AudioBlockType } from '@/types/blocks';

export default function AudioBlock({ url }: AudioBlockType) {
    return (
        <audio controls preload="metadata">
            <source src={url} />
            Your browser does not support embedded audio.{' '}
            <a href={url}>Open the audio file</a>.
        </audio>
    );
}
