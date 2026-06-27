import type { FlowNode, FlowEdge, FeedbackResult } from '../../types';

export interface ExampleSolution {
    nodes: FlowNode[];
    edges: FlowEdge[];
    feedback: FeedbackResult;
}

export const getExampleSolution = (problemTitle: string): ExampleSolution | null => {
    const lowerTitle = problemTitle.toLowerCase();

    // 1. URL Shortener (TinyURL) Example Solution
    if (lowerTitle.includes('tinyurl') || lowerTitle.includes('url shortener')) {
        return {
            nodes: [
                {
                    id: 'client',
                    type: 'customNode',
                    position: { x: 50, y: 200 },
                    data: {
                        label: 'Client (Browser/App)',
                        nodeType: 'client',
                        config: {},
                    },
                },
                {
                    id: 'cdn',
                    type: 'customNode',
                    position: { x: 250, y: 200 },
                    data: {
                        label: 'CDN / DNS',
                        nodeType: 'cdn',
                        config: { provider: 'CloudFlare' },
                    },
                },
                {
                    id: 'lb',
                    type: 'customNode',
                    position: { x: 450, y: 200 },
                    data: {
                        label: 'Load Balancer',
                        nodeType: 'loadBalancer',
                        config: { algorithm: 'Round Robin' },
                    },
                },
                {
                    id: 'api1',
                    type: 'customNode',
                    position: { x: 650, y: 100 },
                    data: {
                        label: 'API Server 1',
                        nodeType: 'apiServer',
                        config: { replicationFactor: 3 },
                    },
                },
                {
                    id: 'api2',
                    type: 'customNode',
                    position: { x: 650, y: 200 },
                    data: {
                        label: 'API Server 2',
                        nodeType: 'apiServer',
                        config: { replicationFactor: 3 },
                    },
                },
                {
                    id: 'redis',
                    type: 'customNode',
                    position: { x: 900, y: 150 },
                    data: {
                        label: 'Redis Cache',
                        nodeType: 'cache',
                        config: {
                            caching: true,
                            purpose: 'Cache short URL mappings for fast redirects'
                        },
                    },
                },
                {
                    id: 'db-primary',
                    type: 'customNode',
                    position: { x: 900, y: 280 },
                    data: {
                        label: 'PostgreSQL Primary',
                        nodeType: 'database',
                        config: {
                            storage: 'PostgreSQL',
                            role: 'Primary',
                            replication: true
                        },
                    },
                },
                {
                    id: 'db-replica',
                    type: 'customNode',
                    position: { x: 1100, y: 280 },
                    data: {
                        label: 'PostgreSQL Replica',
                        nodeType: 'database',
                        config: {
                            storage: 'PostgreSQL',
                            role: 'Replica',
                            replication: true
                        },
                    },
                },
                {
                    id: 'analytics',
                    type: 'customNode',
                    position: { x: 900, y: 420 },
                    data: {
                        label: 'Analytics Service',
                        nodeType: 'queue',
                        config: { purpose: 'Track clicks asynchronously' },
                    },
                },
            ],
            edges: [
                { id: 'e-client-cdn', source: 'client', target: 'cdn' },
                { id: 'e-cdn-lb', source: 'cdn', target: 'lb' },
                { id: 'e-lb-api1', source: 'lb', target: 'api1' },
                { id: 'e-lb-api2', source: 'lb', target: 'api2' },
                { id: 'e-api1-redis', source: 'api1', target: 'redis' },
                { id: 'e-api2-redis', source: 'api2', target: 'redis' },
                { id: 'e-api1-db', source: 'api1', target: 'db-primary' },
                { id: 'e-api2-db', source: 'api2', target: 'db-primary' },
                { id: 'e-db-replica', source: 'db-primary', target: 'db-replica' },
                { id: 'e-api1-analytics', source: 'api1', target: 'analytics' },
                { id: 'e-api2-analytics', source: 'api2', target: 'analytics' },
            ],
            feedback: {
                score: 85,
                summary: 'This URL Shortener design is highly robust, utilizing CDN caching, round-robin load balancing, and a master-slave database replication strategy to support heavy read workloads.',
                requirementAnalysis: [
                    { requirement: 'Given a long URL, generate a unique short URL', met: true, comment: 'Handled efficiently by API servers.' },
                    { requirement: 'Fast redirection under 20ms', met: true, comment: 'Supported by caching active redirections in Redis.' },
                    { requirement: 'Highly available and fault tolerant', met: true, comment: 'Load balancers and multiple database replicas prevent single point of failures.' }
                ],
                strengths: [
                    'Excellent cache-aside pattern using Redis to offset database read hits.',
                    'Separation of concerns with an async analytics worker to prevent slow redirects.'
                ],
                warnings: [
                    'Short URL generation algorithm (base62 vs hash) is not explicitly detailed in config properties.',
                ],
                errors: [],
                suggestions: [
                    'Configure Redis LRU eviction policy to keep only the most active URL mappings in memory.'
                ],
                securityAnalysis: 'SSL/TLS termination at the Load Balancer level should be added.',
                scalabilityAnalysis: 'Supports 100k+ read requests/sec with clustered Redis edge nodes.'
            }
        };
    }

    // 2. Fallback (no example configured for other challenges)
    return null;
};
