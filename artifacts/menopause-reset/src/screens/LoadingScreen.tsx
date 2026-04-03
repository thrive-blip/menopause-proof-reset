export default function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <div
            className="w-16 h-16 rounded-full pulse-gentle"
            style={{ backgroundColor: "#4a476a", opacity: 0.7 }}
          />
        </div>
        <p
          className="text-lg font-medium"
          style={{ color: "#4a476a" }}
        >
          Looking at the pattern in your day…
        </p>
      </div>
    </div>
  );
}
