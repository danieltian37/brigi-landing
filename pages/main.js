import { useEffect, useState, useRef } from 'react';
import styles from '../styles/Main.module.css';

export default function Main() {

    return (
        <>
        <div className={styles.main}>
           <h1>Welcome to Pontis: Your Virtual Fridge and Pantry.</h1>
           <p>At Pontis, we’re bridging the gap between your kitchen and your culinary creativity. Our app transforms your pantry and fridge into a virtual assistant, keeping track of your ingredients so you never miss out on a delicious meal again.</p>
        </div>
        <div style={{ height: '100rem' }}></div>
        </>
    )
}