export type Project = {
  n: string;
  title: string;
  blurb: string;
  stack: string[];
  image: string;
  alt: string;
  accent: string;
};

export const PROJECTS: Project[] = [
  {
    n: '01',
    title: 'AI News Intelligence',
    blurb: 'AI-powered news summarization and conversational analysis platform.',
    stack: ['LLMs', 'RAG', 'Python', 'React'],
    image: '/projects/p1.jpg',
    alt: 'Abstract dashboard mockup for an AI news intelligence platform',
    accent: '#5b8cff',
  },
  {
    n: '02',
    title: 'Bank Churn Prediction',
    blurb: 'Machine-learning system for predicting customer churn and generating risk scores.',
    stack: ['Scikit-learn', 'Pandas', 'XGBoost'],
    image: '/projects/p2.jpg',
    alt: 'Abstract data visualisation mockup for a churn prediction model',
    accent: '#8f6bff',
  },
  {
    n: '03',
    title: 'AI Student Assistant',
    blurb: 'AI assistant designed to help students with learning and academic tasks.',
    stack: ['AI Agents', 'Node.js', 'MongoDB'],
    image: '/projects/p3.jpg',
    alt: 'Abstract chat interface mockup for an AI student assistant',
    accent: '#4fd4e4',
  },
  {
    n: '04',
    title: 'Streaming Platform',
    blurb: 'Modern streaming platform interface with personalized content discovery.',
    stack: ['React', 'APIs', 'Recommenders'],
    image: '/projects/p4.jpg',
    alt: 'Abstract streaming platform interface mockup',
    accent: '#ff7ab8',
  },
  {
    n: '05',
    title: 'Smart Digital Experience',
    blurb: 'Interactive web experience combining animation, AI, and modern UI.',
    stack: ['GSAP', 'Next.js', 'WebGL-style UI'],
    image: '/projects/p5.jpg',
    alt: 'Abstract interactive web experience mockup with glowing geometry',
    accent: '#7cf2c0',
  },
];
