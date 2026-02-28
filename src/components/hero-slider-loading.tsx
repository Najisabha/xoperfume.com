export default function HeroSliderLoading() {
  return (
    <div className="relative h-full w-full bg-gray-100">
      <div className="absolute inset-0">
        <div className="animate-pulse h-full w-full bg-gradient-to-r from-gray-100 to-gray-200" />
      </div>
      <div className="absolute bottom-24 left-0 right-0 flex justify-center gap-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-1 w-16 bg-gray-200 rounded-full" />
        ))}
      </div>
    </div>
  );
}
