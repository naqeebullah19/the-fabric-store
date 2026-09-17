import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const GOOGLE_SCRIPT_ID = 'google-identity-services';

export default function GoogleAuthButton() {
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const buttonRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  useEffect(() => {
    if (!clientId || !buttonRef.current) return undefined;

    const renderButton = () => {
      if (!window.google?.accounts?.id || !buttonRef.current) return;
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: async ({ credential }) => {
          setLoading(true);
          try {
            await loginWithGoogle(credential);
            toast.success('Welcome!');
            navigate(location.state?.from || '/');
          } catch (err) {
            toast.error(err.response?.data?.message || 'Google sign-in failed');
          } finally {
            setLoading(false);
          }
        },
      });
      buttonRef.current.innerHTML = '';
      window.google.accounts.id.renderButton(buttonRef.current, {
        theme: 'outline',
        size: 'large',
        width: 390,
        text: 'continue_with',
      });
    };

    const existingScript = document.getElementById(GOOGLE_SCRIPT_ID);
    if (existingScript) {
      renderButton();
      return undefined;
    }

    const script = document.createElement('script');
    script.id = GOOGLE_SCRIPT_ID;
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = renderButton;
    document.head.appendChild(script);

    return undefined;
  }, [clientId, location.state, loginWithGoogle, navigate]);

  if (!clientId) {
    return <p className="text-center text-xs text-gray-500">Google sign-in is not configured.</p>;
  }

  return (
    <div className={`relative flex justify-center ${loading ? 'pointer-events-none opacity-60' : ''}`}>
      <div ref={buttonRef} />
    </div>
  );
}
