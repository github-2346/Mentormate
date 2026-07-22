'use client';
import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Zap, Code2, MessageSquare, Video, Shield, ArrowRight, ChevronDown } from 'lucide-react';

export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const y = window.scrollY;
        heroRef.current.style.transform = `translateY(${y * 0.3}px)`;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-bg-primary overflow-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-surface-border glass">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-accent-blue/20 border border-accent-blue/30 flex items-center justify-center">
              <Zap size={14} className="text-accent-blue" />
            </div>
            <span className="font-display font-bold text-text-primary text-sm tracking-wide">
              Mentor<span className="text-accent-blue">Mate</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">Sign in</Button>
            </Link>
            <Link href="/signup">
              <Button variant="primary" size="sm">Get started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center pt-14">
        {/* Background grid */}
        <div className="absolute inset-0 bg-grid opacity-100" />
        {/* Radial glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-accent-blue/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/3 w-[400px] h-[300px] bg-accent-orange/5 rounded-full blur-[100px] pointer-events-none" />

        <div ref={heroRef} className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          {/* Pill badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent-blue/30 bg-accent-blue/5 mb-8 animate-fade-in">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-blue opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-accent-blue" />
            </span>
            <span className="text-xs text-accent-blue font-medium tracking-wide">Real-time collaboration</span>
          </div>

          <h1 className="font-display font-extrabold text-6xl md:text-7xl leading-none mb-6 animate-slide-up">
            <span className="text-text-primary">The Ultimate mentorship</span>
            <br />
            <span className="gradient-text text-glow-blue">platform</span>
            <br />
            <span className="text-text-primary"></span>
          </h1>

          <p className="text-text-secondary text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up" style={{ animationDelay: '0.1s' }}>
             1-on-1 sessions with live video, collaborative code editing,
            real-time chat — all in one seamless experience.
          </p>

          <div className="flex items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Link href="/signup">
              <Button variant="primary" size="lg" icon={<ArrowRight size={16} />} className="group">
                <span>Start for free</span>
                <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg">Sign in</Button>
            </Link>
          </div>

          {/* Scroll hint */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-float">
            <span className="text-xs text-text-muted">Scroll to explore</span>
            <ChevronDown size={14} className="text-text-muted" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display font-bold text-4xl text-text-primary mb-4">
              Everything in one session
            </h2>
            <p className="text-text-secondary max-w-xl mx-auto">
               MentorMate delivers all the essential
              collaboration features in a single interface.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map((f, i) => (
              <FeatureCard key={i} {...f} />
            ))}
          </div>
        </div>
      </section>


      {/* CTA */}
      <section className="py-24 px-6 text-center relative">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[500px] h-[300px] bg-accent-blue/4 rounded-full blur-[100px]" />
        </div>
        <div className="relative max-w-2xl mx-auto">
          <h2 className="font-display font-bold text-5xl text-text-primary mb-4">
            Ready to mentor<span className="text-accent-blue">?</span>
          </h2>
          <p className="text-text-secondary mb-8">Join as a mentor or student and start your first session today.</p>
          <Link href="/signup">
            <Button variant="primary" size="lg" className="glow-blue" icon={<Zap size={16} />}>
              Get started — it&apos;s free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-surface-border py-8">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap size={14} className="text-accent-blue" />
            <span className="font-display font-bold text-sm text-text-primary">
              Mentor<span className="text-accent-blue">Mate</span>
            </span>
          </div>
          <span className="text-xs text-text-muted">© 2026 MentorMate.</span>
        </div>
      </footer>
    </div>
  );
}

const FEATURES = [
  {
    icon: <Code2 size={20} className="text-accent-blue" />,
    title: 'Collaborative Editor',
    desc: 'Monaco-powered code editor with real-time sync and live cursor tracking.',
    color: 'accent-blue',
  },
  {
    icon: <Video size={20} className="text-accent-orange" />,
    title: 'WebRTC Video',
    desc: '1-on-1 video calling with screen sharing, mute, and camera controls — no plugins needed.',
    color: 'accent-orange',
  },
  {
    icon: <MessageSquare size={20} className="text-violet-400" />,
    title: 'Live Chat',
    desc: 'Persistent chat with code snippets, system messages, and full history per session.',
    color: 'violet-400',
  },
  {
    icon: <Shield size={20} className="text-emerald-400" />,
    title: 'Secure Sessions',
    desc: 'JWT auth, role-based access (Mentor/Student), and private session links.',
    color: 'emerald-400',
  },
];

const TECH = ['Next.js 14', 'TypeScript', 'Spring Boot', 'WebSocket / STOMP', 'WebRTC', 'PostgreSQL', 'Monaco Editor', 'Tailwind CSS'];

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string; color: string }) {
  return (
    <div className="glass rounded-xl p-6 border border-surface-border hover:border-accent-blue/20 transition-all duration-300 group cursor-default">
      <div className="w-10 h-10 rounded-lg bg-bg-elevated border border-surface-border flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="font-display font-semibold text-text-primary mb-2">{title}</h3>
      <p className="text-sm text-text-secondary leading-relaxed">{desc}</p>
    </div>
  );
}
