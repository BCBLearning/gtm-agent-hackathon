const fetch = require('node-fetch');
const DEMO_MODE = process.env.DEMO_MODE === 'true';
const FULLENRICH_API_KEY = process.env.FULLENRICH_API_KEY;

async function enrichCompany(company) {
    if (DEMO_MODE) {
        // Mode démo
        const templates = [
            { name: "John Doe", title: "Head of Growth", email: `john.doe@${company.toLowerCase()}.com`, phone: "+1-555-0100", department: "Marketing" },
            { name: "Jane Smith", title: "VP Sales", email: `jane.smith@${company.toLowerCase()}.com`, phone: "+1-555-0101", department: "Sales" },
            { name: "Alice Lee", title: "Chief Revenue Officer", email: `alice@${company.toLowerCase()}.com`, phone: "+1-555-0102", department: "Executive" }
        ];
        const template = templates[Math.floor(Math.random() * templates.length)];
        return {
            ...template,
            enriched_at: new Date().toISOString(),
            source: "FullEnrich API Simulation",
            credits_used: 0,
            note: "Demo mode - Production: replace with real API call"
        };
    } else {
        // Mode production
        if (!FULLENRICH_API_KEY) {
            console.error("❌ FULLENRICH_API_KEY is not defined in environment variables");
            return {};
        }

        try {
            const response = await fetch(`https://app.fullenrich.com/api/v1/company/search?name=${encodeURIComponent(company)}`, {
                headers: { Authorization: `Bearer ${FULLENRICH_API_KEY}` }
            });

            const data = await response.json();
            if (data && data.contacts && data.contacts.length > 0) {
                const contact = data.contacts[0];
                return {
                    name: contact.name,
                    title: contact.title,
                    email: contact.email,
                    phone: contact.phone,
                    department: contact.department,
                    enriched_at: new Date().toISOString(),
                    source: "FullEnrich API",
                    credits_used: 1
                };
            } else {
                return {
                    name: "Unknown",
                    title: "Unknown",
                    email: "unknown@example.com",
                    phone: "",
                    department: "",
                    enriched_at: new Date().toISOString(),
                    source: "FullEnrich API",
                    credits_used: 0,
                    note: "No contacts found"
                };
            }
        } catch (err) {
            console.error(`❌ FullEnrich API error for company ${company}:`, err.message);
            return {};
        }
    }
}

module.exports = { enrichCompany };