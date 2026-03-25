const API_BASE = 'http://localhost:3001/api/v1';

class MockApi {
    constructor() {
        this.metrics = {};
        this.alerts = [];
        this.insights = [];
        this.rules = [];
        this.flows = {};
        this.listeners = new Set();
        
        // Initial fetch
        this.fetchData();
        
        // Poll every 2.5s for real-time dashboard updates
        setInterval(() => this.fetchData(), 2500);
    }

    async fetchData() {
        try {
            const [metricsRes, alertsRes, insightsRes, rulesRes, flowsRes] = await Promise.all([
                fetch(`${API_BASE}/metrics`),
                fetch(`${API_BASE}/alerts`),
                fetch(`${API_BASE}/insights`),
                fetch(`${API_BASE}/rules`),
                fetch(`${API_BASE}/flows`)
            ]);

            this.metrics = await metricsRes.json();
            this.alerts = await alertsRes.json();
            this.insights = await insightsRes.json();
            this.rules = await rulesRes.json();
            this.flows = await flowsRes.json();

            this.notifyListeners();
        } catch (error) {
            console.error('SignalFlow SDK: Error fetching real-time data', error);
        }
    }

    subscribe(callback) {
        this.listeners.add(callback);
        callback({ metrics: this.metrics, alerts: this.alerts, insights: this.insights, rules: this.rules, flows: this.flows });
        return () => this.listeners.delete(callback);
    }

    notifyListeners() {
        this.listeners.forEach(callback => callback({
            metrics: this.metrics,
            alerts: this.alerts,
            insights: this.insights,
            rules: this.rules,
            flows: this.flows
        }));
    }

    getMetrics() { return this.metrics; }
    getAlerts() { return this.alerts; }
    getInsights() { return this.insights; }
    getRules() { return this.rules; }
    getFlows() { return this.flows; }

    async updateRules(newRules) {
        this.rules = newRules;
        await fetch(`${API_BASE}/rules`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ rules: newRules })
        });
        this.notifyListeners();
    }

    async markAlertRead(id) {
        const alert = this.alerts.find(a => a.id === id);
        if (alert) alert.read = true;
        await fetch(`${API_BASE}/alerts/${id}/read`, { method: 'POST' });
        this.notifyListeners();
    }
}

export const mockApi = new MockApi();
