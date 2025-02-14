export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center h-dvh">
      <div>
        <p className="text-3xl text-center">You received a valentines card</p>
        <div className="text-xl mt-10 items-center flex flex-col gap-4">
          <p>Loading your card...</p>
          <div className="animate-pulse flex gap-2 flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-muted" />
            <div className="w-12 h-12 rounded-full bg-muted" />
            <p className="text-sm">
              <span className="animate-pulse bg-muted inline-block w-full h-1 rounded-full" />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
