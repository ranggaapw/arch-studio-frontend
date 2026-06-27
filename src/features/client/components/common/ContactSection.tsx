import { useState } from 'react';
import { Send } from 'lucide-react';
import { messageService } from '../../../../services/messageService';
import type { Message } from '../../../../types';

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    content: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      await messageService.sendMessage(formData as Omit<Message, 'id' | 'createdAt'>);
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', content: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      console.error('Failed to send message', error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <section className="w-full py-20 bg-neutral-50 text-neutral-800" id="contact">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Text Left */}
          <div>
            <h2 className="text-h3-bold text-neutral-900 mb-6">Mulai Proyek Impian Anda Bersama Kami</h2>
            <p className="text-body-lg-regular text-neutral-500 mb-10">
              Punya ide luar biasa untuk rumah atau kantor Anda? Jangan ragu untuk menghubungi kami. Tim ahli Arch Studio siap membantu mewujudkannya dari konsep hingga realita.
            </p>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center text-primary-600 shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                </div>
                <div>
                  <h4 className="text-body-md-bold text-neutral-800">Telepon</h4>
                  <p className="text-neutral-500">021-12345678</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center text-primary-600 shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                </div>
                <div>
                  <h4 className="text-body-md-bold text-neutral-800">Email</h4>
                  <p className="text-neutral-500">hello@archstudio.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Right */}
          <div className="bg-white text-neutral-900 p-8 rounded-2xl shadow-xl">
            <h3 className="text-h4-bold mb-6">Tinggalkan Pesan</h3>
            
            {status === 'success' && (
              <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-xl border border-green-200">
                Pesan Anda berhasil dikirim! Kami akan segera menghubungi Anda.
              </div>
            )}
            
            {status === 'error' && (
              <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200">
                Gagal mengirim pesan. Silakan coba lagi nanti.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-neutral-700 mb-2">Nama Lengkap</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-600 outline-none"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-neutral-700 mb-2">Email</label>
                  <input 
                    type="email" 
                    required 
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-600 outline-none"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-neutral-700 mb-2">Subjek</label>
                <input 
                  type="text" 
                  required 
                  value={formData.subject}
                  onChange={e => setFormData({...formData, subject: e.target.value})}
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-600 outline-none"
                  placeholder="Konsultasi Desain Interior"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-neutral-700 mb-2">Pesan</label>
                <textarea 
                  required 
                  rows={4}
                  value={formData.content}
                  onChange={e => setFormData({...formData, content: e.target.value})}
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-600 outline-none resize-y"
                  placeholder="Ceritakan tentang proyek Anda..."
                ></textarea>
              </div>
              <button 
                type="submit" 
                disabled={status === 'loading'}
                className="w-full py-4 bg-primary-600 text-white font-bold rounded-xl shadow-lg hover:bg-primary-700 transition-colors flex justify-center items-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <Send size={20} /> {status === 'loading' ? 'Mengirim...' : 'Kirim Pesan'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
