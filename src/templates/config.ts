export interface TemplateConfig {
    name: string;
    value: string;
    gitUrl: string;
    description: string;
}

export const projectTypeList: TemplateConfig[] = [
    {
        name: 'Vue3-TypeScript-TailwindCSS-ElementPlus',
        value: '1',
        gitUrl: 'git@github.com:pandapls/vue3-ts-tailwindcss-element-plug-ui.git',
        description: 'Vue3 + TypeScript + TailwindCSS + Element Plus 项目模板'
    },
    {
        name: 'React-TypeScript-TailwindCSS-ShadcnUI',
        value: '2',
        gitUrl: 'git@github.com:pandapls/react-ts-tailwindcss-shadcnUI.git',
        description: 'React + TypeScript + TailwindCSS + ShadcnUI 项目模板'
    },
    {
        name: 'Monorepo-Turborepo',
        value: '3',
        gitUrl: 'git@github.com:pandapls/monorepo-template.git',
        description: 'Monorepo + Turborepo + TypeScript  项目模板'
    }
]; 