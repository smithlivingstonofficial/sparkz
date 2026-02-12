import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { University, Users, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { auth, googleProvider } from '../../firebase';
import { signInWithPopup, signOut } from 'firebase/auth';

const AuthSelection = () => {
  const { googleLogin } = useAuth();
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Domain Restriction Check
      if (!user.email.endsWith('@klu.ac.in')) {
        await signOut(auth);
        alert('Access Restricted: Only @klu.ac.in email addresses are allowed.');
        return;
      }

      // Call backend with email and name
      const loginResult = await googleLogin(user.email, user.displayName);

      if (loginResult.success) {
        navigate('/');
      } else {
        alert(loginResult.message || 'Login failed');
      }
    } catch (error) {
      console.error("Google Sign-in error:", error);
      alert(error.message || 'Google Sign-in failed');
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 pt-12">
          <div className="flex justify-center items-center gap-3 mb-6">
            <Sparkles className="text-amber-500" size={32} />
            <h1 className="text-5xl font-bold font-['Cinzel'] tracking-tight">
              SPARKZ<span className="text-amber-500">'26</span>
            </h1>
          </div>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Kalasalingam Academy's Cinematic Cultural Fest
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 font-['Cinzel']">
            Choose Your Portal
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* KARE Students Card */}
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-900/20 to-red-900/20 border border-amber-500/20 p-8 hover:border-amber-500/40 transition-all duration-500">
              <div className="absolute top-2 right-4">
                <div className="bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full text-xs font-bold">
                  INTERNAL
                </div>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-amber-500/20 rounded-xl">
                  <University className="text-amber-400" size={28} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">KARE Students</h3>
                  <p className="text-white/60 text-sm">Kalasalingam Academy of Research & Education</p>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {[
                  'Direct campus login with your credentials',
                  'Access to all events and workshops',
                  'Priority registration for pro-shows',
                  'Special discounts on merchandise',
                  'Campus accommodation facilities'
                ].map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                    <span className="text-white/80">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6">
                <button
                  onClick={handleGoogleLogin}
                  type="button"
                  className="w-full py-4 bg-white text-black font-bold text-lg rounded-lg hover:bg-gray-100 transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Sign in with KARE Mail
                </button>
                <p className="mt-4 text-xs text-white/40 text-center">
                  Only @klu.ac.in email addresses are permitted.
                </p>
              </div>
            </div>

            {/* Other College Students Card */}
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/20 p-8 hover:border-blue-500/40 transition-all duration-500">
              <div className="absolute top-2 right-4">
                <div className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-xs font-bold">
                  EXTERNAL
                </div>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-blue-500/20 rounded-xl">
                  <Users className="text-blue-400" size={28} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Other Colleges</h3>
                  <p className="text-white/60 text-sm">External Participants & Visitors</p>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {[
                  'Register with your college credentials',
                  'Access to all competitive events',
                  'Pro-show passes available',
                  'Accommodation assistance provided',
                  'Transport coordination support'
                ].map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-white/80">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="grid grid-cols-2 gap-4">
                <Link
                  to="/auth/external/login"
                  className="py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 text-center transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/auth/external/register"
                  className="py-3 bg-transparent border border-blue-500 text-blue-400 font-semibold rounded-lg hover:bg-blue-500/10 text-center transition-colors"
                >
                  Register
                </Link>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="mt-12 p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Sparkles size={20} className="text-amber-500" />
              Important Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h4 className="font-semibold text-amber-300">For KARE Students</h4>
                <p className="text-sm text-white/60">
                  Use your KARE email and student ID for authentication
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-blue-300">For Other Colleges</h4>
                <p className="text-sm text-white/60">
                  College ID card verification required during on-site registration
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-white">Common Guidelines</h4>
                <p className="text-sm text-white/60">
                  All participants must follow the code of conduct
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthSelection;