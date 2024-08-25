import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Hero from './hero.js';
import Main from './main.js';

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Ponti | Your Bridge to Home Cooking</title>
        <link rel="icon" href="/nt_icon.png" />
        <link href="https://fonts.googleapis.com/css2?family=Lexend+Deca:wght@400;500;700&display=swap" rel="stylesheet" />
      </Head>

      <main>
        <Hero />
        <Main />
      </main>

      <footer>
        <p>hi</p>
      </footer>

      <style jsx>{`
        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        footer {
          width: 100%;
          height: 100px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        footer img {
          margin-left: 0.5rem;
        }
        footer a {
          display: flex;
          justify-content: center;
          align-items: center;
          text-decoration: none;
          color: inherit;
        }
        code {
          background: #fafafa;
          border-radius: 5px;
          padding: 0.75rem;
          font-size: 1.1rem;
          font-family:
            Menlo,
            Monaco,
            Lucida Console,
            Liberation Mono,
            DejaVu Sans Mono,
            Bitstream Vera Sans Mono,
            Courier New,
            monospace;
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family:
            -apple-system,
            BlinkMacSystemFont,
            Segoe UI,
            Roboto,
            Oxygen,
            Ubuntu,
            Cantarell,
            Fira Sans,
            Droid Sans,
            Helvetica Neue,
            Lexend Deca,
            sans-serif;
          -webkit-text-size-adjust: 100%;
        }
        * {
          box-sizing: border-box;
        }
        h1 {
          font-weight: 500;
          font-family: 'Lexend Deca', sans-serif;
        }

        p {
          font-weight: 400;
        }

        .medium-text {
          font-weight: 500; /* Medium */
        }
      `}</style>
    </div>
  );
}
