const DEMO_MODE = process.env.DEMO_MODE === 'true';
const FULLENRICH_API_KEY = process.env.FULLENRICH_API_KEY;

async function enrichCompany(company) {
    if (DEMO_MODE) {
        return {
            name: 'John Doe',
            title: 'Head of Growth',
            email: `john.doe@${company.toLowerCase()}.com`,
            phone: '+1-555-0100',
            department: 'Marketing',
            enriched_at: new Date().toISOString(),
            source: 'FullEnrich API Simulation',
            credits_used: 0,
            note: 'Demo mode - Production: replace with real API call'
        };
    } else {
        // TODO: Production: call FullEnrich API
        return {};
    }
}

module.exports = { enrichCompany };