#!/usr/bin/env node
import { Command } from "commander";
import colors from "ansi-colors";
import createProject from "./utils/createProject";
const program = new Command();

const printBanner = () => {
    console.log(colors.blue(`
        _   _  ____    _____  _       _____ 
        | \\ | ||  _ \\  / ____|| |     |_   _|
        |  \\| || |_) || |     | |       | |  
        | . \` ||  _ < | |     | |       | |  
        | |\\  || |_) || |____ | |____  _| |_ 
        |_| \\_||____/  \\_____||______||_____|    
    `));
};
printBanner();
program
    .version('1.0.0')
    .description('项目模版脚手架');

program
    .command('create [projectName]')
    .alias('c')
    .description('创建新项目')
    .action(async (projectName: any) => {
        try {
        // 询问和项目创建逻辑
            await createProject(projectName);
        } catch (error: any) {
            if (error.name === 'ExitPromptError') {
                console.log('\n😈操作已取消');

                process.exit(0);
            } else {
                console.error('发生错误:', error);
                process.exit(1);
            };
        }
    });

// 处理信号
process.on('SIGINT', () => {
    console.log('\n😈操作已取消');
    process.exit(0);
});

program.parse(process.argv);