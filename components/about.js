import { useEffect, useState, useRef } from 'react';
import styles from '../styles/About.module.css';
import Link from 'next/link';

export default function About() {

    return (
        <>
        <div className={styles.blockOne}>
            <div className={styles.intro} id="About">
                <h1>Welcome to Frigi: <br>
                </br>Your Virtual Fridge, Pantry, and <span style={{color: "#2E3192"}}>Kitchen Assistant.</span></h1>
                <p>Become the cook you've always wanted to be. Connect your kitchen to the depths of your imagination.</p>
                <Link href='/login'>
                    <button className={styles.getStartedButton} style={{ marginTop: '1rem' }}>
                        Get Started
                    </button>
                </Link>
            </div>
            <div className={styles.imageContainer}>
                <img 
                    src="/aboutStock.png"
                    alt="Description of Image"
                    className={styles.rightImage}
                    loading="eager"
                />
            </div>
        </div>
        <div style={{ height: '100rem' }}></div>
        </>
    )
}