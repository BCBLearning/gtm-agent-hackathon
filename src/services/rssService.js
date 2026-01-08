const fetch = require('node-fetch');
const xml2js = require('xml2js');
const DEMO_MODE = process.env.DEMO_MODE === 'true';

/**
 * Extraction simple du nom de l'entreprise depuis le titre de l'article
 * Exemple: "TechCorp raises $10M in Series A funding" => "TechCorp"
 */
function extractCompanyName(title) {
    // On prend le premier mot avant espace ou mot "raises"
    const match = title.match(/^([\w\-]+)/);
    return match ? match[1] : "Unknown";
}

async function getArticles() {
    if (DEMO_MODE) {
        // Version démo
        return [
            { title: 'TechCorp raises $10M in Series A funding', company: 'TechCorp', link: 'https://techcrunch.com/example1' },
            { title: 'StartupCo announces European expansion with 50 new hires', company: 'StartupCo', link: 'https://techcrunch.com/example2' },
            { title: 'AI Startup InnovateLabs secures $15M funding round', company: 'InnovateLabs', link: 'https://techcrunch.com/example3' }
        ];
    } else {
        // Version production : RSS réel
        const rssUrls = [
            'https://techcrunch.com/feed/',
            'https://thenextweb.com/feed/'
        ];
        let articles = [];

        for (let url of rssUrls) {
            try {
                const response = await fetch(url);
                const xml = await response.text();
                const parsed = await xml2js.parseStringPromise(xml);
                const items = parsed.rss.channel[0].item;
                articles.push(...items.map(item => ({
                    title: item.title[0],
                    link: item.link[0],
                    company: extractCompanyName(item.title[0])
                })));
            } catch (err) {
                console.error(`❌ Failed to fetch RSS from ${url}:`, err.message);
            }
        }

        return articles;
    }
}

module.exports = { getArticles };