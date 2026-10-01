export type SectionMeta = {
  /** DOM id used for anchors + scroll spy */
  id: string;
  /** Two digit index shown in the rail */
  index: string;
  /** Rail label */
  label: string;
  /** Shown in the top navigation (omit to hide) */
  nav?: string;
};

export const SECTIONS: SectionMeta[] = [
  { id: 'intro', index: '01', label: 'Intro' },
  { id: 'about', index: '02', label: 'About', nav: 'About' },
  { id: 'skills', index: '03', label: 'Skills' },
  { id: 'projects', index: '04', label: 'Projects', nav: 'Work' },
  { id: 'experience', index: '05', label: 'Experience', nav: 'Experience' },
  { id: 'contact', index: '06', label: 'Contact', nav: 'Contact' },
];
