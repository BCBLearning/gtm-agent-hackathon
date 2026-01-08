const DEMO_MODE = process.env.DEMO_MODE === 'true';

async function getArticles() {
    if (DEMO_MODE) {
        return [
            { title: 'TechCorp raises $10M in Series A funding', company: 'TechCorp', link: 'https://techcrunch.com/example1' },
            { title: 'StartupCo announces European expansion with 50 new hires', company: 'StartupCo', link: 'https://techcrunch.com/example2' },
            { title: 'AI Startup InnovateLabs secures $15M funding round', company: 'InnovateLabs', link: 'https://techcrunch.com/example3' }
        ];
    } else {
        // TODO: Production: fetch RSS réel
        return [];
    }
}

module.exports = { getArticles };