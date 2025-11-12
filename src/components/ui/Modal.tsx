// FILE: src/components/ui/Modal.tsx - FIXED
'use client';
import React from 'react';
import Button from './Button';

type ModalType = 'success' | 'error' | 'info';

interface ModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  type: ModalType;
  onClose: () => void;
  actionLabel?: string;
  onAction?: () => void;
}

export default function Modal({
  isOpen,
  title,
  message,
  type = 'info',
  onClose,
  actionLabel,
  onAction,
}: ModalProps) {
  if (!isOpen) return null;

  const icons: Record<ModalType, string> = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
  };

  const colors: Record<ModalType, string> = {
    success: 'bg-green-100 text-green-600',
    error: 'bg-red-100 text-red-600',
    info: 'bg-blue-100 text-blue-600',
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4">
        <div className={`w-12 h-12 rounded-full ${colors[type]} flex items-center justify-center text-2xl font-bold mb-4`}>
          {icons[type]}
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={onClose} className="flex-1">
            Close
          </Button>
          {actionLabel && onAction && (
            <Button onClick={onAction} className="flex-1">
              {actionLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}