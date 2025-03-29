import { spawn } from 'child_process';

export async function cloneRepository(gitUrl: string, projectName: string) {
    return new Promise((resolve, reject) => {
        const process = spawn('git', ['clone', gitUrl, projectName]);

        process.on('close', (code: number) => {
            if (code === 0) {
                resolve(true);
            } else {
                reject(new Error(`git clone 失败，退出码: ${code}`));
            }
        });

        process.on('error', (err: any) => {
            reject(err);
        });
    });
}


// 递归删除目录
export function removeDir(dir: string): Promise<void> {
    return new Promise((resolve, reject) => {
        if (process.platform === 'win32') {
            // Windows平台使用 rd 命令
            spawn('rd', ['/s', '/q', dir]).on('close', (code: number) => {
                if (code === 0) resolve();
                else reject(new Error(`无法删除目录 ${dir}`));
            });
        } else {
            // Unix平台使用 rm 命令
            spawn('rm', ['-rf', dir]).on('close', (code: number) => {
                if (code === 0) resolve();
                else reject(new Error(`无法删除目录 ${dir}`));
            });
        }
    });
}

// 初始化新的 Git 仓库
export function initNewGitRepo(projectDir: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const process = spawn('git', ['init'], { cwd: projectDir });

        process.on('close', (code: number) => {
            if (code === 0) {
                resolve();
            } else {
                reject(new Error(`Git init 失败，退出码: ${code}`));
            }
        });
    });
}