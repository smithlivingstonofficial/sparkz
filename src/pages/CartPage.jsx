import React, { useState, useRef, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingCart, Trash2, ArrowLeft, CreditCard, 
  Ticket, Calendar, Clock, MapPin, Users, CheckCircle,
  AlertCircle, Shield, X, Upload, QrCode, Copy,
  RotateCw, Receipt, ExternalLink, Sparkles, BedDouble, Info
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

// ========== PRICING CONFIGURATION ==========
const PRICES = {
  EVENT_REGISTRATION: 300,
  PRO_SHOW: 500,
  ACCOMMODATION: 400
};
// ===========================================

const CartPage = () => {
  const { 
    cart, 
    removeFromCart, 
    clearCart, 
    checkout, 
    isLoading,
    MAX_EVENTS,
    getRemainingSlots
  } = useCart();

  const { user } = useAuth();

  // --- Add-on States ---
  const [includeProShow, setIncludeProShow] = useState(false);
  const [includeAccommodation, setIncludeAccommodation] = useState(false);

  // --- Form States ---
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [upiId, setUpiId] = useState('');
  const [paymentScreenshot, setPaymentScreenshot] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [formError, setFormError] = useState('');
  const fileInputRef = useRef(null);

  const sparkzUPI = 'sparkz26@upi';

  // --- Logic: Check if KLU Student ---
  const isKluStudent = useMemo(() => {
    return user?.email?.toLowerCase().endsWith('@klu.ac.in');
  }, [user]);

  // --- Logic: Calculate Totals ---
  const totals = useMemo(() => {
    const eventRegistrationFee = (cart.length > 0 && !isKluStudent) ? PRICES.EVENT_REGISTRATION : 0;
    const proShowFee = includeProShow ? PRICES.PRO_SHOW : 0;
    const accommodationFee = includeAccommodation ? PRICES.ACCOMMODATION : 0;
    
    return {
      eventRegistrationFee,
      proShowFee,
      accommodationFee,
      total: eventRegistrationFee + proShowFee + accommodationFee
    };
  }, [cart.length, isKluStudent, includeProShow, includeAccommodation]);

  // Disable add-ons if no events are selected
  const hasEvents = cart.length > 0;

  useEffect(() => {
    if (!hasEvents) {
      setIncludeProShow(false);
      setIncludeAccommodation(false);
    }
  }, [hasEvents]);

  // NEW: Force Pro Show to false if KLU student (prevents accidental charges if logic changes)
  useEffect(() => {
    if (isKluStudent) {
      setIncludeProShow(false);
    }
  }, [isKluStudent]);

  // --- Handlers ---
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.match('image.*')) {
      setFormError('Please upload an image file');
      return;
    }
    setPaymentScreenshot(file);
    const reader = new FileReader();
    reader.onload = (e) => setScreenshotPreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const copyUPI = () => {
    navigator.clipboard.writeText(sparkzUPI);
    toast.success('UPI ID copied!');
  };

  const handleSubmitPayment = async (e) => {
    e.preventDefault();
    if (!transactionId.trim() || !paymentScreenshot) {
      setFormError('Transaction ID and Screenshot are required');
      return;
    }
    setIsUploading(true);
    setTimeout(async () => {
      setIsUploading(false);
      await checkout({
        transactionId,
        upiId,
        includeProShow,
        includeAccommodation,
        totalAmount: totals.total
      });
      setShowCheckoutForm(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-12">
      <div className="fixed inset-0 z-0 bg-[radial-gradient(circle_at_50%_50%,#1a1a1a_0%,#000_100%)]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <Link to="/events" className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 mb-4 transition-colors">
              <ArrowLeft className="w-4 h-4" /> <span>Back to Events</span>
            </Link>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight flex items-center gap-4">
              YOUR <span className="text-amber-500">REEL</span>
              <ShoppingCart className="w-8 h-8 text-white/20" />
            </h1>
          </div>
          {cart.length > 0 && (
            <button onClick={clearCart} className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 rounded-full border border-red-500/20 hover:bg-red-500 hover:text-white transition-all">
              <Trash2 className="w-4 h-4" /> <span>Clear Reel</span>
            </button>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column: Events & Add-ons */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Events List */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold uppercase tracking-widest text-white/60 flex items-center gap-2">
                  <Ticket className="text-amber-500" /> Selected Events
                </h2>
                <span className="text-sm font-mono text-amber-500">{cart.length}/{MAX_EVENTS}</span>
              </div>

              {cart.length === 0 ? (
                <div className="bg-white/5 border border-white/10 rounded-3xl p-12 text-center">
                  <p className="text-gray-500 mb-6">Your reel is empty. Start adding some action!</p>
                  <Link to="/events" className="bg-amber-500 text-black px-8 py-3 rounded-full font-bold uppercase tracking-widest hover:scale-105 transition-transform inline-block">Browse Events</Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((event, idx) => (
                    <div key={event.id} className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center gap-4 group hover:border-amber-500/30 transition-colors">
                      <div className="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center text-black font-black text-xl italic">{idx + 1}</div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg leading-tight uppercase tracking-tight">{event.title}</h3>
                        <p className="text-amber-500/60 text-xs font-mono mt-1 uppercase">{event.category} • {event.date}</p>
                      </div>
                      <button onClick={() => removeFromCart(event.id)} className="p-3 text-white/20 hover:text-red-500 transition-colors"><Trash2 size={20}/></button>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Add-ons */}
            <section className="relative">
              {!hasEvents && (
                <div className="absolute inset-0 z-20 bg-black/60 backdrop-blur-[2px] rounded-3xl flex items-center justify-center p-6 text-center">
                  <div className="bg-gray-900 border border-white/10 p-6 rounded-2xl shadow-2xl">
                    <AlertCircle className="mx-auto text-amber-500 mb-2" size={32} />
                    <p className="text-sm font-bold uppercase tracking-tighter">Action Required</p>
                    <p className="text-xs text-gray-400 mt-1">Select at least one event to unlock Pro Show & Accommodation</p>
                  </div>
                </div>
              )}

              <div className="mb-4">
                <h2 className="text-xl font-bold uppercase tracking-widest text-white/60 flex items-center gap-2">
                  <Sparkles className="text-purple-500" /> Exclusive Add-ons
                </h2>
              </div>

              {/* UPDATED: grid-cols logic to look better when only one item is present */}
              <div className={`grid ${isKluStudent ? 'grid-cols-1' : 'md:grid-cols-2'} gap-4`}>
                
                {/* Pro Show Add-on (HIDDEN IF KLU STUDENT) */}
                {!isKluStudent && (
                  <div 
                    onClick={() => hasEvents && setIncludeProShow(!includeProShow)}
                    className={`relative p-6 rounded-3xl border-2 transition-all cursor-pointer ${includeProShow ? 'border-purple-500 bg-purple-500/10 shadow-[0_0_30px_rgba(168,85,247,0.2)]' : 'border-white/5 bg-white/5 opacity-40'}`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-3 bg-purple-500/20 rounded-2xl text-purple-400"><Sparkles /></div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${includeProShow ? 'bg-purple-500 border-purple-500' : 'border-white/20'}`}>
                        {includeProShow && <CheckCircle size={16} className="text-white" />}
                      </div>
                    </div>
                    <h3 className="font-bold text-xl uppercase tracking-tighter">Pro Show Pass</h3>
                    <p className="text-gray-400 text-xs mt-2 leading-relaxed">Star Studio Access for all nights featuring top-tier artists.</p>
                    <div className="mt-4 text-2xl font-black text-purple-400">₹500</div>
                  </div>
                )}

                {/* Accommodation Add-on (VISIBLE TO ALL) */}
                <div 
                  onClick={() => hasEvents && setIncludeAccommodation(!includeAccommodation)}
                  className={`relative p-6 rounded-3xl border-2 transition-all cursor-pointer ${includeAccommodation ? 'border-blue-500 bg-blue-500/10 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : 'border-white/5 bg-white/5 opacity-40'}`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-blue-500/20 rounded-2xl text-blue-400"><BedDouble /></div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${includeAccommodation ? 'bg-blue-500 border-blue-500' : 'border-white/20'}`}>
                      {includeAccommodation && <CheckCircle size={16} className="text-white" />}
                    </div>
                  </div>
                  <h3 className="font-bold text-xl uppercase tracking-tighter">Stay @ Campus</h3>
                  <p className="text-gray-400 text-xs mt-2 leading-relaxed">Safe hostel accommodation within KARE campus with basic amenities.</p>
                  <div className="mt-4 text-2xl font-black text-blue-400">₹400</div>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-[#0a0a0a] border border-white/10 rounded-[2rem] p-8 shadow-2xl overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-3xl rounded-full" />
              
              <h3 className="text-2xl font-bold uppercase tracking-tighter mb-8 flex items-center gap-3">
                <Receipt className="text-amber-500" /> Summary
              </h3>

              <div className="space-y-5 text-sm">
                <div className="flex justify-between text-gray-400">
                  <span>Reel Size:</span>
                  <span className="font-mono text-white">{cart.length} Scenes</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Registration Fee:</span>
                  {isKluStudent ? (
                    <span className="text-[10px] font-black bg-green-500 text-black px-2 py-1 rounded italic">KLU DISCOUNT Applied</span>
                  ) : (
                    <span className="text-white font-bold">₹{hasEvents ? PRICES.EVENT_REGISTRATION : 0}</span>
                  )}
                </div>

                {/* Only show Pro Show line item if it is selected (or if user is NOT KLU, to show 0) */}
                {!isKluStudent && (
                  <div className="flex justify-between text-gray-400">
                    <span>Pro Show:</span>
                    <span className="text-white font-bold">₹{includeProShow ? PRICES.PRO_SHOW : 0}</span>
                  </div>
                )}

                <div className="flex justify-between text-gray-400">
                  <span>Accommodation:</span>
                  <span className="text-white font-bold">₹{includeAccommodation ? PRICES.ACCOMMODATION : 0}</span>
                </div>

                <div className="h-px bg-white/5 my-2" />

                <div className="flex justify-between items-end">
                  <span className="text-xs uppercase font-black text-amber-500/60 tracking-widest">Total Payable</span>
                  <span className="text-4xl font-black text-amber-500 tracking-tighter">₹{totals.total}</span>
                </div>
              </div>

              {isKluStudent && totals.total === 0 && hasEvents ? (
                <button 
                  onClick={() => checkout({ totalAmount: 0 })}
                  className="w-full mt-8 py-5 bg-white text-black font-black uppercase tracking-[0.2em] text-xs rounded-2xl hover:bg-amber-500 transition-colors"
                >
                  Confirm Free Booking
                </button>
              ) : (
                <button
                  disabled={totals.total === 0}
                  onClick={() => setShowCheckoutForm(true)}
                  className="w-full mt-8 py-5 bg-gradient-to-r from-amber-600 to-red-600 text-white font-black uppercase tracking-[0.2em] text-xs rounded-2xl shadow-[0_10px_30px_rgba(220,38,38,0.3)] hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-20 disabled:cursor-not-allowed"
                >
                  Proceed to Payment
                </button>
              )}

              <div className="mt-8 p-4 bg-white/5 rounded-2xl border border-white/5">
                <div className="flex items-start gap-3">
                  <Info size={16} className="text-amber-500 flex-shrink-0 mt-1" />
                  <p className="text-[10px] text-gray-500 leading-relaxed italic">
                    KLU Student verification is based on your logged-in email. Please ensure you are using your official university ID.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <AnimatePresence>
        {showCheckoutForm && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="bg-[#0f0f0f] border border-white/10 w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl"
            >
              <div className="p-8 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-amber-900/10 to-transparent">
                 <h2 className="text-2xl font-black uppercase italic tracking-tighter">Box Office Payment</h2>
                 <button onClick={() => setShowCheckoutForm(false)} className="p-2 bg-white/5 rounded-full hover:bg-red-500 transition-colors"><X size={20}/></button>
              </div>

              <form onSubmit={handleSubmitPayment} className="p-8 space-y-6 overflow-y-auto max-h-[75vh]">
                {/* QR Section */}
                <div className="flex flex-col items-center p-6 bg-white rounded-3xl">
                   <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=${sparkzUPI}&pn=SPARKZ%202K26&am=${totals.total}&cu=INR`} 
                    alt="QR" 
                    className="w-48 h-48 mix-blend-multiply"
                   />
                   <div className="mt-4 text-black text-center">
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Total Amount</p>
                      <p className="text-4xl font-black tracking-tighter">₹{totals.total}</p>
                   </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="text-[10px] font-black uppercase text-gray-500 ml-1">UTR / Transaction ID*</label>
                      <input 
                        type="text" required value={transactionId} onChange={(e)=>setTransactionId(e.target.value)}
                        placeholder="12 Digit UTR Number"
                        className="w-full mt-1 px-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:border-amber-500 focus:outline-none transition-all font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase text-gray-500 ml-1">Your UPI ID (Optional)</label>
                      <input 
                        type="text" value={upiId} onChange={(e)=>setUpiId(e.target.value)}
                        placeholder="yourname@upi"
                        className="w-full mt-1 px-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:border-amber-500 focus:outline-none transition-all font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase text-gray-500 ml-1">Upload Receipt*</label>
                    <div 
                      onClick={() => fileInputRef.current.click()}
                      className="mt-1 group border-2 border-dashed border-white/10 rounded-2xl p-6 text-center cursor-pointer hover:border-amber-500/50 transition-all bg-white/5"
                    >
                      {screenshotPreview ? (
                        <img src={screenshotPreview} alt="Receipt" className="h-32 mx-auto rounded-lg" />
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <Upload className="text-gray-600 group-hover:text-amber-500 transition-colors" />
                          <span className="text-xs text-gray-500">Tap to upload screenshot</span>
                        </div>
                      )}
                      <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                    </div>
                  </div>
                </div>

                {formError && <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs flex items-center gap-2"><AlertCircle size={14}/> {formError}</div>}

                <button 
                  type="submit" 
                  disabled={isUploading}
                  className="w-full py-5 bg-amber-500 text-black font-black uppercase tracking-[0.2em] text-xs rounded-2xl hover:brightness-110 active:scale-95 transition-all shadow-[0_10px_20px_rgba(245,158,11,0.2)]"
                >
                  {isUploading ? 'Verifying...' : 'Finalize Registration'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CartPage;
