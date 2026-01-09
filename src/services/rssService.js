const Parser = require('rss-parser');
const parser = new Parser();

async function getArticles(feeds) {
    const articles = [];
    
    console.log(`📡 Fetching ${feeds.length} RSS feeds...`);
    
    for (const feed of feeds) {
        try {
            console.log(`🔗 Fetching: ${feed}`);
            const feedData = await parser.parseURL(feed);
            console.log(`✅ Found ${feedData.items?.length || 0} items in ${feed}`);

            feedData.items.forEach(item => {
                const title = item.title || '';
                
                // Logique améliorée pour extraire le nom de l'entreprise
                let company = extractCompanyFromTitle(title);
                
                articles.push({
                    title: title,
                    link: item.link || '#',
                    company: company,
                    pubDate: item.pubDate || new Date().toISOString(),
                    contentSnippet: item.contentSnippet || ''
                });
            });
        } catch (err) {
            console.error(`❌ RSS feed error (${feed}):`, err.message);
        }
    }

    console.log(`📄 Total articles fetched: ${articles.length}`);
    return articles;
}

/**
 * Fonction améliorée pour extraire le nom de l'entreprise depuis un titre
 */
function extractCompanyFromTitle(title) {
    if (!title) return 'Unknown Company';
    
    const lowerTitle = title.toLowerCase();
    
    // Liste de mots à ignorer (mots communs qui ne sont pas des noms d'entreprise)
    const stopWords = [
        'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 
        'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
        'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should',
        'can', 'could', 'may', 'might', 'must', 'shall', 'that', 'which', 'who',
        'whom', 'what', 'where', 'when', 'why', 'how', 'this', 'that', 'these',
        'those', 'from', 'into', 'during', 'including', 'until', 'against',
        'among', 'throughout', 'despite', 'towards', 'upon', 'about'
    ];
    
    // Patterns pour trouver des noms d'entreprise
    // 1. Chercher des noms propres (mots avec majuscules)
    const words = title.split(' ');
    let potentialCompanies = [];
    
    for (let i = 0; i < words.length; i++) {
        const word = words[i].replace(/[^a-zA-Z0-9&\.-]/g, '');
        
        // Un nom d'entreprise potentiel :
        // - Commence par une majuscule
        // - A au moins 2 caractères
        // - N'est pas un mot de stop
        // - Ne contient pas seulement des chiffres
        if (word.length >= 2 && 
            /^[A-Z][a-zA-Z0-9&\.-]*$/.test(word) &&
            !stopWords.includes(word.toLowerCase()) &&
            !/^\d+$/.test(word)) {
            
            // Vérifier les cas spéciaux
            // Éviter les mots comme "Startup", "Company", "Corp", etc. en position isolée
            const commonBusinessWords = ['startup', 'company', 'corp', 'inc', 'ltd', 'co', 'llc', 'group'];
            if (!commonBusinessWords.includes(word.toLowerCase())) {
                potentialCompanies.push(word);
            }
        }
    }
    
    // 2. Chercher des patterns spécifiques
    const patterns = [
        // Pattern: [Company] raises/raises/announces
        /([A-Z][a-zA-Z0-9&\.-]+)\s+(?:raises|raised|announces|launches|acquires|partners)/i,
        // Pattern: [Company] and [Company] 
        /([A-Z][a-zA-Z0-9&\.-]+)\s+and\s+[A-Z]/i,
        // Pattern: startup [Company]
        /startup\s+([A-Z][a-zA-Z0-9&\.-]+)/i,
        // Pattern: [Company] stock/valuation
        /([A-Z][a-zA-Z0-9&\.-]+)\s+(?:stock|valuation|shares)/i,
        // Pattern: [Company] CEO
        /([A-Z][a-zA-Z0-9&\.-]+)\s+CEO/i
    ];
    
    for (const pattern of patterns) {
        const match = title.match(pattern);
        if (match && match[1]) {
            return match[1];
        }
    }
    
    // 3. Si on a trouvé des entreprises potentielles, prendre la première
    if (potentialCompanies.length > 0) {
        // Essayer de trouver le mot le plus long (souvent plus spécifique)
        const longest = potentialCompanies.reduce((a, b) => a.length > b.length ? a : b);
        return longest;
    }
    
    // 4. Fallback: premier mot substantif du titre
    for (let i = 0; i < words.length; i++) {
        const word = words[i].replace(/[^a-zA-Z0-9&\.-]/g, '');
        if (word.length >= 2 && !stopWords.includes(word.toLowerCase())) {
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        }
    }
    
    return 'Unknown Company';
}

module.exports = { getArticles, extractCompanyFromTitle };