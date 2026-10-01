import Image from "next/image"

const PHOTOS = [
  { src: "/event/event-01.jpg", w: 1100, h: 1647 },
  { src: "/event/event-02.jpg", w: 1100, h: 1647 },
  { src: "/event/event-03.jpg", w: 1500, h: 1002 },
  { src: "/event/event-04.jpg", w: 1500, h: 1002 },
  { src: "/event/event-05.jpg", w: 1100, h: 1647 },
  { src: "/event/event-06.jpg", w: 1100, h: 1647 },
  { src: "/event/event-07.jpg", w: 1100, h: 1647 },
  { src: "/event/event-08.jpg", w: 1500, h: 1002 },
  { src: "/event/event-09.jpg", w: 1100, h: 1647 },
  { src: "/event/event-10.jpg", w: 1500, h: 1002 },
  { src: "/event/event-11.jpg", w: 1500, h: 1002 },
  { src: "/event/event-12.jpg", w: 1500, h: 1002 },
  { src: "/event/event-13.jpg", w: 1500, h: 1002 },
  { src: "/event/event-14.jpg", w: 1500, h: 1002 },
  { src: "/event/event-15.jpg", w: 1500, h: 1002 },
  { src: "/event/event-16.jpg", w: 1100, h: 1647 },
  { src: "/event/event-17.jpg", w: 1500, h: 1002 },
  { src: "/event/event-18.jpg", w: 1100, h: 1647 },
  { src: "/event/event-19.jpg", w: 1100, h: 1647 },
  { src: "/event/event-20.jpg", w: 1100, h: 1647 },
  { src: "/event/event-21.jpg", w: 1100, h: 1647 },
  { src: "/event/event-22.jpg", w: 1100, h: 1647 },
  { src: "/event/event-23.jpg", w: 1100, h: 1647 },
  { src: "/event/event-24.jpg", w: 1500, h: 1002 },
  { src: "/event/event-25.jpg", w: 1500, h: 1002 },
  { src: "/event/event-26.jpg", w: 1500, h: 1002 },
  { src: "/event/event-27.jpg", w: 1500, h: 1002 },
  { src: "/event/event-28.jpg", w: 1100, h: 1647 },
  { src: "/event/event-29.jpg", w: 1100, h: 1647 },
  { src: "/event/event-30.jpg", w: 1500, h: 1000 },
  { src: "/event/event-31.jpg", w: 1500, h: 1000 },
  { src: "/event/event-32.jpg", w: 1100, h: 1650 },
  { src: "/event/event-33.jpg", w: 1100, h: 1650 },
  { src: "/event/event-34.jpg", w: 1100, h: 1650 },
  { src: "/event/event-35.jpg", w: 1100, h: 1650 },
  { src: "/event/event-36.jpg", w: 1100, h: 1650 },
  { src: "/event/event-37.jpg", w: 1500, h: 1000 },
  { src: "/event/event-38.jpg", w: 1100, h: 1650 },
  { src: "/event/event-39.jpg", w: 1500, h: 1000 },
  { src: "/event/event-40.jpg", w: 1100, h: 1650 },
  { src: "/event/event-41.jpg", w: 1100, h: 1650 },
  { src: "/event/event-42.jpg", w: 1100, h: 1650 },
  { src: "/event/event-43.jpg", w: 1100, h: 1650 },
  { src: "/event/event-44.jpg", w: 1100, h: 1650 },
  { src: "/event/event-45.jpg", w: 1500, h: 1000 },
  { src: "/event/event-46.jpg", w: 1100, h: 1650 },
  { src: "/event/event-47.jpg", w: 1100, h: 1650 },
  { src: "/event/event-48.jpg", w: 1100, h: 1650 },
  { src: "/event/event-49.jpg", w: 1100, h: 1650 },
  { src: "/event/event-50.jpg", w: 1100, h: 1650 },
  { src: "/event/event-51.jpg", w: 1100, h: 1650 },
  { src: "/event/event-52.jpg", w: 1100, h: 1650 },
  { src: "/event/event-53.jpg", w: 1500, h: 1000 },
  { src: "/event/event-54.jpg", w: 1500, h: 1000 },
  { src: "/event/event-55.jpg", w: 1100, h: 1650 },
  { src: "/event/event-56.jpg", w: 1100, h: 1650 },
  { src: "/event/event-57.jpg", w: 1100, h: 1650 },
  { src: "/event/event-58.jpg", w: 1100, h: 1650 },
  { src: "/event/event-59.jpg", w: 1500, h: 1000 },
  { src: "/event/event-60.jpg", w: 1500, h: 1000 },
  { src: "/event/event-61.jpg", w: 1100, h: 1650 },
  { src: "/event/event-62.jpg", w: 1100, h: 1650 },
  { src: "/event/event-63.jpg", w: 1100, h: 1650 },
  { src: "/event/event-64.jpg", w: 1100, h: 1650 },
  { src: "/event/event-65.jpg", w: 1100, h: 1650 },
  { src: "/event/event-66.jpg", w: 1100, h: 1650 },
  { src: "/event/event-67.jpg", w: 1100, h: 1650 },
  { src: "/event/event-68.jpg", w: 1100, h: 1650 },
  { src: "/event/event-69.jpg", w: 1100, h: 1650 },
  { src: "/event/event-70.jpg", w: 1500, h: 1000 },
  { src: "/event/event-71.jpg", w: 1100, h: 1650 },
]

export default function OpeningEvent() {
  return (
    <main className="min-h-screen bg-white px-6 py-12">
      <h1
        className="mb-8 text-[#5c3317] text-center tracking-wide"
        style={{
          fontFamily: '"Times New Roman", Times, serif',
          fontSize: "clamp(0.75rem, 2vw, 0.875rem)",
        }}
      >
        Opening Event
      </h1>

      {/* CSS columns rather than a grid: a mix of portrait and landscape, and
          a grid would align rows and leave gaps under the shorter ones. */}
      <div className="mx-auto w-full max-w-3xl columns-1 sm:columns-2 gap-4">
        {PHOTOS.map((photo, i) => (
          <Image
            key={photo.src}
            src={photo.src}
            alt={`Fazenda opening event, photograph ${i + 1}`}
            width={photo.w}
            height={photo.h}
            priority={i < 2}
            sizes="(max-width: 640px) 90vw, 380px"
            className="mb-4 w-full h-auto break-inside-avoid"
          />
        ))}
      </div>
    </main>
  )
}
