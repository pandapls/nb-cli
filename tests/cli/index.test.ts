import { Command } from 'commander';
import { printBanner } from '../../src/cli/banner';
import createCommand from '../../src/commands/create';

jest.mock('commander', () => {
    const mockCommand = {
        version: jest.fn().mockReturnThis(),
        description: jest.fn().mockReturnThis(),
        command: jest.fn().mockReturnThis(),
        alias: jest.fn().mockReturnThis(),
        action: jest.fn().mockReturnThis(),
        parse: jest.fn()
    };
    return {
        Command: jest.fn(() => mockCommand)
    };
});

jest.mock('../../src/cli/banner');
jest.mock('../../src/commands/create');

describe('CLI Entry', () => {
    let mockProgram: any;

    beforeEach(() => {
        jest.clearAllMocks();
        mockProgram = new Command();
    });

    it('should initialize CLI with correct configuration', () => {
        require('../../src/cli/index');

        expect(printBanner).toHaveBeenCalled();
        expect(mockProgram.version).toHaveBeenCalledWith('1.0.0');
        expect(mockProgram.description).toHaveBeenCalledWith('项目模版脚手架');

        // 验证命令注册
        expect(mockProgram.command).toHaveBeenCalledWith('create [projectName]');
        expect(mockProgram.alias).toHaveBeenCalledWith('c');
        expect(mockProgram.description).toHaveBeenCalledWith('创建新项目');
        expect(mockProgram.action).toHaveBeenCalledWith(createCommand);
    });

    it('should handle SIGINT signal', () => {
        const mockExit = jest.spyOn(process, 'exit').mockImplementation();
        const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation();

        require('../../src/cli/index');

        // 模拟 SIGINT 信号
        process.emit('SIGINT');

        expect(mockConsoleLog).toHaveBeenCalledWith('\n😈操作已取消');
        expect(mockExit).toHaveBeenCalledWith(0);

        mockExit.mockRestore();
        mockConsoleLog.mockRestore();
    });
}); 