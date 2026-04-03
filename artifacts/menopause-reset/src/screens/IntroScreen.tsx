interface IntroScreenProps {
  onStart: () => void;
}

export default function IntroScreen({ onStart }: IntroScreenProps) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 fade-in">
      <div className="max-w-lg w-full text-center space-y-8">
        <div className="space-y-4">
          <h1
            className="text-3xl md:text-4xl font-semibold leading-tight"
            style={{ color: "#4a476a" }}
          >
            The Menopause-Proof Workday Reset
          </h1>
          <p className="text-base md:text-lg leading-relaxed" style={{ color: "#2d2d2d" }}>
            You have already done the hard part — figuring out your pattern. Now let's look at what it is actually doing to your workday, why it feels so much harder than it used to, and what one shift could start to change that. This takes about 3 minutes.
          </p>
        </div>
        <button
          onClick={onStart}
          className="w-full max-w-xs mx-auto block py-4 px-8 rounded-full text-white font-semibold text-base transition-all duration-200 hover:opacity-90 active:scale-95"
          style={{ backgroundColor: "#e63462" }}
        >
          Show Me My Reset
        </button>
      </div>
    </div>
  );
}
