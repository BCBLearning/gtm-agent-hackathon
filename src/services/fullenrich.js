const fetch = require('node-fetch');

/**
 * Enrichit une entreprise via FullEnrich API ou génère des données factices
 */
async function enrichCompany(company) {
    const API_KEY = process.env.FULLENRICH_API;
    
    // Si pas de clé API, utiliser des données factices basées sur le nom de l'entreprise
    if (!API_KEY || API_KEY === 'your_fullenrich_api_key_here') {
        console.log(`🎭 Using mock data for: ${company}`);
        return generateMockContact(company);
    }

    try {
        // Code API FullEnrich existant...
        const postResp = await fetch('https://api.fullenrich.com/v1/contacts/enrich', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ contacts: [{ company_name: company }] })
        });

        if (!postResp.ok) {
            console.warn(`⚠️ FullEnrich POST error: ${postResp.status} ${postResp.statusText}`);
            return generateMockContact(company);
        }

        const postData = await postResp.json();
        const enrichmentId = postData?.contacts?.[0]?.id;
        if (!enrichmentId) {
            console.warn("⚠️ No enrichment ID returned, using mock contact");
            return generateMockContact(company);
        }

        const getResp = await fetch(`https://api.fullenrich.com/v1/contacts/result/${enrichmentId}`, {
            headers: { 'Authorization': `Bearer ${API_KEY}` }
        });

        if (!getResp.ok) {
            console.warn(`⚠️ FullEnrich GET error: ${getResp.status} ${postResp.statusText}`);
            return generateMockContact(company);
        }

        const resultData = await getResp.json();
        const contact = resultData.contact;

        if (!contact) return generateMockContact(company);

        return {
            name: contact.name || 'Unknown',
            title: contact.title || 'N/A',
            email: contact.email || 'unknown@example.com',
            phone: contact.phone || 'N/A',
            department: contact.department || 'N/A'
        };

    } catch (err) {
        console.error('❌ FullEnrich fetch failed:', err.message);
        return generateMockContact(company);
    }
}

/**
 * Génère des contacts factices réalistes basés sur le nom de l'entreprise
 */
function generateMockContact(company) {
    // Base de données de contacts factices pour des entreprises connues
    const mockContacts = {
        'Cyera': {
            name: 'Yair Cohen',
            title: 'CEO & Co-founder',
            email: 'yair@cyera.com',
            phone: '+1-555-0100',
            department: 'Executive'
        },
        'Rio Tinto': {
            name: 'Jakob Stausholm',
            title: 'CEO',
            email: 'jakob.stausholm@riotinto.com',
            phone: '+44-20-7781-2000',
            department: 'Executive'
        },
        'Glencore': {
            name: 'Gary Nagle',
            title: 'CEO',
            email: 'gary.nagle@glencore.com',
            phone: '+41-41-709-2000',
            department: 'Executive'
        },
        'Intel': {
            name: 'Pat Gelsinger',
            title: 'CEO',
            email: 'pat.gelsinger@intel.com',
            phone: '+1-408-765-8080',
            department: 'Executive'
        },
        'Apple': {
            name: 'Tim Cook',
            title: 'CEO',
            email: 'tim.cook@apple.com',
            phone: '+1-408-996-1010',
            department: 'Executive'
        },
        'Google': {
            name: 'Sundar Pichai',
            title: 'CEO',
            email: 'sundar@google.com',
            phone: '+1-650-253-0000',
            department: 'Executive'
        },
        'Microsoft': {
            name: 'Satya Nadella',
            title: 'CEO',
            email: 'satya.nadella@microsoft.com',
            phone: '+1-425-882-8080',
            department: 'Executive'
        },
        'Amazon': {
            name: 'Andy Jassy',
            title: 'CEO',
            email: 'ajassy@amazon.com',
            phone: '+1-206-266-1000',
            department: 'Executive'
        }
    };
    
    // Chercher une correspondance exacte ou partielle
    for (const [key, contact] of Object.entries(mockContacts)) {
        if (company.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(company.toLowerCase())) {
            return contact;
        }
    }
    
    // Si l'entreprise contient des mots comme "startup", "tech", "software", etc.
    const lowerCompany = company.toLowerCase();
    let department = 'Business Development';
    let title = 'Business Development Manager';
    
    if (lowerCompany.includes('tech') || lowerCompany.includes('software')) {
        department = 'Technology';
        title = 'CTO';
    } else if (lowerCompany.includes('finance') || lowerCompany.includes('bank')) {
        department = 'Finance';
        title = 'CFO';
    } else if (lowerCompany.includes('health') || lowerCompany.includes('medical')) {
        department = 'Healthcare';
        title = 'Head of Business Development';
    }
    
    // Fallback générique avec un nom réaliste
    const firstNames = ['Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Avery', 'Quinn'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis'];
    
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    
    // Créer un email plausible
    const emailDomain = company.toLowerCase()
        .replace(/\s+/g, '')
        .replace(/[^a-z0-9]/g, '') + '.com';
    
    return {
        name: `${firstName} ${lastName}`,
        title: title,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${emailDomain}`,
        phone: `+1-555-${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}`,
        department: department
    };
}

module.exports = { enrichCompany };