import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import {
  Crown, Ticket, Sparkles, ArrowRight, ShieldCheck,
  X, UploadCloud, CheckCircle, Music, Film, Mic // Updated Icons
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

// --- UPDATED & CORRECTED DATA ---
const proShowData = [
  {
    id: 1,
    title: "ANDREA JEREMIAH",
    category: "Playback Singer",
    actorImage: "Pro/1.jpeg",
    gradient: "from-violet-600 to-indigo-600",
    icon: Mic // Icon for a singer
  },
  {
    id: 2,
    title: "G.V.PRAKASH KUMAR",
    category: "Music Composer",
    actorImage: "Pro/3.jpeg",
    gradient: "from-rose-600 to-red-600",
    icon: Music // Icon for a live music performance
  },
  {
    id: 3,
    title: "KAYADU LOHAR",
    category: "Actress",
    actorImage: "Pro/2.jpeg",
    gradient: "from-amber-500 to-orange-600",
    icon: Film // Icon for a film star/actress
  }
];

// --- 3D CARD COMPONENT ---
const ArtistCard = ({ show, index }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 500, damping: 100 });
  const mouseY = useSpring(y, { stiffness: 500, damping: 100 });

  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseXPos = e.clientX - rect.left;
    const mouseYPos = e.clientY - rect.top;
    const xPct = mouseXPos / width - 0.5;
    const yPct = mouseYPos / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const Icon = show.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.2 }}
      className="perspective-1000 w-full h-[550px]"
    >
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative w-full h-full rounded-[2rem] bg-gray-900 overflow-hidden group border border-white/5 shadow-2xl"
      >
        {/* --- IMAGE LAYER --- */}
        <div className="absolute inset-0 z-0">
          <img
            src={show.actorImage}
            alt={show.title}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
          {/* Dark Overlay for Text Visibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90" />
        </div>

        {/* --- NEON BORDER GLOW --- */}
        <div className={`absolute inset-0 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${show.gradient} blur-xl -z-10`} />
        <div className={`absolute inset-0 border-2 border-transparent group-hover:border-white/20 rounded-[2rem] transition-colors duration-300 z-30 pointer-events-none`} />

        {/* --- WATERMARK ICON (Animation) --- */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none opacity-0 group-hover:opacity-20 transition-all duration-700 scale-50 group-hover:scale-150">
          <Icon className="w-64 h-64 text-white" />
        </div>

        {/* --- CONTENT LAYER --- */}
        <div className="absolute inset-0 z-20 flex flex-col justify-between p-8" style={{ transform: "translateZ(50px)" }}>
          
          {/* Top Badge */}
          <div className="self-start">
            <span className={`inline-block px-4 py-2 rounded-full text-xs font-black uppercase tracking-[0.2em] bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)]`}>
              {show.category}
            </span>
          </div>

          {/* Bottom Title & Icon */}
          <div>
            <div className="flex items-end justify-between">
              <h3 className="text-5xl font-black text-white leading-none uppercase italic tracking-tighter drop-shadow-2xl">
                {show.title.split(" ").map((word, i) => (
                  <span key={i} className="block group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400 transition-all duration-300">
                    {word}
                  </span>
                ))}
              </h3>
              
              {/* Floating Active Icon */}
              <div className={`p-4 rounded-full bg-gradient-to-br ${show.gradient} text-white shadow-lg transform translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100`}>
                <Icon size={24} className="animate-pulse" />
              </div>
            </div>
            
            {/* Animated Bottom Line */}
            <div className={`mt-6 h-1 w-0 group-hover:w-full bg-gradient-to-r ${show.gradient} transition-all duration-700 ease-out`} />
          </div>
        </div>

      </motion.div>
    </motion.div>
  );
};

const Marquee = () => (
  <div className="relative flex overflow-x-hidden bg-amber-500 py-3 -rotate-1 scale-105 z-20 border-y-4 border-black">
    <div className="animate-marquee whitespace-nowrap flex gap-8">
      {[...Array(10)].map((_, i) => (
        <span key={i} className="text-black font-black italic tracking-tighter text-xl md:text-2xl uppercase">
          STAR STUDIO • PRO SHOW 2026 • LIVE EXCLUSIVE •
        </span>
      ))}
    </div>
  </div>
);

const TicketCard = ({ type, price, features, color, popular, onClick, loading }) => {
  const isVip = type === 'vip';
  
  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className={`relative w-full overflow-hidden rounded-3xl border ${isVip ? 'border-amber-500/50' : 'border-white/10'} bg-black group`}
    >
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
      <div className={`absolute top-0 right-0 w-[300px] h-[300px] bg-gradient-to-bl ${color} opacity-20 blur-[100px] group-hover:opacity-40 transition-opacity`} />

      <div className="relative p-8 flex flex-col h-full">
        <div className="flex justify-between items-start mb-6">
          <div className={`p-3 rounded-2xl ${isVip ? 'bg-amber-500/20 text-amber-400' : 'bg-white/10 text-white'}`}>
            {isVip ? <Crown size={24} /> : <Ticket size={24} />}
          </div>
          {popular && (
            <span className="px-3 py-1 bg-amber-500 text-black text-xs font-bold uppercase rounded-full animate-pulse">
              Best Value
            </span>
          )}
        </div>

        <h3 className="text-2xl font-bold text-white mb-1 uppercase tracking-wide">
          {isVip ? 'Elite Pass' : 'Standard Pass'}
        </h3>
        
        <div className="mb-8 mt-4">
          <span className="text-5xl font-black text-white">₹{price}</span>
        </div>

        <div className="space-y-4 mb-8 flex-grow">
          {features.map((feat, i) => (
            <div key={i} className="flex items-center gap-3">
              <CheckCircle className={`w-5 h-5 ${isVip ? 'text-amber-500' : 'text-gray-500'}`} />
              <span className="text-gray-300 text-sm font-medium">{feat}</span>
            </div>
          ))}
        </div>

        <button
          onClick={onClick}
          disabled={loading}
          className={`w-full py-4 rounded-xl font-bold text-sm tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2
            ${isVip 
              ? 'bg-gradient-to-r from-amber-600 to-yellow-500 text-black hover:shadow-[0_0_30px_rgba(245,158,11,0.4)]' 
              : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
            }`}
        >
          {loading ? <span className="animate-pulse">Processing...</span> : <>Get Ticket <ArrowRight size={16} /></>}
        </button>
      </div>
    </motion.div>
  );
};

const ProShowPage = () => {
  const [registering, setRegistering] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const [upiId, setUpiId] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  
  const { user } = useAuth();
  const wid = useRef(null);

  useEffect(() => {
    const widget = window.cloudinary.createUploadWidget(
      { cloudName: "dfseckyjx", uploadPreset: "qbvu3y5j", multiple: false },
      (error, result) => {
        if (!error && result && result.event === "success") {
          setImgUrl(result.info.secure_url);
          setIsUploading(false);
        }
      }
    );
    wid.current = widget;
  }, []);

  const handleScreenshotUpload = () => {
    setIsUploading(true);
    wid.current?.open();
  };

  const handleRegister = async (type) => {
    if (!user) {
      alert("Please login to register.");
      return;
    }
    if (type === 'vip') {
      setShowPaymentModal(true);
    } else {
      alert("Standard registration is not available at the moment."); 
    }
  };

  const handleSubmitPayment = async () => {
    if (!transactionId || !imgUrl || !upiId) {
      alert("All fields are required.");
      return;
    }
    setRegistering('vip');
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'https://sparkz-server.onrender.com';
      await axios.post(`${API_URL}/user/event/proshow`, {
        transactionId,
        upiId,
        paymentScreenshot: imgUrl,
        event: { type: 'ELITE', name: "Star Studio Proshow 2026", price: "500" },
        user
      });
      alert("Payment Submitted! Verification in progress.");
      setShowPaymentModal(false);
    } catch (error) {
      alert("Payment submission failed.");
    } finally {
      setRegistering(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-amber-500 selection:text-black font-sans overflow-x-hidden">
      
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[50vh] bg-amber-600/10 blur-[150px]" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10" />
      </div>

      <div className="relative z-10">
        
        <section className="relative pt-32 pb-20 px-4 flex flex-col items-center text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 inline-flex items-center gap-3 px-6 py-2 rounded-full border border-amber-500/30 bg-amber-500/10 backdrop-blur-md"
          >
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            <span className="text-amber-300 text-xs font-bold tracking-[0.2em] uppercase">The Main Event</span>
          </motion.div>

          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-200 to-gray-600 tracking-tighter mb-6 drop-shadow-2xl">
            STAR STUDIO
          </h1>

          <p className="max-w-2xl text-lg md:text-xl text-gray-400 font-light leading-relaxed">
            Immerse yourself in a <span className="text-amber-400 font-medium">cinematic auditory experience</span>. 
          </p>
        </section>

        <Marquee />

        <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4 border-b border-white/10 pb-8">
            <div>
              <h2 className="text-4xl md:text-6xl font-black uppercase text-white mb-2 tracking-tight">The Lineup</h2>
              <p className="text-gray-400 text-lg">Curated performances for the ultimate vibe.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {proShowData.map((show, idx) => (
              <ArtistCard key={show.id} show={show} index={idx} />
            ))}
          </div>
        </section>

        <section className="py-24 px-4 bg-gradient-to-b from-transparent via-gray-900/50 to-transparent relative">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-6xl font-black text-white mb-4">SECURE YOUR SPOT</h2>
            </div>

            <div className="grid md:grid-cols-1 gap-2 lg:gap-1 items-center">
              <div className="relative transform md:scale-105 z-10">
                <TicketCard 
                  type="vip" 
                  price="500" 
                  popular={true}
                  features={['Priority Front Row Access', 'Fast Track Entry']} 
                  color="from-amber-600 to-red-600"
                  onClick={() => handleRegister('vip')}
                  loading={registering === 'vip'}
                />
              </div>
            </div>
          </div>
        </section>

      </div>

      <AnimatePresence>
        {showPaymentModal && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-gray-900 border border-amber-500/20 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl"
            >
              <div className="bg-gradient-to-r from-amber-600 to-yellow-600 p-6 flex justify-between items-center">
                <div className="flex items-center gap-3 text-black">
                  <ShieldCheck size={24} />
                  <span className="font-bold uppercase tracking-wide">Secure Checkout</span>
                </div>
                <button onClick={() => setShowPaymentModal(false)} className="bg-black/20 p-2 rounded-full hover:bg-black/40 transition-colors text-black">
                  <X size={18} />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="flex bg-black rounded-xl p-4 border border-white/10 gap-4">
                  <div className="bg-white p-2 rounded-lg">
                    <img 
                      src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=sneha000@ybl&pn=Sparkz&am=500" 
                      alt="QR" 
                      className="w-24 h-24"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <div className="text-amber-500 font-bold text-xl mb-1">₹500.00</div>
                    <div className="text-gray-400 text-xs">Scan to pay via UPI</div>
                    <div className="mt-2 text-xs font-mono bg-gray-800 p-1.5 rounded text-center text-gray-300">sneha000@ybl</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Payment Proof</label>
                    <div 
                      onClick={handleScreenshotUpload}
                      className="border-2 border-dashed border-gray-700 hover:border-amber-500/50 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors bg-black/20"
                    >
                      {isUploading ? (
                        <span className="text-amber-500 text-sm animate-pulse">Uploading...</span>
                      ) : imgUrl ? (
                        <div className="flex items-center gap-2 text-green-500 text-sm font-medium">
                          <CheckCircle size={16} /> Screenshot Uploaded
                        </div>
                      ) : (
                        <>
                          <UploadCloud className="w-6 h-6 text-gray-400 mb-2" />
                          <span className="text-gray-400 text-sm">Click to upload screenshot</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase">UPI ID</label>
                      <input 
                        type="text" 
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-sm text-white focus:border-amber-500 focus:outline-none transition-colors"
                        placeholder="user@upi"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase">Transaction ID</label>
                      <input 
                        type="text" 
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                        className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-sm text-white focus:border-amber-500 focus:outline-none transition-colors"
                        placeholder="UTR / Ref No."
                      />
                    </div>
                  </div>
                </div>

                <button 
                  onClick={handleSubmitPayment}
                  disabled={!transactionId || !imgUrl || !upiId}
                  className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-black font-bold uppercase tracking-widest rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-amber-500/20"
                >
                  Confirm Payment
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};

export default ProShowPage;