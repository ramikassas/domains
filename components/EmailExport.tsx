import React, { useState } from 'react';
import { Lead } from '../types';

interface EmailExportProps {
  leads: Lead[];
}

export const EmailExport: React.FC<EmailExportProps> = ({ leads }) => {
  const [copied, setCopied] = useState(false);

  const validEmails = leads
    .flatMap(l => [l.officialEmail, l.decisionMakerEmail])
    .filter((email): email is string => !!email && email !== 'null' && email.includes('@'));

  const uniqueEmails = Array.from(new Set(validEmails));

  const handleCopy = () => {
    const text = uniqueEmails.join('\n');
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (uniqueEmails.length === 0) return null;

  return (
    <div className="mt-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h3 className="text-lg font-bold text-gray-800">تصدير القائمة البريدية</h3>
          <p className="text-sm text-gray-600">
            تم العثور على <span className="font-bold text-blue-600">{uniqueEmails.length}</span> بريد إلكتروني صالح.
          </p>
        </div>
        <button
          onClick={handleCopy}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all transform active:scale-95 ${
            copied 
              ? 'bg-green-600 text-white shadow-lg' 
              : 'bg-gray-900 text-white hover:bg-gray-800 shadow-md'
          }`}
        >
          {copied ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              تم النسخ بنجاح
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
              </svg>
              نسخ جميع الإيميلات
            </>
          )}
        </button>
      </div>
      
      <div className="mt-4 p-3 bg-white border border-gray-300 rounded h-32 overflow-y-auto font-mono text-sm text-gray-600 select-all" dir="ltr">
        {uniqueEmails.map(email => (
          <div key={email}>{email}</div>
        ))}
      </div>
    </div>
  );
};
