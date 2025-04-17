import { cloneRepository, initNewGitRepo, removeDir } from '../../src/utils/git';
import { createTestDir, cleanupTestDir, mockFileSystem } from './testHelpers';
import { join } from 'path';

jest.mock('child_process', () => ({
    spawn: jest.fn().mockImplementation((command, args) => {
        // 模拟不同命令的结果
        if (command === 'git') {
            if (args[0] === 'clone') {
                return {
                    on: jest.fn().mockImplementation((event, callback) => {
                        if (event === 'close') {
                            callback(0);
                        }
                        return {
                            on: jest.fn()
                        };
                    })
                };
            } else if (args[0] === 'init') {
                return {
                    on: jest.fn().mockImplementation((event, callback) => {
                        if (event === 'close') {
                            callback(0);
                        }
                        return {
                            on: jest.fn()
                        };
                    })
                };
            }
        } else if (command === 'rm' || command === 'rd') {
            // 模拟 rm/rd 命令（用于 removeDir 函数）
            return {
                on: jest.fn().mockImplementation((event, callback) => {
                    if (event === 'close') {
                        // 返回成功状态码
                        callback(0);
                    }
                    return {
                        on: jest.fn()
                    };
                })
            };
        }

        return {
            on: jest.fn()
        };
    })
}));

describe('Git Utils', () => {
    const testDir = 'test-temp';

    beforeAll(() => {
        mockFileSystem();
    });

    beforeEach(() => {
        createTestDir(testDir);
        jest.clearAllMocks();
    });

    afterEach(() => {
        cleanupTestDir(testDir);
    });

    describe('cloneRepository', () => {
        it('should clone a repository successfully', async () => {
            const gitUrl = 'https://github.com/pandapls/vue3-ts-tailwindcss-element-plug-ui.git';
            const projectName = 'test-project';

            await expect(cloneRepository(gitUrl, projectName)).resolves.toBe(true);
        });

        it('should reject with error for invalid git url', async () => {
            const invalidGitUrl = 'https://github.com/invalid/repo.git';
            const projectName = 'test-project';

            // Mock spawn to return error
            const mockSpawn = require('child_process').spawn;
            mockSpawn.mockImplementationOnce(() => ({
                on: jest.fn().mockImplementation((event, callback) => {
                    if (event === 'close') {
                        callback(128);
                    }
                    return {
                        on: jest.fn()
                    };
                })
            }));

            await expect(cloneRepository(invalidGitUrl, projectName)).rejects.toThrow('git clone 失败，退出码: 128');
        });
    });

    describe('initNewGitRepo', () => {
        it('should initialize a new git repository', async () => {
            const projectDir = join(process.cwd(), testDir);
            await expect(initNewGitRepo(projectDir)).resolves.not.toThrow();
        });
    });

    describe('removeDir', () => {
        it('should remove directory successfully', async () => {
            const dirToRemove = join(process.cwd(), testDir, 'to-remove');
            await expect(removeDir(dirToRemove)).resolves.not.toThrow();
        });

        it('should handle non-existent directory', async () => {
            const nonExistentDir = join(process.cwd(), testDir, 'non-existent');
            await expect(removeDir(nonExistentDir)).resolves.not.toThrow();
        });
    });
}); 