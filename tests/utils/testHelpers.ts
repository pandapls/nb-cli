import { existsSync, mkdirSync, rm } from 'fs';
import { join } from 'path';

export const createTestDir = (dirName: string): string => {
    const testDir = join(process.cwd(), dirName);
    if (!existsSync(testDir)) {
        mkdirSync(testDir, { recursive: true });
    }
    return testDir;
};

export const cleanupTestDir = (dirName: string): void => {
    const testDir = join(process.cwd(), dirName);
    if (existsSync(testDir)) {
        rm(testDir, { recursive: true, force: true }, (err) => {
            if (err) {
                console.error('清理测试目录失败:', err);
            }
        });
    }
};

export const mockFileSystem = () => {
    jest.mock('fs', () => ({
        ...jest.requireActual('fs'),
        existsSync: jest.fn().mockReturnValue(true),
        mkdirSync: jest.fn(),
        rm: jest.fn().mockImplementation((path, options, callback) => {
            if (callback) {
                callback(null);
            }
        })
    }));
}; 