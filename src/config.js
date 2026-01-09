let config = {
    demoMode: process.env.DEMO_MODE === 'true',
    rssFeeds: process.env.RSS_FEEDS ? process.env.RSS_FEEDS.split(',') : [],
    keywords: process.env.KEYWORDS ? process.env.KEYWORDS.split(',') : ['funding','raised','expansion','hiring','growth','investment','series'],
    fullenrichApiKey: process.env.FULLENRICH_API || ''
};

function getConfig() {
    return config;
}

function updateConfig(newConfig) {
    config = { ...config, ...newConfig };
    console.log('⚙️ Updated configuration:', config);
}

module.exports = { getConfig, updateConfig };