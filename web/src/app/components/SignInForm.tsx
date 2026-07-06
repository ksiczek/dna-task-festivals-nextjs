'use client';

import { FormEvent, ReactElement, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './SignInForm.module.css';

export const SignInForm = (): ReactElement => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const responseData = await response.json();

            if (!response.ok) {
                setError(responseData?.message || 'Login failed. Please check your credentials.');
                return;
            }

            const token: string = responseData?.data?.token;
            if (token) {
                localStorage.setItem('auth_token', token);
                const stored = localStorage.getItem('auth_token');
                if (!stored) {
                    setError('Failed to save session. Please check your browser settings.');
                    return;
                }
            } else {
                setError('Login failed: no token received. Please try again.');
                return;
            }
            router.push('/');
        } catch {
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.formInput}>
                <label htmlFor="email">Email: </label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                />
            </div>
            <div className={styles.formInput}>
                <label htmlFor="password">Password: </label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                />
            </div>
            {error && <p role="alert" style={{ color: 'red' }}>{error}</p>}
            <div className={styles.formInput}>
                <button type="submit" disabled={loading}>
                    {loading ? 'Signing in…' : 'Sign in'}
                </button>
            </div>
        </form>
    );
};
