import { Component, signal, ElementRef, inject, afterNextRender, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { animate, stagger, inView } from 'motion';

interface Project {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  year: string;
  role: string;
  challenge: string;
  solution: string;
  tech: string[];
  gradient: string;
  mockupStyles?: string;
}

@Component({
  selector: 'app-portfolio',
  imports: [CommonModule],
  templateUrl: './portfolio.html',
  styleUrl: './portfolio.css',
})
export class PortfolioComponent implements OnDestroy {
  // References
  private elementRef = inject(ElementRef);
  private timerId?: ReturnType<typeof setInterval>;

  // Real-time signals
  currentTime = signal<string>('00:00:00 AM');
  copied = signal<boolean>(false);
  activeSection = signal<string>('home');
  mobileMenuOpen = signal<boolean>(false);

  // Selected project modal/drawer
  selectedProject = signal<Project | null>(null);

  // Typography Playground State
  typeTracking = signal<number>(-0.04); // em
  typeWeight = signal<number>(700);
  typeLineHeight = signal<number>(1.1);
  typeSize = signal<number>(56); // px

  // Projects list
  projects = signal<Project[]>([
    {
      id: 'viaje',
      number: '01',
      title: 'VIAJE PLATFORM',
      subtitle: 'Seamless island travel and e-commerce experience across the Philippines.',
      year: '2025',
      role: 'Lead UI Developer & Designer',
      challenge: 'Local island transportation scheduling and reservation systems are traditionally fragmented. The goal was to build a highly responsive, high-speed travel and booking vehicle matrix that works reliably even under low-bandwidth connections in rural coastal islands, with a premium user interface design capturing the beauty of tropical travel.',
      solution: 'Created an offline-first predictive query index using localized data caching, reducing interface latency by 85%. Engineered a customizable dark booking UI utilizing micro-animations that represent ferry seats and bus allocations dynamically. Implemented visual brand updates inspired by minimalist utility typography.',
      tech: ['Angular v21', 'Tailwind CSS', 'RxJS', 'D3.js Data Map', 'Local Storage Persistence'],
      gradient: 'from-zinc-900 via-[#101918] to-[#142A27]'
    },
    {
      id: 'nexus',
      number: '02',
      title: 'NEXUS COMPONENTS',
      subtitle: 'Production-scale Design System focused on strict accessibility.',
      year: '2024',
      role: 'Design System Engineer',
      challenge: 'Establishing a cohesive, enterprise-grade design framework across multiple independent software products. The key constraints were extreme accessibility guidelines (WCAG 2.2 AAA standard), unified dark/light contrast parameters, and a lightweight runtime build footprint that wouldn\'t add delays to client loading speeds.',
      solution: 'Designed and authored a CSS variable architecture supporting lightning-fast CSS-only state changes. Built interactive elements on top of ARIA specifications with complete screen-reader compatibility. Configured automated build routines using PostCSS to eliminate unused design-token definitions and exports.',
      tech: ['TypeScript', 'Tailwind v4', 'PostCSS Custom Builders', 'Figma Variables', 'A11y Jest'],
      gradient: 'from-zinc-950 via-[#13111b] to-[#1C182A]'
    },
    {
      id: 'manila-clubhouse',
      number: '03',
      title: 'MANILA CLUBHOUSE',
      subtitle: 'Spatial design showcase and digital collective hub.',
      year: '2024',
      role: 'Creative Web Developer',
      challenge: 'Developing a highly interactive digital directory and events spatial grid mapping creative talent across Manila. The client desired a non-traditional, immersive directory website that behaved like a virtual physical gallery, engaging the visual curiosity of design studios and artistic collaborators.',
      solution: 'Constructed an interactive coordinate grid layout on custom CSS viewports. Features dynamic canvas mouse interactions, high-fidelity responsive structural alignment, and fluid layout translations that scale gracefully across mobile screens and large ultra-wide monitors.',
      tech: ['Three.js', 'Vanilla HTML5 / WebGL', 'Tailwind CSS', 'Motion Library', 'GSAP Layouts'],
      gradient: 'from-zinc-900 via-[#1b1c1d] to-[#252528]'
    }
  ]);

  // Creative Playground Side Projects
  sideProjects = signal([
    {
      title: 'Kinetic Canvas Grid',
      desc: 'Interactive grid experiment where elements respond seamlessly to coordinate mouse distance metrics.',
      tag: 'Creative Physics'
    },
    {
      title: 'Brand Lettermarks',
      desc: 'An exploration of high-contrast logo systems utilizing minimalist geometry and negative space concepts.',
      tag: 'Graphic Identity'
    },
    {
      title: 'Flex Layout Engine',
      desc: 'Raw CSS framework test mimicking swiss posters grid constraints through responsive layout mathematics.',
      tag: 'Core CSS'
    }
  ]);

  // Active hover dot coordinate tracker for Kinetic Grid
  activeDotRow = signal<number>(-1);
  activeDotCol = signal<number>(-1);

  constructor() {
    // Only fetch/run browser APIs on the client side
    afterNextRender(() => {
      this.initCebuClock();
      this.initScrollSpy();
      this.initAnimations();
    });
  }

  ngOnDestroy() {
    if (this.timerId) {
      clearInterval(this.timerId);
    }
  }

  // Live Philippine Standard Time clock
  private initCebuClock() {
    const updateTime = () => {
      // Cebu, Philippines uses Philippine Standard Time (PST), which is UTC+8.
      // We will format the current time strictly under Asia/Manila time zone.
      try {
        const date = new Date();
        const options: Intl.DateTimeFormatOptions = {
          timeZone: 'Asia/Manila',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        };
        const formatter = new Intl.DateTimeFormat('en-US', options);
        this.currentTime.set(formatter.format(date));
      } catch {
        // Fallback in case of lack of i18n support in old environments
        const local = new Date();
        this.currentTime.set(local.toLocaleTimeString());
      }
    };

    updateTime();
    this.timerId = setInterval(updateTime, 1000);
  }

  // Scrollspy to detect active viewport section and highlight nav list
  private initScrollSpy() {
    const sections = ['home', 'work', 'capabilities', 'testimonials', 'sharing', 'contact'];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.activeSection.set(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-30% 0px -60% 0px', // Trigger activation near the top of the viewport
      }
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
  }

  // Initiate high-end animations using the motion library
  private initAnimations() {
    // 1. Staggered reveal of hero section elements
    animate(
      '.reveal-delay',
      { opacity: [0, 1], y: [40, 0] },
      {
        delay: stagger(0.12),
        duration: 0.9,
        ease: [0.16, 1, 0.3, 1] // Custom cubic bezier (easeOutExpo equivalent)
      }
    );

    // 2. Continuous reveals as user scrolls to other sections
    inView(
      '.scroll-reveal',
      (element) => {
        animate(
          element,
          { opacity: [0, 1], y: [35, 0] },
          { duration: 0.8, ease: 'easeOut' }
        );
      },
      { margin: '-10% 0px -10% 0px' }
    );
  }

  // Copy Email to clipboard with elegant feedback action
  copyEmail() {
    navigator.clipboard.writeText('rosepiedrasingco123@gmail.com').then(() => {
      this.copied.set(true);
      setTimeout(() => {
        this.copied.set(false);
      }, 2000);
    });
  }

  // Scroll manually to a section ID with smooth timing
  scrollToSection(id: string) {
    this.mobileMenuOpen.set(false);
    const element = document.getElementById(id);
    if (element) {
      // Calculate offset for fixed header
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }

  // Open Project Details Drawer
  openProject(project: Project) {
    this.selectedProject.set(project);
    document.body.style.overflow = 'hidden'; // Lock background scroll

    // Animate Modal Entrance
    setTimeout(() => {
      const drawer = document.querySelector('.drawer-content');
      if (drawer) {
        animate(drawer, { x: ['100%', '0%'] }, { duration: 0.5, ease: [0.16, 1, 0.3, 1] });
      }
    }, 20);
  }

  // Close Project Details Drawer
  closeProject() {
    const drawer = document.querySelector('.drawer-content');
    if (drawer) {
      animate(drawer, { x: '100%' }, { duration: 0.4, ease: 'easeIn' }).then(() => {
        this.selectedProject.set(null);
        document.body.style.overflow = ''; // Restore scroll
      });
    } else {
      this.selectedProject.set(null);
      document.body.style.overflow = '';
    }
  }

  // Backdrop click handler for modals to bypass internal content container clicks
  onBackdropClick(event: Event) {
    if (event.target === event.currentTarget) {
      this.closeProject();
    }
  }

  // Interactive Typography controls update helper
  updateTypography(prop: 'tracking' | 'weight' | 'lineHeight' | 'size', event: Event) {
    const target = event.target as HTMLInputElement;
    const val = parseFloat(target.value);
    if (prop === 'tracking') this.typeTracking.set(val);
    if (prop === 'weight') this.typeWeight.set(val);
    if (prop === 'lineHeight') this.typeLineHeight.set(val);
    if (prop === 'size') this.typeSize.set(val);
  }

  // Reset typography matrix controls
  resetTypography() {
    this.typeTracking.set(-0.04);
    this.typeWeight.set(700);
    this.typeLineHeight.set(1.1);
    this.typeSize.set(56);
  }

  // Kinetic Grid dots generation helper
  getRows(): number[] {
    return Array.from({ length: 8 }, (_, i) => i);
  }

  getCols(): number[] {
    return Array.from({ length: 14 }, (_, i) => i);
  }

  // Get dynamic scale metric on Kinetic Grid dot hover based on taxicab distance
  getDotClass(r: number, c: number): string {
    const ar = this.activeDotRow();
    const ac = this.activeDotCol();
    if (ar === -1 || ac === -1) return 'bg-zinc-800 scale-100';

    const dist = Math.abs(r - ar) + Math.abs(c - ac);
    if (dist === 0) return 'bg-white scale-[2.2] shadow-lg shadow-white/40 duration-200';
    if (dist === 1) return 'bg-zinc-300 scale-150 duration-300';
    if (dist === 2) return 'bg-[#00f0ff] scale-125 duration-300';
    if (dist === 3) return 'bg-zinc-600 scale-100 duration-400';
    return 'bg-zinc-800 scale-75 opacity-40 duration-500';
  }

  // Handle dot hover tracker metrics
  hoverDot(r: number, c: number) {
    this.activeDotRow.set(r);
    this.activeDotCol.set(c);
  }

  clearDotHover() {
    this.activeDotRow.set(-1);
    this.activeDotCol.set(-1);
  }
}
