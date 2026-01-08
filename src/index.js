require('dotenv').config();
const express = require('express');
const path = require('path');
const { enrichCompany } = require('./services/fullenrich');
const { getArticles } = require('./services/rssService');
const { generateGTMEmail } = require('./utils/emailGenerator');

const app = express();
const PORT = process.env.PORT || 10000;
const DEMO_MODE = process.env.DEMO_MODE === 'true';

console.log(`🚀 GTM-Agent starting | Mode: ${DEMO_MODE ? "Demo" : "Production"}`);

// Public path
const publicPath = path.join(__dirname, '..', 'public');
app.use(express.json());
app.use(express.static(publicPath));

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'healthy', service: 'GTM-Agent-Hackathon', timestamp: new Date().toISOString(), port: PORT, mode: DEMO_MODE ? "Demo" : "Production" });
});

// Hackathon info
app.get('/hackathon-info', (req, res) => {
    res.json({
        project: "GTM-Agent",
        description: "Automated GTM lead detection and enrichment agent",
        mode: DEMO_MODE ? "Demo" : "Production",
        live_demo: "https://gtm-agent-hackathon.onrender.com",
        github_repo: "https://github.com/your-username/gtm-agent-hackathon"
    });
});

// Main API endpoint
app.get('/api/run', async (req, res) => {
    try {
        console.log(`🔄 Executing GTM-Agent | Mode: ${DEMO_MODE ? "Demo" : "Production"}`);

        const articles = await getArticles();
        if (!articles || articles.length === 0) {
            console.log("⚠️ No articles found.");
        }

        const leads = await Promise.all(articles.map(async article => {
            const enriched = await enrichCompany(article.company);
            const lead = {
                company: article.company,
                article_title: article.title,
                article_link: article.link,
                ...enriched,
                detected_at: new Date().toISOString(),
                status: 'Qualified'
            };
            console.log(`Lead detected: ${lead.company} | Contact: ${lead.name || "N/A"} | Mode: ${DEMO_MODE ? "Demo" : "Production"}`);
            return lead;
        }));

        const emails = leads.map(generateGTMEmail);

        res.json({
            success: true,
            message: "GTM Agent executed successfully!",
            mode: DEMO_MODE ? "Demo" : "Production",
            execution_summary: { leads_detected: leads.length, emails_generated: emails.length, execution_time: new Date().toISOString() },
            business_impact: { potential_pipeline: `$${leads.length*10000}/month`, time_saved: `${leads.length*2} hours`, roi: "Infinite ($0 cost)" },
            data: { leads, emails }
        });

    } catch (err) {
        console.error('❌ Error:', err);
        res.status(500).json({ error: err.message });
    }
});

// Root route
app.get('/', (req, res) => res.sendFile(path.join(publicPath, 'dashboard.html')));

// Fallback 404
app.use((req, res) => res.status(404).json({ error: 'Route not found', available_routes: ['/', '/api/run', '/health', '/hackathon-info'] }));

app.listen(PORT, () => {
    console.log(`✅ GTM-Agent started on port ${PORT} | Mode: ${DEMO_MODE ? "Demo" : "Production"}`);
});