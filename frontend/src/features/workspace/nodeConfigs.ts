export interface ConfigOption {
    id: string;
    label: string;
    type: 'text' | 'number' | 'select' | 'boolean';
    options?: string[]; // For select type
    placeholder?: string;
    defaultValue?: string | number | boolean;
    description?: string;
}

export const nodeConfigs: Record<string, ConfigOption[]> = {
    // Compute
    client: [
        { id: 'region', label: 'Region', type: 'select', options: ['US-East', 'US-West', 'EU-Central', 'Asia-Pacific'], defaultValue: 'US-East' },
        { id: 'users', label: 'Concurrent Users', type: 'number', placeholder: 'e.g. 1000' }
    ],
    webServer: [
        { id: 'language', label: 'Language', type: 'select', options: ['Node.js', 'Python', 'Go', 'Java'], defaultValue: 'Node.js' },
        { id: 'instances', label: 'Instance Count', type: 'number', defaultValue: 1 },
        { id: 'cpu', label: 'CPU (vCores)', type: 'number', defaultValue: 2 },
        { id: 'ram', label: 'RAM (GB)', type: 'number', defaultValue: 4 },
    ],
    apiService: [
        { id: 'protocol', label: 'Protocol', type: 'select', options: ['REST', 'gRPC', 'GraphQL'], defaultValue: 'REST' },
        { id: 'instances', label: 'Instance Count', type: 'number', defaultValue: 1 },
        { id: 'timeout', label: 'Timeout (ms)', type: 'number', defaultValue: 3000 },
    ],
    worker: [
        { id: 'processingType', label: 'Processing Type', type: 'select', options: ['Batch', 'Stream', 'On-Demand'], defaultValue: 'Batch' },
        { id: 'concurrency', label: 'Concurrency', type: 'number', defaultValue: 5 },
    ],

    // Networking
    loadBalancer: [
        { id: 'algorithm', label: 'Algorithm', type: 'select', options: ['Round Robin', 'Least Connections', 'IP Hash', 'Random'], defaultValue: 'Round Robin' },
        { id: 'healthCheck', label: 'Health Check Path', type: 'text', placeholder: '/health', defaultValue: '/health' },
    ],
    cdn: [
        { id: 'ttl', label: 'Cache TTL (seconds)', type: 'number', defaultValue: 3600 },
        { id: 'regions', label: 'Replication Regions', type: 'select', options: ['Global', 'North America', 'Europe', 'Asia'], defaultValue: 'Global' },
    ],
    apiGateway: [
        { id: 'rateLimit', label: 'Rate Limit (req/sec)', type: 'number', defaultValue: 1000 },
        { id: 'auth', label: 'Authentication', type: 'select', options: ['None', 'JWT', 'OAuth2', 'API Key'], defaultValue: 'None' },
    ],

    // Storage
    database: [
        { id: 'engine', label: 'Engine', type: 'select', options: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Cassandra'], defaultValue: 'PostgreSQL' },
        { id: 'storage', label: 'Storage Size (GB)', type: 'number', defaultValue: 100 },
        { id: 'replication', label: 'Replication Factor', type: 'number', defaultValue: 1 },
        { id: 'backup', label: 'Automated Backups', type: 'boolean', defaultValue: true },
    ],
    cache: [
        { id: 'engine', label: 'Engine', type: 'select', options: ['Redis', 'Memcached'], defaultValue: 'Redis' },
        { id: 'eviction', label: 'Eviction Policy', type: 'select', options: ['LRU', 'LFU', 'FIFO', 'Random'], defaultValue: 'LRU' },
        { id: 'ttl', label: 'Default TTL (seconds)', type: 'number', defaultValue: 3600 },
    ],
    objectStorage: [
        { id: 'provider', label: 'Provider', type: 'select', options: ['AWS S3', 'GCS', 'Azure Blob'], defaultValue: 'AWS S3' },
        { id: 'versioning', label: 'Versioning', type: 'boolean', defaultValue: true },
        { id: 'lifecycle', label: 'Lifecycle Rules', type: 'boolean', defaultValue: false },
    ],

    // Messaging
    messageQueue: [
        { id: 'engine', label: 'Engine', type: 'select', options: ['RabbitMQ', 'AWS SQS', 'ActiveMQ'], defaultValue: 'RabbitMQ' },
        { id: 'retention', label: 'Message Retention (days)', type: 'number', defaultValue: 4 },
        { id: 'visibilityTimeout', label: 'Visibility Timeout (sec)', type: 'number', defaultValue: 30 },
    ],
    kafka: [
        { id: 'partitions', label: 'Partitions', type: 'number', defaultValue: 3 },
        { id: 'replication', label: 'Replication Factor', type: 'number', defaultValue: 3 },
        { id: 'retention', label: 'Retention (hours)', type: 'number', defaultValue: 168 },
    ],
};
