import s from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={s.footer}>
      <div className={s.top}>
        <p className={s.name}>SUYASH PANDEY</p>
        <p className={s.tag}>AI • DATA • SOFTWARE • CREATIVE TECHNOLOGY</p>
      </div>
      <div className={s.bottom}>
        <p className={s.copy}>© 2026 Suyash Pandey</p>
        <ul className={s.links}>
          <li>
            <a href="https://github.com/suyashpandey8088-cell" target="_blank" rel="noreferrer noopener" data-cursor="open">
              GitHub
            </a>
          </li>
          <li>
            <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer noopener" data-cursor="open">
              LinkedIn
            </a>
          </li>
          <li>
            <a href="mailto:suyashpandey8088@gmail.com" data-cursor="open">
              Email
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
