'use client';

import { useRef } from 'react';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { useTheme } from 'next-themes';

gsap.registerPlugin(SplitText, useGSAP);

// ===================== HERO =====================
interface HeroProps {
  title: string;
  description: string;
  badgeText?: string;
  badgeLabel?: string;
  ctaButtons?: Array<{ text: string; href: string; primary?: boolean }>;
  microDetails?: Array<string>;
}

export default function Hero({
  title,
  description,
  badgeText = "Generative Surfaces",
  badgeLabel = "New",
  ctaButtons = [
    { text: "Get started", href: "#get-started", primary: true },
    { text: "View showcase", href: "#showcase" }
  ],
  microDetails = ["Low‑weight font", "Tight tracking", "Subtle motion"]
}: HeroProps) {
  const { theme } = useTheme();
  const sectionRef = useRef<HTMLElement | null>(null);
  const headerRef = useRef<HTMLHeadingElement | null>(null);
  const paraRef = useRef<HTMLParagraphElement | null>(null);
  const ctaRef = useRef<HTMLDivElement | null>(null);
  const badgeRef = useRef<HTMLDivElement | null>(null);
  const microRef = useRef<HTMLUListElement | null>(null);
  const microItem1Ref = useRef<HTMLLIElement | null>(null);
  const microItem2Ref = useRef<HTMLLIElement | null>(null);
  const microItem3Ref = useRef<HTMLLIElement | null>(null);
  
  const isDark = theme === 'dark';

  useGSAP(
    () => {
      if (!headerRef.current) return;

      const initAnimation = () => {
        try {
          if (!headerRef.current) return;

          const split = new SplitText(headerRef.current!, {
            type: 'lines',
            wordsClass: 'lines',
          });

          if (!split.lines || split.lines.length === 0) {
            return;
          }

          // Animate only transforms - content stays visible
          // Don't touch opacity, let CSS handle visibility
          gsap.fromTo(
            split.lines,
            {
              filter: 'blur(12px)',
              yPercent: 20,
              scale: 1.04,
            },
            {
              filter: 'blur(0px)',
              yPercent: 0,
              scale: 1,
              duration: 1.0,
              stagger: 0.12,
              ease: 'power3.out',
            }
          );

          if (badgeRef.current) {
            gsap.fromTo(
              badgeRef.current,
              { y: -6 },
              { y: 0, duration: 0.6, ease: 'power3.out' }
            );
          }
          if (paraRef.current) {
            gsap.fromTo(
              paraRef.current,
              { y: 6 },
              { y: 0, duration: 0.6, ease: 'power3.out', delay: 0.2 }
            );
          }
          if (ctaRef.current) {
            gsap.fromTo(
              ctaRef.current,
              { y: 6 },
              { y: 0, duration: 0.6, ease: 'power3.out', delay: 0.4 }
            );
          }
          const microItems = [microItem1Ref.current, microItem2Ref.current, microItem3Ref.current].filter(Boolean);
          if (microItems.length > 0) {
            gsap.fromTo(
              microItems,
              { y: 4 },
              { y: 0, duration: 0.5, stagger: 0.08, ease: 'power3.out', delay: 0.6 }
            );
          }
        } catch (error) {
          console.error('Error initializing hero animations:', error);
        }
      };

      // Wait for fonts, then animate
      if (document.fonts && document.fonts.ready) {
        Promise.race([
          document.fonts.ready,
          new Promise((resolve) => setTimeout(resolve, 400)),
        ]).then(() => {
          setTimeout(initAnimation, 150);
        });
      } else {
        setTimeout(initAnimation, 150);
      }
    },
    { scope: sectionRef },
  );

  return (
    <section 
      ref={sectionRef} 
      className="relative h-screen w-screen overflow-hidden bg-background text-foreground"
      style={{ 
        color: 'hsl(var(--foreground))',
        backgroundColor: 'hsl(var(--background))',
        position: 'relative'
      }}
    >
      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-start gap-6 px-6 pb-24 pt-36 sm:gap-8 sm:pt-44 md:px-10 lg:px-16">
        <div 
          ref={badgeRef} 
          className="inline-flex items-center gap-2 rounded-full border border-border dark:border-white/10 bg-card dark:bg-white/5 px-3 py-1.5 backdrop-blur-sm"
        >
          <span className="text-[10px] font-light uppercase tracking-[0.08em] text-foreground/70 dark:text-white/70">{badgeLabel}</span>
          <span className="h-1 w-1 rounded-full bg-foreground/50 dark:bg-white/40" />
          <span className="text-xs font-light tracking-tight text-foreground dark:text-white/80">{badgeText}</span>
        </div>

        <h1 
          ref={headerRef} 
          className="max-w-2xl text-left text-5xl font-extralight leading-[1.05] tracking-tight text-foreground dark:text-white sm:text-6xl md:text-7xl"
        >
          {title}
        </h1>

        <p 
          ref={paraRef} 
          className="max-w-xl text-left text-base font-light leading-relaxed tracking-tight text-foreground/80 dark:text-white/75 sm:text-lg"
        >
          {description}
        </p>

        <div 
          ref={ctaRef} 
          className="flex flex-wrap items-center gap-3 pt-2"
        >
          {ctaButtons.map((button, index) => {
            // Determine border color based on theme and button type
            let borderColor: string;
            if (button.primary) {
              borderColor = isDark ? 'rgba(255, 255, 255, 0.25)' : 'rgba(0, 0, 0, 0.35)';
            } else {
              borderColor = isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.45)';
            }

            return (
              <a
                key={index}
                href={button.href}
                className={`rounded-2xl px-5 py-3 text-sm font-light tracking-tight transition-all focus:outline-none focus:ring-2 focus:ring-ring duration-300 ${
                  button.primary
                    ? "bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
                    : "text-foreground hover:bg-accent hover:text-accent-foreground dark:text-white/80 dark:hover:bg-white/5"
                }`}
                style={{
                  border: '1px solid',
                  borderColor: borderColor,
                }}
              >
                {button.text}
              </a>
            );
          })}
        </div>

        <ul 
          ref={microRef} 
          className="mt-8 flex flex-wrap gap-6 text-xs font-extralight tracking-tight text-foreground/70 dark:text-white/60"
        >
          {microDetails.map((detail, index) => {
            const refMap = [microItem1Ref, microItem2Ref, microItem3Ref];
            return (
              <li 
                key={index} 
                ref={refMap[index]} 
                className="flex items-center gap-2"
              >
                <span className="h-1 w-1 rounded-full bg-foreground/50 dark:bg-white/40" /> {detail}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
