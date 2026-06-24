import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import type { AboutInfo } from '../../../types';
import { aboutService } from '../../../services/aboutService';

export default function AboutManager() {
  const [about, setAbout] = useState<AboutInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await aboutService.getAboutInfo();
        setAbout(res.data);
      } catch (error) {
        console.error('Failed to fetch about info', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAbout();
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (about) {
          setAbout({ ...about, imageUrl: reader.result as string });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!about) return;

    setSaving(true);
    setMessage('');
    try {
      const res = await aboutService.updateAboutInfo(about);
      setAbout(res.data);
      setMessage('About information updated successfully!');
    } catch (error) {
      console.error('Failed to update about info', error);
      setMessage('Failed to update about information.');
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  if (loading) return <div className="text-neutral-500 animate-pulse">Loading data...</div>;
  if (!about) return <div className="text-red-500">Failed to load data.</div>;

  return (
    <div className="bg-white p-8 rounded-2xl border border-neutral-200 shadow-sm w-full">
      {message && (
        <div className={`mb-6 p-4 rounded-xl text-sm font-medium ${message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Description</label>
            <textarea
              required
              rows={5}
              value={about.description}
              onChange={(e) => setAbout({ ...about, description: e.target.value })}
              className="w-full px-4 py-3 bg-neutral-50 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-primary-600 outline-none resize-y"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Mission</label>
            <textarea
              required
              rows={3}
              value={about.mission}
              onChange={(e) => setAbout({ ...about, mission: e.target.value })}
              className="w-full px-4 py-3 bg-neutral-50 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-primary-600 outline-none resize-y"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Vision</label>
            <textarea
              required
              rows={3}
              value={about.vision}
              onChange={(e) => setAbout({ ...about, vision: e.target.value })}
              className="w-full px-4 py-3 bg-neutral-50 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-primary-600 outline-none resize-y"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Image (URL atau Upload File)</label>
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                value={about.imageUrl || ''}
                onChange={(e) => setAbout({ ...about, imageUrl: e.target.value })}
                className="flex-1 px-4 py-3 bg-neutral-50 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-primary-600 outline-none"
                placeholder="https://... atau upload ->"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full md:max-w-xs px-2 py-2 bg-white rounded-xl border border-neutral-200 cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
              />
            </div>
            {about.imageUrl && (
              <div className="mt-4">
                <img src={about.imageUrl} alt="Preview" className="h-32 object-cover rounded-xl border border-neutral-200" />
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-end pt-6 mt-4 border-t border-neutral-100">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 flex items-center gap-2 bg-primary-900 text-white font-medium hover:bg-primary-800 rounded-xl transition-colors cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <Save size={20} /> {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
