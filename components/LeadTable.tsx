import React from 'react';
import { Lead } from '../types';

interface LeadTableProps {
  leads: Lead[];
}

export const LeadTable: React.FC<LeadTableProps> = ({ leads }) => {
  if (leads.length === 0) return null;

  return (
    <div className="overflow-x-auto shadow-md sm:rounded-lg border border-gray-200 mt-6">
      <table className="w-full text-sm text-right text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3">اسم الشركة / الموقع</th>
            <th scope="col" className="px-6 py-3">التخصص</th>
            <th scope="col" className="px-6 py-3">بيانات التواصل</th>
            <th scope="col" className="px-6 py-3">صاحب القرار</th>
            <th scope="col" className="px-6 py-3">سبب التطابق</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead, index) => (
            <tr key={index} className="bg-white border-b hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                <div className="flex flex-col">
                  <span className="text-base font-bold">{lead.companyName}</span>
                  <a 
                    href={lead.websiteUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-600 hover:underline text-xs mt-1 ltr:text-left"
                    dir="ltr"
                  >
                    {lead.websiteUrl}
                  </a>
                  <span className={`text-[10px] mt-1 px-2 py-0.5 rounded-full w-fit ${
                    lead.sourceType === 'Similar Domain' ? 'bg-purple-100 text-purple-800' :
                    lead.sourceType === 'Competitor' ? 'bg-red-100 text-red-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {lead.sourceType}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4">
                {lead.specialization}
              </td>
              <td className="px-6 py-4">
                {lead.officialEmail ? (
                  <div className="flex items-center gap-2">
                     <span className="text-blue-600 font-mono bg-blue-50 px-2 py-1 rounded select-all">
                       {lead.officialEmail}
                     </span>
                  </div>
                ) : (
                  <span className="text-gray-400 italic">غير متوفر</span>
                )}
              </td>
              <td className="px-6 py-4">
                {lead.decisionMakerName ? (
                  <div className="flex flex-col">
                    <span className="font-semibold">{lead.decisionMakerName}</span>
                    {lead.decisionMakerEmail && (
                      <span className="text-xs text-gray-500 font-mono select-all">
                        {lead.decisionMakerEmail}
                      </span>
                    )}
                  </div>
                ) : (
                  <span className="text-gray-400 italic">غير متوفر</span>
                )}
              </td>
              <td className="px-6 py-4 text-gray-600">
                {lead.matchReason}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
