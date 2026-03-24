import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  X, Crown, Star, Ticket, Calendar, Clock,
  MapPin, Users, Sparkles, Award, Share2,
  Bookmark, Download, ChevronDown, Heart,
  Music, Mic, Video, Phone, ExternalLink,
  CheckCircle, UploadCloud
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const ProShowModal = ({ event, onClose, isMobile }) => {
  const modalRef = useRef(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const { user } = useAuth()

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleContentScroll = (e) => {
    setIsScrolled(e.target.scrollTop > 20);
  };

  const handleScreenshotUpload = () => {
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: "dchbfnlct",
        uploadPreset: "sparkz",
      },
      (error, result) => {
        if (!error && result && result.event === "success") {
          setImgUrl(result.info.secure_url);
          setIsUploading(false);
        }
      }
    );
    setIsUploading(true);
    widget.open();
  };

  const handleSubmitPayment = async (e) => {
    e.preventDefault();
    if (!transactionId || !imgUrl) {
      alert("Please provide all payment details.");
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/event/proshow`, {
        transactionId,
        paymentScreenshot: imgUrl,
        event,
        user
      });
      if (response.data) {
        alert("Payment Submitted Successfully!");
        setShowPaymentModal(false);
        onClose();
      }
    } catch (error) {
      console.error("Payment submission failed:", error);
      alert("Payment submission failed. Please try again.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4"
      onClick={onClose}
    >
      {/* Luxury Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/98 via-amber-900/30 to-black/98 backdrop-blur-3xl" />
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 via-yellow-500/10 to-amber-500/20" />

      <motion.div
        ref={modalRef}
        initial={{ scale: 0.95, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 10 }}
        className="relative w-full h-full md:max-w-4xl md:h-[90vh] md:mx-auto rounded-3xl overflow-hidden border border-amber-500/30 shadow-2xl shadow-amber-500/20"
        onClick={e => e.stopPropagation()}
        style={{
          background: `linear-gradient(rgba(10, 10, 10, 0.98), rgba(5, 5, 5, 0.99)), url(${event.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Glass Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/95 via-black/90 to-black/95 backdrop-blur-xl" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-30 p-3 bg-black/80 backdrop-blur-xl rounded-full text-white hover:bg-black/95 transition-all duration-300 hover:scale-110 border border-amber-500/30 shadow-lg group"
        >
          <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
        </button>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ opacity: isScrolled ? 0 : 1 }}
          className="absolute top-6 left-1/2 transform -translate-x-1/2 z-30"
        >
          <div className="flex items-center gap-2 px-4 py-2 bg-black/80 backdrop-blur-md rounded-full border border-amber-500/30 shadow-lg">
            <ChevronDown size={16} className="text-amber-400 animate-bounce" />
            <span className="text-amber-200 text-sm font-medium">Scroll for details</span>
          </div>
        </motion.div>

        {/* Scrollable Content */}
        <div
          onScroll={handleContentScroll}
          className="relative z-10 h-full overflow-y-auto"
        >
          <div className="p-6 md:p-10 pt-16">
            {/* Header */}
            <div className="mb-8">
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-600 to-yellow-600 rounded-full backdrop-blur-md">
                  <Crown size={18} className="text-white" />
                  <span className="text-white text-sm font-bold uppercase tracking-wider">
                    PREMIUM PRO SHOW
                  </span>
                </div>

                <div className="px-4 py-2 bg-black/80 backdrop-blur-md rounded-full border border-amber-500/30">
                  <span className="text-amber-300 text-sm font-bold">{event.day}</span>
                </div>

                <div className="flex items-center gap-1 px-3 py-2 bg-black/80 backdrop-blur-md rounded-full">
                  <Star size={14} className="text-amber-400 fill-amber-400" />
                  <span className="text-white text-sm font-bold">{event.rating}</span>
                </div>
              </div>

              <h2 className="text-4xl md:text-5xl font-bold font-['Cinzel'] text-white mb-3 leading-tight">
                {event.title}
              </h2>

              <p className="text-xl md:text-2xl text-amber-100 mb-6 font-medium">
                {event.headliner}
              </p>

              <p className="text-lg text-amber-200/70 italic">{event.tagline}</p>
            </div>

            {/* Quick Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { icon: Calendar, label: 'DATE', value: event.date },
                { icon: Clock, label: 'TIME', value: event.time },
                { icon: MapPin, label: 'VENUE', value: event.venue },
                { icon: Users, label: 'CAPACITY', value: event.capacity }
              ].map((item, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-lg p-4 rounded-2xl border border-amber-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <item.icon className="text-amber-300" size={18} />
                    <div className="text-amber-200/70 text-sm">{item.label}</div>
                  </div>
                  <div className="text-white font-bold text-lg">{item.value}</div>
                </div>
              ))}
            </div>

            {/* Main Content */}
            <div className="space-y-8">
              {/* Description */}
              <div className="bg-black/60 backdrop-blur-xl p-6 rounded-3xl border border-white/15">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-3 h-8 bg-gradient-to-b from-amber-400 to-yellow-500 rounded-full"></div>
                  <h3 className="font-bold text-white text-2xl">SHOW DESCRIPTION</h3>
                </div>
                <p className="text-white/85 leading-relaxed text-lg">
                  {event.description}
                </p>
              </div>

              {/* Features */}
              <div className="bg-gradient-to-r from-amber-900/40 to-yellow-900/40 backdrop-blur-xl p-6 rounded-3xl border border-amber-500/30">
                <h3 className="font-bold text-white text-2xl mb-6">PREMIUM FEATURES</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {event.features?.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-r from-amber-600 to-yellow-600 rounded-lg">
                        <Sparkles size={16} className="text-white" />
                      </div>
                      <span className="text-white text-lg">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price & Registration */}
              <div className="bg-gradient-to-br from-amber-900/50 to-yellow-900/50 backdrop-blur-2xl p-8 rounded-3xl border border-amber-500/40">
                <div className="text-center">
                  <div className="text-amber-200/80 text-sm mb-2 font-medium uppercase tracking-wider">
                    VIP TICKET PRICE
                  </div>
                  <div className="text-white text-4xl md:text-5xl font-bold mb-6">{event.price}</div>
                  <button
                    onClick={() => setShowPaymentModal(true)}
                    className="px-12 py-4 bg-gradient-to-r from-amber-600 to-yellow-600 text-white font-bold text-xl rounded-xl hover:from-amber-700 hover:to-yellow-700 transition-all duration-300 flex items-center justify-center gap-3 mx-auto">
                    <Ticket size={24} />
                    BUY VIP TICKET
                  </button>
                  <p className="text-amber-200/60 text-sm mt-4">
                    *Limited seats available. Book now to avoid disappointment.
                  </p>
                </div>
              </div>

              {/* Contact */}
              <div className="bg-black/60 backdrop-blur-xl p-6 rounded-3xl border border-white/15">
                <h3 className="font-bold text-white text-2xl mb-6">CONTACT FOR QUERIES</h3>
                <div className="space-y-4">
                  {event.eventCoordinators?.map((coordinator, idx) => (
                    <div key={idx} className="flex items-center gap-4 bg-white/10 p-4 rounded-xl">
                      <div className="p-3 bg-amber-900/40 rounded-lg">
                        <Phone size={20} className="text-amber-300" />
                      </div>
                      <div>
                        <div className="text-white font-semibold text-lg">
                          {coordinator.split(' - ')[0]}
                        </div>
                        <div className="text-amber-300 font-mono">
                          {coordinator.split(' - ')[1]}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="mt-10 pt-8 border-t border-amber-500/20">
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setShowPaymentModal(true)}
                  className="flex-1 py-4 bg-gradient-to-r from-amber-600 to-yellow-600 text-white font-bold rounded-xl hover:from-amber-700 hover:to-yellow-700 transition-all duration-300 flex items-center justify-center gap-3">
                  <Ticket size={22} />
                  <span className="text-lg">BUY TICKET NOW</span>
                </button>
                <button className="flex-1 py-4 bg-white/15 backdrop-blur-xl text-white font-bold rounded-xl hover:bg-white/25 transition-all duration-300 flex items-center justify-center gap-3 border border-amber-500/30">
                  <Bookmark size={22} />
                  <span className="text-lg">SAVE FOR LATER</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Modal Overlay */}
        {showPaymentModal && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 border border-amber-500/30 rounded-2xl p-6 max-w-md w-full shadow-2xl relative"
            >
              <button
                onClick={() => setShowPaymentModal(false)}
                className="absolute top-4 right-4 text-white/60 hover:text-white"
              >
                <X size={20} />
              </button>

              <h3 className="text-2xl font-bold text-amber-400 mb-6 font-['Cinzel']">
                Complete Payment
              </h3>

              <div className="space-y-6">
                {/* QR Code Section */}
                <div className="bg-white p-4 rounded-xl flex flex-col items-center justify-center gap-3">
                  <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=sneha000@ybl&pn=Sparkz&am=500" alt="Payment QR" className="w-40 h-40 mix-blend-multiply" />
                  <div className="text-black text-center">
                    <p className="font-bold text-lg">₹{event.price}</p>
                    <p className="text-sm text-gray-600">Scan via Any UPI App</p>
                    <p className="text-xs text-gray-500 mt-1">UPI ID: sneha000@ybl</p>
                  </div>
                </div>

                {/* Upload Section */}
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Upload Payment Screenshot
                  </label>
                  <div
                    onClick={handleScreenshotUpload}
                    className="border-2 border-dashed border-amber-500/30 rounded-xl p-4 cursor-pointer hover:border-amber-500/60 transition-colors text-center bg-black/20"
                  >
                    {isUploading ? (
                      <p className="text-amber-400">Uploading...</p>
                    ) : imgUrl ? (
                      <div className="flex items-center justify-center gap-2 text-green-400">
                        <CheckCircle size={20} />
                        <span>Screenshot Uploaded!</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-white/60">
                        <UploadCloud size={24} />
                        <span>Click to upload screenshot</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Transaction ID Input */}
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Transaction ID / UTR
                  </label>
                  <input
                    type="text"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    placeholder="Enter 12-digit UTR number"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-amber-500/50"
                  />
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleSubmitPayment}
                  disabled={!transactionId || !imgUrl}
                  className="w-full py-3 bg-gradient-to-r from-amber-600 to-yellow-600 text-white font-bold rounded-xl hover:from-amber-700 hover:to-yellow-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  VERIFY & REGISTER
                </button>
              </div>
            </motion.div>
          </div>
        )}

      </motion.div>
    </motion.div>
  );
};

export default ProShowModal;