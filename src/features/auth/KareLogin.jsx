// KareLogin.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { University, ArrowLeft } from 'lucide-react';
import { auth, googleProvider } from '../../firebase';
import { signInWithPopup, signOut } from 'firebase/auth';

const KareLogin = () => {
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
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] text-white">
      <div className="container mx-auto px-6 py-12">
        {/* Back Button */}
        <Link
          to="/auth"
          className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Selection
        </Link>

        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="flex justify-center items-center gap-3 mb-4">
              <University className="text-amber-500" size={40} />
              <h1 className="text-4xl font-bold font-['Cinzel']">
                KARE Login
              </h1>
            </div>
            <p className="text-white/70">
              Exclusive login for Kalasalingam Academy students
            </p>
          </div>

          {/* Login Card */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-xl">
            <div className="text-center mb-8">
              <p className="text-white/80 mb-6">
                Please sign in using your institutional Google account.
              </p>

              {/* <button
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
              </button> */}

              <p className="mt-4 text-xs text-white/40">
                Only @klu.ac.in email addresses are permitted.
              </p>
            </div>

            {/* Divider */}
            <div className="my-6 flex items-center">
              <div className="flex-1 h-px bg-white/20"></div>
              <div className="flex-1 h-px bg-white/20"></div>
            </div>

            {/* Quick Links */}
            <div className="space-y-3">
              <a
                href="https://kare.edu.in"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-3 border border-white/20 rounded-lg hover:bg-white/5 transition-colors text-sm text-white/70 hover:text-white"
              >
                <University size={16} />
                <span>Visit KARE Portal</span>
              </a>
            </div>
          </div>

          {/* Security Notice */}
          <div className="mt-8 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
            <p className="text-sm text-white/80 text-center">
              <span className="font-semibold">Note:</span> If you face issues logging in, please contact the student coordinator.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KareLogin;