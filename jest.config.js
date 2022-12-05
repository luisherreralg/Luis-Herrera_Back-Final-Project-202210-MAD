/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testPathIgnorePatterns: ['dist', 'node_modules/'],
    resolver: 'jest-ts-webcompat-resolver',
    coveragePathIgnorePatterns: [
        'src/entities',
        'src/app.ts',
        'src/index.ts',
        'src/routes.ts',
    ],
};
