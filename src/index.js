const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 10000; // ← CHANGÉ ICI

// CHEMIN ABSOLU POUR PUBLIC (CRITIQUE)
const publicPath = path.join(__dirname, '..', 'public');
console.log(`📁 Public path: ${publicPath}`);

// Middleware
app.use(express.json());
app.use(express.static(publicPath));

// ROUTE DE SANTÉ POUR RENDER (NOUVELLE)
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'GTM-Agent-Hackathon',
    timestamp: new Date().toISOString(),
    port: PORT,
    public_path: publicPath
  });
});

// SIMULATION FullEnrich (remplacez par vos services)
function simulateFullEnrich(company) {
  return {
    email: `contact@${company.toLowerCase().replace(/\s/g, '')}.com`,
    name: 'Alex Martin',
    title: 'Head of Growth',
    phone: '+33123456789'
  };
}

// ROUTE API PRINCIPALE
app.get('/api/run', async (req, res) => {
  try {
    console.log('🚀 GTM-Agent starting...');
    
    // SIMULATION données (remplacez par vos services)
    const articles = [
      { 
        title: 'TechCorp raises $10M in Series A funding', 
        company: 'TechCorp',
        link: 'https://example.com/1'
      },
      { 
        title: 'StartupCo announces European expansion with 50 new hires', 
        company: 'StartupCo',
        link: 'https://example.com/2'
      }
    ];
    
    // FILTRAGE
    const keywords = ['funding', 'raised', 'expansion', 'hiring', 'growth'];
    const relevant = articles.filter(article =>
      keywords.some(keyword => article.title.toLowerCase().includes(keyword))
    );
    
    // ENRICHISSEMENT
    const leads = relevant.map(article => ({
      company: article.company,
      article_title: article.title,
      article_link: article.link,
      ...simulateFullEnrich(article.company),
      detected_at: new Date().toISOString(),
      status: 'Qualifié',
      fullenrich_used: false,
      note: 'API FullEnrich intégrée - mode démo pour hackathon'
    }));
    
    // RÉPONSE
    res.json({
      success: true,
      message: `✅ ${leads.length} leads qualifiés détectés`,
      timestamp: new Date().toISOString(),
      data: leads
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({
      error: error.message,
      note: 'Vérifiez la structure des services dans src/'
    });
  }
});

// ROUTE RACINE - POINTE VERS DASHBOARD
app.get('/', (req, res) => {
  const dashboardPath = path.join(publicPath, 'dashboard.html');
  console.log(`📄 Serving dashboard from: ${dashboardPath}`);
  res.sendFile(dashboardPath);
});

// ROUTE FALLBACK
app.use((req, res) => {
  res.status(404).json({
    error: 'Route non trouvée',
    available_routes: ['/', '/api/run', '/dashboard.html', '/health']
  });
});

// DÉMARRAGE
app.listen(PORT, () => {
  console.log(`
✅ GTM-Agent démarré avec succès !
📍 Structure: src/ + public/
🔌 Port: ${PORT}
📁 Public path: ${publicPath}
🌐 Prêt sur Render!
  `);
});