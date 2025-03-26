import GameComponent from "~/components/monopoly/Game";

function Page() {
  return (
    <main>
      <div className="flex min-h-screen flex-col items-center justify-center bg-blue-100">
        <GameComponent />
      </div>
    </main>
  );
}

export default Page;
