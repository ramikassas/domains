import React, { useState } from 'react';
import { fetchLeads } from './services/geminiService';
import { LeadTable } from './components/LeadTable';
import { EmailExport } from './components/EmailExport';
import { SearchState } from './types';

export default function App() {
  const [domainInput, setDomainInput] = useState('');
  const [state, setState] = useState<SearchState>({
    isLoading: false,
    error: null,
    results: [],
    hasSearched: false,
  });

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domainInput.trim()) return;

    setState(prev => ({ ...prev, isLoading: true, error: null, hasSearched: true, results: [] }));

    try {
      const leads = await fetchLeads(domainInput);
      setState(prev => ({
        ...prev,
        isLoading: false,
        results: leads,
      }));
    } catch (err: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: "حدث خطأ أثناء البحث. تأكد من اتصالك بالإنترنت وصلاحية مفتاح API.",
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans" dir="rtl">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-gray-900">مستكشف العملاء والشركات</h1>
          </div>
          <div className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full border border-gray-200">
            Powered by Gemini 2.5 Flash
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Search Section */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl mb-4">
            استخراج العملاء المحتملين والمنافسين
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            أدخل نطاق (Domain) للبحث عن الشركات المشابهة، الامتدادات المختلفة، والمنافسين في نفس المجال عبر محركات البحث والخرائط.
          </p>

          <form onSubmit={handleSearch} className="relative max-w-xl mx-auto">
            <div className="flex shadow-lg rounded-full overflow-hidden border border-gray-200 focus-within:ring-4 focus-within:ring-blue-100 transition-all">
              <input
                type="text"
                value={domainInput}
                onChange={(e) => setDomainInput(e.target.value)}
                placeholder="مثال: example.com"
                className="flex-1 px-6 py-4 text-lg text-gray-700 placeholder-gray-400 focus:outline-none text-left font-mono"
                dir="ltr"
                disabled={state.isLoading}
              />
              <button
                type="submit"
                disabled={state.isLoading || !domainInput.trim()}
                className={`px-8 py-4 font-bold text-white transition-colors flex items-center gap-2 ${
                  state.isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {state.isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    جاري البحث...
                  </>
                ) : (
                  'بحث واستخراج'
                )}
              </button>
            </div>
            <p className="mt-3 text-xs text-gray-400">
              يقوم النظام بالبحث العميق وقد يستغرق بضع ثوانٍ.
            </p>
          </form>
        </div>

        {/* Error State */}
        {state.error && (
          <div className="bg-red-50 border-r-4 border-red-500 p-4 rounded-md mb-8 max-w-3xl mx-auto">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="mr-3">
                <h3 className="text-sm font-medium text-red-800">خطأ في النظام</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{state.error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State / Intro */}
        {!state.hasSearched && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-12">
            <FeatureCard 
              icon="search" 
              title="بحث شامل" 
              description="البحث في محركات البحث، الخرائط، ومنصات التواصل عن العلامات التجارية المطابقة."
            />
            <FeatureCard 
              icon="filter" 
              title="تحليل الامتدادات" 
              description="العثور على نفس اسم الدومين بامتدادات مختلفة (.net, .org, .ae) لكشف انتحال الهوية أو المنافسة."
            />
            <FeatureCard 
              icon="users" 
              title="بيانات القرار" 
              description="محاولة استخراج الإيميلات الرسمية وأسماء المدراء التنفيذيين لاتخاذ قرارات تسويقية."
            />
          </div>
        )}

        {/* Results Section */}
        {state.hasSearched && !state.isLoading && (
          <div className="animate-fade-in-up">
            <div className="flex justify-between items-end mb-4 border-b border-gray-200 pb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-800">نتائج البحث</h3>
                <p className="text-sm text-gray-500">تم العثور على {state.results.length} نتيجة مطابقة لـ <span dir="ltr" className="font-mono text-blue-600">{domainInput}</span></p>
              </div>
            </div>

            <LeadTable leads={state.results} />
            
            <div className="mt-8">
               <EmailExport leads={state.results} />
            </div>
          </div>
        )}
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-20 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} Domain Lead Extractor. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

// Helper Component for Features
const FeatureCard = ({ icon, title, description }: { icon: string, title: string, description: string }) => {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-4">
        {icon === 'search' && (
           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
           </svg>
        )}
        {icon === 'filter' && (
           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
           </svg>
        )}
        {icon === 'users' && (
           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
           </svg>
        )}
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 leading-relaxed">{description}</p>
    </div>
  );
}
