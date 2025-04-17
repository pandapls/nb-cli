import { projectTypeList, TemplateConfig } from '../../src/templates/config';

describe('Template Configuration', () => {
    it('should have valid template configurations', () => {
        expect(projectTypeList).toBeInstanceOf(Array);
        expect(projectTypeList.length).toBeGreaterThan(0);

        projectTypeList.forEach((template: TemplateConfig) => {
            expect(template).toHaveProperty('name');
            expect(template).toHaveProperty('value');
            expect(template).toHaveProperty('gitUrl');
            expect(template).toHaveProperty('description');

            expect(typeof template.name).toBe('string');
            expect(typeof template.value).toBe('string');
            expect(typeof template.gitUrl).toBe('string');
            expect(typeof template.description).toBe('string');

            expect(template.name.length).toBeGreaterThan(0);
            expect(template.value.length).toBeGreaterThan(0);
            expect(template.gitUrl.length).toBeGreaterThan(0);
            expect(template.description.length).toBeGreaterThan(0);
        });
    });

    it('should have unique template values', () => {
        const values = projectTypeList.map(template => template.value);
        const uniqueValues = new Set(values);

        expect(values.length).toBe(uniqueValues.size);
    });

    it('should have valid git URLs', () => {
        projectTypeList.forEach((template: TemplateConfig) => {
            expect(template.gitUrl).toMatch(/^git@github\.com:.+\.git$/);
        });
    });
}); 