import { Home, ArrowLeft, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

const NotFoundFlashy = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden bg-linear-to-br from-purple-600 via-pink-600 to-blue-600 flex items-center justify-center px-4">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-40 left-20 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Cursor follower glow */}
      <div
        className="absolute w-96 h-96 rounded-full bg-white mix-blend-overlay filter blur-3xl opacity-30 pointer-events-none transition-all duration-300"
        style={{
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
        }}
      ></div>

      <div className="relative z-10 max-w-2xl w-full">
        <div className="bg-white/10 dark:bg-slate-900/30 backdrop-blur-2xl rounded-3xl shadow-2xl border-4 border-white/20 p-12 text-center transform hover:scale-105 transition-all duration-500">
          <div className="absolute -top-6 -right-6 bg-linear-to-br from-yellow-400 to-orange-500 rounded-full p-4 shadow-2xl animate-bounce">
            <Sparkles className="text-white" size={32} />
          </div>

          <div className="mb-8">
            <h1 className="text-9xl font-black text-transparent bg-clip-text bg-linear-to-r from-yellow-300 via-pink-300 to-purple-300 mb-4 animate-pulse drop-shadow-2xl">
              404
            </h1>
            <h2 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">
              Oops! Lost in Space 🚀
            </h2>
            <p className="text-xl text-white/90 drop-shadow-md leading-relaxed">
              This page got abducted by aliens or maybe it's chilling on Mars. Either way, it's not here! 👽
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <a
              href="/"
              className="group flex items-center justify-center gap-3 px-8 py-4 bg-linear-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white text-lg font-bold rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 hover:-rotate-2"
            >
              <Home size={24} className="group-hover:rotate-12 transition-transform" />
              Beam Me Home
            </a>
            <button
              onClick={() => window.history.back()}
              className="group flex items-center justify-center gap-3 px-8 py-4 bg-linear-to-r from-purple-400 to-pink-500 hover:from-purple-500 hover:to-pink-600 text-white text-lg font-bold rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 hover:rotate-2"
            >
              <ArrowLeft size={24} className="group-hover:-translate-x-2 transition-transform" />
              Go Back in Time
            </button>
          </div>
        </div>

        {/* Floating particles */}
        <div className="absolute top-10 left-10 w-4 h-4 bg-yellow-300 rounded-full animate-ping"></div>
        <div className="absolute bottom-20 right-10 w-3 h-3 bg-pink-300 rounded-full animate-ping animation-delay-1000"></div>
        <div className="absolute top-32 right-32 w-2 h-2 bg-blue-300 rounded-full animate-ping animation-delay-2000"></div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animation-delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
};

export default NotFoundFlashy;
