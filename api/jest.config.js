module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleFileExtensions: ['js', 'ts'],
    globals: {
        'ts-jest': {
            tsconfig: './test/tsconfig.json'
        }
    },
    transform: {
        '^.+\\.ts$': 'ts-jest',
    },
    testMatch: ['**/*.test.ts'],
};
