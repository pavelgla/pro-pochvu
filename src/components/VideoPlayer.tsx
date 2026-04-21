type Props = {
  src: string;
  title?: string;
  poster?: string;
};

export function VideoPlayer({ src, title, poster }: Props) {
  return (
    <video
      className="aspect-video w-full rounded-xl bg-black"
      controls
      preload="metadata"
      playsInline
      poster={poster}
      title={title}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
