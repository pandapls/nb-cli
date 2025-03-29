import inquirer from "inquirer";
import colors from "ansi-colors";
import oraSpinner from 'ora';
import { projectTypeList } from "./constant";
import path from "path";
import { cloneRepository, initNewGitRepo, removeDir } from "./git";
import fs from "fs";
// 创建项目的主函数
async function createProject(projectName: string) {

    // 如果没有提供项目名称，则询问用户
    if (!projectName) {
        const { inputProjectName } = await inquirer.prompt([
            {
                type: 'input',
                name: 'inputProjectName',
                message: '请输入项目名称:',
                validate: (input: string) => input.trim() !== '' || '项目名称不能为空'
            }
        ]);
        projectName = inputProjectName;
    }

    // 询问项目类型
    const { projectType } = await inquirer.prompt([
        {
            type: 'list',
            name: 'projectType',
            message: '请选择项目模板:',
            choices: projectTypeList.map(item => ({
                name: `${item.name}`,
                value: item.value
            }))
        }
    ]);
    // 确认信息
    console.log('\n');
    console.log('✅ 项目信息确认:');
    console.log('------------------------');
    console.log(`📁 项目名称: ${colors.green(projectName)}`);
    console.log(`🔖 项目类型: ${colors.green(projectTypeList.find(item => item.value === projectType)?.name || '未知')}`);
    console.log('------------------------');

    const { confirmCreate } = await inquirer.prompt([
        {
            type: 'confirm',
            name: 'confirmCreate',
            message: '确认创建项目?',
            default: true
        }
    ]);

    if (!confirmCreate) {
        console.log(colors.yellow('已取消项目创建'));
        process.exit(0);
    }
    // 开始创建项目
    const spinner = oraSpinner({ text: '初始化项目...' });
    spinner.start();
    const projectDir = path.join(process.cwd(), projectName);

    // 模拟项目创建流程
    try {
        const selectedTemplate = projectTypeList.find(item => item.value === projectType);
        if (!selectedTemplate || !selectedTemplate.gitUrl) {
            spinner.fail('无效的项目模板');
            process.exit(1);
        }

        // git clone逻辑
        spinner.text = '正在下载模板...';
        try {
            await cloneRepository(selectedTemplate.gitUrl, projectName);
            const gitFolder = path.join(projectDir, '.git');
            if (fs.existsSync(gitFolder)) {
                await removeDir(gitFolder);
            }
            // 初始化新的 git 仓库（可选）
            await initNewGitRepo(projectDir);
        } catch (error) {
            spinner.fail('模板下载失败');
            console.error(error);
            process.exit(1);
        }
        spinner.succeed('项目创建成功!');

        console.log('\n');
        console.log(colors.green('✨ 项目已成功创建!'));
        console.log('\n使用以下命令或者项目中的md文档启动开发:');
        console.log(colors.cyan(`  cd ${projectName}`));
        console.log(colors.cyan('  npm install'));
        console.log(colors.cyan('  npm run dev'));
        process.exit(0);
    } catch (error) {
        spinner.fail('项目创建失败');
        console.error(error);
        process.exit(1);
    }
}

export default createProject;
