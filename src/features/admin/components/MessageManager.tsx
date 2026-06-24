import { useState, useEffect } from 'react';
import { Mail, Trash2, Calendar, User } from 'lucide-react';
import type { Message } from '../../../types';
import { messageService } from '../../../services/messageService';
interface MessageManagerProps {
  onMessageRead?: () => void;
}

export default function MessageManager({ onMessageRead }: MessageManagerProps = {}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  async function fetchMessages() {
    try {
      const res = await messageService.getMessages();
      setMessages(res.data);
    } catch (error) {
      console.error('Failed to fetch messages', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchMessages();
  }, []);

  const handleSelectMessage = async (message: Message) => {
    const updatedMessage = { ...message, isRead: true };
    setSelectedMessage(updatedMessage);
    
    // Mark as read if not read yet
    if (!message.isRead) {
      setMessages(messages.map(m => m.id === message.id ? updatedMessage : m));
      if (onMessageRead) onMessageRead();
      
      try {
        await messageService.markAsRead(message.id);
      } catch (error) {
        console.error('Failed to mark message as read', error);
      }
    }
  };

  const handleBackToList = () => {
    setSelectedMessage(null);
  };

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Apakah Anda yakin ingin menghapus pesan ini?')) {
      try {
        await messageService.deleteMessage(id);
        setMessages(messages.filter(m => m.id !== id));
      } catch (error) {
        console.error('Failed to delete message', error);
        alert('Gagal menghapus pesan.');
      }
    }
  };

  if (loading) return <div className="text-neutral-500 animate-pulse">Memuat pesan...</div>;

  if (selectedMessage) {
    const date = new Date(selectedMessage.createdAt);
    const formattedDate = date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    const formattedTime = date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

    return (
      <div className="bg-white p-8 rounded-2xl border border-neutral-200 shadow-sm w-full animate-in fade-in slide-in-from-right-4 duration-300">
        <button 
          onClick={handleBackToList}
          className="flex items-center gap-2 text-neutral-500 hover:text-primary-600 mb-8 font-bold transition-colors group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-1 transition-transform"><path d="m15 18-6-6 6-6"/></svg>
          Kembali ke Kotak Masuk
        </button>

        <div className="border-b border-neutral-100 pb-8 mb-8">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-black text-neutral-900 leading-tight pr-8">{selectedMessage.subject}</h2>
            <button
              onClick={(e) => {
                handleDelete(selectedMessage.id, e);
                setSelectedMessage(null);
              }}
              className="text-neutral-400 hover:text-red-500 hover:bg-red-50 p-3 rounded-xl transition-colors flex-shrink-0"
              title="Hapus Pesan"
            >
              <Trash2 size={20} />
            </button>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
              <User size={28} />
            </div>
            <div>
              <div className="text-lg font-bold text-neutral-900">{selectedMessage.name}</div>
              <div className="text-neutral-500 text-sm flex items-center gap-4 mt-1">
                <a href={`mailto:${selectedMessage.email}`} className="text-primary-600 hover:underline">{selectedMessage.email}</a>
                <span className="w-1 h-1 bg-neutral-300 rounded-full"></span>
                <span>{formattedDate} • {formattedTime}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-neutral-50 p-8 rounded-2xl border border-neutral-100 mt-4">
          <div className="prose prose-neutral max-w-none prose-p:leading-loose">
            <p className="text-neutral-700 whitespace-pre-wrap">{selectedMessage.content}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-2xl border border-neutral-200 shadow-sm w-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-neutral-900">Pesan Masuk</h2>
          <p className="text-sm text-neutral-500">Daftar pesan dari form Hubungi Kami.</p>
        </div>
        <div className="bg-primary-50 text-primary-700 px-4 py-2 rounded-lg font-bold flex items-center gap-2">
          <Mail size={20} />
          {messages.filter(m => !m.isRead).length} Belum Dibaca
        </div>
      </div>

      {messages.length === 0 ? (
        <div className="py-12 text-center text-neutral-500 bg-neutral-50 rounded-xl border border-neutral-200">
          <Mail size={48} className="mx-auto mb-4 text-neutral-300" />
          <p>Belum ada pesan yang masuk.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((message) => {
            const date = new Date(message.createdAt);
            const formattedDate = date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

            return (
              <div 
                key={message.id} 
                onClick={() => handleSelectMessage(message)}
                className={`border rounded-xl p-6 transition-all duration-300 shadow-sm relative group cursor-pointer ${
                  !message.isRead ? 'bg-primary-50/50 border-primary-200' : 'bg-white border-neutral-200 hover:border-primary-300 hover:shadow-md'
                }`}
              >
                {!message.isRead && (
                  <div className="absolute top-6 right-20 w-3 h-3 bg-primary-600 rounded-full shadow-sm shadow-primary-200"></div>
                )}
                <button
                  onClick={(e) => handleDelete(message.id, e)}
                  className="absolute top-6 right-6 text-neutral-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 z-10"
                  title="Hapus Pesan"
                >
                  <Trash2 size={20} />
                </button>
                
                <div className="flex items-start gap-4 mb-2">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${!message.isRead ? 'bg-primary-100 text-primary-600' : 'bg-neutral-100 text-neutral-500 group-hover:bg-primary-50 group-hover:text-primary-500'}`}>
                    <User size={24} />
                  </div>
                  <div className="flex-1 min-w-0 pr-8">
                    <h3 className={`text-lg truncate ${!message.isRead ? 'font-black text-neutral-900' : 'font-bold text-neutral-800'}`}>{message.subject}</h3>
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-1 text-sm text-neutral-600">
                      <span className={`flex items-center gap-1.5 ${!message.isRead ? 'font-bold text-neutral-900' : 'font-medium text-neutral-900'}`}>
                        {message.name}
                      </span>
                      <span className="flex items-center gap-1.5 hidden sm:flex">
                        <Mail size={16} className="text-neutral-400" />
                        <span className="truncate max-w-[150px]">{message.email}</span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Calendar size={16} className="text-neutral-400" />
                        {formattedDate}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="pl-16 mt-3">
                   <p className={`truncate text-sm ${!message.isRead ? 'text-neutral-800 font-medium' : 'text-neutral-500'}`}>
                     {message.content}
                   </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
