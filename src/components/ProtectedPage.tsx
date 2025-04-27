'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function ProtectedPage({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/signin');
      } else {
        setLoading(false);
      }
    };
    getUser();
  }, [router]);

  if (loading) return <div className="flex items-center justify-center min-h-screen">
    <p className="text-center -translate-y-10">
      <span className="loading loading-ring loading-xl bg-[#F7AD45]"></span>
    </p>
  </div>;

  return <>{children}</>;
}
