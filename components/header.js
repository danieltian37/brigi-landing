import React from 'react';
import Link from 'next/link';
import styles from '../styles/Header.module.css';

export default function Header() {
    return (
        <header className={styles.header}>
            <Link href="/">
                <img src="/frigi2.png" alt="Ponti Logo" className={styles.logo}/>
            </Link>
            <nav className={styles.nav}>
                <ul className={styles.nav__list}>
                    <li class="nav__list-item">
                        <Link href="/#About" className={styles.nav__link}> About</Link>
                    </li>
                    <li class="nav__list-item">
                        <Link href="/login" className={styles.nav__link}><span style={{color: "#536DFE"}}>Join our Journey</span></Link>
                    </li>
                </ul>
            </nav>
        </header>
    );
}
