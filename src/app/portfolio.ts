import {
  afterNextRender,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { animate, inView, stagger } from 'motion';

interface Experience {
  number: string;
  role: string;
  company: string;
  period: string;
  summary: string;
  tags: string[];
}

interface Service {
  number: string;
  title: string;
  description: string;
}

interface SampleDesign {
  slug: string;
  title: string;
  type: string;
  platform: string;
  image: string;
  alt: string;
}

@Component({
  selector: 'app-portfolio',
  imports: [CommonModule],
  templateUrl: './portfolio.html',
  styleUrl: './portfolio.css',
})
export class PortfolioComponent implements OnDestroy {
  private readonly elementRef: ElementRef<HTMLElement> = inject(ElementRef);
  private clockTimer?: ReturnType<typeof setInterval>;
  private sectionObserver?: IntersectionObserver;

  readonly currentTime = signal('');
  readonly activeSection = signal('home');
  readonly menuOpen = signal(false);
  readonly emailCopied = signal(false);
  readonly photoMissing = signal(false);
  readonly missingDesignImages = signal<ReadonlySet<string>>(new Set<string>());

  readonly experiences: Experience[] = [
    {
      number: '01',
      role: 'SEO Specialist',
      company: 'iCosys Pte Ltd',
      period: 'May 2026 — Present',
      summary:
        'Conducting technical website audits, keyword research, competitor analysis, backlink monitoring, and practical recommendations that improve search visibility.',
      tags: ['Ahrefs', 'Screaming Frog', 'Technical SEO', 'Research'],
    },
    {
      number: '02',
      role: 'UI/UX Designer',
      company: 'Dinnox IT Solutions',
      period: 'May 2023 — Aug 2025',
      summary:
        'Designed user-centered web and mobile interfaces, built wireframes and interactive prototypes, and collaborated closely with developers and stakeholders.',
      tags: ['Figma', 'Prototyping', 'User flows', 'Usability'],
    },
    {
      number: '03',
      role: 'SEO Specialist',
      company: 'Dinnox IT Solutions',
      period: 'May 2023 — Dec 2023',
      summary:
        'Delivered on-page optimization, keyword research, and technical SEO implementation to strengthen content structure and organic performance.',
      tags: ['On-page SEO', 'Keywords', 'Audits', 'Optimization'],
    },
    {
      number: '04',
      role: 'Intern Web Developer',
      company: 'Above Digital, Australia',
      period: 'Aug 2022 — Jun 2023',
      summary:
        'Supported the development and maintenance of WordPress websites while contributing to website performance and optimization initiatives.',
      tags: ['WordPress', 'Web development', 'Maintenance', 'Performance'],
    },
  ];

  readonly services: Service[] = [
    {
      number: '01',
      title: 'UI/UX design',
      description:
        'Clear, user-centered web and mobile interfaces shaped through research, flows, wireframes, and polished visual design.',
    },
    {
      number: '02',
      title: 'Wireframing & prototyping',
      description:
        'Fast, testable prototypes that make ideas tangible and align product decisions before development begins.',
    },
    {
      number: '03',
      title: 'Technical SEO',
      description:
        'Structured audits and prioritized recommendations covering crawlability, on-page signals, and site performance.',
    },
    {
      number: '04',
      title: 'Search research',
      description:
        'Keyword, competitor, and backlink analysis that connects audience intent with useful content opportunities.',
    },
    {
      number: '05',
      title: 'WordPress development',
      description:
        'Responsive website implementation, maintenance, and optimization with a practical eye for usability.',
    },
    {
      number: '06',
      title: 'Brand & visual identity',
      description:
        'Focused visual systems that give products a consistent, recognizable, and credible digital presence.',
    },
  ];

  readonly sampleDesigns: SampleDesign[] = [
    {
      slug: 'erpworkbench',
      title: 'ERPWorkbench dashboard',
      type: 'Website UI',
      platform: 'Responsive landing page concept',
      image: '/sample-designs/erp-workbench.jpg',
      alt: 'ERPWorkbench dashboard sample design mockup',
    },
    {
      slug: 'cariton',
      title: 'Cariton ordering app',
      type: 'Food delivery',
      platform: 'Restaurant discovery and cart flow',
      image: '/sample-designs/cariton.jpg',
      alt: 'Cariton ordering app sample design mockup',
    },
    {
      slug: 'online-course',
      title: 'Knowledj online course platform',
      type: 'Education website',
      platform: 'Course discovery landing page',
      image: '/sample-designs/knowledj.jpg',
      alt: 'Online course platform sample design mockup',
    },
    {
      slug: 'sookee-rewards-app',
      title: 'Sookee rewards app',
      type: 'Mobile app UI',
      platform: 'Rewards, vouchers, and redemption flow',
      image: '/sample-designs/sookee-reward-app.jpg',
      alt: 'Sookee rewards mobile app sample design mockup',
    },
    {
      slug: 'realtyhub',
      title: 'Realtyhub property search',
      type: 'Real estate website',
      platform: 'Listing search and inquiry experience',
      image: '/sample-designs/realtyhub.jpg',
      alt: 'Realtyhub real estate sample design mockup',
    },
    {
      slug: 'dinnox-website',
      title: 'Dinnox website',
      type: 'Corporate website',
      platform: 'Brand awareness and lead generation',
      image: '/sample-designs/dinnox-website.jpg',
      alt: 'Dinnox website sample design mockup',
    },
    {
      slug: 'parkee',
      title: 'Parkee parking app',
      type: 'Mobility product',
      platform: 'Parking discovery and reservation flow',
      image: '/sample-designs/parkee.jpg',
      alt: 'Parkee parking app sample design mockup',
    },
    {
      slug: 'jagna-municipality',
      title: 'Municipality of Jagna',
      type: 'Civic website',
      platform: 'Public service and tourism landing page',
      image: '/sample-designs/jagna-municipality.jpg',
      alt: 'Municipality of Jagna sample design mockup',
    },
  ];

  readonly designTools = ['Figma', 'Canva', 'Wireframing', 'Prototyping', 'Usability testing'];
  readonly seoTools = [
    'Ahrefs',
    'Screaming Frog',
    'Technical audits',
    'Keyword research',
    'Competitor analysis',
  ];
  readonly deliverySkills = [
    'WordPress',
    'Agile & Scrum',
    'Project management',
    'Collaboration',
    'Problem-solving',
  ];

  readonly certifications = [
    {
      title: 'UI/UX Design Course',
      issuer: 'Udemy',
      year: '2024',
    },
    {
      title: 'Figma UI UX Design Advanced',
      issuer: 'Professional training',
      year: 'Advanced',
    },
    {
      title: 'Creating User-Focused Design',
      issuer: 'TechXpo 2024 — Guest Speaker',
      year: '2024',
    },
  ];

  constructor() {
    afterNextRender(() => {
      this.startClock();
      this.observeSections();
      this.initializeMotion();
    });
  }

  ngOnDestroy(): void {
    if (this.clockTimer) {
      clearInterval(this.clockTimer);
    }
    this.sectionObserver?.disconnect();
  }

  scrollTo(sectionId: string): void {
    this.menuOpen.set(false);
    document.getElementById(sectionId)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }

  toggleMenu(): void {
    this.menuOpen.update((isOpen) => !isOpen);
  }

  handlePhotoError(): void {
    this.photoMissing.set(true);
  }

  handleDesignImageError(slug: string): void {
    this.missingDesignImages.update((current) => new Set(current).add(slug));
  }

  isDesignImageMissing(slug: string): boolean {
    return this.missingDesignImages().has(slug);
  }

  async copyEmail(): Promise<void> {
    try {
      await navigator.clipboard.writeText('johnkinmascardo@gmail.com');
      this.emailCopied.set(true);
      window.setTimeout(() => this.emailCopied.set(false), 1800);
    } catch {
      window.location.href = 'mailto:johnkinmascardo@gmail.com';
    }
  }

  private startClock(): void {
    const update = () => {
      this.currentTime.set(
        new Intl.DateTimeFormat('en-US', {
          timeZone: 'Asia/Manila',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        }).format(new Date()),
      );
    };

    update();
    this.clockTimer = setInterval(update, 30_000);
  }

  private observeSections(): void {
    const sectionIds = ['home', 'experience', 'designs', 'expertise', 'about', 'contact'];

    this.sectionObserver = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries.find((entry) => entry.isIntersecting);
        if (visibleEntry) {
          this.activeSection.set(visibleEntry.target.id);
        }
      },
      { rootMargin: '-25% 0px -65% 0px' },
    );

    sectionIds.forEach((id) => {
      const section = document.getElementById(id);
      if (section) {
        this.sectionObserver?.observe(section);
      }
    });
  }

  private initializeMotion(): void {
    const host: HTMLElement = this.elementRef.nativeElement;

    animate(
      host.querySelectorAll('.hero-reveal'),
      { opacity: [0, 1], y: [36, 0] },
      {
        delay: stagger(0.1),
        duration: 0.9,
        ease: [0.16, 1, 0.3, 1],
      },
    );

    host.querySelectorAll<HTMLElement>('.scroll-reveal').forEach((element) => {
      inView(
        element,
        () => {
          animate(
            element,
            { opacity: [0, 1], y: [28, 0] },
            { duration: 0.75, ease: [0.16, 1, 0.3, 1] },
          );
        },
        { margin: '-8% 0px -8% 0px' },
      );
    });
  }
}
