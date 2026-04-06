'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import { createClient } from '@/lib/supabase/client';

type Step = 'welcome' | 'video' | 'voice' | 'done';

export default function OnboardingPage() {
  const router = useRouter();
  const supabase = createClient();
  const [step, setStep] = useState<Step>('welcome');
  const [videoUploaded, setVideoUploaded] = useState(false);
  const [voiceUploaded, setVoiceUploaded] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const videoRef = useRef<HTMLInputElement>(null);
  const voiceRef = useRef<HTMLInputElement>(null);

  const steps = ['welcome', 'video', 'voice', 'done'];
  const stepIdx = steps.indexOf(step);

  const uploadFile = async (file: File, bucket: string, path: string, field: string) => {
    setUploading(true); setError('');
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const fullPath = `${user.id}/${path}.${file.name.split('.').pop()}`;
    const { error: uploadErr } = await supabase.storage.from(bucket).upload(fullPath, file, { upsert: true });
    if (uploadErr) { setError(uploadErr.message); setUploading(false); return; }
    const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(fullPath);
    await supabase.from('profiles').update({ [field]: publicUrl }).eq('id', user.id);
    setUploading(false);
    if (field === 'twin_video_url') setVideoUploaded(true);
    else setVoiceUploaded(true);
  };

  const submitTraining = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from('profiles').update({ twin_status: 'processing', twin_submitted_at: new Date().toISOString() }).eq('id', user.id);
    setStep('done');
    setTimeout(() => { router.push('/dashboard'); router.refresh(); }, 3000);
  };

  return (
    <>
      <Navbar pageTitle="Digital Twin Setup" pageDescription="One-time setup · Takes about 5 minutes" />
      <main className="flex-1 p-6">
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex items-center justify-between">
            {['Account', 'Seed Video', 'Voice', 'Training'].map((s, i) => (
              <div key={s} className="flex items-center flex-1">
                <div className={`flex items-center gap-1.5 text-xs font-semibold ${i <= stepIdx ? 'text-blue-600' : 'text-slate-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${i < stepIdx ? 'bg-blue-600 border-blue-600 text-white' : i === stepIdx ? 'border-blue-600 text-blue-600 bg-blue-50' : 'border-slate-200 text-slate-400 bg-white'}`}>
                    {i < stepIdx ? '✓' : i + 1}
                  </div>
                  <span className="hidden sm:block">{s}</span>
                </div>
                {i < 3 && <div className={`flex-1 h-0.5 mx-2 rounded ${i < stepIdx ? 'bg-blue-500' : 'bg-slate-200'}`} />}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-8 max-w-xl mx-auto">
          {step === 'welcome' && (
            <div className="text-center py-8">
              <div className="text-7xl mb-6">🎭</div>
              <h2 className="text-2xl font-extrabold text-slate-900 mb-3">Let's Build Your Digital Twin</h2>
              <p className="text-slate-500 mb-8 max-w-sm mx-auto">Upload a 2-min video and voice sample. AVA creates a photorealistic AI version of you that delivers any script on demand.</p>
              <button onClick={() => setStep('video')} className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-10 py-4 rounded-xl transition-all shadow-lg shadow-blue-200">Let's Go →</button>
            </div>
          )}

          {step === 'video' && (
            <div>
              <div className="text-center mb-6"><div className="text-5xl mb-3">📹</div><h2 className="text-xl font-extrabold text-slate-900">Upload Your Seed Video</h2><p className="text-slate-500 text-sm mt-1">A 2-minute clip of you speaking naturally trains your twin's face and expressions.</p></div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-5 text-sm text-slate-600 space-y-1">
                <p className="font-semibold text-slate-700 mb-1">📋 Tips</p>
                <p>✓ Face a window for natural light</p><p>✓ Look directly at camera</p><p>✗ No hats, sunglasses, or filters</p>
              </div>
              {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
              <div onClick={() => !uploading && !videoUploaded && videoRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${videoUploaded ? 'border-emerald-400 bg-emerald-50' : 'border-slate-300 bg-white hover:border-blue-400 hover:bg-blue-50'}`}>
                <input ref={videoRef} type="file" accept="video/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) uploadFile(f, 'seed-videos', 'seed-video', 'twin_video_url'); }} />
                {videoUploaded ? <><div className="text-5xl mb-2">✅</div><p className="font-bold text-emerald-700">Video uploaded!</p></> : uploading ? <><div className="text-4xl mb-2 animate-bounce">⬆️</div><p className="font-bold text-slate-700">Uploading…</p></> : <><div className="text-5xl mb-2">📤</div><p className="font-bold text-slate-700">Click to upload your video</p><p className="text-slate-400 text-sm mt-1">MP4, MOV · Up to 500MB</p></>}
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep('welcome')} className="flex-1 py-3 border-2 border-slate-200 text-slate-600 font-semibold rounded-xl hover:border-slate-300">← Back</button>
                <button onClick={() => setStep('voice')} disabled={!videoUploaded} className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">Continue →</button>
              </div>
            </div>
          )}

          {step === 'voice' && (
            <div>
              <div className="text-center mb-6"><div className="text-5xl mb-3">🎙️</div><h2 className="text-xl font-extrabold text-slate-900">Upload Your Voice Sample</h2><p className="text-slate-500 text-sm mt-1">ElevenLabs will clone your voice for perfect lip-sync.</p></div>
              <div className="bg-slate-800 rounded-xl p-4 mb-5">
                <p className="text-slate-400 text-xs font-semibold uppercase mb-2">📖 Read this aloud and record (1 minute):</p>
                <p className="text-white text-sm italic leading-relaxed">"Welcome, I'm [your name], a [realtor / loan officer] serving [your area]. Whether you're buying, selling, or refinancing, I bring expertise and dedication to every client. Real estate is one of the biggest decisions of your life — I'm here to make it simple and successful."</p>
              </div>
              {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
              <div onClick={() => !uploading && !voiceUploaded && voiceRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${voiceUploaded ? 'border-emerald-400 bg-emerald-50' : 'border-slate-300 bg-white hover:border-blue-400 hover:bg-blue-50'}`}>
                <input ref={voiceRef} type="file" accept="audio/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) uploadFile(f, 'voice-samples', 'voice-sample', 'voice_sample_url'); }} />
                {voiceUploaded ? <><div className="text-5xl mb-2">✅</div><p className="font-bold text-emerald-700">Voice uploaded!</p></> : uploading ? <><div className="text-4xl mb-2 animate-bounce">⬆️</div><p className="font-bold">Uploading…</p></> : <><div className="text-5xl mb-2">🎤</div><p className="font-bold text-slate-700">Click to upload your audio</p><p className="text-slate-400 text-sm mt-1">MP3, M4A, WAV · Under 50MB</p></>}
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep('video')} className="flex-1 py-3 border-2 border-slate-200 text-slate-600 font-semibold rounded-xl hover:border-slate-300">← Back</button>
                <button onClick={submitTraining} disabled={!voiceUploaded} className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">Submit for Training →</button>
              </div>
            </div>
          )}

          {step === 'done' && (
            <div className="text-center py-12">
              <div className="relative w-20 h-20 mx-auto mb-6">
                <div className="absolute inset-0 rounded-full border-4 border-blue-100" />
                <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center text-3xl">🎭</div>
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Training Your Digital Twin</h2>
              <p className="text-slate-500 mb-4 max-w-sm mx-auto">We'll email you within 24 hours when your twin is live and ready to generate videos.</p>
              <div className="inline-block bg-blue-50 border border-blue-100 rounded-xl px-6 py-3">
                <p className="text-blue-700 font-semibold text-sm">📧 Check your email for updates</p>
              </div>
              <p className="mt-4 text-slate-400 text-sm">Redirecting to dashboard…</p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
