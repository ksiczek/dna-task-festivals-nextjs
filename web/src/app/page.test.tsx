import '@testing-library/jest-dom';
import Root from './page';
import { render } from '@testing-library/react';

// Mock Next.js router
jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: jest.fn(),
    }),
}));

describe('Root layout', () => {
    beforeEach(() => {
        // @ts-ignore
        global.fetch = async () => ({
            json: async () => ({})
        });

        // Mock localStorage
        Object.defineProperty(window, 'localStorage', {
            value: {
                getItem: jest.fn(() => 'mock-token'),
                setItem: jest.fn(),
                removeItem: jest.fn(),
            },
            writable: true,
        });
    });

    it('should render festivals list', async () => {
        const { container } = render(<Root />);

        expect(container).not.toBeEmptyDOMElement();
    });
});
