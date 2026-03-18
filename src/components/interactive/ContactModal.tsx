'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback, useRef } from 'react';

interface FormData {
  name: string;
  company: string;
  phone: string;
  emailLocal: string;
  emailDomain: string;
  category: string;
  categoryOther: string;
  message: string;
}

interface FormErrors {
  name?: string;
  company?: string;
  phone?: string;
  emailLocal?: string;
  emailDomain?: string;
  category?: string;
  categoryOther?: string;
  message?: string;
}

const initialForm: FormData = {
  name: '', company: '', phone: '',
  emailLocal: '', emailDomain: '',
  category: '', categoryOther: '', message: '',
};

const PHONE_RE = /^[0-9\-]+$/;
const HALFWIDTH_RE = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~\-]+$/;
const DOMAIN_RE = /^[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;

export default function ContactModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [form, setForm] = useState<FormData>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollPosRef = useRef(0);

  useEffect(() => {
    if (isOpen) {
      scrollPosRef.current = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollPosRef.current}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.overflow = 'hidden';
      document.body.style.width = '100%';
      setForm(initialForm);
      setErrors({});
      setStatus('idle');
    }
    return () => {
      if (isOpen) {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.right = '';
        document.body.style.overflow = '';
        document.body.style.width = '';
        window.scrollTo(0, scrollPosRef.current);
      }
    };
  }, [isOpen]);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [onClose]);

  const set = useCallback((key: keyof FormData, val: string) => {
    setForm(prev => ({ ...prev, [key]: val }));
    setErrors(prev => ({ ...prev, [key]: undefined }));
  }, []);

  const handlePhoneChange = useCallback((val: string) => {
    const cleaned = val.replace(/[^0-9\-]/g, '');
    set('phone', cleaned);
  }, [set]);

  const handleEmailLocalChange = useCallback((val: string) => {
    const cleaned = val.replace(/[^a-zA-Z0-9.!#$%&'*+/=?^_`{|}~\-]/g, '');
    set('emailLocal', cleaned);
  }, [set]);

  const handleEmailDomainChange = useCallback((val: string) => {
    const cleaned = val.replace(/[^a-zA-Z0-9.\-]/g, '');
    set('emailDomain', cleaned);
  }, [set]);

  const validate = useCallback((): boolean => {
    const e: FormErrors = {};
    if (!form.name.trim()) e.name = 'お名前を入力してください';
    if (!form.company.trim()) e.company = '法人名 / 組織名を入力してください';
    if (!form.phone.trim()) e.phone = '電話番号を入力してください';
    else if (!PHONE_RE.test(form.phone)) e.phone = '半角数字とハイフンのみ有効です';
    if (!form.emailLocal.trim()) e.emailLocal = 'メールアドレスを入力してください';
    else if (!HALFWIDTH_RE.test(form.emailLocal)) e.emailLocal = '半角英数字のみ有効です';
    if (!form.emailDomain.trim()) e.emailDomain = 'ドメインを入力してください';
    else if (!DOMAIN_RE.test(form.emailDomain)) e.emailDomain = '正しいドメインを入力してください';
    if (!form.category) e.category = 'お問い合わせ概要を選択してください';
    if (form.category === 'other' && !form.categoryOther.trim()) e.categoryOther = '内容を入力してください';
    if (!form.message.trim()) e.message = 'お問い合わせ内容を入力してください';
    setErrors(e);
    return Object.keys(e).length === 0;
  }, [form]);

  const handleSubmit = useCallback(async () => {
    if (!validate()) return;
    setStatus('sending');
    try {
      const body = new FormData();
      body.append('name', form.name);
      body.append('company', form.company);
      body.append('phone', form.phone);
      body.append('email', `${form.emailLocal}@${form.emailDomain}`);
      body.append('category', form.category === 'other' ? form.categoryOther : 'ご依頼のご要望');
      body.append('message', form.message);

      const res = await fetch('/test/send.php', { method: 'POST', body });
      if (res.ok) {
        setStatus('sent');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }, [form, validate]);

  const inputClass = 'w-full bg-white/[.04] border border-white/[.08] rounded px-4 py-3 text-[14px] text-nc-white placeholder:text-nc-slate/40 focus:border-nc-gold/30 focus:outline-none transition-colors duration-300';
  const labelClass = 'font-ui text-[9px] tracking-[3px] uppercase text-nc-gold/50 mb-2 block';
  const errorClass = 'text-[11px] text-red-400/80 mt-1';
  const requiredMark = <span className="text-nc-gold/70 ml-1">*</span>;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }} className="fixed inset-0 z-[200]">
          <div className="fixed inset-0 bg-nc-black/[.97]" onClick={onClose} />

          <div ref={scrollRef} className="fixed inset-0 z-[3] overflow-y-auto overscroll-contain"
            style={{ WebkitOverflowScrolling: 'touch', height: '100dvh' }}>
            <div className="flex justify-center px-4 md:px-6 pb-12 min-h-full" onClick={onClose}
              style={{ paddingTop: 'max(16px, env(safe-area-inset-top))' }}>

              <motion.div
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-[560px] my-auto"
                onClick={(e) => e.stopPropagation()}>

                <div className="bg-nc-charcoal/95 rounded px-5 md:px-8 py-8 md:py-10 relative"
                  style={{ paddingBottom: 'max(32px, env(safe-area-inset-bottom))' }}>

                  {/* Close button */}
                  <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                    onClick={onClose}
                    className="absolute top-4 right-4 z-[10] w-10 h-10 flex items-center justify-center rounded-full bg-nc-black/40 border border-nc-gold/15 active:bg-nc-gold/20 hover:border-nc-gold/40 transition-all duration-300"
                    aria-label="Close">
                    <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M2 2L12 12M12 2L2 12" stroke="#B8956A" strokeWidth="1.2" /></svg>
                  </motion.button>

                  {status === 'sent' ? (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                      className="text-center py-12">
                      <div className="w-12 h-12 rounded-full bg-nc-gold/10 border border-nc-gold/20 flex items-center justify-center mx-auto mb-5">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 10L8 14L16 6" stroke="#B8956A" strokeWidth="1.5" /></svg>
                      </div>
                      <h3 className="font-bebas text-[28px] text-nc-white tracking-[.04em] mb-3">THANK YOU</h3>
                      <p className="text-[13px] text-nc-silver/70 leading-[2]">
                        お問い合わせありがとうございます。<br />内容を確認のうえ、折り返しご連絡いたします。
                      </p>
                      <button onClick={onClose}
                        className="mt-8 font-ui text-[10px] tracking-[3px] uppercase text-nc-gold/60 border border-nc-gold/20 px-6 py-3 hover:bg-nc-gold/10 active:bg-nc-gold/15 transition-colors duration-300">
                        CLOSE
                      </button>
                    </motion.div>
                  ) : (
                    <>
                      {/* Header */}
                      <div className="mb-8 pr-10">
                        <div className="font-ui text-[9px] tracking-[4px] uppercase text-nc-gold/40 mb-2">Contact</div>
                        <h2 className="font-bebas text-[clamp(24px,6vw,36px)] text-nc-white tracking-[.04em] leading-tight">GET IN TOUCH</h2>
                        <p className="text-[12px] text-nc-slate mt-2 leading-[1.8]">
                          <span className="text-nc-gold/70">*</span> は必須項目です
                        </p>
                      </div>

                      {/* Form fields */}
                      <div className="flex flex-col gap-5">

                        {/* お名前 */}
                        <div>
                          <label className={labelClass}>お名前{requiredMark}</label>
                          <input type="text" value={form.name} onChange={(e) => set('name', e.target.value)}
                            placeholder="山田 太郎" className={inputClass} />
                          {errors.name && <p className={errorClass}>{errors.name}</p>}
                        </div>

                        {/* 法人名 / 組織名 */}
                        <div>
                          <label className={labelClass}>法人名 / 組織名{requiredMark}</label>
                          <input type="text" value={form.company} onChange={(e) => set('company', e.target.value)}
                            placeholder="株式会社〇〇" className={inputClass} />
                          {errors.company && <p className={errorClass}>{errors.company}</p>}
                        </div>

                        {/* 電話番号 */}
                        <div>
                          <label className={labelClass}>電話番号{requiredMark}</label>
                          <input type="tel" value={form.phone} onChange={(e) => handlePhoneChange(e.target.value)}
                            placeholder="03-1234-5678" className={inputClass}
                            inputMode="tel" />
                          {errors.phone && <p className={errorClass}>{errors.phone}</p>}
                          <p className="text-[10px] text-nc-slate/40 mt-1">半角数字とハイフンのみ</p>
                        </div>

                        {/* メールアドレス */}
                        <div>
                          <label className={labelClass}>メールアドレス{requiredMark}</label>
                          <div className="flex items-center gap-0">
                            <input type="text" value={form.emailLocal}
                              onChange={(e) => handleEmailLocalChange(e.target.value)}
                              placeholder="example" className={`${inputClass} rounded-r-none border-r-0`}
                              inputMode="email" autoCapitalize="none" autoCorrect="off" />
                            <span className="flex-shrink-0 bg-white/[.06] border-y border-white/[.08] px-3 py-3 text-[14px] text-nc-gold/50 select-none">@</span>
                            <input type="text" value={form.emailDomain}
                              onChange={(e) => handleEmailDomainChange(e.target.value)}
                              placeholder="company.co.jp" className={`${inputClass} rounded-l-none border-l-0`}
                              inputMode="email" autoCapitalize="none" autoCorrect="off" />
                          </div>
                          {(errors.emailLocal || errors.emailDomain) && (
                            <p className={errorClass}>{errors.emailLocal || errors.emailDomain}</p>
                          )}
                          <p className="text-[10px] text-nc-slate/40 mt-1">半角英数字のみ</p>
                        </div>

                        {/* お問い合わせ概要 */}
                        <div>
                          <label className={labelClass}>お問い合わせ概要{requiredMark}</label>
                          <div className="flex flex-col gap-2.5">
                            <label className="flex items-center gap-3 cursor-pointer group">
                              <span className={`w-[18px] h-[18px] rounded-full border flex items-center justify-center flex-shrink-0 transition-colors duration-300 ${form.category === 'request' ? 'border-nc-gold bg-nc-gold/10' : 'border-white/[.12] group-hover:border-white/[.25]'}`}>
                                {form.category === 'request' && <span className="w-2 h-2 rounded-full bg-nc-gold" />}
                              </span>
                              <input type="radio" name="category" value="request"
                                checked={form.category === 'request'}
                                onChange={() => set('category', 'request')}
                                className="sr-only" />
                              <span className="text-[13px] text-nc-silver/70">ご依頼のご要望</span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer group">
                              <span className={`w-[18px] h-[18px] rounded-full border flex items-center justify-center flex-shrink-0 transition-colors duration-300 ${form.category === 'other' ? 'border-nc-gold bg-nc-gold/10' : 'border-white/[.12] group-hover:border-white/[.25]'}`}>
                                {form.category === 'other' && <span className="w-2 h-2 rounded-full bg-nc-gold" />}
                              </span>
                              <input type="radio" name="category" value="other"
                                checked={form.category === 'other'}
                                onChange={() => set('category', 'other')}
                                className="sr-only" />
                              <span className="text-[13px] text-nc-silver/70">その他</span>
                            </label>
                          </div>
                          {form.category === 'other' && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                              transition={{ duration: 0.3 }} className="overflow-hidden">
                              <input type="text" value={form.categoryOther}
                                onChange={(e) => set('categoryOther', e.target.value)}
                                placeholder="お問い合わせの種類を入力" className={`${inputClass} mt-3`} />
                              {errors.categoryOther && <p className={errorClass}>{errors.categoryOther}</p>}
                            </motion.div>
                          )}
                          {errors.category && <p className={errorClass}>{errors.category}</p>}
                        </div>

                        {/* お問い合わせ内容 */}
                        <div>
                          <label className={labelClass}>お問い合わせ内容{requiredMark}</label>
                          <textarea value={form.message} onChange={(e) => set('message', e.target.value)}
                            placeholder="お問い合わせ内容をご記入ください"
                            rows={5} className={`${inputClass} resize-none leading-[2]`} />
                          {errors.message && <p className={errorClass}>{errors.message}</p>}
                        </div>
                      </div>

                      {/* Error status */}
                      {status === 'error' && (
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                          className="text-[12px] text-red-400/80 mt-4 text-center">
                          送信に失敗しました。時間をおいて再度お試しください。
                        </motion.p>
                      )}

                      {/* Submit */}
                      <div className="mt-8 text-center">
                        <button onClick={handleSubmit} disabled={status === 'sending'}
                          className="font-ui text-[10px] tracking-[4px] uppercase text-nc-white border border-nc-gold/30 px-10 py-4 hover:bg-nc-gold/10 active:bg-nc-gold/15 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-500">
                          {status === 'sending' ? 'SENDING...' : 'SEND MESSAGE'}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
