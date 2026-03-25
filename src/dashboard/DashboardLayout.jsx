import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockApi } from '../services/mockApi';
import { Sidebar } from './components/Sidebar';
import PlatformOverview from './components/PlatformOverview';
import { DeveloperAlertsPanel } from './components/DeveloperAlertsPanel';
import { FunnelChart } from './components/FunnelChart';
import { BehavioralSignalsPanel } from './components/BehavioralSignalsPanel';
import { PsychologyInsightsPanel } from './components/PsychologyInsightsPanel';
import { DeviceBreakdownPanel } from './components/DeviceBreakdownPanel';
import { AlertConfigurationPanel } from './components/AlertConfigurationPanel';
import { ErrorBoundary } from './components/ErrorBoundary';

const DashboardLayout = () => {
    const navigate = useNavigate();
    const [metrics, setMetrics] = useState({});
    const [alerts, setAlerts] = useState([]);
    const [insights, setInsights] = useState([]);
    const [rules, setRules] = useState([]);
    const [flows, setFlows] = useState({});
    const [selectedStep, setSelectedStep] = useState(null);
    const [selectedFlowFilter, setSelectedFlowFilter] = useState(null);
    const [activeNav, setActiveNav] = useState('overview');

    useEffect(() => {
        const unsubscribe = mockApi.subscribe(({ metrics, alerts, insights, rules, flows }) => {
            setMetrics({ ...metrics });
            setAlerts([...alerts]);
            setInsights([...insights]);
            setRules([...rules]);
            setFlows({ ...flows });
        });
        return unsubscribe;
    }, []);

    const markAlertRead = (id) => mockApi.markAlertRead(id);

    // Get the steps shown in the current flow filter (or ALL steps if no filter)
    const filteredStepKeys = (() => {
        if (selectedFlowFilter && flows[selectedFlowFilter]) {
            return flows[selectedFlowFilter].steps.filter(s => metrics[s]);
        }
        return Object.keys(metrics);
    })();

    // Resolve the selected step safely
    const activeStep = (selectedStep && metrics[selectedStep]) ? selectedStep : filteredStepKeys[0] || null;
    const activeStepMetrics = activeStep ? metrics[activeStep] : null;

    return (
        <div className="app-container" style={{ background: 'var(--bg-app)', display: 'flex', overflow: 'hidden', height: '100vh' }}>
            <Sidebar activeNav={activeNav} setActiveNav={setActiveNav} />

            <div style={{ overflowY: 'auto', flex: 1, padding: '40px 48px' }}>

                {/* 1. PLATFORM OVERVIEW */}
                {activeNav === 'overview' && (
                    <ErrorBoundary name="Platform Overview">
                        <PlatformOverview metrics={metrics} flows={flows} alerts={alerts} />
                    </ErrorBoundary>
                )}

                {/* 2. FUNNELS & DEEP DIVE */}
                {activeNav === 'funnels' && (
                    <div className="animate-fade-in" style={{ paddingBottom: 40 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
                            <div>
                                <h1 style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-0.02em', margin: '0 0 8px 0' }}>Funnel Deep Dive</h1>
                                <p style={{ color: 'var(--text-secondary)', fontSize: 15, margin: 0 }}>Analyze behavioral signals and drop-off points step-by-step.</p>
                            </div>
                            <button className="secondary-button" onClick={() => navigate('/signup')}>
                                Launch Simulator ➔
                            </button>
                        </div>

                        {/* Flow + Step Selectors */}
                        <div style={{ display: 'flex', gap: 16, marginBottom: 24, padding: 20, background: 'rgba(255,255,255,0.02)', borderRadius: 12, border: '1px solid var(--border-light)' }}>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Filter by Industry Flow</label>
                                <select
                                    className="glass-input"
                                    style={{ width: '100%', padding: '10px 14px' }}
                                    value={selectedFlowFilter || ''}
                                    onChange={(e) => { setSelectedFlowFilter(e.target.value || null); setSelectedStep(null); }}
                                >
                                    <option value="">All Flows Combined</option>
                                    {Object.entries(flows).map(([id, flow]) => (
                                        <option key={id} value={id}>{flow.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Analyze Specific Step</label>
                                <select
                                    className="glass-input"
                                    style={{ width: '100%', padding: '10px 14px' }}
                                    value={activeStep || ''}
                                    onChange={(e) => setSelectedStep(e.target.value)}
                                >
                                    {filteredStepKeys.length === 0 && <option>No telemetry data yet</option>}
                                    {filteredStepKeys.map(key => (
                                        <option key={key} value={key}>{metrics[key]?.name || key}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Funnel Chart - filtered */}
                        <ErrorBoundary name="Funnel Chart">
                            <FunnelChart metrics={
                                filteredStepKeys.length > 0
                                    ? Object.fromEntries(filteredStepKeys.map(k => [k, metrics[k]]))
                                    : metrics
                            } />
                        </ErrorBoundary>

                        {/* Step Analysis Panels */}
                        {activeStepMetrics ? (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginTop: 24 }}>
                                <ErrorBoundary name="Behavioral Signals">
                                    <BehavioralSignalsPanel stepMetrics={activeStepMetrics} />
                                </ErrorBoundary>
                                <ErrorBoundary name="Psychology Insights">
                                    <PsychologyInsightsPanel stepMetrics={activeStepMetrics} />
                                </ErrorBoundary>
                                <ErrorBoundary name="Device Breakdown">
                                    <DeviceBreakdownPanel stepMetrics={activeStepMetrics} />
                                </ErrorBoundary>
                            </div>
                        ) : (
                            <div style={{ padding: 64, textAlign: 'center', color: 'var(--text-secondary)' }}>
                                <p style={{ fontSize: 20 }}>📊</p>
                                <p>Awaiting telemetry from the Simulator.<br /><span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Go to <strong>Launch Simulator</strong>, select a flow and simulate a drop-off to see real-time data here.</span></p>
                            </div>
                        )}
                    </div>
                )}

                {/* 3. DROP ANALYSIS */}
                {activeNav === 'drop_analysis' && (
                    <ErrorBoundary name="Drop Analysis">
                        <DeveloperAlertsPanel alerts={alerts} insights={insights} onMarkRead={markAlertRead} />
                    </ErrorBoundary>
                )}

                {/* 4. ALERT CONFIGURATION */}
                {activeNav === 'alerts' && (
                    <div className="animate-fade-in">
                        <div style={{ marginBottom: 32 }}>
                            <h1 style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-0.02em', margin: '0 0 8px 0' }}>Alert Configuration</h1>
                            <p style={{ color: 'var(--text-secondary)', fontSize: 15, margin: 0 }}>Manage thresholds for automatic Slack & email pings.</p>
                        </div>
                        <ErrorBoundary name="Alert Configuration">
                            <AlertConfigurationPanel rules={rules} />
                        </ErrorBoundary>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardLayout;
