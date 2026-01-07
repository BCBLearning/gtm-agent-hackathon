 // Serveur principal

 const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Route principale : Exécute l'agent GTM
app.get('/api/run', async (req, res) => {
  try {
    // 1. Récupérer les actualités
    const articles = await fetchRSS();
    
    // 2. Filtrer les articles pertinents
    const relevant = filterArticles(articles);
    
    // 3. Enrichir avec FullEnrich
    const leads = await enrichLeads(relevant);
    
    // 4. Sauvegarder et générer emails
    const results = processLeads(leads);
    
    res.json({
      success: true,
      leads: leads.length,
      message: `✅ ${leads.length} leads qualifiés`,
      data: results
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Dashboard web
app.get('/dashboard', (req, res) => {
  res.sendFile(__dirname + '/public/dashboard.html');
});

app.listen(PORT, () => {
  console.log(`🚀 GTM-Agent en ligne: http://localhost:${PORT}`);
});

// Fonctions principales
async function fetchRSS() {
  const response = await fetch('https://techcrunch.com/feed/');
  const text = await response.text();
  // Parser le XML (simplifié pour l'exemple)
  return [{ title: 'Startup raises $10M', company: 'StartupCo' }];
}

function filterArticles(articles) {
  return articles.filter(article => 
    /funding|raised|expansion|hiring/i.test(article.title)
  );
}

async function enrichLeads(articles) {
  const leads = [];
  for (const article of articles) {
    // Mode démo ou vraie API FullEnrich
    const enriched = process.env.FULLENRICH_API 
      ? await callFullEnrichAPI(article.company)
      : simulateFullEnrich(article.company);
    
    leads.push({ ...article, ...enriched });
  }
  return leads;
}

function simulateFullEnrich(company) {
  return {
    email: `contact@${company.toLowerCase().replace(/\s/g, '')}.com`,
    name: 'Alex Martin',
    title: 'Head of Growth',
    phone: '+33123456789'
  };
}

async function callFullEnrichAPI(company) {
  const response = await fetch(
    `https://app.fullenrich.com/api/v1/company/search?name=${company}`,
    {
      headers: { Authorization: `Bearer ${process.env.FULLENRICH_API}` }
    }
  );
  return await response.json();
}