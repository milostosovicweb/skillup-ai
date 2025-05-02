'use client';

import { useEffect, useState } from 'react';

interface AlertMessageProps {
  variant?: 'success' | 'error' | 'warning' | 'info';
  message: string;
  onClose?: () => void;
}

export default function AlertMessage({
  variant = 'info',
  message,
  onClose,
}: AlertMessageProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose?.();
    }, 10000); // 10 sec

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className={`alert alert-${variant} shadow-lg animate-fade-in`}>
        <div>
          <span>{message}</span>
        </div>
        <button
          onClick={() => {
            setVisible(false);
            onClose?.();
          }}
          className="btn btn-sm btn-circle btn-ghost ml-2"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
