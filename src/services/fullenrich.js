// Service // src/services/fullenrich.js
require('dotenv').config();
const fetch = require('node-fetch');

const DEMO_MODE = process.env.DEMO_MODE === 'true';
const FULLENRICH_API_KEY = process.env.FULLENRICH_API_KEY;

/**
 * Enrich a company with FullEnrich API
 * Returns demo data if DEMO_MODE=true
 */
async function enrichCompany(companyName) {
    if (DEMO_MODE) {
        // Simulated response for hackathon
        const templates = [
            { name: "Alex Johnson", title: "Head of Growth", email: `alex.johnson@${companyName.toLowerCase()}.com`, phone: "+1-555-0123", department: "Marketing" },
            { name: "Sarah Miller", title: "VP of Business Development", email: `sarah.miller@${companyName.toLowerCase()}.com`, phone: "+1-555-0124", department: "Sales" },
            { name: "Marcus Chen", title: "Chief Revenue Officer", email: `marcus@${companyName.toLowerCase()}.com`, phone: "+1-555-0125", department: "Executive" }
        ];
        const template = templates[Math.floor(Math.random() * templates.length)];
        return {
            ...template,
            enriched_at: new Date().toISOString(),
            source: "FullEnrich API Simulation",
            credits_used: 0,
            note: "Demo mode - Production: replace with real API call"
        };
    }

    if (!FULLENRICH_API_KEY) {
        throw new Error("FULLENRICH_API_KEY missing");
    }

    // Real FullEnrich API request (production)
    const url = `https://app.fullenrich.com/api/v1/company/search?name=${encodeURIComponent(companyName)}`;
    const res = await fetch(url, {
        headers: { "Authorization": `Bearer ${FULLENRICH_API_KEY}` }
    });

    if (!res.ok) throw new Error(`FullEnrich API error: ${res.statusText}`);
    const data = await res.json();
    return data;
}

module.exports = { enrichCompany };