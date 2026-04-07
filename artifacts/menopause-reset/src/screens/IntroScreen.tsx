import { useState } from "react";

interface IntroScreenProps {
  onStart: () => void;
}

export default function IntroScreen({ onStart }: IntroScreenProps) {
  const [showPrivacy, setShowPrivacy] = useState(false);

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
            You have already done the hard part — figuring out your pattern. Now let us look at what it is actually doing to your workday, why it feels so much harder than it used to, and what one shift could start to change that. This takes about 3 minutes.
          </p>
        </div>

        <button
          onClick={onStart}
          className="w-full max-w-xs mx-auto block py-4 px-8 rounded-full text-white font-semibold text-base transition-all duration-200 hover:opacity-90 active:scale-95"
          style={{ backgroundColor: "#e63462" }}
        >
          Show Me My Reset
        </button>

        <div className="space-y-2">
          <p className="text-xs leading-relaxed" style={{ color: "#888888" }}>
            Your answers are used only to generate your reset. They are not stored or shared. This tool uses OpenAI to process your responses privately.
          </p>
          <button
            onClick={() => setShowPrivacy(!showPrivacy)}
            className="text-xs underline"
            style={{ color: "#888888" }}
          >
            Privacy notice
          </button>
        </div>

        {showPrivacy && (
          <div
            className="text-left text-xs leading-relaxed rounded-xl p-4 space-y-3"
            style={{ backgroundColor: "#f5f4f8", color: "#2d2d2d" }}
          >
            <p className="font-semibold">Privacy Notice</p>
            <p>
              The Menopause-Proof Workday Reset Tool is available exclusively to members of The Menopause-Proof Workday Reset course.
            </p>
            <p>
              When you use this tool, your answers to the three questions are sent securely to OpenAI to generate your personalised reset. Your answers are not stored by this tool after your reset is generated. They are not used for marketing, shared with third parties, or retained in any database.
            </p>
            <p>
              OpenAI processes your input in accordance with their privacy policy, which you can review at openai.com/privacy
            </p>
            <p>
              This tool does not collect your name, email address, or any identifying information. It is designed to be used anonymously.
            </p>
            <p>
              If you have any questions about how your information is handled, please contact support@masteringmenopausemethod.com
            </p>
          </div>
        )}

      </div>
    </div>
  );
}