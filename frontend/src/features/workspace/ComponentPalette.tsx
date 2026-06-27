import React, { useState } from 'react';
import {
    Monitor,
    Globe,
    Server,
    Database,
    Cloud,
    Shield,
    HardDrive,
    MessageSquare,
    Search,
    BarChart3,
    Layers,
    Cpu,
    Network,
    Lock,
    Bell,
    FileText,
    ChevronDown,
    ChevronRight,
    Zap,
    Activity,
    Grid,
    DatabaseZap,
    Workflow,
    Box,
    LayoutTemplate
} from 'lucide-react';


interface ComponentPaletteProps {
    onAddNode: (type: string, label: string) => void;
}

const categories = [
    {
        id: 'compute',
        label: 'Compute',
        icon: <Cpu className="w-4 h-4" />,
        items: [
            { type: 'client', label: 'Client', icon: <Monitor className="w-4 h-4" /> },
            { type: 'frontend', label: 'Frontend App', icon: <LayoutTemplate className="w-4 h-4" /> },
            { type: 'webServer', label: 'Web Server', icon: <Globe className="w-4 h-4" /> },
            { type: 'apiService', label: 'API Service', icon: <Server className="w-4 h-4" /> },
            { type: 'worker', label: 'Worker', icon: <Cpu className="w-4 h-4" /> },
            { type: 'container', label: 'Container', icon: <Box className="w-4 h-4" /> },
        ]
    },
    {
        id: 'networking',
        label: 'Networking',
        icon: <Network className="w-4 h-4" />,
        items: [
            { type: 'cdn', label: 'CDN', icon: <Cloud className="w-4 h-4" /> },
            { type: 'loadBalancer', label: 'Load Balancer', icon: <Layers className="w-4 h-4" /> },
            { type: 'apiGateway', label: 'API Gateway', icon: <Network className="w-4 h-4" /> },
            { type: 'dns', label: 'DNS', icon: <Globe className="w-4 h-4" /> },
        ]
    },
    {
        id: 'storage',
        label: 'Storage',
        icon: <Database className="w-4 h-4" />,
        items: [
            { type: 'database', label: 'Database', icon: <Database className="w-4 h-4" /> },
            { type: 'cache', label: 'Cache', icon: <Zap className="w-4 h-4" /> },
            { type: 'redis', label: 'Redis', icon: <DatabaseZap className="w-4 h-4" /> },
            { type: 'objectStorage', label: 'Object Storage', icon: <HardDrive className="w-4 h-4" /> },
            { type: 'fileStorage', label: 'File Storage', icon: <FileText className="w-4 h-4" /> },
        ]
    },
    {
        id: 'messaging',
        label: 'Messaging',
        icon: <MessageSquare className="w-4 h-4" />,
        items: [
            { type: 'messageQueue', label: 'Message Queue', icon: <MessageSquare className="w-4 h-4" /> },
            { type: 'rabbitmq', label: 'RabbitMQ', icon: <Workflow className="w-4 h-4" /> },
            { type: 'eventBus', label: 'Event Bus', icon: <Activity className="w-4 h-4" /> },
            { type: 'kafka', label: 'Kafka', icon: <Layers className="w-4 h-4" /> },
        ]
    },
    {
        id: 'security',
        label: 'Security',
        icon: <Shield className="w-4 h-4" />,
        items: [
            { type: 'auth', label: 'Auth Service', icon: <Lock className="w-4 h-4" /> },
            { type: 'firewall', label: 'Firewall', icon: <Shield className="w-4 h-4" /> },
        ]
    },
    {
        id: 'monitoring',
        label: 'Monitoring',
        icon: <BarChart3 className="w-4 h-4" />,
        items: [
            { type: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
            { type: 'logging', label: 'Logging', icon: <FileText className="w-4 h-4" /> },
            { type: 'monitoring', label: 'Monitoring', icon: <Activity className="w-4 h-4" /> },
        ]
    },
    {
        id: 'other',
        label: 'Other',
        icon: <Grid className="w-4 h-4" />,
        items: [
            { type: 'search', label: 'Search', icon: <Search className="w-4 h-4" /> },
            { type: 'notification', label: 'Notification', icon: <Bell className="w-4 h-4" /> },
        ]
    }
];

export const ComponentPalette: React.FC<ComponentPaletteProps> = ({ onAddNode }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['compute', 'networking', 'storage']));
    const [isCollapsed, setIsCollapsed] = useState(false);

    // Filter categories based on search query
    const filteredCategories = React.useMemo(() => {
        if (!searchQuery.trim()) return categories;

        return categories.map(category => {
            // Check if category matches
            const categoryMatches = category.label.toLowerCase().includes(searchQuery.toLowerCase());

            // Filter items
            const filteredItems = category.items.filter(item =>
                item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.type.toLowerCase().includes(searchQuery.toLowerCase())
            );

            // If category matches, return original category (show all items)
            if (categoryMatches) {
                return category;
            }

            // If items match, return category with filtered items
            if (filteredItems.length > 0) {
                return { ...category, items: filteredItems };
            }
            return null;
        }).filter(Boolean) as typeof categories;
    }, [searchQuery]);

    // Auto-expand categories when searching
    React.useEffect(() => {
        if (searchQuery.trim()) {
            const allCategoryIds = new Set(filteredCategories.map(c => c.id));
            setExpandedCategories(allCategoryIds);
        }
    }, [searchQuery, filteredCategories]);

    const toggleCategory = (id: string, e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent drag start when clicking toggle
        setExpandedCategories(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    const handleDragStart = (event: React.DragEvent, nodeType: string, label: string) => {
        event.dataTransfer.setData('application/reactflow/type', nodeType);
        event.dataTransfer.setData('application/reactflow/label', label);
        event.dataTransfer.effectAllowed = 'move';
    };

    if (isCollapsed) {
        return (
            <button
                onClick={() => setIsCollapsed(false)}
                className="bg-[rgb(var(--color-card))] hover:bg-[rgb(var(--color-bg-secondary))] border border-[rgb(var(--color-border))] rounded-xl shadow-md p-3.5 flex items-center justify-center text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-primary))] hover:scale-105 pointer-events-auto transition-all duration-200 shrink-0"
                title="Expand Component Palette"
            >
                <Grid className="w-5 h-5" />
            </button>
        );
    }

    return (
        <div className="bg-[rgb(var(--color-card))] rounded-xl shadow-lg border border-[rgb(var(--color-border))] overflow-hidden flex flex-col w-64 h-full pointer-events-auto transition-all duration-300">
            <div className="p-3 border-b border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg-secondary))] flex items-center justify-between">
                <h3 className="text-sm font-semibold text-[rgb(var(--color-text-primary))] flex items-center gap-2 select-none">
                    <Grid className="w-4 h-4" />
                    Components
                </h3>
                <button
                    onClick={() => setIsCollapsed(true)}
                    className="p-1 rounded hover:bg-[rgb(var(--color-bg-hover))] text-[rgb(var(--color-text-secondary))] transition-colors"
                    title="Collapse Palette"
                >
                    <ChevronDown className="w-4 h-4 rotate-90" />
                </button>
            </div>
            
            <div className="p-3 border-b border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg-secondary))]">
                {/* Search Input */}
                <div className="relative group">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[rgb(var(--color-text-tertiary))] group-focus-within:text-[rgb(var(--color-primary))] transition-colors" />
                    <input
                        type="text"
                        placeholder="Search components..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-[rgb(var(--color-bg))] border border-[rgb(var(--color-border))] rounded-lg pl-8 pr-8 py-1.5 text-xs text-[rgb(var(--color-text-primary))] placeholder-[rgb(var(--color-text-tertiary))] focus:outline-none focus:border-[rgb(var(--color-primary))]/50 focus:ring-1 focus:ring-[rgb(var(--color-primary))]/20 transition-all"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-[rgb(var(--color-bg-secondary))] text-[rgb(var(--color-text-tertiary))] hover:text-[rgb(var(--color-text-primary))]"
                        >
                            <span className="sr-only">Clear</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                        </button>
                    )}
                </div>
            </div>

            <div className="overflow-y-auto flex-1 p-2 space-y-2 custom-scrollbar">
                {filteredCategories.length === 0 ? (
                    <div className="text-center py-8 text-[rgb(var(--color-text-tertiary))]">
                        <p className="text-xs">No components found</p>
                    </div>
                ) : (
                    filteredCategories.map(category => (
                        <div key={category.id} className="rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] overflow-hidden transition-all duration-200">
                            <button
                                onClick={(e) => toggleCategory(category.id, e)}
                                className="w-full flex items-center justify-between p-2 text-sm font-medium text-[rgb(var(--color-text-secondary))] hover:bg-[rgb(var(--color-bg-hover))] transition-colors bg-[rgb(var(--color-bg-secondary))/50]"
                            >
                                <div className="flex items-center gap-2">
                                    <span className="text-[rgb(var(--color-text-tertiary))]">{category.icon}</span>
                                    {category.label}
                                </div>
                                {expandedCategories.has(category.id) ?
                                    <ChevronDown className="w-3.5 h-3.5" /> :
                                    <ChevronRight className="w-3.5 h-3.5" />
                                }
                            </button>

                            {expandedCategories.has(category.id) && (
                                <div className="grid grid-cols-2 gap-2 p-2 bg-[rgb(var(--color-bg))] animate-in fade-in slide-in-from-top-1 duration-200">
                                    {category.items.map(item => (
                                        <div
                                            key={item.type}
                                            draggable
                                            onDragStart={(e) => handleDragStart(e, item.type, item.label)}
                                            onClick={() => onAddNode(item.type, item.label)}
                                            className="flex flex-col items-center justify-center p-2 rounded-md border border-[rgb(var(--color-border))] hover:border-[rgb(var(--color-primary))]/50 hover:bg-[rgb(var(--color-primary))]/5 cursor-grab active:cursor-grabbing transition-all group aspect-square hover:shadow-sm"
                                        >
                                            <div className="text-[rgb(var(--color-text-tertiary))] group-hover:text-[rgb(var(--color-primary))] mb-1.5 transition-colors scale-100 group-hover:scale-110 duration-200">
                                                {item.icon}
                                            </div>
                                            <span className="text-[10px] text-center font-medium text-[rgb(var(--color-text-secondary))] group-hover:text-[rgb(var(--color-text-primary))] leading-tight line-clamp-2">
                                                {item.label}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
