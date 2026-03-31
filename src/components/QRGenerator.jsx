'use client';

import { QRCodeSVG } from 'qrcode.react';

export default function QRGenerator({ value, size = 200, bgColor = 'transparent', fgColor = '#ffffff', className = '' }) {
  return (
    <div className={`inline-flex items-center justify-center p-4 rounded-2xl bg-white ${className}`}>
      <QRCodeSVG
        value={value || 'https://kaushal-id.in'}
        size={size}
        bgColor="#ffffff"
        fgColor="#0a0a1a"
        level="H"
        includeMargin={false}
      />
    </div>
  );
}
