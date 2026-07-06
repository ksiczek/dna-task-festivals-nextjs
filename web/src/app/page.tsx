'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from "./page.module.css";
import { Festival } from '@/app/components/Festival';

export default function Home() {
    const router = useRouter();
    const [festivals, setFestivals] = useState([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const getData = async () => {
            const token = localStorage.getItem('auth_token');

            if (!token) {
                router.push('/sign-in');
                return;
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/graphql`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    query: `
            query {
                festivals {
                    id
                    name
                    price
                    duration {
                        end
                        start
                    }
                }
            }
            `
                }),
                method: 'POST'
            });
            const responseData = await response.json();

            if (responseData?.errors) {
                const isUnauthorized = responseData.errors.some(
                    (e: { extensions?: { code?: string } }) => e.extensions?.code === 'UNAUTHENTICATED'
                );
                if (isUnauthorized) {
                    localStorage.removeItem('auth_token');
                    router.push('/sign-in');
                    return;
                }
                setError('Failed to load festivals.');
                return;
            }

            setFestivals(responseData?.data?.festivals || []);
        }

        getData();
    }, [router]);


    return (
        <main>
            {error && <p role="alert" style={{ color: 'red' }}>{error}</p>}
            <div className={styles.festivals}>
                {festivals.map((festival: any) => (
                    <Festival
                        key={(festival as any).id}
                        name={festival.name}
                        endDate={festival.duration.end}
                        startDate={festival.duration.start}
                        price={festival.price}
                    />
                ))}
            </div>
        </main>
    );
}
