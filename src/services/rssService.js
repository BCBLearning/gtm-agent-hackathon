// Service // src/services/rssService.js
require('dotenv').config();
const fetch = require('node-fetch');
const DEMO_MODE = process.env.DEMO_MODE === 'true';

/**
 * Fetch articles from RSS feeds
 * Returns demo articles if DEMO_MODE=true
 */
async function getArticles() {
    if (DEMO_MODE) {
        return [
            { title: 'TechCorp raises $10M in Series A funding', company: 'TechCorp', link: 'https://techcrunch.com/example1' },
            { title: 'StartupCo announces European expansion with 50 new hires', company: 'StartupCo', link: 'https://techcrunch.com/example2' },
            { title: 'AI Startup InnovateLabs secures $15M funding round', company: 'InnovateLabs', link: 'https://techcrunch.com/example3' }
        ];
    }

    // Example for production: parse real RSS feeds (xml parsing required)
    const rssUrls = [
        'https://techcrunch.com/feed/',
        'https://www.forbes.com/tech/feed/'
    ];

    let articles = [];
    for (let url of rssUrls) {
        const res = await fetch(url);
        const xml = await res.text();
        // TODO: parse XML with xml2js or rss-parser
        // Example: extract title, company, link
    }

    return articles;
}

module.exports = { getArticles };