import createCommand from '../../src/commands/create';
import { cloneRepository, initNewGitRepo, removeDir } from '../../src/utils/git';
import inquirer from 'inquirer';
import { createTestDir, cleanupTestDir, mockFileSystem } from '../utils/testHelpers';
import { join } from 'path';
import { existsSync } from 'fs';
import { projectTypeList } from '../../src/templates/config';

// 正确的 mock 方式
jest.mock('inquirer', () => ({
    prompt: jest.fn()
}));
jest.mock('../../src/utils/git');
jest.mock('fs');

describe('Create Command', () => {
    const testDir = 'test-temp';
    const mockProjectName = 'test-project';
    const mockProjectType = '1'; // 使用有效的项目类型值

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

    it('should create a project successfully', async () => {
        // Mock inquirer prompts
        const mockPrompt = (inquirer.prompt as unknown) as jest.Mock;
        mockPrompt
            .mockResolvedValueOnce({ projectType: mockProjectType })
            .mockResolvedValueOnce({ confirmCreate: true });

        // Mock git functions
        (cloneRepository as jest.Mock).mockResolvedValue(true);
        (initNewGitRepo as jest.Mock).mockResolvedValue(true);
        (removeDir as jest.Mock).mockResolvedValue(true);
        (existsSync as jest.Mock).mockReturnValue(true);

        await createCommand(mockProjectName);

        expect(inquirer.prompt).toHaveBeenCalledTimes(2);
        expect(cloneRepository).toHaveBeenCalledWith(
            expect.any(String),
            mockProjectName
        );
        expect(initNewGitRepo).toHaveBeenCalledWith(
            join(process.cwd(), mockProjectName)
        );
    });

    it('should handle project creation cancellation', async () => {
        // Mock inquirer prompts
        const mockPrompt = (inquirer.prompt as unknown) as jest.Mock;
        mockPrompt
            .mockResolvedValueOnce({ projectType: mockProjectType })
            .mockResolvedValueOnce({ confirmCreate: false });

        await createCommand(mockProjectName);

        expect(inquirer.prompt).toHaveBeenCalledTimes(2);
        expect(cloneRepository).not.toHaveBeenCalled();
    });

    it('should handle empty project name at command line', async () => {
        // 使用空字符串作为项目名
        const emptyName = ' '; // 使用一个空格，创建函数内部会调用 trim()

        try {
            await createCommand(emptyName);
            fail('应该抛出错误但没有'); // 如果到达这里，测试应该失败
        } catch (error: any) {
            expect(error.message).toBe('项目名称不能为空');
        }
    });

    it('should prompt for project name if not provided', async () => {
        // 当未提供项目名时，会提示用户输入
        const mockPrompt = (inquirer.prompt as unknown) as jest.Mock;

        // 第一个提示会询问项目名称
        mockPrompt.mockResolvedValueOnce({ inputProjectName: mockProjectName });
        // 后续提示
        mockPrompt.mockResolvedValueOnce({ projectType: mockProjectType });
        mockPrompt.mockResolvedValueOnce({ confirmCreate: true });

        // Mock git functions
        (cloneRepository as jest.Mock).mockResolvedValue(true);
        (initNewGitRepo as jest.Mock).mockResolvedValue(true);
        (removeDir as jest.Mock).mockResolvedValue(true);
        (existsSync as jest.Mock).mockReturnValue(true);

        await createCommand(''); // 传入空字符串触发提示

        expect(inquirer.prompt).toHaveBeenCalledTimes(3); // 应该有3次提示
    });

    it('should handle invalid template selection', async () => {
        // 首先需要设置 prompt mock
        const mockPrompt = (inquirer.prompt as unknown) as jest.Mock;

        // 返回一个无效的项目类型
        mockPrompt.mockResolvedValueOnce({ projectType: 'invalid-type' });
        mockPrompt.mockResolvedValueOnce({ confirmCreate: true });

        // Mock existsSync
        (existsSync as jest.Mock).mockReturnValue(false);

        try {
            await createCommand(mockProjectName);
            fail('应该抛出错误但没有'); // 如果到达这里，测试应该失败
        } catch (error: any) {
            expect(error.message).toBe('无效的项目模板');
        }
    });

    it('should handle git clone failure', async () => {
        // Mock inquirer prompts
        const mockPrompt = (inquirer.prompt as unknown) as jest.Mock;
        mockPrompt
            .mockResolvedValueOnce({ projectType: mockProjectType })
            .mockResolvedValueOnce({ confirmCreate: true });

        // Mock git functions
        (cloneRepository as jest.Mock).mockRejectedValue(new Error('git clone 失败'));
        (existsSync as jest.Mock).mockReturnValue(false);

        try {
            await createCommand(mockProjectName);
            fail('应该抛出错误但没有'); // 如果到达这里，测试应该失败
        } catch (error: any) {
            expect(error.message).toBe('git clone 失败');
        }
    });

    it('should handle git directory removal failure', async () => {
        // Mock inquirer prompts
        const mockPrompt = (inquirer.prompt as unknown) as jest.Mock;
        mockPrompt
            .mockResolvedValueOnce({ projectType: mockProjectType })
            .mockResolvedValueOnce({ confirmCreate: true });

        // Mock git functions
        (cloneRepository as jest.Mock).mockResolvedValue(true);
        (removeDir as jest.Mock).mockRejectedValue(new Error('删除目录失败'));
        (existsSync as jest.Mock).mockReturnValue(true);

        try {
            await createCommand(mockProjectName);
            fail('应该抛出错误但没有'); // 如果到达这里，测试应该失败
        } catch (error: any) {
            expect(error.message).toBe('删除目录失败');
        }
    });

    it('should handle non-existent directory', async () => {
        // Mock inquirer prompts
        const mockPrompt = (inquirer.prompt as unknown) as jest.Mock;
        mockPrompt
            .mockResolvedValueOnce({ projectType: mockProjectType })
            .mockResolvedValueOnce({ confirmCreate: true });

        // Mock git functions
        (cloneRepository as jest.Mock).mockResolvedValue(true);
        (existsSync as jest.Mock).mockReturnValue(false);

        await createCommand(mockProjectName);

        expect(removeDir).not.toHaveBeenCalled();
    });
}); 