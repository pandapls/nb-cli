#!/usr/bin/env node
import { Command } from "commander";
import { printBanner } from "./banner"
import createCommand from "../commands/create";

const program = new Command();

// 打印横幅
printBanner();

// 设置基本信息
program
    .version('1.0.0')
    .description('项目模版脚手架');

// 注册命令
program
    .command('create [projectName]')
    .alias('c')
    .description('创建新项目')
    .action(createCommand);

// 处理信号
process.on('SIGINT', () => {
    console.log('\n😈操作已取消');
    process.exit(0);
});

program.parse(process.argv); 