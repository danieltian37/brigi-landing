import React from 'react';
import styles from '../styles/Login.module.css';
import Head from 'next/head';

function Login() {
    return (
        <div className={styles.container}>
            <Head>
                <title>Log In | Frigi</title>
                <link rel="icon" href="/icon.png" />
                <link href="https://fonts.googleapis.com/css2?family=Lexend+Deca:wght@400;500;700&display=swap" rel="stylesheet" />
            </Head>
            <div className={styles.blockOne}>
                <div className="intro">
                    <h1>Login to Frigi</h1>
                    <form className={styles.LoginForm}>
                        <label>
                            Username:
                            <input type="text" name="username" className={styles.inputField} />
                        </label>
                        <br />
                        <label>
                            Password:
                            <input type="password" name="password" className={styles.inputField} />
                        </label>
                        <br />
                        <button type="submit" className={styles.getStartedButton}>Log In</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;