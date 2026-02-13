import React, { useState, useRef, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingCart, Trash2, ArrowLeft, CreditCard, 
  Ticket, Calendar, Clock, MapPin, Users, CheckCircle,
  AlertCircle, Shield, X, Upload, QrCode, Copy,
  RotateCw, Receipt, ExternalLink, Sparkles, BedDouble, Info,
  ArrowRight, Heart
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
  const { cart, removeFromCart, clearCart, checkout, isLoading, MAX_EVENTS } = useCart();
  const { user } = useAuth();

  // --- States ---
  const [includeProShow, setIncludeProShow] = useState(false);
  const [includeAccommodation, setIncludeAccommodation] = useState(false);
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [showReminder, setShowReminder] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [upiId, setUpiId] = useState('');
  const [paymentScreenshot, setPaymentScreenshot] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [formError, setFormError] = useState('');
  const fileInputRef = useRef(null);

  const sparkzUPI = 'kvbupiqr.105000000014533@kvb';

  // --- Logic: Pricing & Student Check ---
  const isKluStudent = useMemo(() => user?.email?.toLowerCase().endsWith('@klu.ac.in'), [user]);
  
  const totals = useMemo(() => {
    const eventFee = (cart.length > 0 && !isKluStudent) ? PRICES.EVENT_REGISTRATION : 0;
    const proShowFee = includeProShow ? PRICES.PRO_SHOW : 0;
    const accommodationFee = includeAccommodation ? PRICES.ACCOMMODATION : 0;
    return { eventFee, proShowFee, accommodationFee, total: eventFee + proShowFee + accommodationFee };
  }, [cart.length, isKluStudent, includeProShow, includeAccommodation]);

  const hasEvents = cart.length > 0;

  // --- Handlers ---
  const handleProceedClick = () => {
    if (cart.length === 0) {
      toast.error('Add at least one event to your reel!');
      return;
    }

    // If they haven't picked both add-ons, show a friendly reminder
    if (!includeProShow || !includeAccommodation) {
      setShowReminder(true);
    } else {
      openPayment();
    }
  };

  const openPayment = () => {
    setShowReminder(false);
    if (totals.total === 0) {
      handleFinalCheckout();
    } else {
      setShowCheckoutForm(true);
    }
  };

  const handleFinalCheckout = async () => {
    await checkout({ totalAmount: totals.total, includeProShow, includeAccommodation });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.match('image.*')) {
      setPaymentScreenshot(file);
      const reader = new FileReader();
      reader.onload = (e) => setScreenshotPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const copyUPI = () => {
    navigator.clipboard.writeText(sparkzUPI);
    toast.success('UPI ID copied to clipboard');
  };

  return (
    <div className="min-h-screen bg-[#020202] text-white pt-24 pb-20 selection:bg-amber-500 selection:text-black">
      {/* Background FX */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-amber-600/5 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-0 right-0 w-[40vw] h-[40vw] bg-red-600/5 blur-[100px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        
        {/* Header Section */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <Link to="/events" className="inline-flex items-center gap-2 text-gray-500 hover:text-amber-400 mb-4 transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-bold uppercase tracking-widest">Back to Studio</span>
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase leading-none">
                Your <span className="text-amber-500">Booking</span>
              </h1>
              <p className="text-gray-500 mt-2 font-mono text-sm tracking-widest uppercase">Box Office // Sparkz 2K26</p>
            </div>
            {cart.length > 0 && (
              <button onClick={clearCart} className="flex items-center gap-2 text-xs font-bold uppercase text-red-500/60 hover:text-red-500 transition-colors">
                <Trash2 size={14} /> Clear All Items
              </button>
            )}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-10">
          
          {/* LEFT: CART ITEMS & ADDONS */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* 1. Selected Events */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px flex-1 bg-white/10" />
                <h2 className="text-xs font-black uppercase tracking-[0.4em] text-white/40">Premiere Selection</h2>
                <div className="h-px flex-1 bg-white/10" />
              </div>

              {cart.length === 0 ? (
                <div className="bg-white/5 border border-white/10 rounded-[2rem] p-16 text-center backdrop-blur-sm">
                  <ShoppingCart size={48} className="mx-auto text-white/10 mb-4" />
                  <h3 className="text-xl font-bold uppercase">Your reel is empty</h3>
                  <p className="text-gray-500 text-sm mt-2 max-w-xs mx-auto">You haven't selected any cinematic experiences yet.</p>
                  <Link to="/events" className="mt-8 inline-block px-8 py-4 bg-white text-black font-black uppercase tracking-widest text-xs rounded-full hover:bg-amber-500 transition-all">Start Browsing</Link>
                </div>
              ) : (
                <div className="grid gap-4">
                  {cart.map((event, idx) => (
                    <motion.div key={event.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * idx }}
                      className="group relative bg-[#0a0a0a] border border-white/5 rounded-3xl p-5 flex items-center gap-6 hover:border-amber-500/30 transition-all hover:bg-white/[0.02]"
                    >
                      <img src={event.image} alt={event.title} className="w-20 h-20 rounded-2xl object-cover shadow-2xl grayscale group-hover:grayscale-0 transition-all duration-500" />
                      <div className="flex-1">
                        <h4 className="text-xl font-black uppercase tracking-tight leading-none mb-1">{event.title}</h4>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                           <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">{event.category}</span>
                           <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1"><Calendar size={10}/>{event.day}</span>
                           <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1"><MapPin size={10}/>{event.venue}</span>
                        </div>
                      </div>
                      <button onClick={() => removeFromCart(event.id)} className="p-3 text-white/20 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-all"><Trash2 size={20}/></button>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* 2. Exclusive Add-ons */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
               <div className="flex items-center gap-3 mb-6">
                <div className="h-px flex-1 bg-white/10" />
                <h2 className="text-xs font-black uppercase tracking-[0.4em] text-white/40">VIP Enhancements</h2>
                <div className="h-px flex-1 bg-white/10" />
              </div>

              <div className="grid md:grid-cols-2 gap-6 relative">
                {!hasEvents && (
                  <div className="absolute inset-0 z-20 bg-[#020202]/80 backdrop-blur-[2px] rounded-3xl flex items-center justify-center p-6 text-center border border-white/5">
                    <div className="max-w-xs">
                       <AlertCircle className="mx-auto text-amber-500 mb-3" size={32} />
                       <p className="text-sm font-bold uppercase tracking-widest">Select an event first</p>
                       <p className="text-[10px] text-gray-500 mt-2">Add-ons are only available for registered participants.</p>
                    </div>
                  </div>
                )}

                <AddonItem 
                  title="Pro Show Pass" 
                  price={PRICES.PRO_SHOW} 
                  icon={Sparkles} 
                  desc="Elite access to Star Studio concerts." 
                  selected={includeProShow} 
                  onToggle={() => setIncludeProShow(!includeProShow)}
                />
                <AddonItem 
                  title="Stay @ KARE" 
                  price={PRICES.ACCOMMODATION} 
                  icon={BedDouble} 
                  desc="Comfortable campus hostel stay." 
                  selected={includeAccommodation} 
                  onToggle={() => setIncludeAccommodation(!includeAccommodation)}
                />
              </div>
            </motion.div>

          </div>

          {/* RIGHT: ORDER SUMMARY */}
          <div className="lg:col-span-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}
              className="sticky top-28 bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-[2.5rem] p-8 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-[80px] rounded-full pointer-events-none" />
              
              <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-8 flex items-center gap-3">
                <Receipt size={24} className="text-amber-500" /> Bill Summary
              </h3>

              <div className="space-y-6 text-sm">
                <SummaryRow label="Registration Fee" value={totals.eventFee} status={isKluStudent ? "WAIVED" : null} />
                <SummaryRow label="Pro Show Elite" value={includeProShow ? totals.proShowFee : 0} />
                <SummaryRow label="Accommodation" value={includeAccommodation ? totals.accommodationFee : 0} />

                <div className="h-px bg-white/5 my-4" />

                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Grand Total</p>
                    <p className="text-5xl font-black text-amber-500 tracking-tighter">₹{totals.total}</p>
                  </div>
                  <Shield size={32} className="text-white/5" />
                </div>
              </div>

              <button 
                onClick={handleProceedClick}
                disabled={isLoading || cart.length === 0}
                className="w-full mt-10 py-5 bg-amber-500 text-black font-black uppercase tracking-[0.2em] text-xs rounded-2xl hover:bg-amber-400 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-amber-500/20 flex items-center justify-center gap-3 disabled:opacity-20"
              >
                {isLoading ? <RotateCw className="animate-spin" size={18} /> : <>Proceed to Payment <ArrowRight size={16}/></>}
              </button>

              <div className="mt-8 flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5 italic">
                <Info size={16} className="text-amber-500 flex-shrink-0" />
                <p className="text-[9px] text-gray-500 leading-relaxed uppercase tracking-tighter">
                  KLU verification is automated via email ID. External students must provide a valid UTR for verification.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* --- MODAL 1: ADD-ON REMINDER --- */}
      <AnimatePresence>
        {showReminder && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setShowReminder(false)} />
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="relative bg-gray-900 border border-amber-500/30 w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl text-center"
            >
              <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-amber-500">
                <Sparkles size={32} />
              </div>
              <h2 className="text-2xl font-black uppercase italic tracking-tighter mb-4">Wait, Star!</h2>
              <p className="text-gray-400 text-lm leading-relaxed mb-8 uppercase tracking-tight">
                You haven't selected the <span className="text-amber-500 font-bold">VIP Add-ons</span>. Would you like to add Pro Show access or Campus Stay before you pay?
              </p>

              <div className="grid gap-3">
                <button onClick={openPayment} className="w-full py-4 bg-white text-black font-black uppercase tracking-widest text-[15px] rounded-xl hover:bg-gray-200 transition-all">
                  No, proceed to pay ₹{totals.total}
                </button>
                <button onClick={() => setShowReminder(false)} className="w-full py-4 bg-amber-500 text-black font-black uppercase tracking-widest text-[16px] rounded-xl hover:bg-amber-400 transition-all">
                  Wait, let me add them
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- MODAL 2: PAYMENT FORM --- */}
      <AnimatePresence>
        {showCheckoutForm && (
          <div data-lenis-prevent className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/95 backdrop-blur-xl" />
            <motion.div initial={{ scale: 0.9, y: 50 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 50 }}
              className="relative bg-[#0a0a0a] border border-white/10 w-full max-w-lg rounded-[3rem] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="p-8 border-b border-white/5 flex justify-between items-center">
                 <div className="flex items-center gap-3">
                    <QrCode className="text-amber-500" />
                    <h2 className="text-xl font-black uppercase italic tracking-tighter">Box Office</h2>
                 </div>
                 <button onClick={() => setShowCheckoutForm(false)} className="p-2 bg-white/5 rounded-full hover:bg-red-500 transition-colors"><X size={20}/></button>
              </div>

              {/* Modal Form */}
              <form onSubmit={(e) => { e.preventDefault(); setIsVerifying(true); setTimeout(handleFinalCheckout, 2000); }} className="p-8 space-y-6 overflow-y-auto custom-scrollbar">
                
                {/* QR Section */}
                <div className="flex flex-col items-center p-8 bg-white rounded-[2rem] shadow-inner">
                   <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=${sparkzUPI}&pn=SPARKZ%202K26&am=${totals.total}&cu=INR`} alt="QR" className="w-48 h-48 mix-blend-multiply" />
                   <div className="mt-4 text-center">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Scan to pay</p>
                      <p className="text-5xl font-black text-black tracking-tighter">₹{totals.total}</p>
                      <div className="flex items-center justify-center gap-2 mt-2 text-[10px] font-mono text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                        {sparkzUPI} <button type="button" onClick={copyUPI}><Copy size={12}/></button>
                      </div>
                   </div>
                </div>

                <div className="space-y-4">
                  <InputBox label="Transaction ID / UTR*" placeholder="12-digit payment ref" value={transactionId} onChange={setTransactionId} required />
                  <InputBox label="Your UPI ID" placeholder="user@bank" value={upiId} onChange={setUpiId} />
                  
                  <div>
                    <label className="text-[10px] font-black uppercase text-gray-500 mb-2 block ml-2">Payment Receipt*</label>
                    <div onClick={() => fileInputRef.current.click()} className="relative group border-2 border-dashed border-white/10 rounded-3xl p-8 text-center cursor-pointer hover:border-amber-500/50 transition-all bg-white/5 overflow-hidden">
                      {screenshotPreview ? (
                        <img src={screenshotPreview} alt="Receipt" className="h-32 mx-auto rounded-xl object-contain" />
                      ) : (
                        <div className="flex flex-col items-center gap-3">
                          <Upload className="text-gray-600 group-hover:text-amber-500 transition-colors" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Upload screenshot</span>
                        </div>
                      )}
                      <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                    </div>
                  </div>
                </div>

                <button type="submit" disabled={isVerifying || !transactionId || !paymentScreenshot} className="w-full py-5 bg-amber-500 text-black font-black uppercase tracking-[0.2em] text-xs rounded-2xl shadow-xl shadow-amber-500/20">
                  {isVerifying ? 'Confirming with Bank...' : 'Submit Payment Details'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Helper Components ---

const AddonItem = ({ title, price, icon: Icon, desc, selected, onToggle }) => (
  <div onClick={onToggle} className={`relative p-6 rounded-[2rem] border-2 transition-all cursor-pointer group ${selected ? 'border-amber-500 bg-amber-500/10' : 'border-white/5 bg-white/5 hover:border-white/20'}`}>
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-2xl transition-colors ${selected ? 'bg-amber-500 text-black' : 'bg-white/5 text-gray-400'}`}><Icon size={24}/></div>
      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${selected ? 'bg-amber-500 border-amber-500' : 'border-white/10'}`}>
        {selected && <CheckCircle size={14} className="text-black" />}
      </div>
    </div>
    <h3 className="text-lg font-black uppercase italic tracking-tighter">{title}</h3>
    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tight mt-1 leading-relaxed">{desc}</p>
    <p className="text-2xl font-black text-amber-500 mt-4 leading-none tracking-tighter">₹{price}</p>
  </div>
);

const SummaryRow = ({ label, value, status }) => (
  <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-widest">
    <span className="text-gray-500">{label}</span>
    {status ? (
      <span className="text-green-500 flex items-center gap-1"><Heart size={10} fill="currentColor"/> {status}</span>
    ) : (
      <span className="text-white font-mono">₹{value}</span>
    )}
  </div>
);

const InputBox = ({ label, value, onChange, ...props }) => (
  <div>
    <label className="text-[10px] font-black uppercase text-gray-500 mb-1 block ml-2">{label}</label>
    <input 
      className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:border-amber-500 focus:outline-none transition-all font-mono text-sm placeholder:text-white/10"
      value={value} onChange={(e) => onChange(e.target.value)} {...props}
    />
  </div>
);

export default CartPage;