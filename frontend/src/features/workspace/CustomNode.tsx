import React, { useState } from 'react';
import { Handle, Position, useReactFlow } from '@xyflow/react';
import {
    Database, HardDrive, Server, Cloud, Zap, Globe,
    Shield, Bell, BarChart3, Search, MessageSquare, Smartphone, Network, X,
    LayoutTemplate, Box, DatabaseZap, Workflow, Activity, Layers, FileText, Cpu, Lock
} from 'lucide-react';
import { useAppStore } from '../../store';

const iconMap: Record<string, React.ComponentType<any>> = {
    client: Smartphone,
    cdn: Cloud,
    apiGateway: Network,
    loadBalancer: Layers,
    webServer: Globe,
    apiService: Server,
    auth: Lock,
    database: Database,
    cache: Zap,
    messageQueue: MessageSquare,
    search: Search,
    objectStorage: HardDrive,
    notification: Bell,
    analytics: BarChart3,
    frontend: LayoutTemplate,
    container: Box,
    redis: DatabaseZap,
    rabbitmq: Workflow,
    dns: Globe,
    fileStorage: FileText,
    eventBus: Activity,
    kafka: Layers,
    firewall: Shield,
    logging: FileText,
    monitoring: Activity,
    worker: Cpu,
};

const colorMap: Record<string, string> = {
    client: '#6366F1', // Indigo
    frontend: '#3B82F6', // Blue
    webServer: '#10B981', // Green
    apiService: '#8B5CF6', // Purple
    worker: '#14B8A6', // Teal
    container: '#8B5CF6', // Purple
    cdn: '#8B5CF6', // Purple
    loadBalancer: '#3B82F6', // Blue
    apiGateway: '#06B6D4', // Cyan
    dns: '#8B5CF6', // Purple
    database: '#F59E0B', // Amber
    cache: '#EC4899', // Pink
    redis: '#EF4444', // Red
    objectStorage: '#06B6D4', // Cyan
    fileStorage: '#F59E0B', // Amber
    messageQueue: '#6366F1', // Indigo
    rabbitmq: '#F97316', // Orange
    eventBus: '#6366F1', // Indigo
    kafka: '#6366F1', // Indigo
    auth: '#F59E0B', // Amber
    firewall: '#EF4444', // Red
    analytics: '#A855F7', // Purple
    logging: '#A855F7', // Purple
    monitoring: '#14B8A6', // Teal
    search: '#EF4444', // Red
    notification: '#F97316', // Orange
};

const getNodeTypeLabel = (nodeType: string): string => {
    switch (nodeType) {
        case 'client': return 'Client';
        case 'cdn': return 'CDN';
        case 'apiGateway': return 'API Gateway';
        case 'loadBalancer': return 'Load Balancer';
        case 'webServer': return 'Web Server';
        case 'apiService': return 'API Service';
        case 'auth': return 'Auth Service';
        case 'database': return 'Database';
        case 'cache': return 'Cache';
        case 'messageQueue': return 'Message Queue';
        case 'search': return 'Search';
        case 'objectStorage': return 'Object Storage';
        case 'notification': return 'Notification';
        case 'analytics': return 'Analytics';
        case 'frontend': return 'Frontend App';
        case 'container': return 'Container';
        case 'redis': return 'Redis Cache';
        case 'rabbitmq': return 'RabbitMQ';
        case 'dns': return 'DNS';
        case 'fileStorage': return 'File Storage';
        case 'eventBus': return 'Event Bus';
        case 'kafka': return 'Kafka Cluster';
        case 'firewall': return 'Firewall';
        case 'logging': return 'Logging';
        case 'monitoring': return 'Monitoring';
        case 'worker': return 'Worker';
        default: return 'Component';
    }
};

export const CustomNode: React.FC<{ data: { label: string; nodeType: string; isActive?: boolean }; id: string }> = ({ data, id }) => {
    const Icon = iconMap[data.nodeType] || Server;
    const color = colorMap[data.nodeType] || '#3B82F6';
    const nodeTypeLabel = getNodeTypeLabel(data.nodeType);
    const [isHovered, setIsHovered] = useState(false);
    const { setNodes, setEdges } = useReactFlow();
    const { theme } = useAppStore();
    const isActive = data.isActive || false;

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        setNodes((nodes) => nodes.filter((node) => node.id !== id));
        setEdges((edges) => edges.filter((edge) => edge.source !== id && edge.target !== id));
    };

    const handleBorderColor = theme === 'dark' 
        ? (isActive ? '#253D46' : '#142329') 
        : (isActive ? '#f8fafc' : '#ffffff');

    return (
        <div
            className={`w-[110px] p-2.5 rounded-xl border flex flex-col items-center gap-1 z-10 transition-all duration-300 relative group cursor-pointer ${
                isActive 
                ? 'scale-[1.03] shadow-md bg-slate-50 dark:bg-[#253D46]' 
                : 'bg-white dark:bg-[#142329]/95 border-slate-200 dark:border-white/[0.06] hover:border-slate-400 hover:shadow-sm'
            }`}
            style={{
                borderColor: isActive ? color : undefined,
                boxShadow: isActive ? `0 0 15px ${color}25` : undefined,
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Delete button */}
            {isHovered && (
                <button
                    onClick={handleDelete}
                    className="absolute -top-2.5 -right-2.5 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-all z-10 animate-in fade-in zoom-in duration-150"
                    title="Delete node"
                >
                    <X className="w-3.5 h-3.5" />
                </button>
            )}

            {/* Custom styled handles */}
            {/* Top Handle - Input (Target) */}
            <Handle 
                type="target" 
                position={Position.Top} 
                id="top" 
                style={{ background: color, border: `2px solid ${handleBorderColor}`, width: 8, height: 8 }} 
            />

            {/* Left Handle - Input (Target) */}
            <Handle
                type="target"
                position={Position.Left}
                id="left"
                style={{ background: color, border: `2px solid ${handleBorderColor}`, width: 8, height: 8 }}
            />

            {/* Right Handle - Output (Source) */}
            <Handle
                type="source"
                position={Position.Right}
                id="right"
                style={{ background: color, border: `2px solid ${handleBorderColor}`, width: 8, height: 8 }}
            />

            {/* Bottom Handle - Output (Source) */}
            <Handle 
                type="source" 
                position={Position.Bottom} 
                id="bottom" 
                style={{ background: color, border: `2px solid ${handleBorderColor}`, width: 8, height: 8 }} 
            />

            {/* Content wrapper (Center-aligned layout matching home page style) */}
            <div className="flex flex-col items-center justify-center text-center w-full">
                <Icon className="w-5 h-5 mb-0.5" style={{ color }} />
                <span className="text-[10px] font-bold text-slate-800 dark:text-white leading-tight truncate w-full px-0.5 select-none">
                    {data.label}
                </span>
                <span className="text-[8px] text-slate-400 dark:text-slate-500 font-mono tracking-normal select-none">
                    {nodeTypeLabel}
                </span>
            </div>
        </div>
    );
};
