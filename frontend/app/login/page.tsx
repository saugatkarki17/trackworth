'use client';

import { useState } from 'react';
import {
  updateProfile,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
} from 'firebase/auth';
import { auth } from '../../services/firebaseConfig';
import { useRouter } from 'next/navigation';
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleAuth = async () => {
    setError('');
    setSuccessMessage('');

    if (!email.includes('@') || password.length < 8) {
      return setError('Enter a valid email and at least 8 character password.');
    }

    if (mode === 'signup' && password !== confirm) {
      return setError('Passwords do not match.');
    }

    try {
      if (mode === 'signup') {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, {
          displayName: fullName,
        });
        setMode('login');
        setSuccessMessage('✅ Account created! You can now log in.');
        setTimeout(() => setSuccessMessage(''), 3000);
        setFullName('');
        setEmail('');
        setPassword('');
        setConfirm('');
        return;
      }

      await signInWithEmailAndPassword(auth, email, password);
      const setupDone = localStorage.getItem('setupComplete') === 'true';
      router.push(setupDone ? '/dashboard' : '/setup');

    } catch (err: any) {
      const msg = err.message;
      if (msg.includes('auth/email-already-in-use')) setError('Email already in use.');
      else if (msg.includes('auth/user-not-found')) setError('User not found.');
      else if (msg.includes('auth/wrong-password')) setError('Incorrect password.');
      else setError('Authentication failed. Try again.');
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      const setupDone = localStorage.getItem('setupComplete') === 'true';
      router.push(setupDone ? '/dashboard' : '/setup');
    } catch {
      setError('Google sign-in failed.');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Left Illustration */}
      <div className="hidden lg:flex w-1/2 bg-white items-center justify-center p-5">
        <div className="text-center">
          <Image
            src="/logo.png"
            alt="TRACKWORTH Logo"
            width={280}
            height={80}
            className="mb-[4rem] m-auto"
          />
          <div className="relative w-[550px] h-[420px] mx-auto">
            <img src="/final.svg" alt="auth page" className="w-[550px]" />
          </div>
          <h2 className="text-3xl font-semibold mb-2">Smart finance companion for students</h2>
          <p className="text-gray-600 text-xl">Easily manage your income, expenses, and savings. <br /> Get personalized insights and grow your net worth with AI.</p>
        </div>
      </div>

      {/* Right Form */}
      <div className="w-full lg:w-1/2 bg-white flex flex-col justify-center px-8 py-12 sm:px-16 md:px-24">
        <div className="max-w-md w-full mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-[1rem]">
            {mode === 'login' ? 'Welcome back!' : 'Create your account'}
          </h2>
          <p className="text-xl text-gray-500 mb-6">
            Start managing your finance faster and better
          </p>

          {successMessage && (
            <div className="mb-4 bg-green-200 text-green-700 px-4 py-4 rounded text-sm">
              {successMessage}
            </div>
          )}
          {error && (
            <div className="mb-4 bg-red-100 text-red-500 px-4 py-4 rounded text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {mode === 'signup' && (
              <input
                type="text"
                placeholder="Full name"
                className="w-full px-4 py-5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            )}
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full px-4 py-5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="At least 8 characters"
              className="w-full px-4 py-5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {mode === 'signup' && (
              <input
                type="password"
                placeholder="Confirm password"
                className="w-full px-4 py-5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
            )}
            <div className="flex justify-between items-center">
              {mode === 'login' && (
                <a href="#" className="text-sm text-blue-500 hover:underline">
                  Forgot password?
                </a>
              )}
            </div>
            <button
              onClick={handleAuth}
              className="w-full bg-[#3459E2] hover:bg-blue-500 text-white py-5 rounded-lg transition font-medium"
            >
              {mode === 'signup' ? 'Create Account' : 'Login'}
            </button>
          </div>

          <div className="mt-5 text-center text-sm flex items-center text-gray-500 relative">
            <div className="w-full h-[1.4px] bg-gray-200"></div>
            <div className='p-3'>OR</div>
            <div className="w-full h-[1.4px] bg-gray-200"></div>
          </div>

          <div className="mt-4 flex flex-col gap-3">
            <button
              onClick={handleGoogleSignIn}
              className="flex items-center justify-center w-full gap-3 bg-white border border-gray-300 rounded-lg py-4 px-4 hover:shadow-md transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-6 h-6">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                <path fill="none" d="M0 0h48v48H0z" />
              </svg>
              <span className="text-gray-700 font-medium text-m">Sign in with Google</span>
            </button>

            {/* Facebook Placeholder */}
            <button
              disabled
              className="flex items-center justify-center w-full gap-3 bg-gray-100 border border-gray-300 rounded-lg py-4 px-4 text-gray-400 cursor-not-allowed"
              title="Facebook sign-in coming soon"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#AAB8C2" className="w-6 h-6">
                <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073c0 6.01 4.388 10.984 10.125 11.854v-8.385H7.078v-3.47h3.047V9.428c0-3.007 1.792-4.668 4.533-4.668 1.312 0 2.686.235 2.686.235v2.953h-1.513c-1.49 0-1.953.926-1.953 1.874v2.245h3.328l-.532 3.47h-2.796v8.385C19.612 23.057 24 18.082 24 12.073z" />
              </svg>
              <span className="text-m font-medium">Sign in with Facebook</span>
              <span className="ml-1 text-s italic">(coming soon)</span>
            </button>
          </div>

          <p className="mt-6 text-m text-center text-gray-500">
            {mode === 'login' ? (
              <>
                Don't have an account yet?{' '}
                <button
                  onClick={() => setMode('signup')}
                  className="text-blue-600 hover:underline font-medium"
                >
                  Sign Up
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  onClick={() => setMode('login')}
                  className="text-blue-600 hover:underline font-medium"
                >
                  Log In
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
