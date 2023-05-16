export const stripSystem = (system: string) => {
    return system.split('-').slice(0, 2).join('-');
}
