'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../lib/firebase';

const AUTHORIZED_UID = process.env.NEXT_PUBLIC_AUTHORIZED_UID || 'tu-uid-autorizado';

export default function AuthCheck({ children }: { children: React.ReactNode }) {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (user && user.uid === AUTHORIZED_UID) {
        setIsAuthorized(true);
      } else {
        router.push('/');
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return <div>Cargando...</div>;
  }

  return isAuthorized ? <>{children}</> : null;
}