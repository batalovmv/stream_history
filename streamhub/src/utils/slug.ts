export function slugify(input: string): string {
    return input
        .trim()
        .toLowerCase()
        .replace(/['’"]/g, '')           // убрать кавычки
        .replace(/[^a-z0-9]+/gi, '-')    // всё негодное -> дефис
        .replace(/-+/g, '-')             // схлопнуть дефисы
        .replace(/^-|-$/g, '')           // обрезать по краям
}
