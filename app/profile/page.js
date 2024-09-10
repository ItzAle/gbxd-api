import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const DynamicProfileContent = dynamic(() => import('./ProfileContent'), {
  loading: () => <div>Cargando...</div>,
  ssr: false
});

const DynamicAuthCheck = dynamic(() => import('../components/AuthCheck'), {
  ssr: false
});

export default function Profile() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <DynamicAuthCheck>
        <DynamicProfileContent />
      </DynamicAuthCheck>
    </Suspense>
  );
}
