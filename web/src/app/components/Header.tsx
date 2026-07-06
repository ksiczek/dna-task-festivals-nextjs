'use client';

import { ReactElement, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import classes from './Header.module.css';

export const Header = (): ReactElement => {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        setIsAuthenticated(!!localStorage.getItem('auth_token'));
    }, []);

    const handleSignOut = () => {
        localStorage.removeItem('auth_token');
        setIsAuthenticated(false);
        router.push('/sign-in');
    };

    return (
        <header className={classes.header}>
            <Link href="/">Home</Link>
            {isAuthenticated ? (
                <button onClick={handleSignOut}>Sign out</button>
            ) : (
                <Link href="/sign-in">
                    <button>Sign in</button>
                </Link>
            )}
        </header>
    );
}
