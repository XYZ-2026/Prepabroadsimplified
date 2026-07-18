import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, ShieldCheck, ChevronLeft, FileText } from 'lucide-react';

interface TermsPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onProceed: () => void;
}

type ViewMode = 'main' | 'terms' | 'privacy';

export default function TermsPopup({ isOpen, onClose, onProceed }: TermsPopupProps) {
  const [tcAccepted, setTcAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('main');

  const canProceed = tcAccepted && privacyAccepted;

  // Reset view mode when popup closes
  React.useEffect(() => {
    if (!isOpen) {
      setTimeout(() => setViewMode('main'), 300); // Wait for exit animation
    }
  }, [isOpen]);

  const handleClose = () => {
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col font-sans max-h-[90vh]"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
              <div className="flex items-center gap-3">
                {viewMode !== 'main' && (
                  <button 
                    onClick={() => setViewMode('main')}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-200/50 hover:bg-slate-200 text-slate-500 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                )}
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  {viewMode === 'main' && <ShieldCheck className="w-6 h-6 text-[#690b1b]" />}
                  {viewMode === 'terms' && <FileText className="w-6 h-6 text-[#690b1b]" />}
                  {viewMode === 'privacy' && <FileText className="w-6 h-6 text-[#690b1b]" />}
                  {viewMode === 'main' ? 'Before You Begin' : viewMode === 'terms' ? 'Terms & Conditions' : 'Privacy Policy'}
                </h2>
              </div>
              <button 
                onClick={handleClose}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-200/50 hover:bg-slate-200 text-slate-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              <AnimatePresence mode="wait">
                {viewMode === 'main' && (
                  <motion.div 
                    key="main"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="p-6 space-y-6"
                  >
                    <p className="text-sm text-slate-500 leading-relaxed font-medium">
                      To proceed with the assessment, please review and accept our Terms and Conditions and Privacy Policy.
                    </p>

                    <div className="space-y-4">
                      {/* T&C Checkbox */}
                      <label className="flex items-start gap-3 cursor-pointer group">
                        <div className="relative flex items-start justify-center pt-0.5">
                          <input 
                            type="checkbox"
                            className="sr-only"
                            checked={tcAccepted}
                            onChange={(e) => setTcAccepted(e.target.checked)}
                          />
                          <div 
                            className={`w-5 h-5 rounded transition-all flex items-center justify-center ${tcAccepted ? 'bg-[#690b1b]' : 'bg-white'}`}
                            style={{ 
                              border: tcAccepted ? '3px solid #690b1b' : '3px solid #1e293b',
                              boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
                            }}
                          >
                            {tcAccepted && <Check className="w-4 h-4 text-white stroke-[4]" />}
                          </div>
                        </div>
                        <div className="text-sm text-slate-700 font-medium leading-tight select-none">
                          I agree to the <button type="button" className="text-[#690b1b] hover:underline !border-none !bg-transparent !p-0 !m-0 !shadow-none !outline-none inline-block h-auto" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setViewMode('terms'); }}>Terms and Conditions</button>
                        </div>
                      </label>

                      {/* Privacy Checkbox */}
                      <label className="flex items-start gap-3 cursor-pointer group">
                        <div className="relative flex items-start justify-center pt-0.5">
                          <input 
                            type="checkbox"
                            className="sr-only"
                            checked={privacyAccepted}
                            onChange={(e) => setPrivacyAccepted(e.target.checked)}
                          />
                          <div 
                            className={`w-5 h-5 rounded transition-all flex items-center justify-center ${privacyAccepted ? 'bg-[#690b1b]' : 'bg-white'}`}
                            style={{ 
                              border: privacyAccepted ? '3px solid #690b1b' : '3px solid #1e293b',
                              boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
                            }}
                          >
                            {privacyAccepted && <Check className="w-4 h-4 text-white stroke-[4]" />}
                          </div>
                        </div>
                        <div className="text-sm text-slate-700 font-medium leading-tight select-none">
                          I acknowledge and agree to the <button type="button" className="text-[#690b1b] hover:underline !border-none !bg-transparent !p-0 !m-0 !shadow-none !outline-none inline-block h-auto" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setViewMode('privacy'); }}>Privacy Policy</button>
                        </div>
                      </label>
                    </div>
                  </motion.div>
                )}

                {viewMode === 'terms' && (
                  <motion.div
                    key="terms"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                    className="p-6 text-sm text-slate-600 space-y-4"
                  >
                    <h3 className="font-bold text-slate-800 text-base">Terms and Conditions</h3>
                    <p>Welcome to Abroad Simplified's Psychometric Assessment.</p>
                    <ul className="list-disc pl-5 space-y-2">
                      <li><strong>Assessment Integrity:</strong> You agree to take the assessment honestly and without external assistance. The results are generated based on your inputs and are intended for guidance purposes only.</li>
                      <li><strong>Intellectual Property:</strong> All content, questions, and reports generated are the intellectual property of Abroad Simplified. Reproduction or distribution is strictly prohibited.</li>
                      <li><strong>Non-Refundable:</strong> If you opt for a premium report or paid features, the fees are non-refundable once the report is generated.</li>
                      <li><strong>Limitation of Liability:</strong> Abroad Simplified is not responsible for any career or educational decisions made based on the results of this assessment. The reports are suggestive and should not be taken as absolute guarantees of success in any particular field.</li>
                    </ul>
                    <p className="mt-4 font-medium text-slate-800">By continuing, you agree to these terms.</p>
                  </motion.div>
                )}

                {viewMode === 'privacy' && (
                  <motion.div
                    key="privacy"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                    className="p-6 text-sm text-slate-600 space-y-4"
                  >
                    <h3 className="font-bold text-slate-800 text-base">Privacy Policy</h3>
                    <p>Your privacy is important to us at Abroad Simplified.</p>
                    <ul className="list-disc pl-5 space-y-2">
                      <li><strong>Data Collection:</strong> We collect your assessment responses, basic profile information (like age, grade, stream), and contact details to generate your report.</li>
                      <li><strong>Data Usage:</strong> Your data is used exclusively to formulate your personalized psychometric report, recommend suitable career paths, and provide related counseling services if requested.</li>
                      <li><strong>Data Security:</strong> We employ industry-standard security measures to protect your personal information and assessment results from unauthorized access.</li>
                      <li><strong>Third-Party Sharing:</strong> We do not sell or rent your personal information to third parties. Data may be shared with trusted partners only for the purpose of providing educational services you explicitly request.</li>
                    </ul>
                    <p className="mt-4 font-medium text-slate-800">By continuing, you acknowledge that you have read and understood our Privacy Policy.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            {viewMode === 'main' && (
              <div className="p-6 border-t border-slate-100 bg-slate-50 shrink-0">
                <button
                  disabled={!canProceed}
                  onClick={onProceed}
                  className="w-full py-3.5 rounded-xl bg-[#690b1b] hover:bg-[#831124] disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-bold transition-all shadow-md hover:shadow-lg disabled:shadow-none"
                >
                  Proceed to Assessment
                </button>
              </div>
            )}
            {viewMode !== 'main' && (
              <div className="p-6 border-t border-slate-100 bg-slate-50 shrink-0">
                <button
                  onClick={() => {
                    if (viewMode === 'terms') setTcAccepted(true);
                    if (viewMode === 'privacy') setPrivacyAccepted(true);
                    setViewMode('main');
                  }}
                  className="w-full py-3.5 rounded-xl bg-[#690b1b] hover:bg-[#831124] text-white font-bold transition-all shadow-md hover:shadow-lg"
                >
                  Accept & Go Back
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
