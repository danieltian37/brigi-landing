import { useEffect, useState, useRef } from 'react';
import styles from '../styles/Main.module.css';

export default function Main() {

    return (
        <>
        <div className={styles.blockOne}>
            <div className={styles.intro}>
                <h1>Welcome to Ponti: <br>
                </br>Your Virtual Fridge, Pantry, and Assistant.</h1>
                <p>Become the cook you've always wanted to be. Connect your kitchen to the depths of your imagination.</p>
                <button className={styles.getStartedButton} style={{ marginTop: '1rem' }}>
                    Get Started
                </button>
            </div>
        </div>
        <div style={{ height: '100rem' }}></div>
        </>
    )
}