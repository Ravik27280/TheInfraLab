import React, { useState, useEffect } from 'react';
import {
    Book, Compass, CheckSquare, ArrowLeft, Search, Layers,
    ShieldAlert, Server, Database, HardDrive, RefreshCw, Shield, Brain,
    ArrowRight, ArrowDown, Network, Users, Code, Activity,
    Zap, AlertTriangle, Play, Lock, Clock,
    Globe, MapPin, Hash, ShieldCheck, Cpu, FileText
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { ThemeToggle } from '../components/ThemeToggle';
import { SEO } from '../components/SEO';

export const DocsPage: React.FC = () => {
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState('getting-started');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedScenario, setSelectedScenario] = useState('chat');
    const [activeBlockTab, setActiveBlockTab] = useState('all');

    const [simRoute, setSimRoute] = useState<string | null>(null);
    const [simStep, setSimStep] = useState(0);
    const [simStatus, setSimStatus] = useState<'idle' | 'processing' | 'success' | 'rate-limited'>('idle');
    const [simLogs, setSimLogs] = useState<string[]>([]);
    const [tokens, setTokens] = useState(5);

    // Anti-spam processing locks
    const [isScalingProcessing, setIsScalingProcessing] = useState(false);
    const [isDbProcessing, setIsDbProcessing] = useState(false);
    const [isCacheProcessing, setIsCacheProcessing] = useState(false);
    const [isSearchProcessing, setIsSearchProcessing] = useState(false);
    const [isSecurityProcessing, setIsSecurityProcessing] = useState(false);
    const [isGeoProcessing, setIsGeoProcessing] = useState(false);
    const [isStorageProcessing, setIsStorageProcessing] = useState(false);
    const [isMeshProcessing, setIsMeshProcessing] = useState(false);
    const [isConsensusProcessing, setIsConsensusProcessing] = useState(false);
    const [isIdProcessing, setIsIdProcessing] = useState(false);

    // Refill tokens periodically
    useEffect(() => {
        const interval = setInterval(() => {
            setTokens(prev => Math.min(prev + 1, 5));
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const triggerSimulation = (route: string) => {
        if (simStatus === 'processing') return;

        setSimRoute(route);
        setSimStatus('processing');
        setSimStep(1);

        const newLogs = [`[Client] Initializing Request: ${route === 'ddos' ? 'Spamming GET /draw' : route === 'auth' ? 'POST /auth' : route === 'draw' ? 'GET /draw' : 'GET /leaderboard'}`];
        setSimLogs(newLogs);

        if (route === 'ddos') {
            setTokens(0);
            setTimeout(() => {
                setSimStep(2);
                setSimStatus('rate-limited');
                setSimLogs(prev => [
                    ...prev,
                    `[Gateway] Checking Rate Limiter...`,
                    `[Gateway] ❌ ERROR: Rate Limit Exceeded (0/5 tokens remaining)`,
                    `[Gateway] Returning HTTP 429 Too Many Requests`
                ]);
            }, 800);
            return;
        }

        setTimeout(() => {
            if (tokens <= 0) {
                setSimStep(2);
                setSimStatus('rate-limited');
                setSimLogs(prev => [
                    ...prev,
                    `[Gateway] Checking Rate Limiter...`,
                    `[Gateway] ❌ ERROR: Rate Limit Exceeded (0/5 tokens remaining)`,
                    `[Gateway] Returning HTTP 429 Too Many Requests`
                ]);
                return;
            }

            setTokens(prev => Math.max(prev - 1, 0));
            setSimStep(2);
            setSimLogs(prev => [
                ...prev,
                `[Gateway] Routing request downstream...`,
                `[Gateway] Rate Limiter check: OK (${tokens - 1}/5 tokens remaining)`,
                `[Gateway] Decrypting SSL... Done`,
                `[Gateway] Validating authentication... OK`
            ]);

            setTimeout(() => {
                setSimStep(3);
                const targetService = route === 'auth' ? 'Auth Service' : route === 'draw' ? 'Design Service' : 'Leaderboard Svc';
                setSimLogs(prev => [
                    ...prev,
                    `[Gateway] Forwarding path '${route === 'auth' ? '/auth' : route === 'draw' ? '/draw' : '/leaderboard'}' -> ${targetService}`
                ]);

                setTimeout(() => {
                    setSimStep(4);
                    setSimStatus('success');
                    const simulatedResponse =
                        route === 'auth' ? '{"status": "authenticated", "userId": "usr_992"}' :
                            route === 'draw' ? '{"canvasId": "draw_772", "width": 1920, "height": 1080}' :
                                '{"leaderboard": [{"rank": 1, "username": "alex"}, {"rank": 2, "username": "sarah"}]}';

                    setSimLogs(prev => [
                        ...prev,
                        `[${targetService}] Request processed in 3ms`,
                        `[Client] Received response: ${simulatedResponse}`
                    ]);
                }, 800);

            }, 1000);

        }, 800);
    };

    // --- 1. SCALING SIMULATOR STATE & HANDLERS ---
    const [scalingMode, setScalingMode] = useState<'vertical' | 'horizontal'>('vertical');
    const [scalingCpu, setScalingCpu] = useState(0);
    const [scalingServerCount, setScalingServerCount] = useState(1);
    const [scalingLogs, setScalingLogs] = useState<string[]>([]);
    const [scalingStatus, setScalingStatus] = useState<'idle' | 'low' | 'heavy' | 'crashed' | 'ddos'>('idle');
    const [activeRequestServer, setActiveRequestServer] = useState<number | null>(null);

    const triggerScalingTraffic = (level: 'low' | 'heavy' | 'ddos') => {
        if (isScalingProcessing) return;
        setIsScalingProcessing(true);
        setScalingStatus('idle');
        setScalingCpu(0);
        setActiveRequestServer(null);

        const logs = [`[Client] Dispatching requests (Mode: ${scalingMode.toUpperCase()}, Load: ${level.toUpperCase()})`];
        setScalingLogs(logs);

        setTimeout(() => {
            if (scalingMode === 'vertical') {
                if (level === 'low') {
                    setScalingCpu(25);
                    setScalingStatus('low');
                    setScalingLogs(prev => [
                        ...prev,
                        `[Load Balancer] Bypassed (Single Host)`,
                        `[Server] Request received. CPU Load: 25%`,
                        `[Server] Response 200 OK sent back.`
                    ]);
                } else if (level === 'heavy') {
                    setScalingCpu(75);
                    setScalingStatus('heavy');
                    setScalingLogs(prev => [
                        ...prev,
                        `[Load Balancer] Bypassed (Single Host)`,
                        `[Server] Warning: High Thread Usage. CPU Load: 75%`,
                        `[Server] Response 200 OK sent back.`
                    ]);
                } else {
                    setScalingCpu(100);
                    setScalingStatus('crashed');
                    setScalingLogs(prev => [
                        ...prev,
                        `[Load Balancer] Bypassed (Single Host)`,
                        `[Server] ❌ CRITICAL: Thread Pool Exhausted! CPU Load: 100%`,
                        `[Server] 💥 SERVER CRASHED! Single Point of Failure triggered.`,
                        `[Client] ❌ Connection Timeout / 503 Service Unavailable`
                    ]);
                }
            } else {
                const count = scalingServerCount;
                setScalingStatus(level);
                if (level === 'low') {
                    const serverIdx = Math.floor(Math.random() * count);
                    setActiveRequestServer(serverIdx);
                    setScalingCpu(Math.round(20 / count));
                    setScalingLogs(prev => [
                        ...prev,
                        `[Load Balancer] Distributing load (Round-Robin)`,
                        `[Load Balancer] Routing request to Server ${String.fromCharCode(65 + serverIdx)}`,
                        `[Server ${String.fromCharCode(65 + serverIdx)}] Processing request. Load: ${Math.round(20 / count)}%`,
                        `[Client] Response 200 OK received`
                    ]);
                } else if (level === 'heavy') {
                    setScalingCpu(Math.round(60 / count));
                    setScalingLogs(prev => [
                        ...prev,
                        `[Load Balancer] Distributing concurrent load across ${count} nodes`,
                        ...Array.from({ length: count }).map((_, i) =>
                            `[Server ${String.fromCharCode(65 + i)}] Thread active. CPU Load: ${Math.round(60 / count)}%`
                        ),
                        `[Client] All concurrent requests resolved successfully.`
                    ]);
                } else {
                    setScalingCpu(Math.round(95 / count));
                    if (count < 3) {
                        setScalingStatus('crashed');
                        setScalingLogs(prev => [
                            ...prev,
                            `[Load Balancer] Flooded with DDoS requests (100k requests/sec)`,
                            `[Load Balancer] Distributing to only ${count} node(s)...`,
                            ...Array.from({ length: count }).map((_, i) =>
                                `[Server ${String.fromCharCode(65 + i)}] ❌ Thread Pool Exhausted! CPU: 100% (CRASHED)`
                            ),
                            `[Client] ❌ 503 Service Unavailable (System Overloaded). Hint: Scale out to more servers!`
                        ]);
                    } else {
                        setScalingLogs(prev => [
                            ...prev,
                            `[Load Balancer] Flooded with DDoS requests (100k requests/sec)`,
                            `[Load Balancer] Distributing load across ${count} nodes...`,
                            ...Array.from({ length: count }).map((_, i) =>
                                `[Server ${String.fromCharCode(65 + i)}] Operating under heavy load. CPU: ${Math.round(95 / count)}%`
                            ),
                            `[Client] ✅ 200 OK. System survived the spike (Elastic scaling active).`
                        ]);
                    }
                }
            }
            setIsScalingProcessing(false);
        }, 800);
    };

    // --- 2. DATABASE SIMULATOR STATE & HANDLERS ---
    const [dbMode, setDbMode] = useState<'replication' | 'sharding'>('replication');
    const [syncMode, setSyncMode] = useState<'sync' | 'async'>('async');
    const [primaryDb, setPrimaryDb] = useState<string[]>(['User: Alex (ID: 1)']);
    const [replicaDb, setReplicaDb] = useState<string[]>(['User: Alex (ID: 1)']);
    const [shards, setShards] = useState<{ [key: string]: string[] }>({
        'shard_A_M': ['Alex (ID: 1)', 'Emily (ID: 4)'],
        'shard_N_Z': ['Sarah (ID: 2)', 'Zack (ID: 3)']
    });
    const [dbLogs, setDbLogs] = useState<string[]>([]);
    const [dbStatus, setDbStatus] = useState<'idle' | 'syncing' | 'synced' | 'stale-read'>('idle');
    const [lastInputName, setLastInputName] = useState('');
    const [shardRouteResult, setShardRouteResult] = useState<string | null>(null);

    const triggerDbWrite = (name: string) => {
        if (!name.trim() || isDbProcessing) return;
        setIsDbProcessing(true);
        const newRecord = `User: ${name} (ID: ${Math.floor(Math.random() * 900) + 100})`;

        if (dbMode === 'replication') {
            setDbStatus('syncing');
            setDbLogs([`[Client] Initiating WRITE operation`]);

            setTimeout(() => {
                setPrimaryDb(prev => [...prev, newRecord]);
                setDbLogs(prev => [...prev, `[Primary DB] Commit successful: "${newRecord}"`]);

                if (syncMode === 'sync') {
                    setTimeout(() => {
                        setReplicaDb(prev => [...prev, newRecord]);
                        setDbStatus('synced');
                        setDbLogs(prev => [
                            ...prev,
                            `[Replica DB] Sync confirmed (Synchronous Mode)`,
                            `[Client] Write transaction completed successfully in 120ms`
                        ]);
                        setIsDbProcessing(false);
                    }, 600);
                } else {
                    setDbStatus('stale-read');
                    setDbLogs(prev => [
                        ...prev,
                        `[Client] Write transaction completed (Asynchronous Mode) in 15ms`,
                        `[Replica DB] Replication log queued (Sync pending)`
                    ]);

                    setTimeout(() => {
                        setReplicaDb(prev => [...prev, newRecord]);
                        setDbStatus('synced');
                        setDbLogs(prev => [
                            ...prev,
                            `[Replica DB] Asynchronous sync completed (Replicated record: "${name}")`
                        ]);
                        setIsDbProcessing(false);
                    }, 2500);
                }
            }, 800);
        } else {
            setDbStatus('syncing');
            const firstChar = name.trim().charAt(0).toUpperCase();
            const targetShard = (firstChar >= 'A' && firstChar <= 'M') ? 'shard_A_M' : 'shard_N_Z';
            setShardRouteResult(targetShard);
            setDbLogs([
                `[Client] Router: Hash partitioning requested for "${name}"`,
                `[Router] Character mapping: '${firstChar}'`
            ]);

            setTimeout(() => {
                setDbLogs(prev => [
                    ...prev,
                    `[Router] Target evaluation: Route key '${firstChar}' &rarr; ${targetShard === 'shard_A_M' ? 'Shard A (A-M)' : 'Shard B (N-Z)'}`
                ]);

                setTimeout(() => {
                    setShards(prev => ({
                        ...prev,
                        [targetShard]: [...prev[targetShard], `${name} (ID: ${Math.floor(Math.random() * 900) + 100})`]
                    }));
                    setDbStatus('synced');
                    setDbLogs(prev => [
                        ...prev,
                        `[${targetShard === 'shard_A_M' ? 'Shard A' : 'Shard B'}] Write committed successfully.`
                    ]);
                    setIsDbProcessing(false);
                }, 800);
            }, 600);
        }
    };

    // --- 3. CACHING SIMULATOR STATE & HANDLERS ---
    const [bloomFilterActive, setBloomFilterActive] = useState(false);
    const [cachingStatus, setCachingStatus] = useState<'idle' | 'checking' | 'hit' | 'miss' | 'db-query' | 'stampede' | 'blocked'>('idle');
    const [cachingLogs, setCachingLogs] = useState<string[]>([]);
    const [cacheLatency, setCacheLatency] = useState(0);
    const [cacheStore, setCacheStore] = useState<{ [key: string]: string }>({
        'user_123': '{"id": 123, "name": "Sarah", "status": "active"}',
        'user_456': '{"id": 456, "name": "Jack", "status": "pending"}'
    });

    const triggerCacheRequest = (key: string, isInvalid: boolean) => {
        if (isCacheProcessing) return;
        setIsCacheProcessing(true);
        setCachingStatus('checking');
        setCachingLogs([`[Client] GET Request: ${key}`]);
        setCacheLatency(0);

        setTimeout(() => {
            if (bloomFilterActive && isInvalid) {
                setCachingStatus('blocked');
                setCachingLogs(prev => [
                    ...prev,
                    `[Bloom Filter] Checking key membership...`,
                    `[Bloom Filter] ❌ Key does not exist in dataset (Blocked)`,
                    `[Client] Response: 404 Not Found (Checked in 1ms, DB load: 0%)`
                ]);
                setCacheLatency(1);
                setIsCacheProcessing(false);
                return;
            }

            if (bloomFilterActive && !isInvalid) {
                setCachingLogs(prev => [
                    ...prev,
                    `[Bloom Filter] Checking key membership...`,
                    `[Bloom Filter] Key check passed (Proceeding to cache...)`
                ]);
            }

            const hit = cacheStore[key];
            if (hit) {
                setCachingStatus('hit');
                setCachingLogs(prev => [
                    ...prev,
                    `[Cache] Checking Redis for '${key}'...`,
                    `[Cache] ✅ CACHE HIT: Found value in Redis`,
                    `[Client] Received response: ${hit} (Checked in 2ms)`
                ]);
                setCacheLatency(2);
                setIsCacheProcessing(false);
            } else {
                setCachingStatus('miss');
                setCachingLogs(prev => [
                    ...prev,
                    `[Cache] Checking Redis for '${key}'...`,
                    `[Cache] ❌ CACHE MISS: Key not found in Redis`,
                    `[Database] Querying backing SQL server for '${key}'...`
                ]);

                setTimeout(() => {
                    setCachingStatus('db-query');
                    if (isInvalid) {
                        setCachingLogs(prev => [
                            ...prev,
                            `[Database] ❌ Record not found in tables (NULL return)`,
                            `[Client] Received response: 404 Not Found (Checked in 45ms)`
                        ]);
                        setCacheLatency(45);
                    } else {
                        const retrievedVal = `{"id": 789, "name": "Robert", "status": "active"}`;
                        setCacheStore(prev => ({ ...prev, [key]: retrievedVal }));
                        setCachingLogs(prev => [
                            ...prev,
                            `[Database] ✅ Record found in SQL tables`,
                            `[Cache] Writing record back to Redis...`,
                            `[Client] Received response: ${retrievedVal} (Checked in 42ms)`
                        ]);
                        setCacheLatency(42);
                    }
                    setIsCacheProcessing(false);
                }, 1000);
            }
        }, 600);
    };

    const triggerCacheStampede = () => {
        if (isCacheProcessing) return;
        setIsCacheProcessing(true);
        setCachingStatus('stampede');
        setCachingLogs([
            `[Client] Spamming 10 concurrent requests for expired hot key 'config_prod'`,
            `[Cache] Checking Redis for 'config_prod'...`,
            `[Cache] ❌ CACHE MISS (Key expired at 14:02:10)`
        ]);

        setTimeout(() => {
            setCachingLogs(prev => [
                ...prev,
                `[Client] All 10 threads fail cache lookups concurrently!`,
                `[Database] ⚠️ WARNING: Stampeding database with 10 identical SQL queries!`,
                `[Database] CPU load spiked to 98%`,
                `[Database] Resolving lock contentions... Done`,
                `[Cache] Updating Redis with 'config_prod'`,
                `[Client] All threads resolved in 380ms (Thundering Herd mitigated).`
            ]);
            setCacheLatency(380);
            setIsCacheProcessing(false);
        }, 1200);
    };

    // --- 4. MESSAGE QUEUE SIMULATOR STATE & HANDLERS ---
    const [queue, setQueue] = useState<string[]>(['Task: Transcode Video 1080p', 'Task: Compile Invoice PDF']);
    const [workerCount, setWorkerCount] = useState(2);
    const [workerProcessing, setWorkerProcessing] = useState<{ [key: number]: string | null }>({
        0: null, 1: null, 2: null, 3: null
    });
    const [queueLogs, setQueueLogs] = useState<string[]>([]);
    const [isProcessingQueue, setIsProcessingQueue] = useState(false);

    const publishQueueTask = () => {
        if (queue.length >= 10) {
            setQueueLogs(prev => [
                `[API Server] ❌ WARNING: Queue Full! Rejecting task request (spam protection active).`,
                ...prev.slice(0, 10)
            ]);
            return;
        }
        const tasks = ['Send Welcome Email', 'Transcode Video 720p', 'Process Bank Report', 'Render 3D Mesh', 'Export User CSV'];
        const newTask = `Task: ${tasks[Math.floor(Math.random() * tasks.length)]} (#${Math.floor(Math.random() * 900) + 100})`;
        setQueue(prev => [...prev, newTask]);
        setQueueLogs(prev => [`[API Server] Published task: "${newTask}"`, ...prev.slice(0, 10)]);
    };

    useEffect(() => {
        if (queue.length === 0 || isProcessingQueue) return;

        setIsProcessingQueue(true);
        let idleWorkerIdx = -1;
        for (let i = 0; i < workerCount; i++) {
            if (!workerProcessing[i]) {
                idleWorkerIdx = i;
                break;
            }
        }

        if (idleWorkerIdx === -1) {
            setIsProcessingQueue(false);
            return;
        }

        const taskToProcess = queue[0];
        setQueue(prev => prev.slice(1));

        setWorkerProcessing(prev => ({
            ...prev,
            [idleWorkerIdx]: taskToProcess
        }));

        setQueueLogs(prev => [
            `[Worker ${String.fromCharCode(65 + idleWorkerIdx)}] Pulling task: "${taskToProcess}"`,
            ...prev.slice(0, 10)
        ]);

        setTimeout(() => {
            setWorkerProcessing(prev => ({
                ...prev,
                [idleWorkerIdx]: null
            }));
            setQueueLogs(prev => [
                `[Worker ${String.fromCharCode(65 + idleWorkerIdx)}] Completed task: "${taskToProcess}" &rarr; Database Synced`,
                ...prev.slice(0, 10)
            ]);
            setIsProcessingQueue(false);
        }, 2000);

    }, [queue, workerProcessing, workerCount, isProcessingQueue]);


    // --- 6. LOAD BALANCING & CDN STATE & HANDLERS ---
    const [lbMode, setLbMode] = useState<'routing' | 'cdn'>('routing');
    const [lbAlg, setLbAlg] = useState<'round-robin' | 'consistent-hash'>('round-robin');
    const [lbLogs, setLbLogs] = useState<string[]>([]);
    const [lbActiveServer, setLbActiveServer] = useState<number | null>(null);
    const [lbLatency, setLbLatency] = useState<number | null>(null);

    const triggerLbSimulation = (type: 'request' | 'cdn-hit' | 'cdn-miss') => {
        if (lbMode === 'routing') {
            setLbLogs(prev => [`[Client] Dispatched HTTP GET /index.html`, ...prev]);
            if (lbAlg === 'round-robin') {
                const nextServer = lbActiveServer === null ? 0 : (lbActiveServer + 1) % 3;
                setLbActiveServer(nextServer);
                setLbLogs(prev => [
                    `[Load Balancer] Algorithm: Round-Robin`,
                    `[Load Balancer] Routing request to Server ${String.fromCharCode(65 + nextServer)}`,
                    `[Server ${String.fromCharCode(65 + nextServer)}] Responded 200 OK in 15ms`,
                    ...prev
                ]);
                setLbLatency(15);
            } else {
                const clientIps = ['192.168.1.5', '10.0.0.12', '172.16.254.1'];
                const randIp = clientIps[Math.floor(Math.random() * clientIps.length)];
                const mappedServer = randIp === '192.168.1.5' ? 1 : randIp === '10.0.0.12' ? 0 : 2;
                setLbActiveServer(mappedServer);
                setLbLogs(prev => [
                    `[Load Balancer] Consistent Hashing on client IP: ${randIp}`,
                    `[Load Balancer] Hash Ring Match &rarr; Routing to Server ${String.fromCharCode(65 + mappedServer)}`,
                    `[Server ${String.fromCharCode(65 + mappedServer)}] (Session Sticky) Responded 200 OK in 12ms`,
                    ...prev
                ]);
                setLbLatency(12);
            }
        } else {
            if (type === 'cdn-hit') {
                setLbLogs(prev => [
                    `[Client] Requesting static asset: /logo.png`,
                    `[CDN Edge] Cache HIT: Found valid asset on edge pop`,
                    `[CDN Edge] Returning file from memory in 4ms`,
                    ...prev
                ]);
                setLbLatency(4);
            } else {
                setLbLogs(prev => [
                    `[Client] Requesting static asset: /logo.png`,
                    `[CDN Edge] Cache MISS: Asset not present on edge`,
                    `[CDN Edge] Querying Origin Server (e:/project/Infralab/logo.png)...`,
                    `[Origin Server] Loading asset & returning stream (115ms)`,
                    `[CDN Edge] Caching asset on local storage`,
                    `[CDN Edge] Returning stream in 119ms`,
                    ...prev
                ]);
                setLbLatency(119);
            }
        }
    };

    // --- 7. DISTRIBUTED STORAGE STATE & HANDLERS ---
    const [storageMode, setStorageMode] = useState<'replication' | 'metadata'>('replication');
    const [failedNode, setFailedNode] = useState<number | null>(null);
    const [storageLogs, setStorageLogs] = useState<string[]>([]);
    const [storageStatus, setStorageStatus] = useState<'idle' | 'writing' | 'reading' | 'failed'>('idle');

    const triggerStorageSimulation = (action: 'write' | 'read' | 'toggle-fail') => {
        if (isStorageProcessing) return;
        setIsStorageProcessing(true);

        if (storageMode === 'replication') {
            if (action === 'write') {
                setStorageStatus('writing');
                setStorageLogs(prev => [`[Client] Initiating write block: chunk_x99`, ...prev]);
                setTimeout(() => {
                    setStorageLogs(prev => [
                        `[Storage Node 1] Chunk committed successfully`,
                        `[Replication Daemon] Piping replicas: Node 1 &rarr; Node 2, Node 3`,
                        `[Storage Node 2] Replication check OK`,
                        `[Storage Node 3] Replication check OK`,
                        `[Client] Write transaction durable (3 replicas saved)`,
                        ...prev
                    ]);
                    setStorageStatus('idle');
                    setIsStorageProcessing(false);
                }, 1000);
            } else if (action === 'toggle-fail') {
                setFailedNode(prev => prev === 0 ? null : 0);
                setStorageLogs(prev => [
                    failedNode === 0 ? `[Storage Node 1] Restored online.` : `[Storage Node 1] ❌ CRITICAL Outage simulated (Node Down)`,
                    ...prev
                ]);
                setTimeout(() => {
                    setIsStorageProcessing(false);
                }, 300);
            } else {
                setStorageLogs(prev => [`[Client] Requesting chunk_x99`, ...prev]);
                if (failedNode === 0) {
                    setStorageLogs(prev => [
                        `[Storage Router] Node 1 is offline. Re-routing request to Replica (Node 2)`,
                        `[Storage Node 2] Read check OK. Returning chunk_x99 in 22ms`,
                        ...prev
                    ]);
                } else {
                    setStorageLogs(prev => [
                        `[Storage Router] Routing request to primary node (Node 1)`,
                        `[Storage Node 1] Read check OK. Returning chunk_x99 in 8ms`,
                        ...prev
                    ]);
                }
                setTimeout(() => {
                    setIsStorageProcessing(false);
                }, 300);
            }
        } else {
            if (action === 'read') {
                setStorageStatus('reading');
                setStorageLogs(prev => [`[Client] Requesting file: profile_picture.png`, ...prev]);
                setTimeout(() => {
                    setStorageLogs(prev => [
                        `[Metadata Db] Querying index for key 'profile_picture.png'`,
                        `[Metadata Db] Found entry: Storage Node 3, Offset 8201`,
                        `[Client] Directly querying Storage Node 3 at offset 8201`,
                        `[Storage Node 3] Serving binary payload in 12ms`,
                        ...prev
                    ]);
                    setStorageStatus('idle');
                    setIsStorageProcessing(false);
                }, 1000);
            }
        }
    };

    // --- 8. SERVICE MESH & APIS STATE & HANDLERS ---
    const [meshMode, setMeshMode] = useState<'rest' | 'grpc'>('rest');
    const [meshMtls, setMeshMtls] = useState(false);
    const [meshLogs, setMeshLogs] = useState<string[]>([]);
    const [meshStatus, setMeshStatus] = useState<'idle' | 'requesting' | 'handshake'>('idle');
    const [meshMetrics, setMeshMetrics] = useState<{ size: string, latency: string } | null>(null);

    const triggerMeshSimulation = () => {
        if (isMeshProcessing) return;
        setIsMeshProcessing(true);
        setMeshStatus('requesting');
        setMeshLogs(prev => [
            `[Service A] Sending interservice request to Service B`,
            ...prev
        ]);

        setTimeout(() => {
            if (meshMtls) {
                setMeshLogs(prev => [
                    `[Sidecar Proxy A] Intercepted outgoing traffic`,
                    `[Sidecar Proxy A] Starting Mutual TLS handshake with Sidecar Proxy B`,
                    `[Sidecar Proxy B] Validation cert: Certificate Authority verified`,
                    `[Sidecar Proxy A] Encryption tunnels established successfully (mTLS)`,
                    ...prev
                ]);
            } else {
                setMeshLogs(prev => [
                    `[Service A] Warning: Sending unencrypted payload over local network!`,
                    ...prev
                ]);
            }

            setTimeout(() => {
                if (meshMode === 'rest') {
                    setMeshMetrics({ size: '520 Bytes', latency: '48ms' });
                    setMeshLogs(prev => [
                        `[Sidecar Proxy B] Forwarding HTTP/1.1 POST /api/v1/user`,
                        `[Service B] Payload received: {"name":"John","role":"admin"}`,
                        `[Service A] Request completed in 48ms`,
                        ...prev
                    ]);
                } else {
                    setMeshMetrics({ size: '45 Bytes', latency: '6ms' });
                    setMeshLogs(prev => [
                        `[Sidecar Proxy B] Forwarding HTTP/2 gRPC Stream (Protobuf binary)`,
                        `[Service B] Protobuf decoded successfully (Compact Struct)`,
                        `[Service A] Request completed in 6ms`,
                        ...prev
                    ]);
                }
                setMeshStatus('idle');
                setIsMeshProcessing(false);
            }, 800);
        }, 600);
    };

    // --- 9. CONSENSUS & SAGAS STATE & HANDLERS ---
    const [consensusMode, setConsensusMode] = useState<'2pc' | 'saga'>('2pc');
    const [consensusStatus, setConsensusStatus] = useState<'idle' | 'preparing' | 'committed' | 'aborted' | 'compensating'>('idle');
    const [consensusLogs, setConsensusLogs] = useState<string[]>([]);
    const [dbLocks, setDbLocks] = useState<{ [key: string]: boolean }>({ inventory: false, payment: false });

    const triggerConsensusSimulation = (action: 'run' | 'fail') => {
        if (isConsensusProcessing) return;
        setIsConsensusProcessing(true);
        setConsensusLogs([]);
        if (consensusMode === '2pc') {
            setConsensusStatus('preparing');
            setConsensusLogs(prev => [
                `[Coordinator] Starting Two-Phase Commit transaction`,
                `[Coordinator] Step 1: Sending PREPARE to Database A (Payment)`,
                `[Coordinator] Step 1: Sending PREPARE to Database B (Inventory)`,
                ...prev
            ]);
            setDbLocks({ payment: true, inventory: true });

            setTimeout(() => {
                if (action === 'fail') {
                    setConsensusStatus('aborted');
                    setConsensusLogs(prev => [
                        `[Database A] Prepare check: OK (Resource locked)`,
                        `[Database B] ❌ Prepare check failed: Timeout / Constraint violation`,
                        `[Coordinator] Phase 1 finished with failures. Issuing GLOBAL ABORT!`,
                        `[Database A] Rolling back local changes. Releasing locks.`,
                        `[Database B] Releasing locks.`,
                        `[Client] ❌ Transaction Aborted (Locks held for 1200ms total)`,
                        ...prev
                    ]);
                    setDbLocks({ payment: false, inventory: false });
                } else {
                    setConsensusStatus('committed');
                    setConsensusLogs(prev => [
                        `[Database A] Prepare check: OK (Resource locked)`,
                        `[Database B] Prepare check: OK (Resource locked)`,
                        `[Coordinator] Phase 1 OK. Issuing GLOBAL COMMIT!`,
                        `[Database A] Committing local logs. Releasing locks.`,
                        `[Database B] Committing local logs. Releasing locks.`,
                        `[Client] ✅ Transaction Committed Successfully in 950ms`,
                        ...prev
                    ]);
                    setDbLocks({ payment: false, inventory: false });
                }
                setIsConsensusProcessing(false);
            }, 1000);
        } else {
            setConsensusStatus('preparing');
            setConsensusLogs(prev => [
                `[Saga Orchestrator] Starting Saga execution chain`,
                `[Service A] Local Commit: Deduct $100 from Account &rarr; SUCCESS`,
                ...prev
            ]);

            setTimeout(() => {
                if (action === 'fail') {
                    setConsensusStatus('compensating');
                    setConsensusLogs(prev => [
                        `[Service B] Local Commit: Reserve hotel room &rarr; ❌ FAILURE (Sold out)`,
                        `[Saga Orchestrator] Saga interrupted. Triggering compensating transactions!`,
                        `[Service A] Compensating Local Commit: Refund $100 to Account &rarr; SUCCESS`,
                        `[Client] ❌ Saga reversed. Eventually Consistent rollback complete.`,
                        ...prev
                    ]);
                } else {
                    setConsensusStatus('committed');
                    setConsensusLogs(prev => [
                        `[Service B] Local Commit: Reserve hotel room &rarr; SUCCESS`,
                        `[Service C] Local Commit: Book airline ticket &rarr; SUCCESS`,
                        `[Saga Orchestrator] Saga chain completed successfully!`,
                        `[Client] ✅ Transaction Completed (Eventually Consistent)`,
                        ...prev
                    ]);
                }
                setIsConsensusProcessing(false);
            }, 1000);
        }
    };

    // --- 10. TELEMETRY & LOGS STATE & HANDLERS ---
    const [telemetryLogs, setTelemetryLogs] = useState<string[]>([]);
    const [telemetrySpans, setTelemetrySpans] = useState<any[]>([]);
    const [isTracing, setIsTracing] = useState(false);

    const triggerTelemetrySimulation = () => {
        setIsTracing(true);
        setTelemetryLogs([`[Gateway] trace_id=t88-x22 span_id=s01 Incoming request GET /v1/checkout`]);
        setTelemetrySpans([
            { name: 'API Gateway', duration: 180, offset: 0, color: '#B58863' },
            { name: 'Auth Service', duration: 40, offset: 10, color: '#10B981' },
            { name: 'Cart Service', duration: 30, offset: 55, color: '#3B82F6' },
            { name: 'Order Service', duration: 80, offset: 90, color: '#EC4899' },
            { name: 'SQL DB Commit', duration: 45, offset: 110, color: '#F59E0B' }
        ]);

        setTimeout(() => {
            setTelemetryLogs(prev => [
                ...prev,
                `[Auth Service] trace_id=t88-x22 span_id=s02 JWT Signature Verified (40ms)`,
                `[Cart Service] trace_id=t88-x22 span_id=s03 Loading user items (30ms)`
            ]);
            setTimeout(() => {
                setTelemetryLogs(prev => [
                    ...prev,
                    `[Order Service] trace_id=t88-x22 span_id=s04 Deducting inventories (80ms)`,
                    `[Database] trace_id=t88-x22 span_id=s05 Commit order block (45ms)`,
                    `[Client] Received Checkout response: 200 OK (Total duration: 180ms)`
                ]);
                setIsTracing(false);
            }, 800);
        }, 600);
    };

    // --- 11. MULTI-REGION & DR STATE & HANDLERS ---
    const [drMode, setDrMode] = useState<'active-passive' | 'active-active'>('active-passive');
    const [regionAOffline, setRegionAOffline] = useState(false);
    const [drLogs, setDrLogs] = useState<string[]>([]);
    const [drActivePath, setDrActivePath] = useState<'regionA' | 'regionB' | null>(null);

    const triggerDrSimulation = (action: 'send' | 'toggle-region') => {
        if (action === 'toggle-region') {
            setRegionAOffline(!regionAOffline);
            setDrLogs(prev => [
                !regionAOffline ? `[Region A - US East] ❌ OUTAGE SIMULATED (Data Center Dark)` : `[Region A - US East] Restored online.`,
                ...prev
            ]);
        } else {
            setDrLogs(prev => [`[Client] Querying domain endpoint...`, ...prev]);
            if (drMode === 'active-passive') {
                if (regionAOffline) {
                    setDrActivePath('regionB');
                    setDrLogs(prev => [
                        `[DNS Failover] Region A is down. Dynamic DNS routing to Region B (US West)`,
                        `[Region B] Serving static content and API routes in 45ms`,
                        ...prev
                    ]);
                } else {
                    setDrActivePath('regionA');
                    setDrLogs(prev => [
                        `[DNS Router] Directing request to Primary Region A (US East)`,
                        `[Region A] Serving request in 10ms`,
                        ...prev
                    ]);
                }
            } else {
                const target = Math.random() > 0.5 ? 'regionA' : 'regionB';
                if (target === 'regionA' && regionAOffline) {
                    setDrActivePath('regionB');
                    setDrLogs(prev => [
                        `[BGP Router] Directing to nearest node: Region A (failed)`,
                        `[BGP Failover] Failover active: routing to Region B`,
                        `[Region B] Serving request in 48ms`,
                        ...prev
                    ]);
                } else {
                    setDrActivePath(target);
                    setDrLogs(prev => [
                        `[BGP Router] Geo-routing request to ${target === 'regionA' ? 'Region A (US East)' : 'Region B (US West)'}`,
                        `[${target === 'regionA' ? 'Region A' : 'Region B'}] Serving request in 12ms`,
                        `[Data Sync] Cross-region replication logs sent (eventual sync lag: 180ms)`,
                        ...prev
                    ]);
                }
            }
        }
    };

    // --- 12. SEARCH ENGINES STATE & HANDLERS ---
    const [searchEngineLogs, setSearchEngineLogs] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const searchIndex: Record<string, number[]> = {
        'scalable': [1, 3],
        'distributed': [1, 2, 3],
        'cache': [2, 3],
        'database': [1, 2]
    };
    const [searchResults, setSearchResults] = useState<number[] | null>(null);

    const triggerSearchSimulation = (word: string) => {
        if (isSearchProcessing) return;
        setIsSearchProcessing(true);
        const cleaned = word.trim().toLowerCase();
        setSearchTerm(word);
        setSearchResults(null);
        setSearchEngineLogs([
            `[Query Parser] Received search term: "${word}"`,
            `[Query Parser] Tokenized query: [${cleaned}]`
        ]);

        setTimeout(() => {
            const matches = searchIndex[cleaned];
            if (matches) {
                setSearchResults(matches);
                setSearchEngineLogs(prev => [
                    ...prev,
                    `[Inverted Index] Index Match found for token "${cleaned}"`,
                    `[Inverted Index] Target document IDs: [${matches.join(', ')}]`,
                    `[Ranker] Sorting matched documents by TF-IDF scoring index...`,
                    `[Search] Found ${matches.length} result(s).`
                ]);
            } else {
                setSearchResults([]);
                setSearchEngineLogs(prev => [
                    ...prev,
                    `[Inverted Index] ❌ Term "${cleaned}" not found in index catalog.`,
                    `[Search] 0 results found.`
                ]);
            }
            setIsSearchProcessing(false);
        }, 600);
    };

    // --- 13. SECURITY & DDOS STATE & HANDLERS ---
    const [wafActive, setWafActive] = useState(false);
    const [securityLogs, setSecurityLogs] = useState<string[]>([]);
    const [securityStatus, setSecurityStatus] = useState<'idle' | 'ddos' | 'sql-inject' | 'blocked' | 'passed'>('idle');

    const triggerSecuritySimulation = (type: 'valid' | 'ddos' | 'sql') => {
        if (isSecurityProcessing) return;
        setIsSecurityProcessing(true);
        setSecurityStatus('idle');
        setSecurityLogs([`[Client] Dispatching HTTP payload`]);

        setTimeout(() => {
            if (type === 'sql') {
                setSecurityStatus('sql-inject');
                setSecurityLogs(prev => [
                    `[WAF Firewall] Inspecting request payload parameters...`,
                    `[WAF Firewall] Detected query string: "SELECT * FROM users; --"`,
                    wafActive
                        ? `[WAF Firewall] ❌ SQL Injection Pattern Matched! Blocked HTTP 403 Forbidden.`
                        : `[Database] ⚠️ Executed SQL injection payload! User tables exposed.`,
                    ...prev
                ]);
                if (wafActive) setSecurityStatus('blocked');
            } else if (type === 'ddos') {
                setSecurityStatus('ddos');
                setSecurityLogs(prev => [
                    `[Firewall] Network interface flooded with 50,000 SYN packets/sec`,
                    wafActive
                        ? `[Firewall] ✅ DDoS Shield: Scrubbing server active. Dropping syn flood IPs.`
                        : `[App Server] 💥 Thread Pool Exhausted! 100% CPU. Server Unresponsive.`,
                    ...prev
                ]);
                if (wafActive) setSecurityStatus('blocked');
            } else {
                setSecurityStatus('passed');
                setSecurityLogs(prev => [
                    `[WAF Firewall] Inspection complete: Payload validated`,
                    `[App Server] Request processed: HTTP 200 OK`,
                    ...prev
                ]);
            }
            setIsSecurityProcessing(false);
        }, 800);
    };

    // --- 14. GEOSPATIAL SYSTEMS STATE & HANDLERS ---
    const [spatialMode, setSpatialMode] = useState<'geohash' | 'quadtree'>('geohash');
    const [geospatialLogs, setGeospatialLogs] = useState<string[]>([]);
    const geoPoints = [
        { x: 30, y: 40, name: 'Taxi 1' },
        { x: 70, y: 20, name: 'Taxi 2' },
        { x: 50, y: 80, name: 'Cafe Bistro' },
        { x: 20, y: 70, name: 'Pizza Shop' }
    ];
    const [geoSearchResult, setGeoSearchResult] = useState<string[]>([]);

    const triggerGeospatialSimulation = (x: number, y: number) => {
        if (isGeoProcessing) return;
        setIsGeoProcessing(true);
        setGeospatialLogs([`[Router] Spatial search triggered at coordinates: (${x}, ${y})`]);
        if (spatialMode === 'geohash') {
            const calculatedHash = `dr5r${Math.floor(x / 10)}${Math.floor(y / 10)}`;
            setGeospatialLogs(prev => [
                ...prev,
                `[Geohash Converter] Encoded coordinate to geohash base32: "${calculatedHash}"`,
                `[Query Engine] Retrieving points in geohash region "${calculatedHash}"...`
            ]);

            setTimeout(() => {
                const found = geoPoints.filter(p => Math.abs(p.x - x) < 35 && Math.abs(p.y - y) < 35);
                setGeoSearchResult(found.map(f => f.name));
                setGeospatialLogs(prev => [
                    ...prev,
                    `[Database] Found matches: [${found.map(f => f.name).join(', ')}]`,
                    `[Search] Search query resolved in 11ms`
                ]);
                setIsGeoProcessing(false);
            }, 600);
        } else {
            setGeospatialLogs(prev => [
                ...prev,
                `[Quadtree Index] Root bounds (0,0,100,100). Traversing tree nodes...`,
                `[Quadtree Index] Checking Quadrant NW &rarr; Quad NE &rarr; Leaf node found`
            ]);

            setTimeout(() => {
                const found = geoPoints.filter(p => Math.abs(p.x - x) < 30 && Math.abs(p.y - y) < 30);
                setGeoSearchResult(found.map(f => f.name));
                setGeospatialLogs(prev => [
                    ...prev,
                    `[Quadtree Index] Intersection bounds check passed for ${found.length} leaf nodes`,
                    `[Search] Search query resolved in 5ms`
                ]);
                setIsGeoProcessing(false);
            }, 600);
        }
    };

    // --- 15. DISTRIBUTED ID GENERATOR STATE & HANDLERS ---
    const [idMode, setIdMode] = useState<'uuid' | 'snowflake'>('uuid');
    const [generatedIds, setGeneratedIds] = useState<{ id: string, components: string }[]>([
        { id: 'e31b67ea-8d2a-4bc4-9d10-09fa451b6672', components: 'Version 4 Random (128-bit)' },
        { id: '1728192309832941568', components: 'Snowflake (64-bit Int)' }
    ]);
    const [idLogs, setIdLogs] = useState<string[]>([]);

    const triggerIdSimulation = () => {
        if (isIdProcessing) return;
        setIsIdProcessing(true);
        if (idMode === 'uuid') {
            const uuidVal = 'f81d4fae-7dec-11d0-a765-00a0c91e6bf6'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
            const comp = `Version 4 Random (128-bit)`;
            setGeneratedIds(prev => [{ id: uuidVal, components: comp }, ...prev.slice(0, 5)]);
            setIdLogs(prev => [
                `[UUID Gen] Created ID: ${uuidVal}`,
                `[UUID Gen] ❌ Disadvantage: 128-bit string is non-sequential (creates index fragmentation)`,
                ...prev
            ]);
        } else {
            const timePart = Date.now().toString(2).slice(-41);
            const nodePart = '0101010101';
            const seqPart = Math.floor(Math.random() * 4095).toString(2).padStart(12, '0');
            const snowflakeId = BigInt('0b' + timePart + nodePart + seqPart).toString();
            const comp = `Timestamp: ${timePart.length}b, Worker: 10b, Seq: 12b`;
            setGeneratedIds(prev => [{ id: snowflakeId, components: comp }, ...prev.slice(0, 5)]);
            setIdLogs(prev => [
                `[Snowflake Gen] Created ID: ${snowflakeId} (64-bit Int)`,
                `[Snowflake Gen] ✅ Advantage: Sortable chronologically, coordination-free index friendly`,
                ...prev
            ]);
        }
        setTimeout(() => {
            setIsIdProcessing(false);
        }, 300);
    };

    const resetAllSimulators = () => {
        // 1. API Gateway
        setSimRoute(null);
        setSimStep(0);
        setSimStatus('idle');
        setSimLogs([]);
        setTokens(5);

        // 2. Scaling
        setScalingMode('vertical');
        setScalingCpu(0);
        setScalingServerCount(1);
        setScalingLogs([]);
        setScalingStatus('idle');
        setActiveRequestServer(null);
        setIsScalingProcessing(false);

        // 3. Database
        setDbMode('replication');
        setSyncMode('async');
        setPrimaryDb(['User: Alex (ID: 1)']);
        setReplicaDb(['User: Alex (ID: 1)']);
        setShards({
            'shard_A_M': ['Alex (ID: 1)', 'Emily (ID: 4)'],
            'shard_N_Z': ['Sarah (ID: 2)', 'Zack (ID: 3)']
        });
        setDbLogs([]);
        setDbStatus('idle');
        setLastInputName('');
        setShardRouteResult(null);
        setIsDbProcessing(false);

        // 4. Caching
        setBloomFilterActive(false);
        setCachingStatus('idle');
        setCachingLogs([]);
        setCacheLatency(0);
        setIsCacheProcessing(false);

        // 5. Message Queue
        setQueue(['Task: Transcode Video 1080p', 'Task: Compile Invoice PDF']);
        setWorkerCount(2);
        setWorkerProcessing({ 0: null, 1: null, 2: null, 3: null });
        setQueueLogs([]);
        setIsProcessingQueue(false);

        // 6. Load Balancing
        setLbMode('routing');
        setLbAlg('round-robin');
        setLbLogs([]);
        setLbActiveServer(null);
        setLbLatency(null);

        // 7. Distributed Storage
        setStorageMode('replication');
        setFailedNode(null);
        setStorageLogs([]);
        setStorageStatus('idle');
        setIsStorageProcessing(false);

        // 8. Service Mesh
        setMeshMode('rest');
        setMeshMtls(false);
        setMeshLogs([]);
        setMeshStatus('idle');
        setMeshMetrics(null);
        setIsMeshProcessing(false);

        // 9. Consensus
        setConsensusMode('2pc');
        setConsensusStatus('idle');
        setConsensusLogs([]);
        setDbLocks({ inventory: false, payment: false });
        setIsConsensusProcessing(false);

        // 10. Telemetry
        setTelemetryLogs([]);
        setTelemetrySpans([]);
        setIsTracing(false);

        // 11. Multi-Region
        setDrMode('active-passive');
        setRegionAOffline(false);
        setDrLogs([]);
        setDrActivePath(null);

        // 12. Search Engine
        setSearchEngineLogs([]);
        setSearchTerm('');
        setSearchResults(null);
        setIsSearchProcessing(false);

        // 13. Security
        setWafActive(false);
        setSecurityLogs([]);
        setSecurityStatus('idle');
        setIsSecurityProcessing(false);

        // 14. Geospatial
        setSpatialMode('geohash');
        setGeospatialLogs([]);
        setGeoSearchResult([]);
        setIsGeoProcessing(false);

        // 15. ID Generator
        setIdMode('uuid');
        setGeneratedIds([
            { id: 'e31b67ea-8d2a-4bc4-9d10-09fa451b6672', components: 'Version 4 Random (128-bit)' },
            { id: '1728192309832941568', components: 'Snowflake (64-bit Int)' }
        ]);
        setIdLogs([]);
        setIsIdProcessing(false);
    };

    useEffect(() => {
        resetAllSimulators();
    }, [activeSection]);

    useEffect(() => {
        document.title = "System Design Interview Study Guide | Infralab";
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
            metaDesc = document.createElement('meta');
            metaDesc.setAttribute('name', 'description');
            document.head.appendChild(metaDesc);
        }
        metaDesc.setAttribute('content', 'Master system design interviews. Interactive visual study guides, scaling strategies, database sharding, caching, message queues, and complete interview frameworks.');
    }, []);

    const scenarios = [
        {
            id: 'chat',
            name: 'Real-Time Chat System',
            description: 'A scale-out architecture supporting millions of concurrent chat users, ensuring instant delivery and offline queueing.',
            components: ['Load Balancer (L4/L7)', 'API Gateway', 'NoSQL Database', 'Key-Value Store', 'Message Queue', 'Service Discovery', 'Rate Limiter'],
            flow: [
                { step: 1, sender: 'Client', receiver: 'API Gateway', action: 'Connect via WebSocket (negotiated via Load Balancer)' },
                { step: 2, sender: 'API Gateway', receiver: 'Rate Limiter', action: 'Validate rate limits and user session token' },
                { step: 3, sender: 'API Gateway', receiver: 'Service Discovery', action: 'Look up active connection handler server instance' },
                { step: 4, sender: 'Handler Server', receiver: 'Redis (Key-Value)', action: 'Query active presence status (online/offline)' },
                { step: 5, sender: 'Handler Server', receiver: 'Message Queue', action: 'Enqueue message for routing (decouples sender/receiver)' },
                { step: 6, sender: 'Message Queue', receiver: 'Cassandra (NoSQL)', action: 'Persist chat history with partition key `chat_id`' }
            ],
            interviewTip: 'Always separate the connection management path (WebSockets for real-time delivery) from the stateless REST path (fetching historical messages, profile edits). This allows the stateful gateway to scale independently of stateless APIs.'
        },
        {
            id: 'video',
            name: 'Video Streaming (Netflix/YouTube)',
            description: 'A system designed for heavy traffic loads, optimizing for high bandwidth video delivery and variable network speeds.',
            components: ['DNS', 'CDN (Content Delivery Network)', 'Load Balancer (L4/L7)', 'Object Storage', 'Key-Value Store', 'NoSQL Database', 'Message Queue', 'Application Servers'],
            flow: [
                { step: 1, sender: 'Client', receiver: 'DNS', action: 'Resolve video URL to closest CDN edge server' },
                { step: 2, sender: 'Client', receiver: 'CDN', action: 'Request video segment chunks. Cache hit resolves in <10ms' },
                { step: 3, sender: 'Client', receiver: 'API Gateway', action: 'Cache miss / User auth check: forward to App Servers' },
                { step: 4, sender: 'App Server', receiver: 'Object Storage', action: 'On video upload: store raw high-res master file' },
                { step: 5, sender: 'Transcoder Svc', receiver: 'Message Queue', action: 'Push jobs to split video into multiple resolutions & formats' },
                { step: 6, sender: 'Transcoder Svc', receiver: 'Object Storage', action: 'Store encoded chunks (1080p, 720p, etc.)' }
            ],
            interviewTip: 'Video assets should NEVER be served directly from application servers or SQL databases. Always store them in Object Storage (e.g., AWS S3) and distribute them using a Content Delivery Network (CDN) to edge nodes close to the user.'
        },
        {
            id: 'payment',
            name: 'E-Commerce / Payment Sagas',
            description: 'High-consistency transactions designed for order management and distributed payments, avoiding double-billing.',
            components: ['API Gateway', 'Load Balancer (L4/L7)', 'Relational Database (SQL)', 'Key-Value Store', 'Message Queue', 'Dead Letter Queue (DLQ)', 'Secrets Manager'],
            flow: [
                { step: 1, sender: 'Client', receiver: 'API Gateway', action: 'Submit order with Idempotency Key (prevents double-submits)' },
                { step: 2, sender: 'Order Service', receiver: 'Redis (Key-Value)', action: 'Acquire lock on product ID to check inventory' },
                { step: 3, sender: 'Order Service', receiver: 'SQL Database', action: 'Create order record in PENDING state (ACID transaction)' },
                { step: 4, sender: 'Order Service', receiver: 'Message Queue', action: 'Publish ORDER_CREATED event' },
                { step: 5, sender: 'Payment Service', receiver: 'Stripe Gateway', action: 'Charge credit card. If fails, push to Dead Letter Queue (DLQ)' },
                { step: 6, sender: 'Payment Service', receiver: 'Message Queue', action: 'Publish PAYMENT_SUCCESS event' }
            ],
            interviewTip: 'In payment systems, consistency is non-negotiable. Use relational databases (SQL) with strict ACID properties for transactional data. Protect against duplicate requests using Idempotency Keys (e.g., UUIDs generated by the client) and Distributed Locks.'
        },
        {
            id: 'uber',
            name: 'Ride-Hailing (Geospatial Uber/Lyft)',
            description: 'A highly dynamic system tracking moving drivers and matching them with riders in real-time under high spatial query loads.',
            components: ['Load Balancer (L4/L7)', 'API Gateway', 'NoSQL Database', 'Key-Value Store', 'Message Queue', 'Pub/Sub & Event Streams', 'Service Discovery'],
            flow: [
                { step: 1, sender: 'Driver App', receiver: 'API Gateway', action: 'Send GPS location updates every 4 seconds' },
                { step: 2, sender: 'Gateway', receiver: 'Kafka', action: 'Stream coordinate logs for high-throughput tracking' },
                { step: 3, sender: 'Driver Location Svc', receiver: 'Redis (Geospatial Index)', action: 'Update driver positions in a Geo-hashed index' },
                { step: 4, sender: 'Rider App', receiver: 'API Gateway', action: 'Request ride nearby matching coordinate' },
                { step: 5, sender: 'Matching Service', receiver: 'Redis (Geospatial)', action: 'Query active drivers within 2-mile radius (Geo-hash query)' }
            ],
            interviewTip: 'Geospatial systems rely on segmenting the earth. Use indices based on Geo-hashing or Google H3. In-memory caches like Redis are optimal for fast range searches (e.g., "find all drivers within 2km").'
        }
    ];

    const buildingBlocks = [
        { category: 'traffic', name: 'Load Balancer (L4/L7)', badge: 'L4/L7', desc: 'Distributes incoming network traffic across a cluster of servers to optimize resource utilization and prevent overload.', useCase: 'Place in front of web servers to distribute user HTTP traffic (L7) or raw TCP packets (L4).' },
        { category: 'traffic', name: 'API Gateway', badge: 'Gateway', desc: 'A single entry point for all clients. Handles cross-cutting concerns like authentication, rate limiting, routing, and response aggregation.', useCase: 'Use in microservices to shield internal services and manage client request lifecycle.' },
        { category: 'traffic', name: 'Reverse Proxy', badge: 'Proxy', desc: 'Forwards client requests to backend servers, providing SSL termination, caching, compression, and hiding backend IP details.', useCase: 'Deploy Nginx or HAProxy as the direct entry point of web servers.' },
        { category: 'traffic', name: 'DNS', badge: 'DNS', desc: 'Translates domain names to IP addresses. Can perform geographic routing to steer users to the nearest data center.', useCase: 'Route users to global server clusters (e.g. AWS Route 53 Geoproximity routing).' },
        { category: 'traffic', name: 'CDN (Content Delivery Network)', badge: 'CDN', desc: 'A globally distributed network of proxy servers that cache and serve static assets (images, CSS, JS, videos) close to users.', useCase: 'Use for assets like media streaming files, profile avatars, and front-end bundles to reduce server load.' },
        { category: 'compute', name: 'Application Servers', badge: 'Compute', desc: 'Executes the core business logic of the application and coordinates database or cache access.', useCase: 'Monolithic or clustered nodes hosting the application backend (Node.js, Go, Java).' },
        { category: 'compute', name: 'Microservices', badge: 'Compute', desc: 'Decomposes applications into small, single-purpose, loosely coupled services communicating via HTTP REST, gRPC, or queues.', useCase: 'Break up a large e-commerce system into separate Services: User, Order, Payment, and Catalog.' },
        { category: 'compute', name: 'Serverless Functions', badge: 'FaaS', desc: 'Event-driven compute resources that run code without provisioning servers. Scales to zero automatically.', useCase: 'Use for sparse/periodic workloads, like image cropping on upload or processing webhooks.' },
        { category: 'compute', name: 'Containers & Kubernetes', badge: 'K8s', desc: 'Packages apps into isolated environments (Docker) and orchestrates their scheduling, scaling, and rolling updates.', useCase: 'Deploying highly dynamic microservices that scale horizontally based on traffic metrics.' },
        { category: 'storage', name: 'Relational Database (SQL)', badge: 'ACID', desc: 'Stores structured data with schemas, support for complex JOIN queries, and strong ACID transaction consistency.', useCase: 'Financial ledgers, user accounts, and systems where data relationships are complex and consistency is critical.' },
        { category: 'storage', name: 'NoSQL Database', badge: 'NoSQL', desc: 'Highly scalable database for unstructured, semi-structured, or document-based data (e.g., Cassandra, DynamoDB, MongoDB).', useCase: 'High-throughput write workloads, social media feeds, or big-data catalogs.' },
        { category: 'storage', name: 'Key-Value Store', badge: 'Memory', desc: 'Ultra-fast, in-memory key-value database. Typically used for caching or session storage.', useCase: 'Session tokens, user presence status, or shopping carts (e.g., Redis, Memcached).' },
        { category: 'storage', name: 'Object Storage', badge: 'Blob', desc: 'Flat storage architecture designed for storing unstructured binary files, images, videos, and backups.', useCase: 'Raw file uploads, PDF invoices, video source files (e.g., AWS S3, Google Cloud Storage).' },
        { category: 'storage', name: 'Data Warehouse & Lake', badge: 'OLAP', desc: 'Warehouses (e.g. Snowflake) store structured data for BI queries. Lakes store raw data for raw big-data analysis.', useCase: 'Historical analysis, cohort analysis, and machine learning model training.' },
        { category: 'caching', name: 'Distributed Cache', badge: 'Redis', desc: 'Shared memory cache shared across all app server nodes, minimizing database query overhead.', useCase: 'Cache popular product details, user profiles, or heavy query results.' },
        { category: 'caching', name: 'Application Cache', badge: 'Local', desc: 'In-memory cache residing directly on the app server instance. Low latency but not shared.', useCase: 'Storing static config variables, localization resources, or DNS responses locally.' },
        { category: 'caching', name: 'CDN Cache', badge: 'Edge', desc: 'Caches assets at the edge locations of the network, preventing queries from reaching the server.', useCase: 'Static landing page assets, media files, and infrequently changing JSON responses.' },
        { category: 'messaging', name: 'Message Queue', badge: 'Decouple', desc: 'A point-to-point buffer that stores messages asynchronously until they are processed by a consumer service.', useCase: 'Decoupling order submission from invoice generation or email dispatch (e.g., RabbitMQ).' },
        { category: 'messaging', name: 'Pub/Sub & Event Streams', badge: 'Broker', desc: 'Broadcaster model where publishers push events to topics, and multiple subscribers consume them (e.g., Kafka).', useCase: 'Activity tracking logs, real-time analytics data pipelines, or distributed log streaming.' },
        { category: 'messaging', name: 'Dead Letter Queue (DLQ)', badge: 'DLQ', desc: 'A secondary queue that stores messages that failed to process successfully after multiple retry attempts.', useCase: 'Park failing payment events for manual review instead of blocking the main pipeline.' },
        { category: 'search', name: 'Search Engine', badge: 'Lucene', desc: 'Specialized database indexing documents to enable fuzzy, full-text, and autocomplete search capabilities.', useCase: 'Product search bar on Amazon, log analysis dashboard (e.g., Elasticsearch, OpenSearch).' },
        { category: 'search', name: 'Service Discovery', badge: 'Discovery', desc: 'Maintains a dynamic registry of IP addresses and ports for active services in a microservice cluster.', useCase: 'Help App Servers locate where the Payment Service is currently running (e.g., Consul, ZooKeeper).' },
        { category: 'security', name: 'Circuit Breaker', badge: 'Resilience', desc: 'Monitors external service calls and trips/fails fast if the downstream service is down, preventing resource exhaustion.', useCase: 'Prevent the Checkout service from hanging if the third-party shipping service is unresponsive.' },
        { category: 'security', name: 'Rate Limiter', badge: 'Security', desc: 'Throttles requests from specific users or IPs to prevent abuse, scraping, and brute force attacks.', useCase: 'Limit users to maximum 5 login attempts per minute, or 100 API requests per minute.' },
        { category: 'security', name: 'WAF (Web Application Firewall)', badge: 'WAF', desc: 'Inspects and filters incoming HTTP traffic for common web application attacks (SQL injection, XSS, CSRF).', useCase: 'Deploy at the edge to block malicious bot networks and scrapers.' },
        { category: 'security', name: 'Secrets Manager', badge: 'Vault', desc: 'Securely stores, rotates, and manages credentials, API keys, and database passwords.', useCase: 'Keep database passwords and private keys out of source code repositories (e.g., AWS Secrets Manager).' }
    ];

    const filteredBlocks = activeBlockTab === 'all'
        ? buildingBlocks
        : buildingBlocks.filter(b => b.category === activeBlockTab);

    const sections = [
        { id: 'getting-started', label: 'Getting Started', icon: Compass },
        { id: 'building-blocks', label: 'System Building Blocks', icon: Layers },
        { id: 'scaling-basics', label: '1. Scaling Fundamentals', icon: Server },
        { id: 'database-design', label: '2. Databases & Sharding', icon: Database },
        { id: 'caching-latency', label: '3. Caching & Latency', icon: HardDrive },
        { id: 'queues-async', label: '4. Message Queues & Async', icon: RefreshCw },
        { id: 'gateways-apis', label: '5. Gateways & API Design', icon: Shield },
        { id: 'load-balancing', label: '6. Load Balancing & CDN', icon: Network },
        { id: 'distributed-storage', label: '7. Distributed Storage', icon: Layers },
        { id: 'service-mesh', label: '8. Service Mesh & APIs', icon: Users },
        { id: 'consensus-transactions', label: '9. Consensus & Sagas', icon: CheckSquare },
        { id: 'monitoring-tracing', label: '10. Telemetry & Logs', icon: Activity },
        { id: 'disaster-recovery', label: '11. Disaster Recovery & MR', icon: Globe },
        { id: 'search-indexing', label: '12. Search & Indexing', icon: Search },
        { id: 'security-ddos', label: '13. Security & DDoS', icon: ShieldAlert },
        { id: 'geospatial-systems', label: '14. Geospatial Systems', icon: MapPin },
        { id: 'id-generators', label: '15. Distributed IDs', icon: Hash },
        { id: 'interview-blueprint', label: 'Interview Blueprint', icon: Book },
    ];


    // Interview Questions Database
    const interviewQuestions = [
        {
            title: "Design a URL Shortener (TinyURL / Bit.ly)",
            difficulty: "Easy",
            focus: "Encoding, hashing, caching, and key generation services.",
            functional: [
                "Convert a long URL into a unique 7-8 character short URL alias.",
                "Redirect users accessing the short URL to the original long URL (HTTP 301/302).",
                "Support custom short aliases and expiration times."
            ],
            scale: "100 Million URLs generated per month. 10 Billion redirection requests per month. 100:1 read/write ratio.",
            solutionSteps: [
                {
                    name: "1. API Design & Base62 Encoding",
                    detail: "Use a simple POST endpoint `/api/v1/shorten` that returns a unique code. To convert an auto-incrementing ID to a short string, use Base62 encoding (a-z, A-Z, 0-9). A 7-character string in Base62 can represent 62^7 = 3.5 Trillion unique URLs, which is more than enough for 5 years."
                },
                {
                    name: "2. Key Generation Service (KGS)",
                    detail: "To avoid hash collisions and database lock contentions under high write load, build a standalone Key Generation Service (KGS). KGS pre-generates unique 7-character keys and stores them in a key cache. When a request to shorten a URL arrives, KGS hands out a pre-generated key instantly without hitting the database."
                },
                {
                    name: "3. Redirection Caching & Database Selection",
                    detail: "Since read volume is 100x larger than write volume, caching is critical. Store short-to-long URL mappings in a Redis cluster. Set the eviction policy to Least Recently Used (LRU). If a cache miss occurs, query the database (NoSQL Key-Value store like DynamoDB or MongoDB for fast key lookups) and update the cache."
                }
            ],
            interviewTip: "Explain the difference between a 301 Redirect (Permanent - browser caches it, reducing load on our servers) and a 302 Redirect (Temporary - browser requests our servers every time, which is necessary if you need to gather detailed click analytics)."
        },
        {
            title: "Design a Distributed Rate Limiter",
            difficulty: "Easy to Medium",
            focus: "APIs, concurrency, distributed state, and sliding counters.",
            functional: [
                "Limit requests per client IP or API key (e.g., max 100 requests per minute).",
                "Return HTTP 429 Too Many Requests when the limit is exceeded.",
                "Ensure low-latency checks (<5ms) and handle distributed server synchronization."
            ],
            scale: "Supports a global API Gateway cluster handling 1 Million requests per second.",
            solutionSteps: [
                {
                    name: "1. Choosing the Right Algorithm",
                    detail: "Use the Token Bucket or Sliding Window Log/Counter algorithm. Sliding Window Counter is highly accurate and space-efficient. It stores request counts for the current and previous minute, mapping requests across time windows dynamically."
                },
                {
                    name: "2. Distributed State Storage",
                    detail: "Store rate-limit counters in an in-memory database like Redis. Do not store rate limits in local server memory; if a load balancer routes requests to different server instances, the limit will not be synchronized."
                },
                {
                    name: "3. Concurrency & Performance",
                    detail: "Use Redis pipelining or Lua scripts to execute 'Read-and-Increment' operations atomically. This prevents race conditions where multiple requests execute concurrently and bypass the rate limit. For ultra-low latency, use local caching on the gateway node with periodic background sync to Redis."
                }
            ],
            interviewTip: "Discuss client side fallback strategies when hit by HTTP 429. Emphasize implementing exponential backoff with jitter on retry calls, and sending headers like `Retry-After` to let the client know when it is safe to query again."
        },
        {
            title: "Design a Real-Time Chat Service (WhatsApp / Slack)",
            difficulty: "Medium to Hard",
            focus: "WebSockets, persistent connections, user status, and push notifications.",
            functional: [
                "Support one-on-one and group messaging with low latency (<200ms).",
                "Real-time delivery status (sent, delivered, read indicators).",
                "User online/offline status tracking.",
                "Push notifications for offline users."
            ],
            scale: "500 Million Daily Active Users (DAU). 50 Billion messages sent per day.",
            solutionSteps: [
                {
                    name: "1. Connection Management & WebSockets",
                    detail: "Establish persistent TCP connections between clients and the gateway using WebSockets. WebSocket allows full-duplex bi-directional communication, avoiding HTTP polling overhead. Use a Cluster of Connection Managers to maintain active sockets. A single server with 64GB RAM can handle 1M concurrent idle WebSocket connections."
                },
                {
                    name: "2. Message Delivery Pipeline & Storage",
                    detail: "When User A sends a message to User B: User A sends it over WebSockets. The Connection Manager queries the Routing Service (stored in Redis) to find which server holds User B's active socket. If User B is online, route and push immediately. If User B is offline, store the message in a Database (NoSQL Column-Family like Cassandra or Wide-column like HBase, which offer sub-millisecond writes) and trigger a Push Notification Service (FCM/APNS)."
                },
                {
                    name: "3. User Presence Tracker",
                    detail: "Online status changes occur frequently. Use a Heartbeat mechanism where the client sends a small ping every 5 seconds. Store presence states in a fast Redis cache. To optimize group chat notifications, do not push presence updates to all group members immediately; instead, query presence on-demand when a user opens a chat screen."
                }
            ],
            interviewTip: "Group chats require handling fan-out. For small groups (e.g. <500 members), copy the message to each member's inbox (fan-out on write). For large channels, keep a single message record and read on-demand (fan-out on read) to prevent write-amplification bottlenecks."
        },
        {
            title: "Design a Video Streaming Platform (YouTube / Netflix)",
            difficulty: "Hard",
            focus: "CDN networks, media encoding, distributed chunk storage, and bitrate stream adaptability.",
            functional: [
                "Allow users to upload videos securely.",
                "Stream videos smoothly in multiple resolutions (1080p, 720p, 360p) globally.",
                "Support pausing, seeking, and search catalog index queries."
            ],
            scale: "10 Million video uploads per day. 500 Million daily views. Petabytes of raw video files.",
            solutionSteps: [
                {
                    name: "1. Video Upload & Transcoding Pipeline",
                    detail: "Uploads are write-heavy. Split incoming raw videos into 2-5 second chunks. Upload chunk segments to Object Storage (e.g., AWS S3). Place the upload metadata in a queue (like Kafka) which triggers Transcoding Workers. Transcoding Workers compress and encode chunks into multiple bitrates (1080p, 720p, 480p) and adaptive streaming formats (HLS/DASH)."
                },
                {
                    name: "2. Global Content Delivery (CDN)",
                    detail: "Streaming is extremely read-heavy. Place video segments in a distributed Content Delivery Network (CDN) like Cloudflare or Akamai. CDNs cache video chunks at edge locations closer to end users. Cache replacement policies should prioritize popular, trending videos."
                },
                {
                    name: "3. Adaptive Bitrate Streaming (ABR)",
                    detail: "Implement client-driven video player configurations. The media player monitors network bandwidth dynamically. If network speed drops, the player requests lower-resolution chunks (e.g. 480p) from the CDN. If bandwidth rises, the player requests 1080p chunks, ensuring zero buffer interruptions."
                }
            ],
            interviewTip: "Highlight database splitting. Store large video file blobs in Object Storage (S3). Keep video metadata (views, comments, likes, titles) in SQL/NoSQL databases. Do not mix binary video blobs and metadata in the database, as it severely degrades scaling capabilities."
        },
        {
            title: "Design a Distributed Key-Value Store",
            difficulty: "Hard",
            focus: "CAP Theorem, consensus, vector clocks, consistency, and gossip protocols.",
            functional: [
                "Scale write and read operations horizontally across many nodes.",
                "Provide simple `Put(key, value)` and `Get(key)` APIs.",
                "Provide configurable read/write consistency."
            ],
            scale: "Millions of transactions per second. Highly available and split across global data centers.",
            solutionSteps: [
                {
                    name: "1. Sharding & Consistent Hashing",
                    detail: "Distribute keys across storage nodes using a consistent hash ring. Keys are assigned to the first node that appears clockwise from their hash position. Replicate keys across N subsequent nodes in the ring to ensure durability."
                },
                {
                    name: "2. Gossip Protocol & Failure Detection",
                    detail: "Since there is no centralized coordinator (decentralized masterless architecture), nodes communicate using a Gossip Protocol. Every second, each node selects a random peer and exchanges state info. This allows membership changes and node failures to propagate across the cluster in O(log N) time."
                },
                {
                    name: "3. Quorum Consistency & Vector Clocks",
                    detail: "Enforce configurable quorum: `W + R > N` (where N is replication factor, W is write quorum, R is read quorum). If W + R > N, you get strong consistency. If a network partition occurs, use Vector Clocks to track version histories and resolve conflict write discrepancies during reads (read repair)."
                }
            ],
            interviewTip: "Explain Sloppy Quorum and Hinted Handoff. If primary nodes are offline, the system writes to temporary 'backup' nodes. Once primary nodes recover, the backup nodes stream write updates back (Hinted Handoff), prioritizing availability over strict immediate consistency."
        },
        {
            title: "Design a Web Crawler",
            difficulty: "Medium to Hard",
            focus: "URL frontiers, DNS caches, politeness, and duplicate content detection.",
            functional: [
                "Scrape millions of target websites and download HTML source documents.",
                "Extract links and enqueue them for further parsing.",
                "Ensure crawler does not overload target websites (politeness policy)."
            ],
            scale: "Crawls 1 Billion web pages per month. High throughput and storage.",
            solutionSteps: [
                {
                    name: "1. URL Frontier & Queue Management",
                    detail: "Manage the URL Frontier (list of URLs to visit) using a queue pipeline. To maintain politeness, use a mapping: `Queue per host`. Ensure only one worker crawls a specific host at a time, spacing requests with a delay (e.g. 500ms). Enforce priority queues (based on page rank or update frequency)."
                },
                {
                    name: "2. DNS Caching & HTML Fetching",
                    detail: "DNS lookups are expensive bottlenecks. Implement a local DNS cache to avoid hitting DNS resolvers for every webpage request. Workers fetch HTML source files asynchronously using thread pools."
                },
                {
                    name: "3. Duplicate Detection & Document Storage",
                    detail: "To avoid duplicate crawls of identical text content on different URLs, pass documents through a SimHash or MinHash algorithm. For URL deduplication, use a Bloom Filter. Save crawled raw HTML content in Object Storage (e.g. S3) and index metadata in a NoSQL database."
                }
            ],
            interviewTip: "Politeness and robots.txt parsing are essential features. Explain how the crawler reads, parses, and caches `/robots.txt` from target websites to respect Disallow paths before fetching any content."
        }
    ];

    const filteredQuestions = interviewQuestions.filter(q =>
        q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.focus.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.solutionSteps.some(step => step.detail.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="docs-page-root min-h-screen bg-[#080E10] text-slate-100 relative overflow-hidden flex flex-col font-sans transition-theme">
            <SEO 
                title="System Design Study Guides & Reference Docs" 
                description="Comprehensive FAANG-level system design study guides, microservice patterns, database sharding strategies, and interactive diagrams." 
            />
            {/* Minimal Animated Drifting Grid Overlay */}
            <div className="absolute inset-0 animated-grid-overlay pointer-events-none z-0" />

            {/* Header */}
            <header className="border-b border-white/[0.04] bg-[#0A1214]/80 backdrop-blur-md sticky top-0 z-20 transition-theme">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Button
                            variant="secondary"
                            size="sm"
                            className="flex items-center gap-1.5 py-1.5 px-3 bg-white/5 border border-white/10 text-slate-300 hover:text-white"
                            onClick={() => {
                                if (window.history.state && window.history.state.idx > 0) {
                                    navigate(-1);
                                } else {
                                    navigate('/');
                                }
                            }}
                        >
                            <ArrowLeft className="w-4 h-4" /> Back
                        </Button>
                        <div className="h-6 w-px bg-white/10 mx-2 hidden sm:block" />
                        <Link to="/" className="text-xl font-bold tracking-tight hidden sm:flex items-center gap-1.5 text-white hover:text-slate-200 transition-colors">
                            Infra<span className="text-[#B58863]">lab</span> Study Guide
                        </Link>
                    </div>
                    <div className="flex items-center gap-3 max-w-sm w-full justify-end">
                        <div className="relative max-w-xs w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <input
                                type="text"
                                placeholder="Search study guide topics..."
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    if (e.target.value && activeSection !== 'interview-blueprint') {
                                        setActiveSection('interview-blueprint'); // Switch to search questions
                                    }
                                }}
                                className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:bg-white/10 focus:border-[#B58863]/40 focus:ring-1 focus:ring-[#B58863]/20 transition-all"
                            />
                        </div>
                        <ThemeToggle />
                    </div>
                </div>
            </header>

            {/* Content Container */}
            <div className="max-w-7xl w-full mx-auto px-6 py-8 flex flex-col md:flex-row gap-8 flex-1 relative z-10">

                {/* Navigation Sidebar */}
                <aside className="w-full md:w-64 flex-shrink-0">
                    <nav className="space-y-1 sticky top-24">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 mb-2">Study Material</p>
                        {sections.map((sec) => {
                            const Icon = sec.icon;
                            const isActive = activeSection === sec.id;
                            return (
                                <button
                                    key={sec.id}
                                    onClick={() => {
                                        setActiveSection(sec.id);
                                        setSearchQuery('');
                                    }}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all border ${isActive
                                            ? 'bg-[#B58863]/10 text-[#B58863] border-[#B58863]/20 shadow-sm'
                                            : 'text-slate-400 border-transparent hover:bg-white/5 hover:text-white'
                                        }`}
                                >
                                    <Icon className="w-4 h-4 flex-shrink-0" />
                                    <span>{sec.label}</span>
                                </button>
                            );
                        })}
                    </nav>
                </aside>

                {/* Main Documentation Viewer */}
                <main className="flex-1 bg-[#0C1518]/90 border border-white/[0.04] rounded-2xl p-6 md:p-8 shadow-xl min-h-[600px] overflow-y-auto">

                    {/* GETTING STARTED */}
                    {activeSection === 'getting-started' && (
                        <div className="space-y-6 animate-in fade-in duration-300">
                            <div>
                                <div className="inline-flex items-center justify-center p-2 rounded-xl bg-[#B58863]/10 border border-[#B58863]/20 text-[#B58863] mb-3">
                                    <Book className="w-5 h-5" />
                                </div>
                                <h2 className="text-2xl font-black text-white tracking-tight">Introduction to System Design</h2>
                                <p className="text-slate-300 mt-2 leading-relaxed text-sm">
                                    Welcome to the <strong>Infralab Study Guide</strong>! This comprehensive material is written to help you master the key architectural concepts tested in top-tier technology system design interviews.
                                </p>
                                <p className="text-slate-400 mt-2 leading-relaxed text-sm">
                                    In system design interviews, there is no single "correct" answer. Instead, interviewers evaluate your ability to trade off constraints (scalability vs availability, consistency vs latency) and scale systems systematically. Use this guide alongside our **Interactive Design Canvas** to gain the deep technical intuition required to excel.
                                </p>
                            </div>

                            <hr className="border-white/[0.04]" />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-5 bg-white/5 rounded-xl border border-white/[0.04]">
                                    <h3 className="font-bold text-white mb-2 flex items-center gap-2 text-sm">
                                        <Layers className="w-4 h-4 text-[#B58863]" /> 1. Visual Practice
                                    </h3>
                                    <p className="text-xs text-slate-400 leading-relaxed">
                                        Practice structuring real interview questions (like TinyURL, Rate Limiters, or distributed messaging) using components on our canvas.
                                    </p>
                                </div>
                                <div className="p-5 bg-white/5 rounded-xl border border-white/[0.04]">
                                    <h3 className="font-bold text-white mb-2 flex items-center gap-2 text-sm">
                                        <Brain className="w-4 h-4 text-emerald-400" /> 2. AI Code Evaluator
                                    </h3>
                                    <p className="text-xs text-slate-400 leading-relaxed">
                                        Submit your designs for grading. Our engine checks your components for reliability bottlenecks, latency, and single points of failure.
                                    </p>
                                </div>
                            </div>

                            <div className="p-5 bg-[#B58863]/5 rounded-xl border border-[#B58863]/10">
                                <h3 className="font-bold text-white mb-1.5 text-sm">Core Engineering Pillars</h3>
                                <ul className="text-xs text-slate-300 space-y-2 list-disc pl-5 leading-relaxed">
                                    <li><strong>Scalability:</strong> Handling growing volumes of traffic or data without breaking performance.</li>
                                    <li><strong>Availability:</strong> The fraction of time the system remains operational (99.999% "Five Nines" standard).</li>
                                    <li><strong>Latency & Cost:</strong> Delivering ultra-low response times globally while optimizing cloud infrastructure expenses.</li>
                                </ul>
                            </div>
                        </div>
                    )}

                    {/* SYSTEM DESIGN BUILDING BLOCKS */}
                    {activeSection === 'building-blocks' && (
                        <div className="space-y-6 animate-in fade-in duration-300">
                            <div>
                                <div className="inline-flex items-center justify-center p-2 rounded-xl bg-[#B58863]/10 border border-[#B58863]/20 text-[#B58863] mb-3">
                                    <Layers className="w-5 h-5" />
                                </div>
                                <h2 className="text-2xl font-black text-white tracking-tight">System Design Building Blocks</h2>
                                <p className="text-slate-300 mt-2 leading-relaxed text-sm">
                                    Top-tier system design interviews require you to identify, select, and scale infrastructure components. Understanding when to use which service and how they trade off is crucial for passing the design loops.
                                </p>
                            </div>

                            <hr className="border-white/[0.04]" />

                            {/* SCENARIO BLUEPRINT PLAYER */}
                            <div className="bg-white/5 border border-white/[0.04] rounded-2xl p-5 md:p-6 space-y-5">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-4">
                                    <div>
                                        <h3 className="font-bold text-white text-sm">Interactive Architecture Blueprint</h3>
                                        <p className="text-[10.5px] text-slate-400 mt-0.5">Select a common interview scenario to visualize the component flows and required building blocks.</p>
                                    </div>
                                    <div className="flex flex-wrap gap-1.5 bg-black/40 p-1 rounded-xl border border-white/10">
                                        {scenarios.map((sc) => (
                                            <button
                                                key={sc.id}
                                                onClick={() => setSelectedScenario(sc.id)}
                                                className={`px-2.5 py-1 rounded-lg text-[10.5px] font-bold transition-all ${selectedScenario === sc.id
                                                        ? 'bg-[#B58863] text-white'
                                                        : 'text-slate-400 hover:text-white'
                                                    }`}
                                            >
                                                {sc.name.split(' (')[0]}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {scenarios.filter(sc => sc.id === selectedScenario).map((sc) => (
                                    <div key={sc.id} className="space-y-4">
                                        <div className="p-4 bg-black/30 border border-white/5 rounded-xl">
                                            <h4 className="font-bold text-xs text-white uppercase tracking-wider mb-1">Scenario Goal</h4>
                                            <p className="text-xs text-slate-300 leading-relaxed">{sc.description}</p>
                                        </div>

                                        {/* Dynamic Flow Map */}
                                        <div className="space-y-2">
                                            <h4 className="font-bold text-xs text-slate-500 uppercase tracking-wider">Operational Sequence Flow</h4>
                                            <div className="bg-black/60 border border-white/10 rounded-xl p-4 font-mono text-[10px] space-y-2.5 max-h-[300px] overflow-y-auto">
                                                {sc.flow.map((step) => (
                                                    <div key={step.step} className="flex gap-2.5 items-start text-slate-300 hover:text-white transition-colors">
                                                        <span className="text-[#B58863] font-bold">[{step.step}]</span>
                                                        <span className="text-emerald-400 font-bold">{step.sender}</span>
                                                        <span className="text-slate-500">→</span>
                                                        <span className="text-amber-400 font-bold">{step.receiver}:</span>
                                                        <span className="text-slate-300">{step.action}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Highlighted Building Blocks */}
                                        <div className="space-y-2">
                                            <h4 className="font-bold text-xs text-slate-500 uppercase tracking-wider">Required Platform Elements</h4>
                                            <div className="flex flex-wrap gap-1.5">
                                                {sc.components.map((comp) => (
                                                    <span
                                                        key={comp}
                                                        className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-white/5 border border-white/10 text-slate-300 hover:border-[#B58863]/40 hover:text-[#B58863] transition-all cursor-default"
                                                    >
                                                        {comp}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Interview Tip Pro-Card */}
                                        <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl flex gap-3 items-start">
                                            <Brain className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <h5 className="text-xs font-bold text-emerald-400">Architectural Pro-Tip</h5>
                                                <p className="text-[11px] text-slate-300 leading-relaxed mt-1">{sc.interviewTip}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* COMPONENT DICTIONARY GRID */}
                            <div className="space-y-4">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <h3 className="font-black text-lg text-white">Component Dictionary</h3>

                                    {/* Category Filter Tabs */}
                                    <div className="flex flex-wrap gap-1 bg-black/40 p-1 rounded-xl border border-white/10 max-w-max">
                                        {[
                                            { id: 'all', label: 'All' },
                                            { id: 'traffic', label: 'Traffic & CDN' },
                                            { id: 'compute', label: 'Compute' },
                                            { id: 'storage', label: 'Data Storage' },
                                            { id: 'caching', label: 'Caching' },
                                            { id: 'messaging', label: 'Queue & PubSub' },
                                            { id: 'security', label: 'Reliability & Sec' }
                                        ].map((t) => (
                                            <button
                                                key={t.id}
                                                onClick={() => setActiveBlockTab(t.id)}
                                                className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all ${activeBlockTab === t.id
                                                        ? 'bg-[#B58863] text-white'
                                                        : 'text-slate-400 hover:text-white'
                                                    }`}
                                            >
                                                {t.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {filteredBlocks.map((block, idx) => (
                                        <div
                                            key={idx}
                                            className="p-4 bg-white/5 border border-white/[0.04] rounded-xl hover:border-white/10 transition-all flex flex-col justify-between gap-2.5"
                                        >
                                            <div>
                                                <div className="flex justify-between items-start gap-2">
                                                    <h4 className="font-bold text-white text-xs">{block.name}</h4>
                                                    <span className="px-1.5 py-0.5 rounded text-[8px] font-extrabold bg-[#B58863]/10 text-[#B58863] border border-[#B58863]/20 uppercase tracking-wide">
                                                        {block.badge}
                                                    </span>
                                                </div>
                                                <p className="text-[11px] text-slate-400 mt-1 leading-normal">{block.desc}</p>
                                            </div>
                                            <div className="pt-2 border-t border-white/[0.04] text-[10px] text-slate-300">
                                                <span className="font-bold text-slate-400 block mb-0.5">When to use:</span>
                                                {block.useCase}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* SCALING BASICS */}
                    {activeSection === 'scaling-basics' && (
                        <div className="space-y-6 animate-in fade-in duration-300">
                            <div>
                                <h2 className="text-2xl font-black text-white tracking-tight">Scaling Fundamentals</h2>
                                <p className="text-slate-300 mt-2 leading-relaxed text-sm">
                                    When traffic spikes, system administrators must scale computing power. Upgrading a single server's hardware (Vertical) is limited by physical constraints, whereas adding more server instances to a pool (Horizontal) offers infinite capacity.
                                </p>
                            </div>

                            {/* SCALING PLAYGROUND */}
                            <div className="bg-white/5 border border-white/[0.04] rounded-2xl p-6 space-y-6">
                                <div className="flex flex-col sm:flex-row items-center justify-between border-b border-white/[0.06] pb-4 gap-4">
                                    <div>
                                        <h3 className="font-bold text-white text-sm">Interactive Scaling Topology Playground</h3>
                                        <p className="text-[10.5px] text-slate-400 mt-0.5">Toggle scaling modes, fire request levels, and analyze failover behaviors.</p>
                                    </div>

                                    {/* Mode Toggles */}
                                    <div className="flex bg-black/40 p-1 rounded-xl border border-white/10 self-end sm:self-center">
                                        <button
                                            disabled={isScalingProcessing}
                                            onClick={() => { setScalingMode('vertical'); triggerScalingTraffic('low'); }}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all disabled:opacity-50 ${scalingMode === 'vertical' ? 'bg-[#B58863] text-white' : 'text-slate-400 hover:text-white'}`}
                                        >
                                            Vertical (Scale Up)
                                        </button>
                                        <button
                                            disabled={isScalingProcessing}
                                            onClick={() => { setScalingMode('horizontal'); triggerScalingTraffic('low'); }}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all disabled:opacity-50 ${scalingMode === 'horizontal' ? 'bg-[#B58863] text-white' : 'text-slate-400 hover:text-white'}`}
                                        >
                                            Horizontal (Scale Out)
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                                    {/* Left: Graphic mapping */}
                                    <div className="lg:col-span-7 bg-black/40 border border-white/5 rounded-xl p-4 flex flex-col items-center justify-between min-h-[340px] relative overflow-hidden">
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 self-start">Active Hardware Pool</span>

                                        {scalingMode === 'vertical' ? (
                                            /* Vertical Visual */
                                            <div className="flex flex-col items-center justify-center gap-6 flex-1 w-full max-w-[240px]">
                                                <div className="bg-[#10232A] border border-white/10 rounded-xl px-4 py-1.5 text-center shadow-md">
                                                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Client Request Stream</span>
                                                </div>

                                                <ArrowDown className={`w-5 h-5 text-[#B58863] ${scalingStatus !== 'idle' ? 'animate-bounce' : ''}`} />

                                                {/* Single Large Server Box */}
                                                <div
                                                    className={`border rounded-2xl p-5 text-center transition-all duration-500 shadow-xl ${scalingStatus === 'crashed'
                                                            ? 'bg-red-500/10 border-red-500 shadow-red-500/10 animate-pulse'
                                                            : 'bg-[#B58863]/10 border-[#B58863] shadow-[#B58863]/10'
                                                        }`}
                                                    style={{
                                                        transform: `scale(${1 + (scalingCpu / 300)})`,
                                                        minWidth: '180px'
                                                    }}
                                                >
                                                    <Server className={`w-10 h-10 mx-auto mb-2 transition-colors ${scalingStatus === 'crashed' ? 'text-red-500' : 'text-[#B58863]'}`} />
                                                    <span className="text-sm font-black block text-white">Super Server</span>
                                                    <span className="text-[10px] text-slate-400 block mt-1">CPU Load: {scalingCpu}%</span>
                                                    <div className="w-full bg-white/5 h-2 rounded-full mt-3 overflow-hidden">
                                                        <div
                                                            className={`h-full transition-all duration-500 ${scalingCpu > 80 ? 'bg-red-500' : 'bg-[#B58863]'}`}
                                                            style={{ width: `${scalingCpu}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            /* Horizontal Visual */
                                            <div className="flex flex-col items-center justify-between flex-1 w-full gap-4">
                                                <div className="bg-[#10232A] border border-white/10 rounded-xl px-4 py-1.5 text-center shadow-md">
                                                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Client Request Stream</span>
                                                </div>

                                                <ArrowDown className="w-4 h-4 text-slate-500" />

                                                {/* Load Balancer Box */}
                                                <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 flex items-center justify-center gap-2 text-xs font-semibold max-w-[200px] w-full text-slate-200">
                                                    <Network className="w-4 h-4 text-[#B58863]" /> Load Balancer
                                                </div>

                                                {/* Connection Paths SVG */}
                                                <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                                                    {Array.from({ length: scalingServerCount }).map((_, i) => {
                                                        const x2Coord = 15 + (i * (70 / (scalingServerCount - 1 || 1)));
                                                        const isActive = activeRequestServer === i || scalingStatus === 'heavy' || (scalingStatus === 'ddos' && scalingServerCount >= 3);
                                                        return (
                                                            <line
                                                                key={i}
                                                                x1="50%" y1="50%" x2={`${x2Coord}%`} y2="78%"
                                                                stroke={isActive ? (scalingStatus === 'crashed' ? '#EF4444' : '#10B981') : 'rgba(255,255,255,0.06)'}
                                                                strokeWidth="1.5"
                                                                className="transition-all duration-300"
                                                            />
                                                        );
                                                    })}
                                                </svg>

                                                {/* Servers Pool list */}
                                                <div className="flex gap-2 justify-center w-full mt-2 z-10 px-2">
                                                    {Array.from({ length: scalingServerCount }).map((_, i) => {
                                                        const isCurrent = activeRequestServer === i;
                                                        const name = String.fromCharCode(65 + i);
                                                        return (
                                                            <div
                                                                key={i}
                                                                className={`flex-1 border rounded-xl p-2.5 text-center transition-all duration-300 ${scalingStatus === 'crashed'
                                                                        ? 'bg-red-500/10 border-red-500 shadow-red-500/5'
                                                                        : (isCurrent || scalingStatus === 'heavy' || (scalingStatus === 'ddos' && scalingServerCount >= 3))
                                                                            ? 'bg-emerald-500/10 border-emerald-500 shadow-emerald-500/10 scale-105'
                                                                            : 'bg-white/5 border-white/10'
                                                                    }`}
                                                            >
                                                                <Server className={`w-5 h-5 mx-auto mb-1 ${scalingStatus === 'crashed' ? 'text-red-500' : 'text-[#B58863]'}`} />
                                                                <span className="text-[10px] font-black text-white block">Server {name}</span>
                                                                <span className="text-[8px] text-slate-400 block mt-0.5">CPU: {scalingCpu}%</span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Right: Controllers */}
                                    <div className="lg:col-span-5 flex flex-col justify-between gap-4">

                                        {/* Horizontal Scale Configurator */}
                                        {scalingMode === 'horizontal' && (
                                            <div className="bg-black/20 border border-white/5 rounded-xl p-3.5 space-y-2">
                                                <div className="flex items-center justify-between text-xs">
                                                    <span className="font-bold text-slate-300">Cluster Size Configuration</span>
                                                    <span className="font-mono text-[#B58863] font-bold">{scalingServerCount} Nodes Active</span>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        disabled={isScalingProcessing || scalingServerCount <= 1}
                                                        onClick={() => { setScalingServerCount(prev => prev - 1); setScalingCpu(0); }}
                                                        className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg py-1 text-xs font-bold transition-all disabled:opacity-30"
                                                    >
                                                        - Remove Node
                                                    </button>
                                                    <button
                                                        disabled={isScalingProcessing || scalingServerCount >= 4}
                                                        onClick={() => { setScalingServerCount(prev => prev + 1); setScalingCpu(0); }}
                                                        className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg py-1 text-xs font-bold transition-all disabled:opacity-30"
                                                    >
                                                        + Add Node
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {/* Trigger Buttons */}
                                        <div className="space-y-2">
                                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Trigger Traffic Load</span>
                                            <div className="flex flex-col gap-2">
                                                <button
                                                    disabled={isScalingProcessing}
                                                    onClick={() => triggerScalingTraffic('low')}
                                                    className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 hover:border-emerald-500/40 hover:bg-emerald-500/5 text-slate-200 hover:text-white rounded-xl py-2 px-3 text-xs font-semibold disabled:opacity-50 transition-all"
                                                >
                                                    <Play className="w-3.5 h-3.5 text-emerald-400" />
                                                    <span>Send Low Traffic (10 RPS)</span>
                                                </button>
                                                <button
                                                    disabled={isScalingProcessing}
                                                    onClick={() => triggerScalingTraffic('heavy')}
                                                    className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 hover:border-amber-500/40 hover:bg-amber-500/5 text-slate-200 hover:text-white rounded-xl py-2 px-3 text-xs font-semibold disabled:opacity-50 transition-all"
                                                >
                                                    <Play className="w-3.5 h-3.5 text-amber-400" />
                                                    <span>Send Heavy Traffic (10k RPS)</span>
                                                </button>
                                                <button
                                                    disabled={isScalingProcessing}
                                                    onClick={() => triggerScalingTraffic('ddos')}
                                                    className="flex items-center justify-center gap-2 bg-red-500/10 border border-red-500/20 hover:border-red-500/40 hover:bg-red-500/20 text-red-300 hover:text-red-100 rounded-xl py-2 px-3 text-xs font-semibold disabled:opacity-50 transition-all"
                                                >
                                                    <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                                                    <span>Trigger DDoS / Flash Traffic</span>
                                                </button>
                                            </div>
                                        </div>

                                        {/* Logs console */}
                                        <div className="flex flex-col flex-1 min-h-[120px]">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Load Balancer Telemetry</span>
                                                <button
                                                    onClick={() => {
                                                        setScalingStatus('idle');
                                                        setScalingCpu(0);
                                                        setScalingLogs([]);
                                                        setActiveRequestServer(null);
                                                        setScalingServerCount(1);
                                                        setIsScalingProcessing(false);
                                                    }}
                                                    className="text-[9px] font-semibold text-slate-400 hover:text-white transition-all bg-white/5 border border-white/10 px-2 py-0.5 rounded-md"
                                                >
                                                    Reset
                                                </button>
                                            </div>
                                            <div className="flex-1 bg-black/80 font-mono text-[10px] p-3 rounded-xl border border-white/10 overflow-y-auto space-y-1 h-28 text-emerald-400 shadow-inner">
                                                {scalingLogs.length === 0 ? (
                                                    <span className="text-slate-500">Telemetry idle. Trigger traffic load above...</span>
                                                ) : (
                                                    scalingLogs.map((log, lIdx) => (
                                                        <div key={lIdx} className={log.includes('❌') || log.includes('💥') ? 'text-red-400 font-bold' : log.includes('Warning') ? 'text-amber-400' : 'text-slate-300'}>
                                                            {log}
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>

                            <hr className="border-white/[0.04]" />

                            <div className="space-y-4">
                                <h3 className="font-bold text-white text-base">Key Concept: Consistent Hashing</h3>
                                <p className="text-xs text-slate-300 leading-relaxed">
                                    When horizontally scaling caching or storage nodes, a simple modulo hashing function (`hash(key) % N`) causes massive cache misses if a node joins or leaves the cluster.
                                </p>
                                <p className="text-xs text-slate-300 leading-relaxed">
                                    **Consistent Hashing** maps both keys and servers to a circular ring (hash ring). When a server goes offline or a new one is added, only a fraction of keys (`1/N`) need to be remapped or moved, protecting backend databases from thundering herds.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* DATABASE DESIGN */}
                    {activeSection === 'database-design' && (
                        <div className="space-y-6 animate-in fade-in duration-300">
                            <div>
                                <h2 className="text-2xl font-black text-white tracking-tight">Database Replication & Sharding</h2>
                                <p className="text-slate-300 mt-2 leading-relaxed text-sm">
                                    To scale write and read throughput or partition colossal datasets, databases are replicated (duplicated) or sharded (split horizontally across separate server nodes).
                                </p>
                            </div>

                            {/* DATABASE PLAYGROUND */}
                            <div className="bg-white/5 border border-white/[0.04] rounded-2xl p-6 space-y-6">
                                <div className="flex flex-col sm:flex-row items-center justify-between border-b border-white/[0.06] pb-4 gap-4">
                                    <div>
                                        <h3 className="font-bold text-white text-sm">Interactive Storage Playground</h3>
                                        <p className="text-[10.5px] text-slate-400 mt-0.5">Test asynchronous data replication lag or hash partitioning router routing key calculations.</p>
                                    </div>

                                    {/* Mode selection */}
                                    <div className="flex bg-black/40 p-1 rounded-xl border border-white/10 self-end sm:self-center">
                                        <button
                                            disabled={isDbProcessing}
                                            onClick={() => { setDbMode('replication'); setDbLogs([`[Client] Switched to Replication Mode`]); }}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all disabled:opacity-50 ${dbMode === 'replication' ? 'bg-[#B58863] text-white' : 'text-slate-400 hover:text-white'}`}
                                        >
                                            Replication Sync
                                        </button>
                                        <button
                                            disabled={isDbProcessing}
                                            onClick={() => { setDbMode('sharding'); setDbLogs([`[Client] Switched to Sharding Mode`]); }}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all disabled:opacity-50 ${dbMode === 'sharding' ? 'bg-[#B58863] text-white' : 'text-slate-400 hover:text-white'}`}
                                        >
                                            Horizontal Sharding
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                                    {/* Left Column: Visual Diagram */}
                                    <div className="lg:col-span-7 bg-black/40 border border-white/5 rounded-xl p-4 flex flex-col items-center justify-between min-h-[340px] relative overflow-hidden">
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 self-start">Active Storage Cluster</span>

                                        {dbMode === 'replication' ? (
                                            /* Replication Visualization */
                                            <div className="flex flex-col items-center justify-around flex-1 w-full gap-4">
                                                <div className="bg-[#10232A] border border-white/10 rounded-xl px-4 py-1.5 text-center shadow-md">
                                                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Client Application</span>
                                                </div>

                                                <div className="flex justify-between w-full max-w-[280px] my-1 relative">
                                                    <div className="flex flex-col items-center">
                                                        <span className="text-[9px] text-amber-500 font-bold mb-1 uppercase tracking-wider">Writes</span>
                                                        <ArrowDown className={`w-4 h-4 text-amber-500 ${dbStatus === 'syncing' ? 'animate-bounce' : ''}`} />
                                                    </div>
                                                    <div className="flex flex-col items-center">
                                                        <span className="text-[9px] text-emerald-500 font-bold mb-1 uppercase tracking-wider">Reads</span>
                                                        <ArrowDown className="w-4 h-4 text-emerald-500" />
                                                    </div>
                                                </div>

                                                <div className="flex gap-4 w-full justify-center items-stretch relative">
                                                    {/* Primary DB Card */}
                                                    <div className={`flex-1 border rounded-xl p-3 text-center transition-all duration-300 ${dbStatus === 'syncing' ? 'bg-amber-500/10 border-amber-500 shadow-amber-500/5' : 'bg-white/5 border-white/10'
                                                        }`}>
                                                        <Database className="w-6 h-6 text-[#B58863] mx-auto mb-1.5" />
                                                        <span className="text-xs font-bold block text-white">Primary DB</span>
                                                        <span className="text-[9px] text-slate-400 block mt-0.5">Handles Writes</span>

                                                        {/* Primary Database logs */}
                                                        <div className="mt-2 bg-black/30 p-1.5 rounded text-[8px] font-mono h-16 overflow-y-auto text-slate-300 text-left border border-white/5 space-y-0.5">
                                                            {primaryDb.map((rec, i) => (
                                                                <div key={i} className="truncate">{rec}</div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Sync Arrow Path */}
                                                    <div className="flex flex-col items-center justify-center gap-1 min-w-[36px]">
                                                        <span className="text-[8px] text-slate-500 font-bold uppercase">Sync</span>
                                                        <ArrowRight className={`w-5 h-5 ${dbStatus === 'stale-read' ? 'text-amber-500 animate-pulse' :
                                                                dbStatus === 'synced' ? 'text-emerald-500' : 'text-slate-600'
                                                            }`} />
                                                    </div>

                                                    {/* Replica DB Card */}
                                                    <div className={`flex-1 border rounded-xl p-3 text-center transition-all duration-300 ${dbStatus === 'stale-read'
                                                            ? 'bg-amber-500/10 border-amber-500/50 shadow-amber-500/5 animate-pulse'
                                                            : dbStatus === 'synced'
                                                                ? 'bg-emerald-500/10 border-emerald-500 shadow-emerald-500/10'
                                                                : 'bg-white/5 border-white/10'
                                                        }`}>
                                                        <Database className={`w-6 h-6 mx-auto mb-1.5 ${dbStatus === 'synced' ? 'text-emerald-400' : 'text-slate-500'}`} />
                                                        <span className="text-xs font-bold block text-white">Replica DB</span>
                                                        <span className="text-[9px] text-slate-400 block mt-0.5">Handles Reads</span>

                                                        {/* Replica Database logs */}
                                                        <div className="mt-2 bg-black/30 p-1.5 rounded text-[8px] font-mono h-16 overflow-y-auto text-slate-300 text-left border border-white/5 space-y-0.5">
                                                            {replicaDb.map((rec, i) => (
                                                                <div key={i} className="truncate">{rec}</div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            /* Sharding Visualization */
                                            <div className="flex flex-col items-center justify-between flex-1 w-full gap-4">
                                                <div className="bg-[#10232A] border border-white/10 rounded-xl px-4 py-1.5 text-center shadow-md">
                                                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Client Application</span>
                                                </div>

                                                <ArrowDown className="w-4 h-4 text-slate-500" />

                                                {/* Sharding Hash Router Box */}
                                                <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 flex flex-col items-center justify-center gap-1 text-xs font-semibold max-w-[220px] w-full text-slate-200 shadow-md">
                                                    <div className="flex items-center gap-1.5">
                                                        <Network className="w-4 h-4 text-[#B58863]" /> Sharding Router
                                                    </div>
                                                    <span className="text-[8px] font-mono text-slate-400">hash(name) % 2</span>
                                                </div>

                                                {/* Connection Paths SVG */}
                                                <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                                                    <line
                                                        x1="50%" y1="52%" x2="25%" y2="78%"
                                                        stroke={dbStatus === 'synced' && shardRouteResult === 'shard_A_M' ? '#10B981' : 'rgba(255,255,255,0.06)'}
                                                        strokeWidth="1.5"
                                                        className="transition-all duration-300"
                                                    />
                                                    <line
                                                        x1="50%" y1="52%" x2="75%" y2="78%"
                                                        stroke={dbStatus === 'synced' && shardRouteResult === 'shard_N_Z' ? '#10B981' : 'rgba(255,255,255,0.06)'}
                                                        strokeWidth="1.5"
                                                        className="transition-all duration-300"
                                                    />
                                                </svg>

                                                {/* Shards pool */}
                                                <div className="flex gap-4 justify-center w-full mt-2 z-10 px-2">
                                                    {/* Shard A */}
                                                    <div className={`flex-1 border rounded-xl p-3 text-center transition-all duration-300 ${dbStatus === 'synced' && shardRouteResult === 'shard_A_M'
                                                            ? 'bg-emerald-500/10 border-emerald-500 shadow-emerald-500/10 scale-105'
                                                            : 'bg-white/5 border-white/10'
                                                        }`}>
                                                        <Database className="w-5 h-5 mx-auto mb-1 text-[#B58863]" />
                                                        <span className="text-[10px] font-bold text-white block">Shard A (A-M)</span>

                                                        <div className="mt-2 bg-black/30 p-1.5 rounded text-[8px] font-mono h-16 overflow-y-auto text-slate-300 text-left border border-white/5 space-y-0.5">
                                                            {shards.shard_A_M.map((rec, i) => (
                                                                <div key={i} className="truncate">{rec}</div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Shard B */}
                                                    <div className={`flex-1 border rounded-xl p-3 text-center transition-all duration-300 ${dbStatus === 'synced' && shardRouteResult === 'shard_N_Z'
                                                            ? 'bg-emerald-500/10 border-emerald-500 shadow-emerald-500/10 scale-105'
                                                            : 'bg-white/5 border-white/10'
                                                        }`}>
                                                        <Database className="w-5 h-5 mx-auto mb-1 text-[#B58863]" />
                                                        <span className="text-[10px] font-bold text-white block">Shard B (N-Z)</span>

                                                        <div className="mt-2 bg-black/30 p-1.5 rounded text-[8px] font-mono h-16 overflow-y-auto text-slate-300 text-left border border-white/5 space-y-0.5">
                                                            {shards.shard_N_Z.map((rec, i) => (
                                                                <div key={i} className="truncate">{rec}</div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Right Column: Controller Panel */}
                                    <div className="lg:col-span-5 flex flex-col justify-between gap-4">

                                        {/* Sync Mode Config for replication */}
                                        {dbMode === 'replication' && (
                                            <div className="bg-black/20 border border-white/5 rounded-xl p-3.5 space-y-2">
                                                <div className="flex items-center justify-between text-xs">
                                                    <span className="font-bold text-slate-300">Replication Protocol</span>
                                                    <span className="font-mono text-[#B58863] font-bold">{syncMode === 'sync' ? 'Synchronous' : 'Asynchronous'}</span>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        disabled={isDbProcessing}
                                                        onClick={() => setSyncMode('sync')}
                                                        className={`flex-1 border rounded-lg py-1 text-xs font-bold transition-all disabled:opacity-50 ${syncMode === 'sync' ? 'bg-[#B58863]/20 border-[#B58863] text-white' : 'bg-white/5 border-white/10 text-slate-400'}`}
                                                    >
                                                        Sync (Strong)
                                                    </button>
                                                    <button
                                                        disabled={isDbProcessing}
                                                        onClick={() => setSyncMode('async')}
                                                        className={`flex-1 border rounded-lg py-1 text-xs font-bold transition-all disabled:opacity-50 ${syncMode === 'async' ? 'bg-[#B58863]/20 border-[#B58863] text-white' : 'bg-white/5 border-white/10 text-slate-400'}`}
                                                    >
                                                        Async (Eventual)
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {/* Input Box to Commit record */}
                                        <div className="bg-black/20 border border-white/5 rounded-xl p-3.5 space-y-3.5">
                                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Write New Record</span>
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    placeholder="Enter username (e.g. Maria)..."
                                                    value={lastInputName}
                                                    onChange={(e) => setLastInputName(e.target.value)}
                                                    disabled={isDbProcessing}
                                                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#B58863]/50 focus:ring-1 focus:ring-[#B58863]/20 disabled:opacity-50"
                                                />
                                                <button
                                                    disabled={isDbProcessing || !lastInputName.trim()}
                                                    onClick={() => { triggerDbWrite(lastInputName); setLastInputName(''); }}
                                                    className="bg-[#B58863] hover:bg-[#B58863]/85 text-white rounded-xl px-4 py-1.5 text-xs font-bold disabled:opacity-50 transition-all flex items-center gap-1"
                                                >
                                                    <Play className="w-3 h-3" /> Commit
                                                </button>
                                            </div>
                                            {dbStatus === 'stale-read' && (
                                                <div className="flex gap-2 items-start bg-amber-500/5 border border-amber-500/10 p-2.5 rounded-lg text-[10px] text-amber-500 animate-pulse">
                                                    <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                                                    <span><strong>Stale Read Window Alert:</strong> Primary is updated, but Replica is out of sync due to async replication lag. Reading replica now returns old data!</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Telemetry Console */}
                                        <div className="flex flex-col flex-1 min-h-[120px]">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Database Transaction Logs</span>
                                                <button
                                                    onClick={() => {
                                                        setPrimaryDb(['User: Alex (ID: 1)']);
                                                        setReplicaDb(['User: Alex (ID: 1)']);
                                                        setShards({
                                                            'shard_A_M': ['Alex (ID: 1)', 'Emily (ID: 4)'],
                                                            'shard_N_Z': ['Sarah (ID: 2)', 'Zack (ID: 3)']
                                                        });
                                                        setDbLogs([]);
                                                        setDbStatus('idle');
                                                        setLastInputName('');
                                                        setShardRouteResult(null);
                                                        setIsDbProcessing(false);
                                                    }}
                                                    className="text-[9px] font-semibold text-slate-400 hover:text-white transition-all bg-white/5 border border-white/10 px-2 py-0.5 rounded-md"
                                                >
                                                    Reset
                                                </button>
                                            </div>
                                            <div className="flex-1 bg-black/80 font-mono text-[10px] p-3 rounded-xl border border-white/10 overflow-y-auto space-y-1 h-28 text-emerald-400 shadow-inner">
                                                {dbLogs.length === 0 ? (
                                                    <span className="text-slate-500">No transactions recorded. Commit a write above...</span>
                                                ) : (
                                                    dbLogs.map((log, lIdx) => (
                                                        <div key={lIdx} className={log.includes('❌') ? 'text-red-400 font-bold' : log.includes('stale') || log.includes('lag') ? 'text-amber-400' : 'text-slate-300'}>
                                                            {log}
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>

                            <hr className="border-white/[0.04]" />

                            {/* Comparison Table */}
                            <div className="space-y-3">
                                <h3 className="font-bold text-white text-sm">Relational (SQL) vs. Non-Relational (NoSQL)</h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-xs text-slate-300 border-collapse border border-white/10">
                                        <thead>
                                            <tr className="bg-white/5 text-white">
                                                <th className="border border-white/10 p-2.5 text-left">Property</th>
                                                <th className="border border-white/10 p-2.5 text-left">SQL Databases</th>
                                                <th className="border border-white/10 p-2.5 text-left">NoSQL Databases</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td className="border border-white/10 p-2.5 font-bold">Data Model</td>
                                                <td className="border border-white/10 p-2.5">Structured tables, rows, strict schemas, foreign keys.</td>
                                                <td className="border border-white/10 p-2.5">Unstructured/Dynamic key-value, document (JSON), columns, graphs.</td>
                                            </tr>
                                            <tr className="bg-white/[0.01]">
                                                <td className="border border-white/10 p-2.5 font-bold">Scaling</td>
                                                <td className="border border-white/10 p-2.5">Typically vertical. Horizontal requires complex sharding setup.</td>
                                                <td className="border border-white/10 p-2.5">Horizontally scalable by partitioning keys automatically.</td>
                                            </tr>
                                            <tr>
                                                <td className="border border-white/10 p-2.5 font-bold">Transactions</td>
                                                <td className="border border-white/10 p-2.5">Strong ACID (Atomicity, Consistency, Isolation, Durability).</td>
                                                <td className="border border-white/10 p-2.5">BASE properties (Basically Available, Soft State, Eventual Consistency).</td>
                                            </tr>
                                            <tr className="bg-white/[0.01]">
                                                <td className="border border-white/10 p-2.5 font-bold">Common Use Cases</td>
                                                <td className="border border-white/10 p-2.5">Financial ledgers, e-commerce orders, relational profiles.</td>
                                                <td className="border border-white/10 p-2.5">Real-time chats, analytics log streams, user sessions, catalogs.</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* CACHING LATENCY */}
                    {activeSection === 'caching-latency' && (
                        <div className="space-y-6 animate-in fade-in duration-300">
                            <div>
                                <h2 className="text-2xl font-black text-white tracking-tight">Caching Topologies & High-Traffic Risks</h2>
                                <p className="text-slate-300 mt-2 leading-relaxed text-sm">
                                    Caching key-value pairs in memory (using Redis) cuts down round-trip database queries, reducing application latency from &gt;50ms to &lt;2ms.
                                </p>
                            </div>

                            {/* CACHING PLAYGROUND */}
                            <div className="bg-white/5 border border-white/[0.04] rounded-2xl p-6 space-y-6">
                                <div className="flex flex-col sm:flex-row items-center justify-between border-b border-white/[0.06] pb-4 gap-4">
                                    <div>
                                        <h3 className="font-bold text-white text-sm">Interactive Cache-Aside Playground</h3>
                                        <p className="text-[10.5px] text-slate-400 mt-0.5">Toggle Bloom Filters to shield against Cache Penetration attacks, or test Cache Stampede stampedes.</p>
                                    </div>

                                    {/* Bloom Filter Toggle */}
                                    <div className="flex items-center gap-2 self-end sm:self-center bg-black/40 border border-white/10 px-3 py-1.5 rounded-xl">
                                        <span className="text-xs font-bold text-slate-300">Bloom Filter:</span>
                                        <button
                                            disabled={isCacheProcessing}
                                            onClick={() => setBloomFilterActive(!bloomFilterActive)}
                                            className={`px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wide border transition-all disabled:opacity-50 ${bloomFilterActive
                                                    ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                                                    : 'bg-white/5 border-white/10 text-slate-400'
                                                }`}
                                        >
                                            {bloomFilterActive ? 'ON (Active)' : 'OFF'}
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                                    {/* Left: Graphic mapping */}
                                    <div className="lg:col-span-7 bg-black/40 border border-white/5 rounded-xl p-4 flex flex-col items-center justify-between min-h-[340px] relative overflow-hidden">
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 self-start">Active Cache Topology</span>

                                        {/* Paths */}
                                        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                                            {/* App to Bloom */}
                                            <line
                                                x1="50%" y1="12%" x2="50%" y2="34%"
                                                stroke={cachingStatus !== 'idle' ? '#B58863' : 'rgba(255,255,255,0.06)'}
                                                strokeWidth="2"
                                            />
                                            {/* Bloom to Cache */}
                                            <line
                                                x1="50%" y1="34%" x2="22%" y2="68%"
                                                stroke={cachingStatus === 'hit' || cachingStatus === 'miss' || cachingStatus === 'db-query' || cachingStatus === 'stampede' ? '#B58863' : 'rgba(255,255,255,0.06)'}
                                                strokeWidth="2"
                                            />
                                            {/* App to DB */}
                                            <line
                                                x1="50%" y1="34%" x2="78%" y2="68%"
                                                stroke={cachingStatus === 'db-query' || cachingStatus === 'stampede' ? '#10B981' : 'rgba(255,255,255,0.06)'}
                                                strokeWidth="2"
                                            />
                                        </svg>

                                        {/* App Server */}
                                        <div className="z-10 bg-[#10232A] border border-white/10 rounded-xl px-4 py-1.5 text-center shadow-md">
                                            <span className="text-[10px] font-bold text-slate-400 block uppercase">App Server</span>
                                        </div>

                                        {/* Bloom Filter Node */}
                                        <div className={`z-10 border rounded-xl px-3 py-1.5 text-center transition-all duration-300 ${bloomFilterActive
                                                ? 'bg-emerald-500/10 border-emerald-500 text-white'
                                                : 'bg-white/5 border-white/10 text-slate-500'
                                            }`}>
                                            <Shield className="w-4 h-4 mx-auto mb-0.5" />
                                            <span className="text-[9px] font-bold block">Bloom Filter Guard</span>
                                        </div>

                                        {/* Downstream Storage/Cache Tier */}
                                        <div className="w-full flex justify-around px-2 gap-4 z-10">
                                            {/* Cache */}
                                            <div className={`flex-1 border rounded-xl p-3 text-center transition-all duration-300 max-w-[150px] ${cachingStatus === 'hit'
                                                    ? 'bg-emerald-500/10 border-emerald-500 shadow-emerald-500/10 scale-105'
                                                    : cachingStatus === 'miss'
                                                        ? 'bg-amber-500/10 border-amber-500'
                                                        : 'bg-white/5 border-white/10'
                                                }`}>
                                                <HardDrive className={`w-5 h-5 mx-auto mb-1.5 ${cachingStatus === 'hit' ? 'text-emerald-400' : 'text-[#B58863]'}`} />
                                                <span className="text-[10px] font-bold text-white block">Redis Cache</span>
                                            </div>

                                            {/* DB */}
                                            <div className={`flex-1 border rounded-xl p-3 text-center transition-all duration-300 max-w-[150px] ${cachingStatus === 'db-query'
                                                    ? 'bg-emerald-500/10 border-emerald-500 shadow-emerald-500/10 scale-105'
                                                    : cachingStatus === 'stampede'
                                                        ? 'bg-red-500/10 border-red-500 animate-pulse'
                                                        : 'bg-white/5 border-white/10'
                                                }`}>
                                                <Database className={`w-5 h-5 mx-auto mb-1.5 ${cachingStatus === 'stampede' ? 'text-red-500' : 'text-slate-400'}`} />
                                                <span className="text-[10px] font-bold text-white block">Database</span>
                                            </div>
                                        </div>

                                        {/* Packet animation */}
                                        {cachingStatus !== 'idle' && (
                                            <div
                                                className={`absolute w-3 h-3 rounded-full z-20 transition-all duration-500 ease-in-out pointer-events-none ${cachingStatus === 'blocked' ? 'bg-red-500 shadow-[0_0_12px_#EF4444]' : 'bg-[#B58863] shadow-[0_0_12px_#B58863]'
                                                    }`}
                                                style={{
                                                    left: cachingStatus === 'checking' ? '50%'
                                                        : cachingStatus === 'blocked' ? '50%'
                                                            : cachingStatus === 'hit' ? '22%'
                                                                : cachingStatus === 'miss' ? '22%'
                                                                    : (cachingStatus === 'db-query' || cachingStatus === 'stampede') ? '78%'
                                                                        : '50%',
                                                    top: cachingStatus === 'checking' ? '12%'
                                                        : cachingStatus === 'blocked' ? '34%'
                                                            : cachingStatus === 'hit' ? '68%'
                                                                : cachingStatus === 'miss' ? '68%'
                                                                    : (cachingStatus === 'db-query' || cachingStatus === 'stampede') ? '68%'
                                                                        : '12%',
                                                    transform: 'translate(-50%, -50%)',
                                                    opacity: 1
                                                }}
                                            />
                                        )}
                                    </div>

                                    {/* Right: Controller panels */}
                                    <div className="lg:col-span-5 flex flex-col justify-between gap-4">

                                        {/* Latency Meter */}
                                        <div className="bg-black/20 border border-white/5 rounded-xl p-3.5 space-y-2">
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="font-bold text-slate-300">Measured Request Latency</span>
                                                <span className={`font-mono font-bold ${cacheLatency === 0 ? 'text-slate-500' :
                                                        cacheLatency < 5 ? 'text-emerald-400 font-extrabold' :
                                                            cacheLatency < 50 ? 'text-amber-400 font-semibold' : 'text-red-400 font-bold'
                                                    }`}>
                                                    {cacheLatency === 0 ? '---' : `${cacheLatency} ms`}
                                                </span>
                                            </div>
                                            {/* Latency speed bar visual */}
                                            <div className="bg-white/5 h-2 w-full rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full transition-all duration-500 ${cacheLatency === 0 ? 'w-0' :
                                                            cacheLatency < 5 ? 'bg-emerald-500 w-[5%]' :
                                                                cacheLatency < 50 ? 'bg-amber-400 w-[50%]' : 'bg-red-500 w-[100%]'
                                                        }`}
                                                />
                                            </div>
                                        </div>

                                        {/* Keys triggers */}
                                        <div className="space-y-2">
                                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Fetch User Key</span>
                                            <div className="grid grid-cols-2 gap-2">
                                                <button
                                                    disabled={isCacheProcessing}
                                                    onClick={() => triggerCacheRequest('user_123', false)}
                                                    className="flex items-center justify-center gap-1.5 bg-white/5 border border-white/10 hover:border-[#B58863]/40 hover:bg-[#B58863]/5 rounded-xl py-2 px-3 text-xs font-semibold text-slate-200 hover:text-white transition-all disabled:opacity-50"
                                                >
                                                    <span>user_123 (Cache Hit)</span>
                                                </button>
                                                <button
                                                    disabled={isCacheProcessing}
                                                    onClick={() => triggerCacheRequest('user_789', false)}
                                                    className="flex items-center justify-center gap-1.5 bg-white/5 border border-white/10 hover:border-[#B58863]/40 hover:bg-[#B58863]/5 rounded-xl py-2 px-3 text-xs font-semibold text-slate-200 hover:text-white transition-all disabled:opacity-50"
                                                >
                                                    <span>user_789 (Cache Miss)</span>
                                                </button>
                                                <button
                                                    disabled={isCacheProcessing}
                                                    onClick={() => triggerCacheRequest('user_invalid', true)}
                                                    className="flex items-center justify-center gap-1.5 bg-red-500/5 border border-red-500/10 hover:border-red-500/30 hover:bg-red-500/10 rounded-xl py-2 px-3 text-xs font-semibold text-red-300 hover:text-red-100 transition-all disabled:opacity-50"
                                                >
                                                    <span>user_invalid (Penetrate)</span>
                                                </button>
                                                <button
                                                    disabled={isCacheProcessing}
                                                    onClick={triggerCacheStampede}
                                                    className="flex items-center justify-center gap-1.5 bg-amber-500/5 border border-amber-500/10 hover:border-amber-500/30 hover:bg-amber-500/10 rounded-xl py-2 px-3 text-xs font-semibold text-amber-300 hover:text-amber-100 transition-all disabled:opacity-50"
                                                >
                                                    <span>Trigger Stampede</span>
                                                </button>
                                            </div>
                                        </div>

                                        {/* Telemetry Console */}
                                        <div className="flex flex-col flex-1 min-h-[120px]">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Cache Engine Logs</span>
                                                <button
                                                    onClick={() => {
                                                        setCacheStore({
                                                            'user_123': '{"id": 123, "name": "Sarah", "status": "active"}',
                                                            'user_456': '{"id": 456, "name": "Jack", "status": "pending"}'
                                                        });
                                                        setBloomFilterActive(false);
                                                        setCachingLogs([]);
                                                        setCachingStatus('idle');
                                                        setCacheLatency(0);
                                                        setIsCacheProcessing(false);
                                                    }}
                                                    className="text-[9px] font-semibold text-slate-400 hover:text-white transition-all bg-white/5 border border-white/10 px-2 py-0.5 rounded-md"
                                                >
                                                    Reset
                                                </button>
                                            </div>
                                            <div className="flex-1 bg-black/80 font-mono text-[10px] p-3 rounded-xl border border-white/10 overflow-y-auto space-y-1 h-28 text-emerald-400 shadow-inner">
                                                {cachingLogs.length === 0 ? (
                                                    <span className="text-slate-500">Console idle. Request keys above...</span>
                                                ) : (
                                                    cachingLogs.map((log, lIdx) => (
                                                        <div key={lIdx} className={log.includes('❌') || log.includes('⚠️') ? 'text-red-400 font-bold' : log.includes('✅') || log.includes('passed') ? 'text-emerald-400 font-semibold' : 'text-slate-300'}>
                                                            {log}
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>

                            <hr className="border-white/[0.04]" />

                            <div className="space-y-3">
                                <h3 className="font-bold text-white text-sm flex items-center gap-1.5 text-amber-500">
                                    <ShieldAlert className="w-4 h-4" /> Crucial Production Caching Failures
                                </h3>

                                <div className="space-y-3 text-xs text-slate-300">
                                    <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                                        <strong>1. Cache Stampede (Thundering Herd)</strong>
                                        <p className="text-slate-400 mt-1 leading-relaxed">
                                            Occurs when a popular, hot key expires and millions of concurrent read threads fail cache lookups at the same instant. They stampede the backing database to query it, causing query timeouts and DB crashes.
                                            <br /><em>Mitigation:</em> Use locking mechanisms (mutex) so only a single thread fetches the data, or dynamically calculate early expiration times.
                                        </p>
                                    </div>
                                    <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                                        <strong>2. Cache Penetration</strong>
                                        <p className="text-slate-400 mt-1 leading-relaxed">
                                            Occurs when clients request keys that exist neither in the cache nor the database (e.g. searching user ID `-999`). Every lookup misses cache and hits DB.
                                            <br /><em>Mitigation:</em> Cache empty/null values with a short TTL, or pass requests through a **Bloom Filter** (probabilistic structure) to verify if the key exists before hitting the backend.
                                        </p>
                                    </div>
                                    <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                                        <strong>3. Cache Avalanche</strong>
                                        <p className="text-slate-400 mt-1 leading-relaxed">
                                            Occurs when a large portion of cached keys are initialized to expire at the exact same time, causing a complete lack of caching for a prolonged window.
                                            <br /><em>Mitigation:</em> Add a small, randomized **jitter** (e.g., random offset of 1–5 minutes) to the expiration TTL of each key.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* QUEUES ASYNC */}
                    {activeSection === 'queues-async' && (
                        <div className="space-y-6 animate-in fade-in duration-300">
                            <div>
                                <h2 className="text-2xl font-black text-white tracking-tight">Asynchronous Pipelines & Message Brokers</h2>
                                <p className="text-slate-300 mt-2 leading-relaxed text-sm">
                                    Do not process expensive tasks (such as video rendering, PDF compiling, or high-volume analytics) synchronously inside your request-response cycle. Offload them to background consumer threads using a Message Broker or Queue.
                                </p>
                            </div>

                            {/* QUEUE PLAYGROUND */}
                            <div className="bg-white/5 border border-white/[0.04] rounded-2xl p-6 space-y-6">
                                <div className="flex flex-col sm:flex-row items-center justify-between border-b border-white/[0.06] pb-4 gap-4">
                                    <div>
                                        <h3 className="font-bold text-white text-sm">Interactive Message Queue Playground</h3>
                                        <p className="text-[10.5px] text-slate-400 mt-0.5">Publish heavy worker requests, configure concurrent consumers, and observe backpressure buffer logs.</p>
                                    </div>

                                    {/* Worker Count Config */}
                                    <div className="flex items-center gap-2 self-end sm:self-center bg-black/40 border border-white/10 px-3 py-1.5 rounded-xl">
                                        <span className="text-xs font-bold text-slate-300">Active Workers:</span>
                                        <div className="flex items-center gap-1.5">
                                            <button
                                                disabled={workerCount <= 1}
                                                onClick={() => setWorkerCount(prev => prev - 1)}
                                                className="bg-white/5 hover:bg-white/10 px-2 py-0.5 border border-white/10 rounded text-xs font-bold text-slate-300 disabled:opacity-30"
                                            >
                                                -
                                            </button>
                                            <span className="font-mono text-xs font-bold text-white px-1.5">{workerCount}</span>
                                            <button
                                                disabled={workerCount >= 4}
                                                onClick={() => setWorkerCount(prev => prev + 1)}
                                                className="bg-white/5 hover:bg-white/10 px-2 py-0.5 border border-white/10 rounded text-xs font-bold text-slate-300 disabled:opacity-30"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                                    {/* Left: Queue SVG & Workers Visual */}
                                    <div className="lg:col-span-7 bg-black/40 border border-white/5 rounded-xl p-4 flex flex-col justify-between min-h-[340px] relative overflow-hidden">
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Queue System Pipeline</span>

                                        <div className="flex flex-col items-center justify-around flex-1 w-full gap-6">
                                            {/* API Publisher box */}
                                            <div className="bg-[#10232A] border border-white/10 rounded-xl px-4 py-1.5 text-center shadow-md">
                                                <span className="text-[10px] font-bold text-slate-400 block uppercase">API Server</span>
                                                <span className="text-xs font-semibold text-white">Publisher (Ingestion)</span>
                                            </div>

                                            {/* Connection Line: API -> Queue */}
                                            <ArrowDown className="w-4 h-4 text-slate-500" />

                                            {/* Message Queue sliding container */}
                                            <div className="w-full max-w-[420px] bg-[#B58863]/5 border-2 border-dashed border-[#B58863]/30 rounded-xl p-3.5 flex items-center justify-between gap-3 shadow-inner">
                                                <span className="text-[9px] font-extrabold uppercase text-[#B58863] tracking-wide writing-mode-vertical">Buffer</span>

                                                <div className="flex-1 flex gap-2 overflow-x-auto justify-end">
                                                    {queue.length === 0 ? (
                                                        <div className="text-[10px] text-slate-500 italic py-1 text-center w-full">Queue buffer empty. Ready for tasks...</div>
                                                    ) : (
                                                        queue.map((task, tIdx) => (
                                                            <div
                                                                key={tIdx}
                                                                className="flex-shrink-0 bg-[#10232A] border border-[#B58863]/30 rounded px-2.5 py-1.5 text-[9px] font-mono text-slate-300 shadow"
                                                            >
                                                                {task.split('Task: ')[1]}
                                                            </div>
                                                        ))
                                                    )}
                                                </div>

                                                <RefreshCw className={`w-4 h-4 text-[#B58863] flex-shrink-0 ${queue.length > 0 ? 'animate-spin' : ''}`} />
                                            </div>

                                            {/* Connection lines from Queue to workers */}
                                            <ArrowDown className="w-4 h-4 text-slate-500" />

                                            {/* Consumers Worker Cluster */}
                                            <div className="flex gap-2.5 justify-center w-full z-10 px-2">
                                                {Array.from({ length: workerCount }).map((_, i) => {
                                                    const currentTask = workerProcessing[i];
                                                    const letter = String.fromCharCode(65 + i);
                                                    return (
                                                        <div
                                                            key={i}
                                                            className={`flex-1 border rounded-xl p-2 text-center transition-all duration-300 ${currentTask
                                                                    ? 'bg-emerald-500/10 border-emerald-500 shadow-emerald-500/10 animate-pulse'
                                                                    : 'bg-white/5 border-white/10'
                                                                }`}
                                                        >
                                                            <Cpu className={`w-4 h-4 mx-auto mb-1 ${currentTask ? 'text-emerald-400' : 'text-slate-500'}`} />
                                                            <span className="text-[9px] font-extrabold text-white block">Worker {letter}</span>
                                                            <span className="text-[8px] text-slate-400 block truncate mt-1">
                                                                {currentTask ? currentTask.split('Task: ')[1] : 'Idle'}
                                                            </span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right: Controller panels */}
                                    <div className="lg:col-span-5 flex flex-col justify-between gap-4">

                                        {/* Backpressure Meter */}
                                        <div className="bg-black/20 border border-white/5 rounded-xl p-3.5 space-y-2">
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="font-bold text-slate-300">Queue Buffer Load</span>
                                                <span className={`font-mono font-bold ${queue.length === 0 ? 'text-slate-500' :
                                                        queue.length <= 2 ? 'text-emerald-400' :
                                                            queue.length <= 4 ? 'text-amber-400' : 'text-red-400 animate-pulse'
                                                    }`}>
                                                    {queue.length} Tasks Pending
                                                </span>
                                            </div>
                                            {/* Progress load bar */}
                                            <div className="bg-white/5 h-2 w-full rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full transition-all duration-500 ${queue.length === 0 ? 'w-0' :
                                                            queue.length <= 2 ? 'bg-emerald-500 w-[30%]' :
                                                                queue.length <= 4 ? 'bg-amber-400 w-[60%]' : 'bg-red-500 w-[100%]'
                                                        }`}
                                                />
                                            </div>
                                        </div>

                                        {/* Action buttons */}
                                        <div className="space-y-2">
                                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Enqueue Operations</span>
                                            <button
                                                disabled={queue.length >= 10}
                                                onClick={publishQueueTask}
                                                className="w-full flex items-center justify-center gap-2 bg-[#B58863] hover:bg-[#B58863]/85 text-white rounded-xl py-2 px-3 text-xs font-bold transition-all shadow animate-pulse disabled:opacity-50 disabled:animate-none"
                                            >
                                                <Play className="w-3.5 h-3.5 fill-current" />
                                                <span>Publish Random Task</span>
                                            </button>
                                        </div>

                                        {/* Logs Console */}
                                        <div className="flex flex-col flex-1 min-h-[120px]">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Queue Pipeline logs</span>
                                                <button
                                                    onClick={() => {
                                                        setQueue(['Task: Transcode Video 1080p', 'Task: Compile Invoice PDF']);
                                                        setWorkerProcessing({ 0: null, 1: null, 2: null, 3: null });
                                                        setQueueLogs([]);
                                                        setIsProcessingQueue(false);
                                                    }}
                                                    className="text-[9px] font-semibold text-slate-400 hover:text-white transition-all bg-white/5 border border-white/10 px-2 py-0.5 rounded-md"
                                                >
                                                    Reset
                                                </button>
                                            </div>
                                            <div className="flex-1 bg-black/80 font-mono text-[10px] p-3 rounded-xl border border-white/10 overflow-y-auto space-y-1 h-28 text-emerald-400 shadow-inner">
                                                {queueLogs.length === 0 ? (
                                                    <span className="text-slate-500">Pipeline idle. Publish tasks to stream logs...</span>
                                                ) : (
                                                    queueLogs.map((log, lIdx) => (
                                                        <div key={lIdx} className={log.includes('Completed') ? 'text-emerald-400 font-semibold' : 'text-slate-300'}>
                                                            {log}
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>

                            <hr className="border-white/[0.04]" />

                            <ul className="text-xs text-slate-300 space-y-2 list-disc pl-5 leading-relaxed">
                                <li><strong>Decoupling:</strong> The API server completes requests immediately once a task enters the queue, increasing user-perceived performance.</li>
                                <li><strong>Backpressure & Rate Leveling:</strong> If workers are overloaded, the queue safely holds tasks, avoiding server crashes. Workers scale up/down based on consumer lag.</li>
                                <li><strong>Dead-Letter Queue (DLQ):</strong> If a task fails evaluation multiple times, route it to a DLQ for review instead of blocking the main thread.</li>
                            </ul>
                        </div>
                    )}

                    {/* GATEWAYS APIS */}
                    {activeSection === 'gateways-apis' && (
                        <div className="space-y-8 animate-in fade-in duration-300">
                            <div>
                                <h2 className="text-2xl font-black text-white tracking-tight">API Gateways, Microservices & Rate Limiting</h2>
                                <p className="text-slate-300 mt-2 leading-relaxed text-sm">
                                    A distributed system has multiple microservices. Instead of exposing all nodes to clients directly, wrap them in an API Gateway layer. This serves as the single entry point, handles cross-cutting concerns, and decouples clients from internal topology.
                                </p>
                            </div>

                            {/* INTERACTIVE SIMULATION CONTAINER */}
                            <div className="bg-white/5 border border-white/[0.04] rounded-2xl p-6 space-y-6">
                                <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
                                    <div>
                                        <h3 className="font-bold text-white text-sm">Interactive API Gateway Simulator</h3>
                                        <p className="text-[10.5px] text-slate-400 mt-0.5">Click actions to trigger live request routing and observe the rate limiter token bucket.</p>
                                    </div>
                                    <div className="flex items-center gap-1.5 bg-[#B58863]/10 border border-[#B58863]/25 px-2.5 py-1 rounded-lg">
                                        <Clock className="w-3.5 h-3.5 text-[#B58863] animate-pulse" />
                                        <span className="text-[10px] font-bold text-white uppercase tracking-wider">Refills: +1 Token / 3s</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                                    {/* Left Column: Visual SVG Route Map */}
                                    <div className="lg:col-span-7 bg-black/40 border border-white/5 rounded-xl p-4 flex flex-col items-center justify-between min-h-[340px] relative overflow-hidden">
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 self-start">Interactive Route Topology</span>

                                        {/* Connection Lines (SVG) */}
                                        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                                            {/* Client to Gateway */}
                                            <line
                                                x1="50%" y1="12%" x2="50%" y2="40%"
                                                stroke={simStep >= 1 ? (simStatus === 'rate-limited' ? '#EF4444' : '#B58863') : 'rgba(255,255,255,0.06)'}
                                                strokeWidth="2"
                                                strokeDasharray={simStep === 1 ? '4 4' : 'none'}
                                                className="transition-all duration-300"
                                            />
                                            {/* Gateway to Auth */}
                                            <line
                                                x1="50%" y1="52%" x2="20%" y2="82%"
                                                stroke={simStep >= 3 && simRoute === 'auth' ? '#10B981' : 'rgba(255,255,255,0.06)'}
                                                strokeWidth="2"
                                                className="transition-all duration-300"
                                            />
                                            {/* Gateway to Design */}
                                            <line
                                                x1="50%" y1="52%" x2="50%" y2="82%"
                                                stroke={simStep >= 3 && simRoute === 'draw' ? '#10B981' : 'rgba(255,255,255,0.06)'}
                                                strokeWidth="2"
                                                className="transition-all duration-300"
                                            />
                                            {/* Gateway to Leaderboard */}
                                            <line
                                                x1="50%" y1="52%" x2="80%" y2="82%"
                                                stroke={simStep >= 3 && simRoute === 'leaderboard' ? '#10B981' : 'rgba(255,255,255,0.06)'}
                                                strokeWidth="2"
                                                className="transition-all duration-300"
                                            />
                                        </svg>

                                        {/* Client Node */}
                                        <div className="z-10 bg-[#10232A] border border-white/10 rounded-xl px-4 py-1.5 text-center shadow-md">
                                            <span className="text-[10px] font-bold text-slate-400 block uppercase">Client Node</span>
                                            <span className="text-xs font-semibold text-white">Browser/App</span>
                                        </div>

                                        {/* API Gateway Layer Box */}
                                        <div className={`z-10 w-full max-w-[240px] border rounded-xl p-3 text-center transition-all duration-300 shadow-lg ${simStep === 2
                                                ? (simStatus === 'rate-limited' ? 'bg-red-500/10 border-red-500/50 shadow-red-500/10' : 'bg-[#B58863]/20 border-[#B58863] shadow-[#B58863]/10 scale-105')
                                                : 'bg-[#10232A] border-white/10'
                                            }`}>
                                            <Shield className={`w-5 h-5 mx-auto mb-1 transition-colors ${simStatus === 'rate-limited' ? 'text-red-500' : 'text-[#B58863]'
                                                }`} />
                                            <span className="text-xs font-bold block text-white">API Gateway Layer</span>
                                            <span className="text-[9px] text-slate-400 block mt-0.5">Auth Check • Rate Limiting • Routing</span>
                                        </div>

                                        {/* Downstream Service Clusters */}
                                        <div className="w-full flex justify-between px-2 gap-3 z-10">
                                            {/* Auth Service */}
                                            <div className={`flex-1 border rounded-xl p-2.5 text-center transition-all duration-300 ${simStep >= 3 && simRoute === 'auth'
                                                    ? 'bg-emerald-500/10 border-emerald-500 shadow-emerald-500/10 scale-105'
                                                    : 'bg-white/5 border-white/10'
                                                }`}>
                                                <Lock className={`w-4 h-4 mx-auto mb-1 ${simStep >= 3 && simRoute === 'auth' ? 'text-emerald-400' : 'text-slate-500'}`} />
                                                <span className="text-[10px] font-bold text-white block">Auth Service</span>
                                                <span className="text-[8px] text-slate-400 block mt-0.5">Port 8081</span>
                                            </div>

                                            {/* Design Service */}
                                            <div className={`flex-1 border rounded-xl p-2.5 text-center transition-all duration-300 ${simStep >= 3 && simRoute === 'draw'
                                                    ? 'bg-emerald-500/10 border-emerald-500 shadow-emerald-500/10 scale-105'
                                                    : 'bg-white/5 border-white/10'
                                                }`}>
                                                <Code className={`w-4 h-4 mx-auto mb-1 ${simStep >= 3 && simRoute === 'draw' ? 'text-emerald-400' : 'text-slate-500'}`} />
                                                <span className="text-[10px] font-bold text-white block">Design Service</span>
                                                <span className="text-[8px] text-slate-400 block mt-0.5">Port 8082</span>
                                            </div>

                                            {/* Leaderboard Service */}
                                            <div className={`flex-1 border rounded-xl p-2.5 text-center transition-all duration-300 ${simStep >= 3 && simRoute === 'leaderboard'
                                                    ? 'bg-emerald-500/10 border-emerald-500 shadow-emerald-500/10 scale-105'
                                                    : 'bg-white/5 border-white/10'
                                                }`}>
                                                <Activity className={`w-4 h-4 mx-auto mb-1 ${simStep >= 3 && simRoute === 'leaderboard' ? 'text-emerald-400' : 'text-slate-500'}`} />
                                                <span className="text-[10px] font-bold text-white block">Leaderboard Svc</span>
                                                <span className="text-[8px] text-slate-400 block mt-0.5">Port 8083</span>
                                            </div>
                                        </div>

                                        {/* Floating Glowing Packet */}
                                        {simStep > 0 && (
                                            <div
                                                className={`absolute w-3 h-3 rounded-full z-20 transition-all duration-500 ease-in-out pointer-events-none ${simStatus === 'rate-limited' ? 'bg-red-500 shadow-[0_0_12px_#EF4444]' : 'bg-[#B58863] shadow-[0_0_12px_#B58863]'
                                                    }`}
                                                style={{
                                                    left: simStep === 1
                                                        ? '50%'
                                                        : simStep === 2
                                                            ? '50%'
                                                            : simStep >= 3
                                                                ? (simRoute === 'auth' ? '20%' : simRoute === 'draw' ? '50%' : '80%')
                                                                : '50%',
                                                    top: simStep === 1
                                                        ? '12%'
                                                        : simStep === 2
                                                            ? '46%'
                                                            : simStep >= 3
                                                                ? '82%'
                                                                : '12%',
                                                    transform: 'translate(-50%, -50%)',
                                                    opacity: simStep === 4 ? 0 : 1
                                                }}
                                            />
                                        )}
                                    </div>

                                    {/* Right Column: Controller Panel & Live Console logs */}
                                    <div className="lg:col-span-5 flex flex-col justify-between gap-4">

                                        {/* Token Bucket Visualizer */}
                                        <div className="bg-black/20 border border-white/5 rounded-xl p-3.5 space-y-2">
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="font-bold text-slate-300">Rate Limiter Bucket</span>
                                                <span className={`font-mono font-bold ${tokens === 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                                                    {tokens} / 5 Tokens Left
                                                </span>
                                            </div>
                                            {/* Horizontal block indicator */}
                                            <div className="flex gap-1.5 h-3">
                                                {[1, 2, 3, 4, 5].map((idx) => (
                                                    <div
                                                        key={idx}
                                                        className={`flex-1 rounded-sm transition-all duration-300 ${idx <= tokens
                                                                ? 'bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.3)]'
                                                                : 'bg-white/5 border border-white/10'
                                                            }`}
                                                    />
                                                ))}
                                            </div>
                                        </div>

                                        {/* Simulator Trigger Buttons */}
                                        <div className="space-y-2">
                                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Simulate Endpoints</span>
                                            <div className="grid grid-cols-2 gap-2">
                                                <button
                                                    disabled={simStatus === 'processing'}
                                                    onClick={() => triggerSimulation('auth')}
                                                    className="flex items-center justify-center gap-1.5 bg-white/5 border border-white/10 hover:border-emerald-500/40 hover:bg-emerald-500/5 text-slate-200 hover:text-white rounded-xl py-2 px-3 text-xs font-semibold disabled:opacity-50 transition-all"
                                                >
                                                    <Play className="w-3.5 h-3.5 text-emerald-400" />
                                                    <span>POST /auth</span>
                                                </button>
                                                <button
                                                    disabled={simStatus === 'processing'}
                                                    onClick={() => triggerSimulation('draw')}
                                                    className="flex items-center justify-center gap-1.5 bg-white/5 border border-white/10 hover:border-emerald-500/40 hover:bg-emerald-500/5 text-slate-200 hover:text-white rounded-xl py-2 px-3 text-xs font-semibold disabled:opacity-50 transition-all"
                                                >
                                                    <Play className="w-3.5 h-3.5 text-emerald-400" />
                                                    <span>GET /draw</span>
                                                </button>
                                                <button
                                                    disabled={simStatus === 'processing'}
                                                    onClick={() => triggerSimulation('leaderboard')}
                                                    className="flex items-center justify-center gap-1.5 bg-white/5 border border-white/10 hover:border-emerald-500/40 hover:bg-emerald-500/5 text-slate-200 hover:text-white rounded-xl py-2 px-3 text-xs font-semibold disabled:opacity-50 transition-all"
                                                >
                                                    <Play className="w-3.5 h-3.5 text-emerald-400" />
                                                    <span>GET /leaderboard</span>
                                                </button>
                                                <button
                                                    disabled={simStatus === 'processing'}
                                                    onClick={() => triggerSimulation('ddos')}
                                                    className="flex items-center justify-center gap-1.5 bg-red-500/10 border border-red-500/20 hover:border-red-500/40 hover:bg-red-500/20 text-red-300 hover:text-red-100 rounded-xl py-2 px-3 text-xs font-semibold disabled:opacity-50 transition-all"
                                                >
                                                    <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                                                    <span>Simulate DDoS</span>
                                                </button>
                                            </div>
                                        </div>

                                        {/* Live Terminal Log Console */}
                                        <div className="flex flex-col flex-1 min-h-[140px]">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Live Terminal Log Console</span>
                                                <button
                                                    onClick={() => {
                                                        setSimRoute(null);
                                                        setSimStep(0);
                                                        setSimStatus('idle');
                                                        setSimLogs([]);
                                                        setTokens(5);
                                                    }}
                                                    className="text-[9px] font-semibold text-slate-400 hover:text-white transition-all bg-white/5 border border-white/10 px-2 py-0.5 rounded-md"
                                                >
                                                    Reset
                                                </button>
                                            </div>
                                            <div className="flex-1 bg-black/80 font-mono text-[10px] p-3 rounded-xl border border-white/10 overflow-y-auto space-y-1 h-32 text-emerald-400 shadow-inner">
                                                {simLogs.length === 0 ? (
                                                    <span className="text-slate-500">Terminal idle. Click a simulation route to begin...</span>
                                                ) : (
                                                    simLogs.map((log, lIdx) => (
                                                        <div key={lIdx} className={
                                                            log.includes('❌') || log.includes('error') ? 'text-red-400 font-bold' :
                                                                log.includes('OK') || log.includes('200') ? 'text-emerald-400' :
                                                                    'text-slate-300'
                                                        }>
                                                            {log}
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>

                            <hr className="border-white/[0.04]" />

                            <div className="space-y-4">
                                <h3 className="font-bold text-white text-base">Key Concepts: Reverse Proxy vs. API Gateway</h3>
                                <p className="text-xs text-slate-300 leading-relaxed">
                                    Many developers conflate **Reverse Proxies** (like Nginx, HAProxy) and **API Gateways** (like Kong, Apigee, Spring Cloud Gateway). While their structural placement is identical, their responsibilities differ:
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
                                    <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                                        <strong className="text-[#B58863]">Reverse Proxy</strong>
                                        <p className="text-slate-400 mt-1 leading-relaxed">
                                            Operates primarily at network layer 4 (TCP) or layer 7 (HTTP). Focuses on routing requests to backend pools, SSL termination, and caching static assets. Extremely fast and lightweight.
                                        </p>
                                    </div>
                                    <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                                        <strong className="text-[#B58863]">API Gateway</strong>
                                        <p className="text-slate-400 mt-1 leading-relaxed">
                                            Application-level orchestrator. Intercepts incoming requests to run complex custom policies: JWT authentication, dynamic rate limiting, request transformation, telemetry gathering, and payload verification.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <hr className="border-white/[0.04]" />

                            <div className="space-y-4">
                                <h3 className="font-bold text-white text-base">Rate Limiting Algorithms: A Detailed Look</h3>
                                <p className="text-xs text-slate-300 leading-relaxed">
                                    To guard backend microservices from denial-of-service spikes or API resource exhaustion, you must configure rate limiting. Choose the right algorithm based on your traffic patterns:
                                </p>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-xs text-slate-300 border-collapse border border-white/10">
                                        <thead>
                                            <tr className="bg-white/5 text-white">
                                                <th className="border border-white/10 p-2.5 text-left">Algorithm</th>
                                                <th className="border border-white/10 p-2.5 text-left">How It Works</th>
                                                <th className="border border-white/10 p-2.5 text-left">Pros & Cons</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td className="border border-white/10 p-2.5 font-bold">Token Bucket</td>
                                                <td className="border border-white/10 p-2.5">A bucket holds N tokens. Each request consumes one. Refilled constantly at a static rate.</td>
                                                <td className="border border-white/10 p-2.5">✅ Allows bursts of traffic. ❌ Requires locking or atomicity controls in distributed setups.</td>
                                            </tr>
                                            <tr className="bg-white/[0.01]">
                                                <td className="border border-white/10 p-2.5 font-bold">Leaky Bucket</td>
                                                <td className="border border-white/10 p-2.5">Requests go into a queue and leak out at a constant, uniform speed.</td>
                                                <td className="border border-white/10 p-2.5">✅ Smooths out load on downstream services. ❌ Slows down burst requests, hurting responsiveness.</td>
                                            </tr>
                                            <tr>
                                                <td className="border border-white/10 p-2.5 font-bold">Fixed Window Counter</td>
                                                <td className="border border-white/10 p-2.5">Divides timeline into fixed units (e.g. 1 min). Counts requests inside that window.</td>
                                                <td className="border border-white/10 p-2.5">✅ Extremely simple. ❌ Traffic spikes near window boundary can double the limit (boundary burst).</td>
                                            </tr>
                                            <tr className="bg-white/[0.01]">
                                                <td className="border border-white/10 p-2.5 font-bold">Sliding Window Counter</td>
                                                <td className="border border-white/10 p-2.5">Combines current and previous window counts dynamically using a weighted formula.</td>
                                                <td className="border border-white/10 p-2.5">✅ High memory efficiency and prevents boundary bursts. ❌ Mild mathematical approximation.</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <hr className="border-white/[0.04]" />

                            {/* INTERVIEW QUESTIONS & ANSWERS IN THIS SECTION */}
                            <div className="space-y-6">
                                <h3 className="font-bold text-white text-lg flex items-center gap-2">
                                    <Brain className="w-5 h-5 text-[#B58863]" /> Gateway & API Design: Interview Q&A
                                </h3>
                                <p className="text-xs text-slate-400">
                                    Below are advanced interview questions commonly asked about API Gateways, Rate Limiting, and downstream microservice architecture, with deep technical answers.
                                </p>

                                <div className="space-y-6">
                                    {/* Q1 */}
                                    <div className="bg-white/5 border border-white/5 rounded-xl p-5 space-y-3">
                                        <h4 className="text-sm font-bold text-white flex items-start gap-2">
                                            <span className="bg-[#B58863]/10 text-[#B58863] border border-[#B58863]/25 px-2 py-0.5 rounded text-[10px] font-mono mt-0.5">Q1</span>
                                            <span>How do you design a distributed Rate Limiter at API Gateway scale that handles millions of RPS?</span>
                                        </h4>
                                        <div className="text-xs text-slate-300 space-y-2 leading-relaxed">
                                            <p>
                                                <strong>Answer:</strong> Storing rate-limiting counters in a local server instance breaks when load balancers route requests to separate Gateway instances. To scale to millions of requests per second:
                                            </p>
                                            <ul className="list-disc pl-5 space-y-1.5">
                                                <li><strong>Distributed State Storage:</strong> Store rate-limit counters in a centralized Redis cluster. Redis provides sub-millisecond lookups and operations.</li>
                                                <li><strong>Preventing Race Conditions:</strong> A standard `Get-and-Increment` flow is vulnerable to race conditions (two requests reading the same counter value and incrementing it, bypassing limits). We execute the logic inside a **Redis Lua script** or use Redis transactions. Lua scripts run atomically on Redis, preventing race conditions.</li>
                                                <li><strong>Performance Optimization:</strong> Round trips to Redis for every single API request degrade latency. To optimize, use **Local Token Bucket cache synchronization**: local Gateway nodes fetch a batch of tokens (e.g. 100 tokens) from Redis at once, evaluate requests locally, and synchronize balances asynchronously.</li>
                                                <li><strong>Memory Optimization:</strong> Use the **Sliding Window Counter** algorithm. Keep hashes in Redis mapping `ip:minute` &rarr; `request_count`. Set key expirations (TTL) to 2 minutes so stale windows clear automatically.</li>
                                            </ul>
                                        </div>
                                    </div>

                                    {/* Q2 */}
                                    <div className="bg-white/5 border border-white/5 rounded-xl p-5 space-y-3">
                                        <h4 className="text-sm font-bold text-white flex items-start gap-2">
                                            <span className="bg-[#B58863]/10 text-[#B58863] border border-[#B58863]/25 px-2 py-0.5 rounded text-[10px] font-mono mt-0.5">Q2</span>
                                            <span>JWT vs. Stateful Session IDs: Where and how should we authenticate users in a microservice architecture?</span>
                                        </h4>
                                        <div className="text-xs text-slate-300 space-y-2 leading-relaxed">
                                            <p>
                                                <strong>Answer:</strong> The trade-offs dictate the correct choice.
                                            </p>
                                            <ul className="list-disc pl-5 space-y-1.5">
                                                <li><strong>API Gateway Auth (Stateful Sessions):</strong> The client presents a Session ID. The Gateway queries a shared Redis session cache. If valid, the Gateway appends user metadata headers (e.g., `X-User-Id: 991`) and routes the request.
                                                    <br /><em>Pros:</em> Immediate token revocation (if session is deleted in Redis, user is logged out instantly).
                                                    <br /><em>Cons:</em> High dependency on session storage. Redis downtime blocks all API paths.</li>
                                                <li><strong>Service-Level Auth (Decentralized JWT):</strong> The Gateway (or services) decrypts a JSON Web Token (JWT) locally using a public key. The signature is cryptographically verified without hitting any database.
                                                    <br /><em>Pros:</em> Zero database lookups for session validation. Highly scalable.
                                                    <br /><em>Cons:</em> Hard to revoke before TTL expiration. Mitigate this by utilizing a short-lived JWT (e.g., 15 minutes) alongside a database-backed Refresh Token (e.g., 7 days) stored in a secure cookie.</li>
                                                <li><strong>Hybrid Approach (Recommended):</strong> API Gateway acts as the gatekeeper. It performs JWT validation. If valid, it decodes the payload, forwards user context downstream as HTTP headers, and handles token expiration checks. Backend microservices do not need to validate signatures or fetch profiles; they trust the `X-User-` headers injected by the Gateway.</li>
                                            </ul>
                                        </div>
                                    </div>

                                    {/* Q3 */}
                                    <div className="bg-white/5 border border-white/5 rounded-xl p-5 space-y-3">
                                        <h4 className="text-sm font-bold text-white flex items-start gap-2">
                                            <span className="bg-[#B58863]/10 text-[#B58863] border border-[#B58863]/25 px-2 py-0.5 rounded text-[10px] font-mono mt-0.5">Q3</span>
                                            <span>What is a Circuit Breaker pattern, and how does the API Gateway use it to protect microservices?</span>
                                        </h4>
                                        <div className="text-xs text-slate-300 space-y-2 leading-relaxed">
                                            <p>
                                                <strong>Answer:</strong> In a microservice ecosystem, if one service (e.g., Auth Service) slows down, incoming threads block waiting for it. The Gateway quickly depletes its thread pool, causing a cascading failure that crashes the entire API. A **Circuit Breaker** acts as an electrical fuse to intercept this:
                                            </p>
                                            <ul className="list-disc pl-5 space-y-1.5">
                                                <li><strong>Closed State:</strong> Normal state. All requests flow directly to the downstream service. The Gateway tracks the error/timeout rates.</li>
                                                <li><strong>Open State:</strong> If the error rate exceeds a configured threshold (e.g., 50% failures or timeouts in a 10-second sliding window), the circuit "trips" and enters the Open state. Subsequent requests fail *instantly* at the Gateway layer, returning a fallback response (e.g. cached data, static error, or empty collection) without sending load to the failing service.</li>
                                                <li><strong>Half-Open State:</strong> After a timeout period (e.g., 60 seconds), the circuit enters the Half-Open state. A limited batch of trial requests is sent to check if the downstream service has recovered. If they succeed, the circuit returns to **Closed**. If they fail, it trips back to **Open**.</li>
                                                <li><strong>Bulkhead Isolation:</strong> Combine circuit breakers with the Bulkhead pattern. Allocate dedicated thread pools (or connection limits) at the Gateway for each downstream service. If the Design Service goes down, it exhausts only its own bulkhead pool, leaving the Auth and Leaderboard services operating normally.</li>
                                            </ul>
                                        </div>
                                    </div>

                                    {/* Q4 */}
                                    <div className="bg-white/5 border border-white/5 rounded-xl p-5 space-y-3">
                                        <h4 className="text-sm font-bold text-white flex items-start gap-2">
                                            <span className="bg-[#B58863]/10 text-[#B58863] border border-[#B58863]/25 px-2 py-0.5 rounded text-[10px] font-mono mt-0.5">Q4</span>
                                            <span>How does an API Gateway scale persistent connection protocols like WebSockets or gRPC streams?</span>
                                        </h4>
                                        <div className="text-xs text-slate-300 space-y-2 leading-relaxed">
                                            <p>
                                                <strong>Answer:</strong> Persistent TCP connections break standard HTTP load balancing because connections are long-lived and cannot be re-routed request-by-request.
                                            </p>
                                            <ul className="list-disc pl-5 space-y-1.5">
                                                <li><strong>Connection Registry:</strong> Maintain an active WebSocket Registry (usually in Redis). When a client connects and establishes a WebSocket connection on Gateway Server A, map `client_id` &rarr; `Gateway_Server_A`. When User B sends a message to User A, the dispatch service checks Redis to identify the correct gateway server holding the socket, and forwards the packet.</li>
                                                <li><strong>Load Balancing Persistent Streams:</strong> Do not load balance based on simple round-robin. Instead, load balance based on **Least Connections** so new connections go to gateway instances hosting fewer sockets.</li>
                                                <li><strong>Protocols (gRPC / HTTP/2):</strong> Ensure the Gateway supports HTTP/2 multiplexing. Instead of opening a new TCP connection for every downstream service request, multiplex multiple gRPC streams over a single shared TCP connection to reduce overhead.</li>
                                            </ul>
                                        </div>
                                    </div>

                                    {/* Q5 */}
                                    <div className="bg-white/5 border border-white/5 rounded-xl p-5 space-y-3">
                                        <h4 className="text-sm font-bold text-white flex items-start gap-2">
                                            <span className="bg-[#B58863]/10 text-[#B58863] border border-[#B58863]/25 px-2 py-0.5 rounded text-[10px] font-mono mt-0.5">Q5</span>
                                            <span>How does a gateway implement Dynamic Routing and Service Discovery without downtime during service deployments?</span>
                                        </h4>
                                        <div className="text-xs text-slate-300 space-y-2 leading-relaxed">
                                            <p>
                                                <strong>Answer:</strong> In dynamic cloud environments, containers launch and terminate constantly, meaning IP addresses are ephemeral.
                                            </p>
                                            <ul className="list-disc pl-5 space-y-1.5">
                                                <li><strong>Service Registries:</strong> Integrate the API Gateway with a Service Registry (e.g. Consul, Eureka, ZooKeeper, or Kubernetes DNS). Microservices register their active IPs and ports upon startup.</li>
                                                <li><strong>Dynamic Configuration Hot-Reloading:</strong> Traditional proxies required manual file updates and process restarts to modify routes. Modern API Gateways use control plane APIs (e.g., Envoy's xDS APIs, Kong's decK declarative configs) to hot-reload routes in memory. The gateway continuously polls or receives webhook updates from the service registry, adjusting its downstream routing tables dynamically without dropping a single active client request.</li>
                                                <li><strong>Health Check Loops:</strong> The gateway performs periodic background active health checks (`GET /health`) on all downstream service instances. If an instance fails, the gateway ejects it from the pool immediately.</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* LOAD BALANCING & CDN */}
                    {activeSection === 'load-balancing' && (
                        <div className="space-y-6 animate-in fade-in duration-300">
                            <div>
                                <h2 className="text-2xl font-black text-white tracking-tight">Load Balancing & CDNs</h2>
                                <p className="text-slate-300 mt-2 leading-relaxed text-sm">
                                    Load Balancers act as traffic cops, distributing requests across healthy servers. Content Delivery Networks (CDNs) cache static assets globally on edge servers close to end-users.
                                </p>
                            </div>

                            {/* LOAD BALANCER & CDN PLAYGROUND */}
                            <div className="bg-white/5 border border-white/[0.04] rounded-2xl p-6 space-y-6">
                                <div className="flex flex-col sm:flex-row items-center justify-between border-b border-white/[0.06] pb-4 gap-4">
                                    <div>
                                        <h3 className="font-bold text-white text-sm">Interactive CDN & Load Balancer Simulator</h3>
                                        <p className="text-[10.5px] text-slate-400 mt-0.5">Toggle modes to test traffic distribution rules or edge server cache latency differences.</p>
                                    </div>

                                    <div className="flex bg-black/40 p-1 rounded-xl border border-white/10 self-end sm:self-center">
                                        <button
                                            onClick={() => { setLbMode('routing'); setLbLogs([`[Client] Switched to Load Balancer routing`]); }}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${lbMode === 'routing' ? 'bg-[#B58863] text-white' : 'text-slate-400 hover:text-white'}`}
                                        >
                                            LB Routing
                                        </button>
                                        <button
                                            onClick={() => { setLbMode('cdn'); setLbLogs([`[Client] Switched to CDN edge cache simulation`]); }}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${lbMode === 'cdn' ? 'bg-[#B58863] text-white' : 'text-slate-400 hover:text-white'}`}
                                        >
                                            CDN Caching
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                                    {/* Left: Interactive graphic mapping */}
                                    <div className="lg:col-span-7 bg-black/40 border border-white/5 rounded-xl p-4 flex flex-col items-center justify-between min-h-[340px] relative overflow-hidden">
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 self-start">Active Topology Flow</span>

                                        {lbMode === 'routing' ? (
                                            /* LB routing visual */
                                            <div className="flex flex-col items-center justify-between flex-1 w-full gap-4 relative">
                                                <div className="bg-[#10232A] border border-white/10 rounded-xl px-4 py-1.5 text-center shadow-md z-10">
                                                    <span className="text-[9px] font-bold text-slate-400 block uppercase">Client IP Stream</span>
                                                </div>

                                                <ArrowDown className="w-4 h-4 text-slate-500 z-10" />

                                                {/* Load Balancer node */}
                                                <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 flex flex-col items-center justify-center gap-1 text-xs font-semibold max-w-[200px] w-full text-slate-200 z-10 shadow-md">
                                                    <div className="flex items-center gap-1.5">
                                                        <Network className="w-4 h-4 text-[#B58863]" /> Load Balancer
                                                    </div>
                                                    <span className="text-[8px] font-mono text-slate-400 uppercase tracking-wider">
                                                        {lbAlg === 'round-robin' ? 'Round-Robin' : 'IP Consistent Hashing'}
                                                    </span>
                                                </div>

                                                {/* Dynamic lines */}
                                                <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                                                    {[0, 1, 2].map((idx) => {
                                                        const isActive = lbActiveServer === idx;
                                                        const x2Val = idx === 0 ? '20%' : idx === 1 ? '50%' : '80%';
                                                        return (
                                                            <line
                                                                key={idx}
                                                                x1="50%" y1="52%" x2={x2Val} y2="82%"
                                                                stroke={isActive ? '#10B981' : 'rgba(255,255,255,0.06)'}
                                                                strokeWidth="2"
                                                                className="transition-all duration-300"
                                                            />
                                                        );
                                                    })}
                                                </svg>

                                                {/* Backend Server pool */}
                                                <div className="flex gap-3 justify-between w-full mt-2 z-10 px-2">
                                                    {[0, 1, 2].map((idx) => {
                                                        const isCurrent = lbActiveServer === idx;
                                                        const name = String.fromCharCode(65 + idx);
                                                        return (
                                                            <div
                                                                key={idx}
                                                                className={`flex-1 border rounded-xl p-2.5 text-center transition-all duration-300 ${isCurrent
                                                                        ? 'bg-emerald-500/10 border-emerald-500 shadow-emerald-500/10 scale-105'
                                                                        : 'bg-white/5 border-white/10'
                                                                    }`}
                                                            >
                                                                <Server className="w-5 h-5 mx-auto mb-1 text-[#B58863]" />
                                                                <span className="text-[10px] font-bold text-white block">Server {name}</span>
                                                                <span className="text-[8px] text-slate-400 block mt-0.5">Port 800{idx + 1}</span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        ) : (
                                            /* CDN caching visual */
                                            <div className="flex flex-col items-center justify-around flex-1 w-full gap-4 relative">
                                                <div className="bg-[#10232A] border border-white/10 rounded-xl px-4 py-1.5 text-center shadow-md z-10">
                                                    <span className="text-[9px] font-bold text-slate-400 block uppercase">Client request (/logo.png)</span>
                                                </div>

                                                <div className="flex gap-4 w-full justify-center items-stretch relative z-10">
                                                    {/* CDN Edge Card */}
                                                    <div className="flex-1 border border-white/10 bg-white/5 rounded-xl p-3 text-center transition-all">
                                                        <Globe className="w-6 h-6 text-[#B58863] mx-auto mb-1.5" />
                                                        <span className="text-xs font-bold block text-white">CDN Edge Node</span>
                                                        <span className="text-[9px] text-slate-400 block mt-0.5">Tokyo POP (Edge)</span>
                                                    </div>

                                                    <div className="flex flex-col items-center justify-center gap-1 min-w-[50px]">
                                                        <span className="text-[8px] text-slate-500 font-bold uppercase">Fetch</span>
                                                        <ArrowRight className="w-5 h-5 text-slate-600 animate-pulse" />
                                                    </div>

                                                    {/* Origin Server Card */}
                                                    <div className="flex-1 border border-white/10 bg-white/5 rounded-xl p-3 text-center transition-all">
                                                        <Server className="w-6 h-6 text-slate-500 mx-auto mb-1.5" />
                                                        <span className="text-xs font-bold block text-white">Origin Server</span>
                                                        <span className="text-[9px] text-slate-400 block mt-0.5">Virginia Host</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Right: Controller panels */}
                                    <div className="lg:col-span-5 flex flex-col justify-between gap-4">
                                        {/* Alg configuration for LB */}
                                        {lbMode === 'routing' ? (
                                            <div className="bg-black/20 border border-white/5 rounded-xl p-3.5 space-y-2">
                                                <div className="flex items-center justify-between text-xs">
                                                    <span className="font-bold text-slate-300">Routing Algorithm</span>
                                                    <span className="font-mono text-[#B58863] font-bold">
                                                        {lbAlg === 'round-robin' ? 'Round-Robin' : 'Consistent Hashing'}
                                                    </span>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => setLbAlg('round-robin')}
                                                        className={`flex-1 border rounded-lg py-1 text-xs font-bold transition-all ${lbAlg === 'round-robin' ? 'bg-[#B58863]/20 border-[#B58863] text-white' : 'bg-white/5 border-white/10 text-slate-400'}`}
                                                    >
                                                        Round-Robin
                                                    </button>
                                                    <button
                                                        onClick={() => setLbAlg('consistent-hash')}
                                                        className={`flex-1 border rounded-lg py-1 text-xs font-bold transition-all ${lbAlg === 'consistent-hash' ? 'bg-[#B58863]/20 border-[#B58863] text-white' : 'bg-white/5 border-white/10 text-slate-400'}`}
                                                    >
                                                        Consistent Hashing
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="bg-black/20 border border-white/5 rounded-xl p-3.5 space-y-2">
                                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">CDN Simulators</span>
                                                <div className="flex flex-col gap-2">
                                                    <button
                                                        onClick={() => triggerLbSimulation('cdn-hit')}
                                                        className="w-full flex items-center justify-center gap-1.5 bg-[#B58863] hover:bg-[#B58863]/85 text-white rounded-xl py-2 px-3 text-xs font-semibold transition-all"
                                                    >
                                                        <Play className="w-3 h-3 fill-current" />
                                                        <span>Simulate Cache Hit (Edge Server)</span>
                                                    </button>
                                                    <button
                                                        onClick={() => triggerLbSimulation('cdn-miss')}
                                                        className="w-full flex items-center justify-center gap-1.5 bg-white/5 border border-white/10 hover:bg-white/10 text-slate-200 rounded-xl py-2 px-3 text-xs font-semibold transition-all"
                                                    >
                                                        <Play className="w-3 h-3 fill-current" />
                                                        <span>Simulate Cache Miss (Fetch Origin)</span>
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {lbMode === 'routing' && (
                                            <div className="space-y-2">
                                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Traffic Dispatch</span>
                                                <button
                                                    onClick={() => triggerLbSimulation('request')}
                                                    className="w-full flex items-center justify-center gap-2 bg-[#B58863] hover:bg-[#B58863]/85 text-white rounded-xl py-2 px-3 text-xs font-bold transition-all shadow"
                                                >
                                                    <Play className="w-3.5 h-3.5 fill-current" />
                                                    <span>Dispatch HTTP GET Request</span>
                                                </button>
                                            </div>
                                        )}

                                        {/* Latency Display */}
                                        {lbLatency !== null && (
                                            <div className="bg-black/20 border border-white/5 rounded-xl p-3 flex items-center justify-between text-xs">
                                                <span className="text-slate-400">Response Latency:</span>
                                                <span className={`font-mono font-bold ${lbLatency < 10 ? 'text-emerald-400' : lbLatency < 30 ? 'text-amber-400' : 'text-red-400'}`}>
                                                    {lbLatency} ms
                                                </span>
                                            </div>
                                        )}

                                        {/* Telemetry Console */}
                                        <div className="flex flex-col flex-1 min-h-[120px]">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Network Transmission Logs</span>
                                                <button
                                                    onClick={() => {
                                                        setLbLogs([]);
                                                        setLbActiveServer(null);
                                                        setLbLatency(null);
                                                    }}
                                                    className="text-[9px] font-semibold text-slate-400 hover:text-white transition-all bg-white/5 border border-white/10 px-2 py-0.5 rounded-md"
                                                >
                                                    Reset
                                                </button>
                                            </div>
                                            <div className="flex-1 bg-black/80 font-mono text-[10px] p-3 rounded-xl border border-white/10 overflow-y-auto space-y-1 h-28 text-emerald-400 shadow-inner">
                                                {lbLogs.length === 0 ? (
                                                    <span className="text-slate-500">Telemetry idle. Run simulations above...</span>
                                                ) : (
                                                    lbLogs.map((log, lIdx) => (
                                                        <div key={lIdx} className="text-slate-300">
                                                            {log}
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <hr className="border-white/[0.04]" />

                            <div className="space-y-6">
                                <h3 className="font-bold text-white text-lg flex items-center gap-2">
                                    <Brain className="w-5 h-5 text-[#B58863]" /> Load Balancing & CDN: Interview Q&A
                                </h3>

                                <div className="space-y-6">
                                    <div className="bg-white/5 border border-white/5 rounded-xl p-5 space-y-3">
                                        <h4 className="text-sm font-bold text-white flex items-start gap-2">
                                            <span className="bg-[#B58863]/10 text-[#B58863] border border-[#B58863]/25 px-2 py-0.5 rounded text-[10px] font-mono mt-0.5">Q1</span>
                                            <span>What is the difference between Layer 4 (L4) and Layer 7 (L7) Load Balancing?</span>
                                        </h4>
                                        <p className="text-xs text-slate-300 leading-relaxed">
                                            <strong>Answer:</strong> Layer 4 Load Balancing operates at the transport layer (TCP/UDP). It routes traffic based solely on IP addresses and port numbers without inspecting the packet payload. Because it requires minimal CPU cycles for packet decryption or parsing, L4 balancing is extremely fast and suited for edge routing.
                                            <br /><br />
                                            Layer 7 Load Balancing operates at the application layer (HTTP/HTTPS/gRPC). It terminates the SSL connection, parses the headers (cookies, paths, user agents), and inspects the payload to make intelligent routing decisions (e.g. directing `/api/v1/auth` requests to the auth pool). L7 balancing is more CPU-heavy but supports advanced policies like sticky sessions, rate limiting, and header injection.
                                        </p>
                                    </div>

                                    <div className="bg-white/5 border border-white/5 rounded-xl p-5 space-y-3">
                                        <h4 className="text-sm font-bold text-white flex items-start gap-2">
                                            <span className="bg-[#B58863]/10 text-[#B58863] border border-[#B58863]/25 px-2 py-0.5 rounded text-[10px] font-mono mt-0.5">Q2</span>
                                            <span>How does Anycast Routing help CDNs scale traffic globally?</span>
                                        </h4>
                                        <p className="text-xs text-slate-300 leading-relaxed">
                                            <strong>Answer:</strong> In unicast routing, every device has a unique IP address. In **Anycast Routing**, multiple physically distinct servers share the exact same IP address. Routers on the internet use BGP (Border Gateway Protocol) to send packets to the closest physical location advertising that shared IP.
                                            <br /><br />
                                            CDNs place edge servers globally in separate data centers, all advertising a single Anycast IP range. When a client requests a video, the request travels to the nearest data center on the network. This reduces latency (fewer network hops) and naturally distributes load globally: if the edge center in Tokyo goes offline, BGP updates route Japanese traffic automatically to the next nearest operational edge center.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* DISTRIBUTED STORAGE */}
                    {activeSection === 'distributed-storage' && (
                        <div className="space-y-6 animate-in fade-in duration-300">
                            <div>
                                <h2 className="text-2xl font-black text-white tracking-tight">Distributed Storage & Object Stores</h2>
                                <p className="text-slate-300 mt-2 leading-relaxed text-sm">
                                    Traditional file systems do not scale to petabytes. Distributed storage systems partition data blocks, blobs, and metadata catalogs across clusters of cheap machines, replicating chunks to ensure durability.
                                </p>
                            </div>

                            {/* DISTRIBUTED STORAGE PLAYGROUND */}
                            <div className="bg-white/5 border border-white/[0.04] rounded-2xl p-6 space-y-6">
                                <div className="flex flex-col sm:flex-row items-center justify-between border-b border-white/[0.06] pb-4 gap-4">
                                    <div>
                                        <h3 className="font-bold text-white text-sm">Interactive Storage Cluster Simulator</h3>
                                        <p className="text-[10.5px] text-slate-400 mt-0.5">Toggle between data replication consensus and metadata separation lookup sequences.</p>
                                    </div>

                                    <div className="flex bg-black/40 p-1 rounded-xl border border-white/10 self-end sm:self-center">
                                        <button
                                            disabled={isStorageProcessing}
                                            onClick={() => { setStorageMode('replication'); setStorageLogs([`[Client] Switched to Block Replication simulation`]); }}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all disabled:opacity-50 ${storageMode === 'replication' ? 'bg-[#B58863] text-white' : 'text-slate-400 hover:text-white'}`}
                                        >
                                            Block Replication
                                        </button>
                                        <button
                                            disabled={isStorageProcessing}
                                            onClick={() => { setStorageMode('metadata'); setStorageLogs([`[Client] Switched to Metadata separation model`]); }}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all disabled:opacity-50 ${storageMode === 'metadata' ? 'bg-[#B58863] text-white' : 'text-slate-400 hover:text-white'}`}
                                        >
                                            Metadata Lookup
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                                    {/* Left: Visualization */}
                                    <div className="lg:col-span-7 bg-black/40 border border-white/5 rounded-xl p-4 flex flex-col items-center justify-between min-h-[340px] relative overflow-hidden">
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 self-start">Cluster Disk Array</span>

                                        {storageMode === 'replication' ? (
                                            /* Replication visual */
                                            <div className="flex flex-col items-center justify-between flex-1 w-full gap-4 relative">
                                                <div className="bg-[#10232A] border border-white/10 rounded-xl px-4 py-1.5 text-center shadow-md z-10">
                                                    <span className="text-[9px] font-bold text-slate-400 block uppercase">Storage Client (chunk_x99)</span>
                                                </div>

                                                <ArrowDown className="w-4 h-4 text-slate-500 z-10" />

                                                {/* Storage nodes grid */}
                                                <div className="flex gap-3 justify-between w-full mt-2 z-10 px-2">
                                                    {[0, 1, 2].map((idx) => {
                                                        const isOffline = failedNode === idx;
                                                        return (
                                                            <div
                                                                key={idx}
                                                                className={`flex-1 border rounded-xl p-2.5 text-center transition-all duration-300 ${isOffline
                                                                        ? 'bg-red-500/10 border-red-500 shadow-red-500/5'
                                                                        : storageStatus === 'writing'
                                                                            ? 'bg-amber-500/10 border-amber-500 animate-pulse'
                                                                            : 'bg-white/5 border-white/10'
                                                                    }`}
                                                            >
                                                                <HardDrive className={`w-5 h-5 mx-auto mb-1 ${isOffline ? 'text-red-500' : 'text-[#B58863]'}`} />
                                                                <span className="text-[10px] font-bold text-white block">Storage Node {idx + 1}</span>
                                                                <span className="text-[8px] text-slate-400 block mt-0.5">{isOffline ? 'OFFLINE' : 'ONLINE'}</span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        ) : (
                                            /* Metadata visual */
                                            <div className="flex flex-col items-center justify-around flex-1 w-full gap-4 relative">
                                                <div className="flex gap-4 w-full justify-center items-stretch relative z-10">
                                                    {/* Metadata Card */}
                                                    <div className={`flex-1 border bg-white/5 rounded-xl p-3 text-center transition-all duration-300 ${storageStatus === 'reading' ? 'border-[#B58863] bg-[#B58863]/10 scale-105' : 'border-white/10'}`}>
                                                        <FileText className="w-6 h-6 text-[#B58863] mx-auto mb-1.5" />
                                                        <span className="text-xs font-bold block text-white">Metadata db</span>
                                                        <span className="text-[9px] text-slate-400 block mt-0.5">Index lookup mapper</span>
                                                    </div>

                                                    <div className="flex flex-col items-center justify-center gap-1 min-w-[50px]">
                                                        <span className="text-[8px] text-slate-500 font-bold uppercase">Route</span>
                                                        <ArrowRight className="w-5 h-5 text-slate-600 animate-pulse" />
                                                    </div>

                                                    {/* Data Card */}
                                                    <div className="flex-1 border border-white/10 bg-white/5 rounded-xl p-3 text-center transition-all">
                                                        <HardDrive className="w-6 h-6 text-slate-500 mx-auto mb-1.5" />
                                                        <span className="text-xs font-bold block text-white">Storage Node 3</span>
                                                        <span className="text-[9px] text-slate-400 block mt-0.5">Virginia Cluster</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Right: Controllers */}
                                    <div className="lg:col-span-5 flex flex-col justify-between gap-4">
                                        <div className="bg-black/20 border border-white/5 rounded-xl p-3.5 space-y-2">
                                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Simulator Actions</span>
                                            {storageMode === 'replication' ? (
                                                <div className="flex flex-col gap-2">
                                                    <button
                                                        disabled={isStorageProcessing}
                                                        onClick={() => triggerStorageSimulation('write')}
                                                        className="w-full flex items-center justify-center gap-1.5 bg-[#B58863] hover:bg-[#B58863]/85 text-white rounded-xl py-2 px-3 text-xs font-semibold transition-all disabled:opacity-50"
                                                    >
                                                        <Play className="w-3 h-3 fill-current" />
                                                        <span>Write block chunk_x99</span>
                                                    </button>
                                                    <button
                                                        disabled={isStorageProcessing}
                                                        onClick={() => triggerStorageSimulation('read')}
                                                        className="w-full flex items-center justify-center gap-1.5 bg-white/5 border border-white/10 hover:bg-white/10 text-slate-200 rounded-xl py-2 px-3 text-xs font-semibold transition-all disabled:opacity-50"
                                                    >
                                                        <Play className="w-3 h-3 fill-current" />
                                                        <span>Read block chunk_x99</span>
                                                    </button>
                                                    <button
                                                        disabled={isStorageProcessing}
                                                        onClick={() => triggerStorageSimulation('toggle-fail')}
                                                        className="w-full flex items-center justify-center gap-1.5 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-300 rounded-xl py-2 px-3 text-xs font-semibold transition-all disabled:opacity-50"
                                                    >
                                                        <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                                                        <span>{failedNode === 0 ? 'Restore Storage Node 1' : 'Simulate Storage Node 1 Outage'}</span>
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    disabled={isStorageProcessing}
                                                    onClick={() => triggerStorageSimulation('read')}
                                                    className="w-full flex items-center justify-center gap-1.5 bg-[#B58863] hover:bg-[#B58863]/85 text-white rounded-xl py-2 px-3 text-xs font-semibold transition-all disabled:opacity-50"
                                                >
                                                    <Play className="w-3 h-3 fill-current" />
                                                    <span>Fetch file: profile_picture.png</span>
                                                </button>
                                            )}
                                        </div>

                                        {/* Telemetry Console */}
                                        <div className="flex flex-col flex-1 min-h-[140px]">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Storage Cluster Transaction Logs</span>
                                                <button
                                                    onClick={() => {
                                                        setStorageLogs([]);
                                                        setFailedNode(null);
                                                        setStorageStatus('idle');
                                                        setIsStorageProcessing(false);
                                                    }}
                                                    className="text-[9px] font-semibold text-slate-400 hover:text-white transition-all bg-white/5 border border-white/10 px-2 py-0.5 rounded-md"
                                                >
                                                    Reset
                                                </button>
                                            </div>
                                            <div className="flex-1 bg-black/80 font-mono text-[10px] p-3 rounded-xl border border-white/10 overflow-y-auto space-y-1 h-32 text-emerald-400 shadow-inner">
                                                {storageLogs.length === 0 ? (
                                                    <span className="text-slate-500">Telemetry idle. Run storage operations above...</span>
                                                ) : (
                                                    storageLogs.map((log, lIdx) => (
                                                        <div key={lIdx} className={log.includes('❌') ? 'text-red-400 font-bold' : 'text-slate-300'}>
                                                            {log}
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <hr className="border-white/[0.04]" />

                            <div className="space-y-6">
                                <h3 className="font-bold text-white text-lg flex items-center gap-2">
                                    <Brain className="w-5 h-5 text-[#B58863]" /> Distributed Storage: Interview Q&A
                                </h3>

                                <div className="space-y-6">
                                    <div className="bg-white/5 border border-white/5 rounded-xl p-5 space-y-3">
                                        <h4 className="text-sm font-bold text-white flex items-start gap-2">
                                            <span className="bg-[#B58863]/10 text-[#B58863] border border-[#B58863]/25 px-2 py-0.5 rounded text-[10px] font-mono mt-0.5">Q1</span>
                                            <span>How does an object store like AWS S3 handle metadata scaling?</span>
                                        </h4>
                                        <p className="text-xs text-slate-300 leading-relaxed">
                                            <strong>Answer:</strong> AWS S3 separates the binary data storage (data path) from the object indexing (metadata path). Large files (blobs) are divided into immutable chunks and stored in a distributed key-value chunk store.
                                            <br /><br />
                                            Object metadata (size, ACLs, creation date, mapping to chunks) is stored in a highly optimized distributed index database. S3 partitions this metadata database by the object key prefix. If you store millions of files with keys like `user_123/file.jpg`, S3 shards the index on `user_123/`. In system design interviews, emphasize **avoiding monotonically increasing prefixes** (like timestamps) for key names under high load, as they will cause all writes to hit a single metadata shard (hot spotting).
                                        </p>
                                    </div>

                                    <div className="bg-white/5 border border-white/5 rounded-xl p-5 space-y-3">
                                        <h4 className="text-sm font-bold text-white flex items-start gap-2">
                                            <span className="bg-[#B58863]/10 text-[#B58863] border border-[#B58863]/25 px-2 py-0.5 rounded text-[10px] font-mono mt-0.5">Q2</span>
                                            <span>How do you protect a distributed storage tier from bit rot and silent data corruption?</span>
                                        </h4>
                                        <p className="text-xs text-slate-300 leading-relaxed">
                                            <strong>Answer:</strong> Disk sectors degrade over time, leading to corrupted file blocks (bit rot) that standard storage drivers do not report.
                                            <br /><br />
                                            We solve this using **Checksum verification** and **Active background scrubbing**:
                                            1. When writing a file block, calculate its cryptographic hash (MD5 or SHA-256) and store it in the metadata.
                                            2. Background scrubber threads continuously scan the storage blocks, recomputing checksums and comparing them with metadata hashes.
                                            3. If a discrepancy is found, the block is discarded, and a healthy replica block is fetched from another node to heal the file automatically.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* SERVICE MESH */}
                    {activeSection === 'service-mesh' && (
                        <div className="space-y-6 animate-in fade-in duration-300">
                            <div>
                                <h2 className="text-2xl font-black text-white tracking-tight">Service Mesh & Interservice APIs</h2>
                                <p className="text-slate-300 mt-2 leading-relaxed text-sm">
                                    Microservices communicate frequently. A Service Mesh handles network routing, service registry calls, security protocols (mTLS), and trace context propagation under the hood.
                                </p>
                            </div>

                            {/* SERVICE MESH PLAYGROUND */}
                            <div className="bg-white/5 border border-white/[0.04] rounded-2xl p-6 space-y-6">
                                <div className="flex flex-col sm:flex-row items-center justify-between border-b border-white/[0.06] pb-4 gap-4">
                                    <div>
                                        <h3 className="font-bold text-white text-sm">Interactive Service Mesh Simulator</h3>
                                        <p className="text-[10.5px] text-slate-400 mt-0.5">Toggle REST/gRPC payloads and enable mutual TLS encryption proxies to observe interservice metrics.</p>
                                    </div>

                                    <div className="flex bg-black/40 p-1 rounded-xl border border-white/10 self-end sm:self-center">
                                        <button
                                            disabled={isMeshProcessing}
                                            onClick={() => { setMeshMode('rest'); setMeshLogs([`[Client] Switched protocol to REST (JSON)`]); }}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all disabled:opacity-50 ${meshMode === 'rest' ? 'bg-[#B58863] text-white' : 'text-slate-400 hover:text-white'}`}
                                        >
                                            REST (JSON)
                                        </button>
                                        <button
                                            disabled={isMeshProcessing}
                                            onClick={() => { setMeshMode('grpc'); setMeshLogs([`[Client] Switched protocol to gRPC (Protobuf)`]); }}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all disabled:opacity-50 ${meshMode === 'grpc' ? 'bg-[#B58863] text-white' : 'text-slate-400 hover:text-white'}`}
                                        >
                                            gRPC (Protobuf)
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                                    {/* Left: Diagram */}
                                    <div className="lg:col-span-7 bg-black/40 border border-white/5 rounded-xl p-4 flex flex-col items-center justify-between min-h-[340px] relative overflow-hidden">
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 self-start">Interservice Data Plane</span>

                                        <div className="flex justify-between items-center w-full gap-4 relative px-2 flex-1">
                                            {/* Service A Card */}
                                            <div className="flex-1 border border-white/10 bg-white/5 rounded-xl p-3.5 text-center relative z-10">
                                                <Cpu className="w-5 h-5 mx-auto mb-1.5 text-[#B58863]" />
                                                <span className="text-xs font-bold text-white block">Service A</span>
                                                <span className="text-[8px] text-slate-400">Inventory Svc</span>
                                            </div>

                                            {/* Connector line */}
                                            <div className="flex flex-col items-center justify-center gap-1.5 flex-1 relative min-w-[120px]">
                                                {meshMtls && (
                                                    <div className="flex gap-4 justify-between w-full px-2 z-10">
                                                        <div className="bg-emerald-500/10 border border-emerald-500 text-emerald-400 text-[8px] font-bold px-1 rounded shadow animate-pulse">
                                                            Sidecar A
                                                        </div>
                                                        <div className="bg-emerald-500/10 border border-emerald-500 text-emerald-400 text-[8px] font-bold px-1 rounded shadow animate-pulse">
                                                            Sidecar B
                                                        </div>
                                                    </div>
                                                )}
                                                <ArrowRight className={`w-6 h-6 ${meshStatus === 'requesting' ? 'text-emerald-500 animate-bounce' : 'text-slate-600'}`} />
                                            </div>

                                            {/* Service B Card */}
                                            <div className="flex-1 border border-white/10 bg-white/5 rounded-xl p-3.5 text-center relative z-10">
                                                <Cpu className="w-5 h-5 mx-auto mb-1.5 text-[#B58863]" />
                                                <span className="text-xs font-bold text-white block">Service B</span>
                                                <span className="text-[8px] text-slate-400">Order Svc</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right: Controllers */}
                                    <div className="lg:col-span-5 flex flex-col justify-between gap-4">
                                        <div className="bg-black/20 border border-white/5 rounded-xl p-3.5 space-y-4">
                                            {/* mTLS checkbox */}
                                            <label className={`flex items-center gap-2 cursor-pointer ${isMeshProcessing ? 'opacity-50 pointer-events-none' : ''}`}>
                                                <input
                                                    type="checkbox"
                                                    checked={meshMtls}
                                                    disabled={isMeshProcessing}
                                                    onChange={(e) => {
                                                        setMeshMtls(e.target.checked);
                                                        setMeshLogs(prev => [
                                                            e.target.checked ? `[Service Mesh] Mutual TLS (mTLS) Enabled` : `[Service Mesh] Mutual TLS (mTLS) Disabled`,
                                                            ...prev
                                                        ]);
                                                    }}
                                                    className="rounded border-white/10 bg-white/5 text-[#B58863] focus:ring-[#B58863]/25"
                                                />
                                                <span className="text-xs text-slate-300 font-semibold flex items-center gap-1">
                                                    <Lock className="w-3.5 h-3.5 text-[#B58863]" /> Enable Mutual TLS (mTLS)
                                                </span>
                                            </label>

                                            <button
                                                disabled={isMeshProcessing}
                                                onClick={triggerMeshSimulation}
                                                className="w-full flex items-center justify-center gap-2 bg-[#B58863] hover:bg-[#B58863]/85 text-white rounded-xl py-2 px-3 text-xs font-bold transition-all shadow disabled:opacity-50"
                                            >
                                                <Play className="w-3.5 h-3.5 fill-current" />
                                                <span>Execute Interservice Call</span>
                                            </button>
                                        </div>

                                        {/* Performance metrics display */}
                                        {meshMetrics && (
                                            <div className="bg-black/20 border border-white/5 rounded-xl p-3.5 space-y-1.5 text-xs">
                                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Interservice Metrics</span>
                                                <div className="flex justify-between">
                                                    <span className="text-slate-400">Payload Wire Size:</span>
                                                    <span className="font-mono font-bold text-[#B58863]">{meshMetrics.size}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-slate-400">Interservice Latency:</span>
                                                    <span className="font-mono font-bold text-emerald-400">{meshMetrics.latency}</span>
                                                </div>
                                            </div>
                                        )}

                                        {/* Telemetry Console */}
                                        <div className="flex flex-col flex-1 min-h-[120px]">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Mesh Envoy Proxies Logs</span>
                                                <button
                                                    onClick={() => {
                                                        setMeshLogs([]);
                                                        setMeshMtls(false);
                                                        setMeshMetrics(null);
                                                        setMeshStatus('idle');
                                                        setIsMeshProcessing(false);
                                                    }}
                                                    className="text-[9px] font-semibold text-slate-400 hover:text-white transition-all bg-white/5 border border-white/10 px-2 py-0.5 rounded-md"
                                                >
                                                    Reset
                                                </button>
                                            </div>
                                            <div className="flex-1 bg-black/80 font-mono text-[10px] p-3 rounded-xl border border-white/10 overflow-y-auto space-y-1 h-28 text-emerald-400 shadow-inner">
                                                {meshLogs.length === 0 ? (
                                                    <span className="text-slate-500">Telemetry idle. Execute call above...</span>
                                                ) : (
                                                    meshLogs.map((log, lIdx) => (
                                                        <div key={lIdx} className={log.includes('Warning') ? 'text-amber-400' : 'text-slate-300'}>
                                                            {log}
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <hr className="border-white/[0.04]" />

                            <div className="space-y-6">
                                <h3 className="font-bold text-white text-lg flex items-center gap-2">
                                    <Brain className="w-5 h-5 text-[#B58863]" /> Service Mesh & APIs: Interview Q&A
                                </h3>

                                <div className="space-y-6">
                                    <div className="bg-white/5 border border-white/5 rounded-xl p-5 space-y-3">
                                        <h4 className="text-sm font-bold text-white flex items-start gap-2">
                                            <span className="bg-[#B58863]/10 text-[#B58863] border border-[#B58863]/25 px-2 py-0.5 rounded text-[10px] font-mono mt-0.5">Q1</span>
                                            <span>REST vs. gRPC: When should you choose one protocol over the other?</span>
                                        </h4>
                                        <p className="text-xs text-slate-300 leading-relaxed">
                                            <strong>Answer:</strong> **REST (Representational State Transfer)** operates over HTTP/1.1 or HTTP/2, using JSON payloads. It is highly readable, widely understood, and suited for external client-facing APIs where third-party integration ease is critical.
                                            <br /><br />
                                            **gRPC (gRPC Remote Procedure Calls)** runs over HTTP/2, utilizing Protocol Buffers (Protobuf) for payload serialization. Protobuf encodes values into compact binary blocks, making it 5-10x faster and lighter than JSON. gRPC uses HTTP/2 multiplexing, allowing multiple streams of requests over a single TCP connection. Choose gRPC for **internal service-to-service communication** where low latency and typed API contracts are vital.
                                        </p>
                                    </div>

                                    <div className="bg-white/5 border border-white/5 rounded-xl p-5 space-y-3">
                                        <h4 className="text-sm font-bold text-white flex items-start gap-2">
                                            <span className="bg-[#B58863]/10 text-[#B58863] border border-[#B58863]/25 px-2 py-0.5 rounded text-[10px] font-mono mt-0.5">Q2</span>
                                            <span>How does Mutual TLS (mTLS) protect inter-service communications?</span>
                                        </h4>
                                        <p className="text-xs text-slate-300 leading-relaxed">
                                            <strong>Answer:</strong> In standard TLS (HTTPS), only the server presents a certificate to verify its identity to the client. In **Mutual TLS (mTLS)**, both the client and the server present certificates to verify each other.
                                            <br /><br />
                                            In a microservice mesh, sidecar proxies manage this handshake transparently. When Service A queries Service B, proxy A establishes a secure connection with proxy B. Both proxies validate certificates issued dynamically by the Control Plane's CA (Certificate Authority). This encrypts all inter-service communications and guarantees that malicious scripts inside the cluster cannot masquerade as other service nodes.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* CONSENSUS & TRANSACTIONS */}
                    {activeSection === 'consensus-transactions' && (
                        <div className="space-y-6 animate-in fade-in duration-300">
                            <div>
                                <h2 className="text-2xl font-black text-white tracking-tight">Consensus & Distributed Transactions</h2>
                                <p className="text-slate-300 mt-2 leading-relaxed text-sm">
                                    Maintaining data consistency across distinct server databases is extremely difficult. The CAP Theorem proves you must trade off immediate consistency for system availability during network partitions.
                                </p>
                            </div>

                            {/* CONSENSUS & TRANSACTIONS PLAYGROUND */}
                            <div className="bg-white/5 border border-white/[0.04] rounded-2xl p-6 space-y-6">
                                <div className="flex flex-col sm:flex-row items-center justify-between border-b border-white/[0.06] pb-4 gap-4">
                                    <div>
                                        <h3 className="font-bold text-white text-sm">Interactive Transaction Consensus Simulator</h3>
                                        <p className="text-[10.5px] text-slate-400 mt-0.5">Toggle atomic commits or Saga compensating transaction flows to inspect distributed rollback actions.</p>
                                    </div>

                                    <div className="flex bg-black/40 p-1 rounded-xl border border-white/10 self-end sm:self-center">
                                        <button
                                            disabled={isConsensusProcessing}
                                            onClick={() => { setConsensusMode('2pc'); setConsensusLogs([`[Client] Switched transaction model to 2-Phase Commit (2PC)`]); }}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all disabled:opacity-50 ${consensusMode === '2pc' ? 'bg-[#B58863] text-white' : 'text-slate-400 hover:text-white'}`}
                                        >
                                            Two-Phase Commit (2PC)
                                        </button>
                                        <button
                                            disabled={isConsensusProcessing}
                                            onClick={() => { setConsensusMode('saga'); setConsensusLogs([`[Client] Switched transaction model to Sagas (Compensating)`]); }}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all disabled:opacity-50 ${consensusMode === 'saga' ? 'bg-[#B58863] text-white' : 'text-slate-400 hover:text-white'}`}
                                        >
                                            Saga (Compensating)
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                                    {/* Left: Diagram */}
                                    <div className="lg:col-span-7 bg-black/40 border border-white/5 rounded-xl p-4 flex flex-col items-center justify-between min-h-[340px] relative overflow-hidden">
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 self-start">Active Transaction Mapping</span>

                                        {consensusMode === '2pc' ? (
                                            /* 2PC visual */
                                            <div className="flex flex-col items-center justify-between flex-1 w-full gap-4 relative">
                                                <div className="bg-[#10232A] border border-white/10 rounded-xl px-4 py-1.5 text-center shadow-md z-10">
                                                    <span className="text-[9px] font-bold text-slate-400 block uppercase">2PC Coordinator</span>
                                                </div>

                                                <div className="flex justify-between items-center w-full gap-6 px-2 flex-1 mt-4 z-10">
                                                    <div className={`flex-1 border p-2.5 rounded-xl text-center transition-all ${dbLocks.payment ? 'bg-amber-500/10 border-amber-500 animate-pulse' : 'bg-white/5 border-white/10'}`}>
                                                        <Database className="w-5 h-5 mx-auto mb-1 text-slate-400" />
                                                        <span className="text-[10px] font-bold text-white block">Database A</span>
                                                        <span className="text-[8px] text-slate-400 block mt-0.5">Payment DB</span>
                                                    </div>

                                                    <div className={`flex-1 border p-2.5 rounded-xl text-center transition-all ${dbLocks.inventory ? 'bg-amber-500/10 border-amber-500 animate-pulse' : 'bg-white/5 border-white/10'}`}>
                                                        <Database className="w-5 h-5 mx-auto mb-1 text-slate-400" />
                                                        <span className="text-[10px] font-bold text-white block">Database B</span>
                                                        <span className="text-[8px] text-slate-400 block mt-0.5">Inventory DB</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            /* Saga visual */
                                            <div className="flex flex-col items-center justify-center flex-1 w-full gap-4 relative">
                                                <div className="bg-[#10232A] border border-white/10 rounded-xl px-4 py-1.5 text-center shadow-md z-10">
                                                    <span className="text-[9px] font-bold text-slate-400 block uppercase">Saga Orchestrator Workflow</span>
                                                </div>

                                                <div className="flex gap-2 w-full justify-between items-center mt-4 z-10 px-2">
                                                    <div className={`flex-1 border p-2.5 rounded-xl text-center transition-all ${consensusStatus === 'compensating' ? 'bg-red-500/10 border-red-500 animate-pulse' : 'bg-white/5 border-white/10'}`}>
                                                        <span className="text-[10px] font-bold text-white block">Step A</span>
                                                        <span className="text-[8px] text-slate-400 block mt-0.5">Deduct Money</span>
                                                    </div>

                                                    <ArrowRight className="w-4 h-4 text-slate-600" />

                                                    <div className={`flex-1 border p-2.5 rounded-xl text-center transition-all ${consensusStatus === 'compensating' ? 'border-red-500/50' : 'bg-white/5 border-white/10'}`}>
                                                        <span className="text-[10px] font-bold text-white block">Step B</span>
                                                        <span className="text-[8px] text-slate-400 block mt-0.5">Book Hotel</span>
                                                    </div>

                                                    <ArrowRight className="w-4 h-4 text-slate-600" />

                                                    <div className="flex-1 border border-white/10 bg-white/5 p-2.5 rounded-xl text-center">
                                                        <span className="text-[10px] font-bold text-white block">Step C</span>
                                                        <span className="text-[8px] text-slate-400 block mt-0.5">Book Flight</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Right: Controllers */}
                                    <div className="lg:col-span-5 flex flex-col justify-between gap-4">
                                        <div className="bg-black/20 border border-white/5 rounded-xl p-3.5 space-y-3">
                                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Commit Actions</span>
                                            <div className="flex flex-col gap-2">
                                                <button
                                                    disabled={isConsensusProcessing}
                                                    onClick={() => triggerConsensusSimulation('run')}
                                                    className="w-full flex items-center justify-center gap-1.5 bg-[#B58863] hover:bg-[#B58863]/85 text-white rounded-xl py-2 px-3 text-xs font-semibold transition-all disabled:opacity-50"
                                                >
                                                    <Play className="w-3 h-3 fill-current" />
                                                    <span>Execute Success Transaction</span>
                                                </button>
                                                <button
                                                    disabled={isConsensusProcessing}
                                                    onClick={() => triggerConsensusSimulation('fail')}
                                                    className="w-full flex items-center justify-center gap-1.5 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-300 rounded-xl py-2 px-3 text-xs font-semibold transition-all disabled:opacity-50"
                                                >
                                                    <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                                                    <span>Execute Failure Transaction</span>
                                                </button>
                                            </div>
                                        </div>

                                        {/* Telemetry Console */}
                                        <div className="flex flex-col flex-1 min-h-[140px]">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Consensus coordinator logs</span>
                                                <button
                                                    onClick={() => {
                                                        setConsensusLogs([]);
                                                        setConsensusStatus('idle');
                                                        setDbLocks({ inventory: false, payment: false });
                                                        setIsConsensusProcessing(false);
                                                    }}
                                                    className="text-[9px] font-semibold text-slate-400 hover:text-white transition-all bg-white/5 border border-white/10 px-2 py-0.5 rounded-md"
                                                >
                                                    Reset
                                                </button>
                                            </div>
                                            <div className="flex-1 bg-black/80 font-mono text-[10px] p-3 rounded-xl border border-white/10 overflow-y-auto space-y-1 h-32 text-emerald-400 shadow-inner">
                                                {consensusLogs.length === 0 ? (
                                                    <span className="text-slate-500">Telemetry idle. Run commit actions above...</span>
                                                ) : (
                                                    consensusLogs.map((log, lIdx) => (
                                                        <div key={lIdx} className={log.includes('❌') ? 'text-red-400 font-bold' : log.includes('SUCCESS') ? 'text-emerald-400' : 'text-slate-300'}>
                                                            {log}
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <hr className="border-white/[0.04]" />

                            <div className="space-y-6">
                                <h3 className="font-bold text-white text-lg flex items-center gap-2">
                                    <Brain className="w-5 h-5 text-[#B58863]" /> Consensus & Transactions: Interview Q&A
                                </h3>

                                <div className="space-y-6">
                                    <div className="bg-white/5 border border-white/5 rounded-xl p-5 space-y-3">
                                        <h4 className="text-sm font-bold text-white flex items-start gap-2">
                                            <span className="bg-[#B58863]/10 text-[#B58863] border border-[#B58863]/25 px-2 py-0.5 rounded text-[10px] font-mono mt-0.5">Q1</span>
                                            <span>Why is 2-Phase Commit (2PC) avoided in highly available web architectures?</span>
                                        </h4>
                                        <p className="text-xs text-slate-300 leading-relaxed">
                                            <strong>Answer:</strong> Two-Phase Commit is a synchronous, blocking protocol.
                                            During the "Prepare" phase, the coordinator locks records in participating databases (e.g. locking user credit and ticket inventory). If one node experiences network delay, all other database nodes hold locks waiting for it.
                                            <br /><br />
                                            This severely degrades availability: locks exhaust connection pools, causing cascading delays that choke the user-facing gateways. In modern web architectures, we prioritize availability and use the **Saga Pattern (Orchestration or Choreography)** to commit records locally and immediately, relying on background compensating transactions if a step fails.
                                        </p>
                                    </div>

                                    <div className="bg-white/5 border border-white/5 rounded-xl p-5 space-y-3">
                                        <h4 className="text-sm font-bold text-white flex items-start gap-2">
                                            <span className="bg-[#B58863]/10 text-[#B58863] border border-[#B58863]/25 px-2 py-0.5 rounded text-[10px] font-mono mt-0.5">Q2</span>
                                            <span>How does Raft Consensus solve network partitions (Split-Brain)?</span>
                                        </h4>
                                        <p className="text-xs text-slate-300 leading-relaxed">
                                            <strong>Answer:</strong> Consensus algorithms like Raft manage replication consistency across a cluster of server nodes (e.g. 5 nodes). Raft requires a **majority quorum** (`N/2 + 1` = 3 nodes) to confirm commits.
                                            <br /><br />
                                            If a network partition occurs and splits the cluster into two segments (a 2-node partition and a 3-node partition):
                                            1. The 2-node partition cannot establish a leader because it cannot gather 3 votes. It blocks all write commits, remaining read-only.
                                            2. The 3-node partition retains a quorum, elects a leader, and continues writing records safely.
                                            3. Once the partition heals, the nodes in the 2-node partition see the higher election terms and logs of the majority partition, roll back uncommitted changes, and align their logs with the source of truth.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TELEMETRY & LOGS */}
                    {activeSection === 'monitoring-tracing' && (
                        <div className="space-y-6 animate-in fade-in duration-300">
                            <div>
                                <h2 className="text-2xl font-black text-white tracking-tight">Observability, Telemetry & Distributed Tracing</h2>
                                <p className="text-slate-300 mt-2 leading-relaxed text-sm">
                                    When microservices fail, local server files are not enough. High-performance observability architectures aggregate metrics, logs, and distributed traces to provide live debugging insights.
                                </p>
                            </div>

                            {/* TELEMETRY PLAYGROUND */}
                            <div className="bg-white/5 border border-white/[0.04] rounded-2xl p-6 space-y-6">
                                <div className="flex flex-col sm:flex-row items-center justify-between border-b border-white/[0.06] pb-4 gap-4">
                                    <div>
                                        <h3 className="font-bold text-white text-sm">Interactive Tracing & Observability Dashboard</h3>
                                        <p className="text-[10.5px] text-slate-400 mt-0.5">Trigger an API flow to trace operations in a Jaeger-style Gantt chart and inspect correlated trace logs.</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                                    {/* Left: Gantt Traces */}
                                    <div className="lg:col-span-7 bg-black/40 border border-white/5 rounded-xl p-4 flex flex-col items-start justify-between min-h-[340px] relative overflow-hidden">
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3">Jaeger Trace Gantt Chart</span>

                                        <div className="w-full space-y-3 flex-1 flex flex-col justify-center">
                                            {telemetrySpans.length === 0 ? (
                                                <div className="text-center text-xs text-slate-500 py-12 w-full">
                                                    No trace records. Click checkout below to record a distributed trace...
                                                </div>
                                            ) : (
                                                telemetrySpans.map((span, sIdx) => (
                                                    <div key={sIdx} className="space-y-1">
                                                        <div className="flex justify-between text-[10px] text-slate-400">
                                                            <span>{span.name}</span>
                                                            <span>{span.duration}ms</span>
                                                        </div>
                                                        <div className="w-full bg-white/5 h-3 rounded-full relative overflow-hidden">
                                                            <div
                                                                className="h-full rounded-full transition-all duration-1000"
                                                                style={{
                                                                    width: `${(span.duration / 180) * 100}%`,
                                                                    marginLeft: `${(span.offset / 180) * 100}%`,
                                                                    backgroundColor: span.color
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>

                                    {/* Right: Controller & Console */}
                                    <div className="lg:col-span-5 flex flex-col justify-between gap-4">
                                        <div className="bg-black/20 border border-white/5 rounded-xl p-3.5 space-y-3">
                                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Trace Actions</span>
                                            <button
                                                disabled={isTracing}
                                                onClick={triggerTelemetrySimulation}
                                                className="w-full flex items-center justify-center gap-2 bg-[#B58863] hover:bg-[#B58863]/85 text-white rounded-xl py-2 px-3 text-xs font-bold transition-all shadow"
                                            >
                                                <Play className="w-3.5 h-3.5 fill-current" />
                                                <span>Trigger Checkout Request</span>
                                            </button>
                                        </div>

                                        {/* Telemetry Console */}
                                        <div className="flex flex-col flex-1 min-h-[160px]">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Centralized Log Aggregator</span>
                                                <button
                                                    onClick={() => {
                                                        setTelemetryLogs([]);
                                                        setTelemetrySpans([]);
                                                        setIsTracing(false);
                                                    }}
                                                    className="text-[9px] font-semibold text-slate-400 hover:text-white transition-all bg-white/5 border border-white/10 px-2 py-0.5 rounded-md"
                                                >
                                                    Reset
                                                </button>
                                            </div>
                                            <div className="flex-1 bg-black/80 font-mono text-[9px] p-3 rounded-xl border border-white/10 overflow-y-auto space-y-1 h-36 text-emerald-400 shadow-inner">
                                                {telemetryLogs.length === 0 ? (
                                                    <span className="text-slate-500">Telemetry logs idle. Run trace above...</span>
                                                ) : (
                                                    telemetryLogs.map((log, lIdx) => (
                                                        <div key={lIdx} className="text-slate-300">
                                                            {log}
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <hr className="border-white/[0.04]" />

                            <div className="space-y-6">
                                <h3 className="font-bold text-white text-lg flex items-center gap-2">
                                    <Brain className="w-5 h-5 text-[#B58863]" /> Telemetry & Logs: Interview Q&A
                                </h3>

                                <div className="space-y-6">
                                    <div className="bg-white/5 border border-white/5 rounded-xl p-5 space-y-3">
                                        <h4 className="text-sm font-bold text-white flex items-start gap-2">
                                            <span className="bg-[#B58863]/10 text-[#B58863] border border-[#B58863]/25 px-2 py-0.5 rounded text-[10px] font-mono mt-0.5">Q1</span>
                                            <span>How do you implement distributed tracing without impacting request latency?</span>
                                        </h4>
                                        <p className="text-xs text-slate-300 leading-relaxed">
                                            <strong>Answer:</strong> Distributed tracing tracks requests across multiple backend networks using unique transaction IDs:
                                            1. When a client requests the API Gateway, the gateway generates a `Trace-ID` header (e.g., `X-B3-TraceId`).
                                            2. As the request queries downstream services (e.g., Auth &rarr; Catalog), each service injects this header into outgoing calls, along with local `Span-ID` tags.
                                            3. To avoid slowing down the active API thread, service containers do not push trace spans synchronously. Instead, they write trace data to a local memory buffer. A background collector daemon gathers and ships these spans asynchronously to a tracer storage engine (e.g., Jaeger, Zipkin).
                                            4. We use **Sampling Rates** (e.g., collecting only 1% of successful requests and 100% of failed ones) to optimize storage capacity.
                                        </p>
                                    </div>

                                    <div className="bg-white/5 border border-white/5 rounded-xl p-5 space-y-3">
                                        <h4 className="text-sm font-bold text-white flex items-start gap-2">
                                            <span className="bg-[#B58863]/10 text-[#B58863] border border-[#B58863]/25 px-2 py-0.5 rounded text-[10px] font-mono mt-0.5">Q2</span>
                                            <span>Metrics Collection: Pull vs. Push models. What are the scaling characteristics?</span>
                                        </h4>
                                        <p className="text-xs text-slate-300 leading-relaxed">
                                            <strong>Answer:</strong> **Pull Model (e.g. Prometheus)**: The monitoring server queries metrics endpoints (`/metrics`) on application instances at static intervals.
                                            <br /><em>Pros:</em> Central control. If application instances are overwhelmed, they can drop scrapers, preventing monitor pipelines from crashing targets.
                                            <br /><em>Cons:</em> Requires active service discovery to identify all IP endpoints. Hard to track short-lived serverless functions.
                                            <br /><br />
                                            **Push Model (e.g. StatsD, Datadog agent)**: Application containers push UDP metrics packets directly to a collector daemon as events occur.
                                            <br /><em>Pros:</em> Works well for transient worker jobs or cloud serverless endpoints without configurations.
                                            <br /><em>Cons:</em> High packet drop rates if collector nodes are overloaded. Application threads can exhaust outgoing connections if metrics are pushed synchronously.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}


                    {/* DISASTER RECOVERY & MULTI-REGION */}
                    {activeSection === 'disaster-recovery' && (
                        <div className="space-y-6 animate-in fade-in duration-300">
                            <div>
                                <h2 className="text-2xl font-black text-white tracking-tight">Disaster Recovery & Multi-Region Architecture</h2>
                                <p className="text-slate-300 mt-2 leading-relaxed text-sm">
                                    To protect against complete data center failures (natural disasters, network grid failure), systems replicate data and routing paths globally across multiple distinct regions.
                                </p>
                            </div>

                            {/* DR PLAYGROUND */}
                            <div className="bg-white/5 border border-white/[0.04] rounded-2xl p-6 space-y-6">
                                <div className="flex flex-col sm:flex-row items-center justify-between border-b border-white/[0.06] pb-4 gap-4">
                                    <div>
                                        <h3 className="font-bold text-white text-sm">Interactive Multi-Region Failover Simulator</h3>
                                        <p className="text-[10.5px] text-slate-400 mt-0.5">Test DNS failover routing when Region A experiences a primary outage, or analyze Active-Active traffic flows.</p>
                                    </div>

                                    <div className="flex bg-black/40 p-1 rounded-xl border border-white/10 self-end sm:self-center">
                                        <button
                                            onClick={() => { setDrMode('active-passive'); setDrLogs([`[DNS] Switched to Active-Passive failover configuration`]); }}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${drMode === 'active-passive' ? 'bg-[#B58863] text-white' : 'text-slate-400 hover:text-white'}`}
                                        >
                                            Active-Passive
                                        </button>
                                        <button
                                            onClick={() => { setDrMode('active-active'); setDrLogs([`[BGP] Switched to Active-Active geo-routing mode`]); }}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${drMode === 'active-active' ? 'bg-[#B58863] text-white' : 'text-slate-400 hover:text-white'}`}
                                        >
                                            Active-Active
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                                    {/* Left: Diagram */}
                                    <div className="lg:col-span-7 bg-black/40 border border-white/5 rounded-xl p-4 flex flex-col items-center justify-between min-h-[340px] relative overflow-hidden">
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 self-start">Global Network Routing</span>

                                        <div className="flex flex-col items-center justify-between flex-1 w-full gap-4 relative">
                                            <div className="bg-[#10232A] border border-white/10 rounded-xl px-4 py-1.5 text-center shadow-md z-10">
                                                <span className="text-[9px] font-bold text-slate-400 block uppercase">Global Anycast DNS Router</span>
                                            </div>

                                            <ArrowDown className="w-4 h-4 text-slate-500 z-10" />

                                            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                                                <line
                                                    x1="50%" y1="20%" x2="25%" y2="80%"
                                                    stroke={drActivePath === 'regionA' && !regionAOffline ? '#10B981' : regionAOffline && drActivePath === 'regionA' ? '#EF4444' : 'rgba(255,255,255,0.06)'}
                                                    strokeWidth="2"
                                                    className="transition-all duration-300"
                                                />
                                                <line
                                                    x1="50%" y1="20%" x2="75%" y2="80%"
                                                    stroke={drActivePath === 'regionB' ? '#10B981' : 'rgba(255,255,255,0.06)'}
                                                    strokeWidth="2"
                                                    className="transition-all duration-300"
                                                />
                                            </svg>

                                            <div className="flex justify-between w-full z-10 px-2 mt-4">
                                                {/* Region A */}
                                                <div className={`flex-1 border rounded-xl p-3 text-center transition-all max-w-[130px] mx-auto ${regionAOffline ? 'bg-red-500/10 border-red-500 shadow-red-500/5' : drActivePath === 'regionA' ? 'bg-emerald-500/10 border-emerald-500 shadow-emerald-500/10 scale-105' : 'bg-white/5 border-white/10'}`}>
                                                    <Globe className="w-5 h-5 mx-auto mb-1 text-slate-400" />
                                                    <span className="text-[10px] font-bold text-white block">US East (A)</span>
                                                    <span className="text-[8px] text-slate-400 block mt-0.5">{regionAOffline ? 'OUTAGE' : 'PRIMARY'}</span>
                                                </div>

                                                {/* Region B */}
                                                <div className={`flex-1 border rounded-xl p-3 text-center transition-all max-w-[130px] mx-auto ${drActivePath === 'regionB' ? 'bg-emerald-500/10 border-emerald-500 shadow-emerald-500/10 scale-105' : 'bg-white/5 border-white/10'}`}>
                                                    <Globe className="w-5 h-5 mx-auto mb-1 text-slate-400" />
                                                    <span className="text-[10px] font-bold text-white block">US West (B)</span>
                                                    <span className="text-[8px] text-slate-400 block mt-0.5">{drMode === 'active-active' ? 'ACTIVE' : 'BACKUP'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right: Controllers */}
                                    <div className="lg:col-span-5 flex flex-col justify-between gap-4">
                                        <div className="bg-black/20 border border-white/5 rounded-xl p-3.5 space-y-3">
                                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Network Actions</span>
                                            <div className="flex flex-col gap-2">
                                                <button
                                                    onClick={() => triggerDrSimulation('send')}
                                                    className="w-full flex items-center justify-center gap-1.5 bg-[#B58863] hover:bg-[#B58863]/85 text-white rounded-xl py-2 px-3 text-xs font-semibold transition-all"
                                                >
                                                    <Play className="w-3 h-3 fill-current" />
                                                    <span>Dispatch Test Traffic</span>
                                                </button>
                                                <button
                                                    onClick={() => triggerDrSimulation('toggle-region')}
                                                    className="w-full flex items-center justify-center gap-1.5 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-300 rounded-xl py-2 px-3 text-xs font-semibold transition-all"
                                                >
                                                    <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                                                    <span>{regionAOffline ? 'Restore Region A Host' : 'Crash Region A Data Center'}</span>
                                                </button>
                                            </div>
                                        </div>

                                        {/* Telemetry Console */}
                                        <div className="flex flex-col flex-1 min-h-[140px]">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">DNS Router Health logs</span>
                                                <button
                                                    onClick={() => {
                                                        setDrLogs([]);
                                                        setRegionAOffline(false);
                                                        setDrActivePath(null);
                                                        setDrMode('active-passive');
                                                    }}
                                                    className="text-[9px] font-semibold text-slate-400 hover:text-white transition-all bg-white/5 border border-white/10 px-2 py-0.5 rounded-md"
                                                >
                                                    Reset
                                                </button>
                                            </div>
                                            <div className="flex-1 bg-black/80 font-mono text-[10px] p-3 rounded-xl border border-white/10 overflow-y-auto space-y-1 h-32 text-emerald-400 shadow-inner">
                                                {drLogs.length === 0 ? (
                                                    <span className="text-slate-500">Router idle. Route test traffic...</span>
                                                ) : (
                                                    drLogs.map((log, lIdx) => (
                                                        <div key={lIdx} className={log.includes('❌') ? 'text-red-400 font-bold' : log.includes('failover') || log.includes('routing') ? 'text-amber-400' : 'text-slate-300'}>
                                                            {log}
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <hr className="border-white/[0.04]" />

                            <div className="space-y-6">
                                <h3 className="font-bold text-white text-lg flex items-center gap-2">
                                    <Brain className="w-5 h-5 text-[#B58863]" /> Multi-Region: Interview Q&A
                                </h3>

                                <div className="space-y-6">
                                    <div className="bg-white/5 border border-white/5 rounded-xl p-5 space-y-3">
                                        <h4 className="text-sm font-bold text-white flex items-start gap-2">
                                            <span className="bg-[#B58863]/10 text-[#B58863] border border-[#B58863]/25 px-2 py-0.5 rounded text-[10px] font-mono mt-0.5">Q1</span>
                                            <span>How do you design Active-Active multi-region database synchronization while avoiding write conflicts?</span>
                                        </h4>
                                        <p className="text-xs text-slate-300 leading-relaxed">
                                            <strong>Answer:</strong> Active-Active multi-region means both region nodes accept writes concurrently. To avoid collision bottlenecks:
                                            1. Use **Conflict-Free Replicated Data Types (CRDTs)** where data structures merge mathematically (e.g. PN-Counters, Grow-Only sets) without coordinator negotiation.
                                            2. Enforce **Last-Write-Wins (LWW)** using NTP synchronized timestamps. *Cons:* Clock skew risks overwriting correct data updates.
                                            3. Partition database tables by location ID or user key prefix, so writes for User X always route to Region A, while User Y writes route to Region B, minimizing overlaps.
                                        </p>
                                    </div>

                                    <div className="bg-white/5 border border-white/5 rounded-xl p-5 space-y-3">
                                        <h4 className="text-sm font-bold text-white flex items-start gap-2">
                                            <span className="bg-[#B58863]/10 text-[#B58863] border border-[#B58863]/25 px-2 py-0.5 rounded text-[10px] font-mono mt-0.5">Q2</span>
                                            <span>What is the difference between RTO (Recovery Time Objective) and RPO (Recovery Point Objective)?</span>
                                        </h4>
                                        <p className="text-xs text-slate-300 leading-relaxed">
                                            <strong>Answer:</strong>
                                            * **Recovery Time Objective (RTO)**: The duration of downtime acceptable before restoring the system to service (e.g., system must recover in &lt;10 minutes).
                                            * **Recovery Point Objective (RPO)**: The maximum acceptable period of data loss measured in time (e.g., if database backups occur hourly, the worst-case data loss window is 60 minutes).
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* SEARCH ENGINES & INDEXING */}
                    {activeSection === 'search-indexing' && (
                        <div className="space-y-6 animate-in fade-in duration-300">
                            <div>
                                <h2 className="text-2xl font-black text-white tracking-tight">Search Engines & Indexing</h2>
                                <p className="text-slate-300 mt-2 leading-relaxed text-sm">
                                    Full-text search queries cannot rely on standard relational table scans. Inverted indexes map terms directly to document locations, allowing near-instant retrieval.
                                </p>
                            </div>

                            {/* SEARCH PLAYGROUND */}
                            <div className="bg-white/5 border border-white/[0.04] rounded-2xl p-6 space-y-6">
                                <div className="flex flex-col sm:flex-row items-center justify-between border-b border-white/[0.06] pb-4 gap-4">
                                    <div>
                                        <h3 className="font-bold text-white text-sm">Interactive Inverted Index Playground</h3>
                                        <p className="text-[10.5px] text-slate-400 mt-0.5">Search index terms (scalable, distributed, cache, database) to view the inverted lookup array matching documents.</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                                    {/* Left: Index visual */}
                                    <div className="lg:col-span-7 bg-black/40 border border-white/5 rounded-xl p-4 flex flex-col items-center justify-between min-h-[340px] relative overflow-hidden">
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 self-start">Inverted Index Database</span>

                                        <div className="w-full space-y-2 mt-2">
                                            <div className="grid grid-cols-2 text-[10px] font-bold text-slate-400 border-b border-white/5 pb-1">
                                                <span>Token Keyword</span>
                                                <span>Posting List (Doc IDs)</span>
                                            </div>
                                            {Object.keys(searchIndex).map((term) => (
                                                <div key={term} className={`grid grid-cols-2 text-xs py-1 transition-all ${searchTerm.toLowerCase() === term ? 'text-[#B58863] bg-[#B58863]/5 font-bold' : 'text-slate-300'}`}>
                                                    <span>{term}</span>
                                                    <span className="font-mono">[{searchIndex[term].join(', ')}]</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Right: Search Console */}
                                    <div className="lg:col-span-5 flex flex-col justify-between gap-4">
                                        <div className="bg-black/20 border border-white/5 rounded-xl p-3.5 space-y-3">
                                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Search Tool</span>
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    placeholder="Try: distributed, cache..."
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                    disabled={isSearchProcessing}
                                                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#B58863]/50 disabled:opacity-50"
                                                />
                                                <button
                                                    onClick={() => triggerSearchSimulation(searchTerm)}
                                                    disabled={isSearchProcessing}
                                                    className="bg-[#B58863] hover:bg-[#B58863]/85 text-white rounded-xl px-4 py-1.5 text-xs font-bold transition-all disabled:opacity-50"
                                                >
                                                    Query
                                                </button>
                                            </div>
                                            <div className="flex flex-wrap gap-1.5 mt-2">
                                                {['scalable', 'distributed', 'cache', 'database'].map((tag) => (
                                                    <button
                                                        key={tag}
                                                        onClick={() => triggerSearchSimulation(tag)}
                                                        disabled={isSearchProcessing}
                                                        className="text-[9px] font-bold bg-white/5 border border-white/10 rounded px-2 py-0.5 text-slate-300 hover:text-white disabled:opacity-50"
                                                    >
                                                        {tag}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Matches Readout */}
                                        {searchResults !== null && (
                                            <div className="bg-black/20 border border-[#B58863]/25 p-3 rounded-xl text-xs space-y-1">
                                                <span className="text-slate-400">Match Results:</span>
                                                <div className="font-mono text-[#B58863] font-bold">
                                                    {searchResults.length > 0 ? `Documents matched: [${searchResults.join(', ')}]` : 'No matching documents found.'}
                                                </div>
                                            </div>
                                        )}

                                        {/* Logs Console */}
                                        <div className="flex flex-col flex-1 min-h-[120px]">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Search Engine Logs</span>
                                                <button
                                                    onClick={() => {
                                                        setSearchEngineLogs([]);
                                                        setSearchTerm('');
                                                        setSearchResults(null);
                                                        setIsSearchProcessing(false);
                                                    }}
                                                    className="text-[9px] font-semibold text-slate-400 hover:text-white transition-all bg-white/5 border border-white/10 px-2 py-0.5 rounded-md"
                                                >
                                                    Reset
                                                </button>
                                            </div>
                                            <div className="flex-1 bg-black/80 font-mono text-[10px] p-3 rounded-xl border border-white/10 overflow-y-auto space-y-1 h-28 text-emerald-400 shadow-inner">
                                                {searchEngineLogs.length === 0 ? (
                                                    <span className="text-slate-500">Query engine idle. Search a term above...</span>
                                                ) : (
                                                    searchEngineLogs.map((log, lIdx) => (
                                                        <div key={lIdx} className="text-slate-300">
                                                            {log}
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <hr className="border-white/[0.04]" />

                            <div className="space-y-6">
                                <h3 className="font-bold text-white text-lg flex items-center gap-2">
                                    <Brain className="w-5 h-5 text-[#B58863]" /> Search Indexing: Interview Q&A
                                </h3>

                                <div className="space-y-6">
                                    <div className="bg-white/5 border border-white/5 rounded-xl p-5 space-y-3">
                                        <h4 className="text-sm font-bold text-white flex items-start gap-2">
                                            <span className="bg-[#B58863]/10 text-[#B58863] border border-[#B58863]/25 px-2 py-0.5 rounded text-[10px] font-mono mt-0.5">Q1</span>
                                            <span>How does a search engine like Elasticsearch perform near real-time document search?</span>
                                        </h4>
                                        <p className="text-xs text-slate-300 leading-relaxed">
                                            <strong>Answer:</strong> Elasticsearch stores updates in memory segments.
                                            1. When a write occurs, documents are compiled into an in-memory buffer.
                                            2. At intervals (e.g. every 1s), this memory buffer is written (flushed) into filesystem cache segments (immutable Lucene indices) which makes the records searchable immediately (near real-time).
                                            3. The changes are concurrently written to a Transaction Log (Translog) buffer to prevent data loss in case of hardware failures.
                                        </p>
                                    </div>

                                    <div className="bg-white/5 border border-white/5 rounded-xl p-5 space-y-3">
                                        <h4 className="text-sm font-bold text-white flex items-start gap-2">
                                            <span className="bg-[#B58863]/10 text-[#B58863] border border-[#B58863]/25 px-2 py-0.5 rounded text-[10px] font-mono mt-0.5">Q2</span>
                                            <span>Explain TF-IDF and BM25 document scoring.</span>
                                        </h4>
                                        <p className="text-xs text-slate-300 leading-relaxed">
                                            <strong>Answer:</strong> TF-IDF evaluates relevance:
                                            * **Term Frequency (TF)**: How often a keyword appears in a document. High TF implies high relevance.
                                            * **Inverse Document Frequency (IDF)**: How rare the keyword is across all documents. Common words (like "the", "and") receive near-zero weights.
                                            * **BM25**: Modern Elasticsearch default. Optimizes TF-IDF by adding a document length normalization parameter (penalizing long documents containing the term by accident) and capping the term frequency influence (preventing a keyword repeated 100 times from skewing scores).
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* SECURITY & DDOS */}
                    {activeSection === 'security-ddos' && (
                        <div className="space-y-6 animate-in fade-in duration-300">
                            <div>
                                <h2 className="text-2xl font-black text-white tracking-tight">Security, Cryptography & DDoS Mitigation</h2>
                                <p className="text-slate-300 mt-2 leading-relaxed text-sm">
                                    Distributed applications are targeted constantly. Edge WAF, SYN cookies, and rate scrubbing protect systems from service outages and injection compromises.
                                </p>
                            </div>

                            {/* SECURITY PLAYGROUND */}
                            <div className="bg-white/5 border border-white/[0.04] rounded-2xl p-6 space-y-6">
                                <div className="flex flex-col sm:flex-row items-center justify-between border-b border-white/[0.06] pb-4 gap-4">
                                    <div>
                                        <h3 className="font-bold text-white text-sm">Interactive Edge Security Shield</h3>
                                        <p className="text-[10.5px] text-slate-400 mt-0.5">Toggle WAF filters and inject malicious request payloads to analyze packet scrubbing defenses.</p>
                                    </div>

                                    <div className="flex items-center gap-2 self-end sm:self-center bg-black/40 border border-white/10 px-3 py-1.5 rounded-xl">
                                        <span className="text-xs font-bold text-slate-300">WAF Filter:</span>
                                        <button
                                            disabled={isSecurityProcessing}
                                            onClick={() => { setWafActive(!wafActive); setSecurityLogs(prev => [`[Firewall] WAF Shield toggled ${!wafActive ? 'ACTIVE' : 'OFF'}`, ...prev]); }}
                                            className={`px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wide border transition-all disabled:opacity-50 ${wafActive
                                                    ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                                                    : 'bg-white/5 border-white/10 text-slate-400'
                                                }`}
                                        >
                                            {wafActive ? 'ON' : 'OFF'}
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                                    {/* Left: Graphic mapping */}
                                    <div className="lg:col-span-7 bg-black/40 border border-white/5 rounded-xl p-4 flex flex-col items-center justify-between min-h-[340px] relative overflow-hidden">
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 self-start">Active Edge Shield</span>

                                        <div className="flex flex-col items-center justify-between flex-1 w-full gap-4 relative">
                                            <div className="bg-[#10232A] border border-white/10 rounded-xl px-4 py-1.5 text-center shadow-md">
                                                <span className="text-[9px] font-bold text-slate-400 block uppercase">Client Connection Stream</span>
                                            </div>

                                            <ArrowDown className="w-4 h-4 text-slate-500" />

                                            {/* Security shield */}
                                            <div className={`border rounded-xl px-4 py-2 flex items-center justify-center gap-2 text-xs font-semibold max-w-[200px] w-full shadow-md transition-all duration-300 ${wafActive ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' : 'bg-white/5 border-white/10 text-slate-400'
                                                }`}>
                                                <ShieldCheck className="w-4 h-4" />
                                                <span>WAF Edge Filter</span>
                                            </div>

                                            <ArrowDown className="w-4 h-4 text-slate-500" />

                                            <div className={`border rounded-xl p-3 text-center transition-all ${securityStatus === 'ddos' && !wafActive ? 'bg-red-500/20 border-red-500 animate-pulse' : 'bg-white/5 border-white/10'}`}>
                                                <Server className="w-5 h-5 mx-auto mb-1 text-slate-400" />
                                                <span className="text-[10px] font-bold text-white block">Application Server</span>
                                                <span className="text-[8px] text-slate-400 block mt-0.5">{securityStatus === 'ddos' && !wafActive ? 'CRASHED (100% CPU)' : 'STABLE'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right: Controllers */}
                                    <div className="lg:col-span-5 flex flex-col justify-between gap-4">
                                        <div className="bg-black/20 border border-white/5 rounded-xl p-3.5 space-y-2">
                                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Attack Injectors</span>
                                            <div className="flex flex-col gap-2">
                                                <button
                                                    onClick={() => triggerSecuritySimulation('valid')}
                                                    disabled={isSecurityProcessing}
                                                    className="w-full flex items-center justify-center gap-1.5 bg-white/5 border border-white/10 hover:bg-white/10 text-slate-200 rounded-xl py-2 px-3 text-xs font-semibold transition-all disabled:opacity-50"
                                                >
                                                    <Play className="w-3.5 h-3.5 fill-current" />
                                                    <span>Send Valid GET Request</span>
                                                </button>
                                                <button
                                                    onClick={() => triggerSecuritySimulation('sql')}
                                                    disabled={isSecurityProcessing}
                                                    className="w-full flex items-center justify-center gap-1.5 bg-red-500/10 border border-red-500/20 hover:bg-red-500/25 text-red-300 rounded-xl py-2 px-3 text-xs font-semibold transition-all disabled:opacity-50"
                                                >
                                                    <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                                                    <span>Inject SQL Injection Attack</span>
                                                </button>
                                                <button
                                                    onClick={() => triggerSecuritySimulation('ddos')}
                                                    disabled={isSecurityProcessing}
                                                    className="w-full flex items-center justify-center gap-1.5 bg-red-500/10 border border-red-500/20 hover:bg-red-500/25 text-red-300 rounded-xl py-2 px-3 text-xs font-semibold transition-all disabled:opacity-50"
                                                >
                                                    <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                                                    <span>Inject Syn Flood DDoS</span>
                                                </button>
                                            </div>
                                        </div>

                                        {/* Telemetry Console */}
                                        <div className="flex flex-col flex-1 min-h-[140px]">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Firewall Scrubber Logs</span>
                                                <button
                                                    onClick={() => {
                                                        setSecurityLogs([]);
                                                        setWafActive(false);
                                                        setSecurityStatus('idle');
                                                        setIsSecurityProcessing(false);
                                                    }}
                                                    className="text-[9px] font-semibold text-slate-400 hover:text-white transition-all bg-white/5 border border-white/10 px-2 py-0.5 rounded-md"
                                                >
                                                    Reset
                                                </button>
                                            </div>
                                            <div className="flex-1 bg-black/80 font-mono text-[10px] p-3 rounded-xl border border-white/10 overflow-y-auto space-y-1 h-32 text-emerald-400 shadow-inner">
                                                {securityLogs.length === 0 ? (
                                                    <span className="text-slate-500">Logs idle. Inject attack scripts above...</span>
                                                ) : (
                                                    securityLogs.map((log, lIdx) => (
                                                        <div key={lIdx} className={log.includes('❌') || log.includes('💥') ? 'text-red-400 font-bold' : log.includes('✅') ? 'text-emerald-400' : 'text-slate-300'}>
                                                            {log}
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <hr className="border-white/[0.04]" />

                            <div className="space-y-6">
                                <h3 className="font-bold text-white text-lg flex items-center gap-2">
                                    <Brain className="w-5 h-5 text-[#B58863]" /> Security & DDoS: Interview Q&A
                                </h3>

                                <div className="space-y-6">
                                    <div className="bg-white/5 border border-white/5 rounded-xl p-5 space-y-3">
                                        <h4 className="text-sm font-bold text-white flex items-start gap-2">
                                            <span className="bg-[#B58863]/10 text-[#B58863] border border-[#B58863]/25 px-2 py-0.5 rounded text-[10px] font-mono mt-0.5">Q1</span>
                                            <span>How does a Web Application Firewall (WAF) block SQL injection attacks?</span>
                                        </h4>
                                        <p className="text-xs text-slate-300 leading-relaxed">
                                            <strong>Answer:</strong> WAF operates at Layer 7 (HTTP level) inspecting headers and query arguments:
                                            * **Signature Matching**: Inspects incoming strings for SQL command structures (e.g. `UNION SELECT`, `OR 1=1`, `--`).
                                            * **Regex Filters**: Passes input text fields through active regular expression catalogs.
                                            * **IP Reputation Check**: Blocks or throttles IPs flagged dynamically by threat network intelligence services.
                                        </p>
                                    </div>

                                    <div className="bg-white/5 border border-white/5 rounded-xl p-5 space-y-3">
                                        <h4 className="text-sm font-bold text-white flex items-start gap-2">
                                            <span className="bg-[#B58863]/10 text-[#B58863] border border-[#B58863]/25 px-2 py-0.5 rounded text-[10px] font-mono mt-0.5">Q2</span>
                                            <span>How do you mitigate massive SYN flood DDoS attacks?</span>
                                        </h4>
                                        <p className="text-xs text-slate-300 leading-relaxed">
                                            <strong>Answer:</strong>
                                            * **SYN Cookies**: The server responds to TCP SYN requests by encoding security info into the TCP sequence number parameter, without allocating memory resources for the connection handshake. The connection allocates memory only once a valid ACK matches the cookie sequence.
                                            * **Anycast Scrubbing (Cloudflare model)**: Routes global traffic through a distributed edgeAnycast IP block. High-capacity edge servers filter syn flood packets before they can reach the origin application servers.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* GEOSPATIAL SYSTEMS */}
                    {activeSection === 'geospatial-systems' && (
                        <div className="space-y-6 animate-in fade-in duration-300">
                            <div>
                                <h2 className="text-2xl font-black text-white tracking-tight">Geospatial Systems & GPS Indexing</h2>
                                <p className="text-slate-300 mt-2 leading-relaxed text-sm">
                                    Finding items near coordinates (e.g., Yelp restaurants, Uber taxis) is extremely resource-heavy. Geospatial indexing partitions grid blocks to optimize coordinate queries.
                                </p>
                            </div>

                            {/* GEOSPATIAL PLAYGROUND */}
                            <div className="bg-white/5 border border-white/[0.04] rounded-2xl p-6 space-y-6">
                                <div className="flex flex-col sm:flex-row items-center justify-between border-b border-white/[0.06] pb-4 gap-4">
                                    <div>
                                        <h3 className="font-bold text-white text-sm">Interactive GPS Coordinate search</h3>
                                        <p className="text-[10.5px] text-slate-400 mt-0.5">Click coordinate dots in the spatial map grid space to test point query lookups.</p>
                                    </div>

                                    <div className="flex bg-black/40 p-1 rounded-xl border border-white/10 self-end sm:self-center">
                                        <button
                                            disabled={isGeoProcessing}
                                            onClick={() => { setSpatialMode('geohash'); setGeospatialLogs([`[Client] Switched indexing pattern to Geohash mapping`]); }}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all disabled:opacity-50 ${spatialMode === 'geohash' ? 'bg-[#B58863] text-white' : 'text-slate-400 hover:text-white'}`}
                                        >
                                            Geohash Base32
                                        </button>
                                        <button
                                            disabled={isGeoProcessing}
                                            onClick={() => { setSpatialMode('quadtree'); setGeospatialLogs([`[Client] Switched indexing pattern to Quadtree divisions`]); }}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all disabled:opacity-50 ${spatialMode === 'quadtree' ? 'bg-[#B58863] text-white' : 'text-slate-400 hover:text-white'}`}
                                        >
                                            Quadtree Splits
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                                    {/* Left: Map Grid */}
                                    <div className="lg:col-span-7 bg-black/40 border border-white/5 rounded-xl p-4 flex flex-col items-center justify-between min-h-[340px] relative overflow-hidden">
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 self-start">Interactive Coordinate Map</span>

                                        <div className="relative w-[260px] h-[260px] bg-slate-900/60 rounded-lg border border-white/10 overflow-hidden cursor-crosshair">
                                            {/* Grid overlays */}
                                            <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 pointer-events-none">
                                                {Array.from({ length: 16 }).map((_, i) => (
                                                    <div key={i} className="border border-white/[0.04]" />
                                                ))}
                                            </div>

                                            {/* Static coordinate nodes */}
                                            {geoPoints.map((pt, pIdx) => (
                                                <div
                                                    key={pIdx}
                                                    className="absolute w-3.5 h-3.5 rounded-full bg-amber-500 border border-white/20 flex items-center justify-center text-[7px] font-black text-slate-950 shadow-md transform -translate-x-1/2 -translate-y-1/2"
                                                    style={{ left: `${pt.x}%`, top: `${pt.y}%` }}
                                                    title={pt.name}
                                                >
                                                    T
                                                </div>
                                            ))}

                                            {/* Click capture overlay */}
                                            <div
                                                className={`absolute inset-0 ${isGeoProcessing ? 'pointer-events-none' : ''}`}
                                                onClick={(e) => {
                                                    const rect = e.currentTarget.getBoundingClientRect();
                                                    const clickX = Math.round(((e.clientX - rect.left) / rect.width) * 100);
                                                    const clickY = Math.round(((e.clientY - rect.top) / rect.height) * 100);
                                                    triggerGeospatialSimulation(clickX, clickY);
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {/* Right: Controls & Logs */}
                                    <div className="lg:col-span-5 flex flex-col justify-between gap-4">
                                        {/* Query Result */}
                                        <div className="bg-black/20 border border-white/5 rounded-xl p-3.5 space-y-2">
                                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Query Output</span>
                                            <div className="text-xs">
                                                <span className="text-slate-400">Closest POIs matching coordinates:</span>
                                                <div className="font-mono text-[#B58863] font-bold mt-1.5">
                                                    {geoSearchResult.length > 0 ? `[${geoSearchResult.join(', ')}]` : 'Click coordinates to search.'}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Telemetry Console */}
                                        <div className="flex flex-col flex-1 min-h-[140px]">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Index Retrieval Logs</span>
                                                <button
                                                    onClick={() => {
                                                        setGeospatialLogs([]);
                                                        setGeoSearchResult([]);
                                                        setSpatialMode('geohash');
                                                        setIsGeoProcessing(false);
                                                    }}
                                                    className="text-[9px] font-semibold text-slate-400 hover:text-white transition-all bg-white/5 border border-white/10 px-2 py-0.5 rounded-md"
                                                >
                                                    Reset
                                                </button>
                                            </div>
                                            <div className="flex-1 bg-black/80 font-mono text-[10px] p-3 rounded-xl border border-white/10 overflow-y-auto space-y-1 h-32 text-emerald-400 shadow-inner">
                                                {geospatialLogs.length === 0 ? (
                                                    <span className="text-slate-500">Index idle. Click quadrant cells...</span>
                                                ) : (
                                                    geospatialLogs.map((log, lIdx) => (
                                                        <div key={lIdx} className="text-slate-300">
                                                            {log}
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <hr className="border-white/[0.04]" />

                            <div className="space-y-6">
                                <h3 className="font-bold text-white text-lg flex items-center gap-2">
                                    <Brain className="w-5 h-5 text-[#B58863]" /> Geospatial: Interview Q&A
                                </h3>

                                <div className="space-y-6">
                                    <div className="bg-white/5 border border-white/5 rounded-xl p-5 space-y-3">
                                        <h4 className="text-sm font-bold text-white flex items-start gap-2">
                                            <span className="bg-[#B58863]/10 text-[#B58863] border border-[#B58863]/25 px-2 py-0.5 rounded text-[10px] font-mono mt-0.5">Q1</span>
                                            <span>How do geospatial indexers like Geohash or Quadtree optimize proximity queries?</span>
                                        </h4>
                                        <p className="text-xs text-slate-300 leading-relaxed">
                                            <strong>Answer:</strong> Traditional database indexing cannot query multi-dimensional ranges (latitude, longitude) efficiently.
                                            * **Geohash**: Encodes latitude/longitude coordinates into a single base32 string representing a grid cell (e.g. `dr5r`). Matches that share prefixes are physically close, allowing fast SQL prefix query scans (e.g. `LIKE 'dr5r%'`).
                                            * **Quadtree**: Recursively divides coordinate space quadrants into 4 sub-quadrants (NW, NE, SW, SE) whenever node density exceeds limits. Queries traverse the tree hierarchy, quickly ignoring complete branches.
                                        </p>
                                    </div>

                                    <div className="bg-white/5 border border-white/5 rounded-xl p-5 space-y-3">
                                        <h4 className="text-sm font-bold text-white flex items-start gap-2">
                                            <span className="bg-[#B58863]/10 text-[#B58863] border border-[#B58863]/25 px-2 py-0.5 rounded text-[10px] font-mono mt-0.5">Q2</span>
                                            <span>How do you handle real-time location tracking for millions of moving drivers (like Uber)?</span>
                                        </h4>
                                        <p className="text-xs text-slate-300 leading-relaxed">
                                            <strong>Answer:</strong> Moving drivers write updates frequently.
                                            1. Do not commit updates directly to SQL tables (creates disk write bottlenecks). Use an in-memory database like **Redis Geospatial (using GEOADD/GEORADIUS)**.
                                            2. Shard the driver location registry across multiple Redis nodes by country or city block ID (e.g. sharding drivers in London vs. Tokyo).
                                            3. Throttling: Throttling updates from driver devices (e.g. uploading coordinates once every 4s, or filtering minor distance deviations) scales down network traffic.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* DISTRIBUTED ID GENERATORS */}
                    {activeSection === 'id-generators' && (
                        <div className="space-y-6 animate-in fade-in duration-300">
                            <div>
                                <h2 className="text-2xl font-black text-white tracking-tight">Distributed ID Generation</h2>
                                <p className="text-slate-300 mt-2 leading-relaxed text-sm">
                                    Large distributed databases cannot rely on auto-incrementing integers due to index write blockages. Unique ID generators build coordination-free keys across clusters.
                                </p>
                            </div>

                            {/* ID PLAYGROUND */}
                            <div className="bg-white/5 border border-white/[0.04] rounded-2xl p-6 space-y-6">
                                <div className="flex flex-col sm:flex-row items-center justify-between border-b border-white/[0.06] pb-4 gap-4">
                                    <div>
                                        <h3 className="font-bold text-white text-sm">Interactive Distributed Key Builder</h3>
                                        <p className="text-[10.5px] text-slate-400 mt-0.5">Generate IDs and analyze their components (Timestamps, Node bits) to test distributed sortability index parameters.</p>
                                    </div>

                                    <div className="flex bg-black/40 p-1 rounded-xl border border-white/10 self-end sm:self-center">
                                        <button
                                            disabled={isIdProcessing}
                                            onClick={() => { setIdMode('uuid'); setIdLogs([`[Generator] Switched to UUID v4 indexer`]); }}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all disabled:opacity-50 ${idMode === 'uuid' ? 'bg-[#B58863] text-white' : 'text-slate-400 hover:text-white'}`}
                                        >
                                            UUID v4
                                        </button>
                                        <button
                                            disabled={isIdProcessing}
                                            onClick={() => { setIdMode('snowflake'); setIdLogs([`[Generator] Switched to Snowflake 64-bit generator`]); }}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all disabled:opacity-50 ${idMode === 'snowflake' ? 'bg-[#B58863] text-white' : 'text-slate-400 hover:text-white'}`}
                                        >
                                            Snowflake ID
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                                    {/* Left: ID component breakdown */}
                                    <div className="lg:col-span-7 bg-black/40 border border-white/5 rounded-xl p-4 flex flex-col items-center justify-between min-h-[340px] relative overflow-hidden">
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 self-start">Generated ID Registry</span>

                                        <div className="w-full space-y-2 mt-2 flex-1 flex flex-col justify-center">
                                            {generatedIds.map((item, iIdx) => (
                                                <div key={iIdx} className="bg-white/5 border border-white/10 p-2.5 rounded-lg text-xs space-y-1">
                                                    <span className="font-mono text-[#B58863] font-bold block select-all">{item.id}</span>
                                                    <span className="text-[9px] text-slate-400 block">{item.components}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Right: Controller */}
                                    <div className="lg:col-span-5 flex flex-col justify-between gap-4">
                                        <div className="bg-black/20 border border-white/5 rounded-xl p-3.5 space-y-3">
                                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">ID Actions</span>
                                            <button
                                                disabled={isIdProcessing}
                                                onClick={triggerIdSimulation}
                                                className="w-full flex items-center justify-center gap-1.5 bg-[#B58863] hover:bg-[#B58863]/85 text-white rounded-xl py-2 px-3 text-xs font-semibold transition-all disabled:opacity-50"
                                            >
                                                <Play className="w-3.5 h-3.5 fill-current" />
                                                <span>Generate Next Unique ID</span>
                                            </button>
                                        </div>

                                        {/* Telemetry Console */}
                                        <div className="flex flex-col flex-1 min-h-[140px]">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Generator Telemetry logs</span>
                                                <button
                                                    onClick={() => {
                                                        setGeneratedIds([
                                                            { id: 'e31b67ea-8d2a-4bc4-9d10-09fa451b6672', components: 'Version 4 Random (128-bit)' },
                                                            { id: '1728192309832941568', components: 'Snowflake (64-bit Int)' }
                                                        ]);
                                                        setIdLogs([]);
                                                        setIdMode('uuid');
                                                        setIsIdProcessing(false);
                                                    }}
                                                    className="text-[9px] font-semibold text-slate-400 hover:text-white transition-all bg-white/5 border border-white/10 px-2 py-0.5 rounded-md"
                                                >
                                                    Reset
                                                </button>
                                            </div>
                                            <div className="flex-1 bg-black/80 font-mono text-[10px] p-3 rounded-xl border border-white/10 overflow-y-auto space-y-1 h-32 text-emerald-400 shadow-inner">
                                                {idLogs.length === 0 ? (
                                                    <span className="text-slate-500">Telemetry logs idle. Generate a key...</span>
                                                ) : (
                                                    idLogs.map((log, lIdx) => (
                                                        <div key={lIdx} className={log.includes('❌') ? 'text-red-400 font-bold' : log.includes('✅') ? 'text-emerald-400 font-semibold' : 'text-slate-300'}>
                                                            {log}
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <hr className="border-white/[0.04]" />

                            <div className="space-y-6">
                                <h3 className="font-bold text-white text-lg flex items-center gap-2">
                                    <Brain className="w-5 h-5 text-[#B58863]" /> Distributed ID: Interview Q&A
                                </h3>

                                <div className="space-y-6">
                                    <div className="bg-white/5 border border-white/5 rounded-xl p-5 space-y-3">
                                        <h4 className="text-sm font-bold text-white flex items-start gap-2">
                                            <span className="bg-[#B58863]/10 text-[#B58863] border border-[#B58863]/25 px-2 py-0.5 rounded text-[10px] font-mono mt-0.5">Q1</span>
                                            <span>Why are auto-incrementing database IDs avoided in large-scale distributed databases?</span>
                                        </h4>
                                        <p className="text-xs text-slate-300 leading-relaxed">
                                            <strong>Answer:</strong> Relational databases serializing auto-incrementing counters (1, 2, 3...) run into bottlenecks:
                                            1. **Single Point of Failure**: Sharding databases means no single database holds coordinates of the next ID without a distributed lock transaction.
                                            2. **Hot Spotting**: Monotonically increasing numbers route all inserts to the same index page block, preventing partition scalability.
                                            3. **Security Risks**: Exposes user registration volume directly to competitors (e.g. `/api/users/1000`).
                                        </p>
                                    </div>

                                    <div className="bg-white/5 border border-white/5 rounded-xl p-5 space-y-3">
                                        <h4 className="text-sm font-bold text-white flex items-start gap-2">
                                            <span className="bg-[#B58863]/10 text-[#B58863] border border-[#B58863]/25 px-2 py-0.5 rounded text-[10px] font-mono mt-0.5">Q2</span>
                                            <span>How does the Twitter Snowflake algorithm generate sortable, 64-bit unique IDs?</span>
                                        </h4>
                                        <p className="text-xs text-slate-300 leading-relaxed">
                                            <strong>Answer:</strong> Twitter Snowflake constructs a 64-bit Integer chronologically using bit positions:
                                            * **1-bit Sign**: Unused, reserved for numbers to remain positive integers.
                                            * **41-bit Timestamp**: Represents millisecond offset from a custom epoch. Gives 69 years of coordinates.
                                            * **10-bit Node/Machine ID**: Identifies the server generator. Allows 1024 unique instances without coordination.
                                            * **12-bit Sequence Number**: Auto-incrementing counter inside the local millisecond. Resets to 0. Supports 4096 unique IDs per node per millisecond.
                                            Because timestamps occupy the most significant bits, Snowflake IDs are naturally sortable chronologically.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeSection === 'interview-blueprint' && (
                        <div className="space-y-6 animate-in fade-in duration-300">
                            <div>
                                <div className="inline-flex items-center justify-center p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mb-3">
                                    <Book className="w-5 h-5" />
                                </div>
                                <h2 className="text-2xl font-black text-white tracking-tight">System Design Interview Guide</h2>
                                <p className="text-slate-300 mt-2 leading-relaxed text-sm">
                                    This section contains blueprints, solutions, and step-by-step interview guides for the most common system design questions asked at FAANG and top-tier companies. Use these as study templates.
                                </p>
                            </div>

                            <hr className="border-white/[0.04]" />

                            <div className="space-y-8">
                                {filteredQuestions.map((q, idx) => (
                                    <div key={idx} className="p-6 bg-white/5 border border-white/[0.04] rounded-2xl space-y-4">

                                        {/* Question header */}
                                        <div className="flex flex-wrap items-center justify-between gap-3">
                                            <div>
                                                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#B58863] bg-[#B58863]/10 border border-[#B58863]/20 px-2.5 py-1 rounded-md">
                                                    {q.difficulty}
                                                </span>
                                                <h3 className="text-lg font-bold text-white mt-2 tracking-tight">{q.title}</h3>
                                            </div>
                                            <div className="text-[11px] text-slate-400 max-w-xs text-right">
                                                <strong>Core Focus:</strong> {q.focus}
                                            </div>
                                        </div>

                                        <hr className="border-white/5" />

                                        {/* Functional scale */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                                            <div className="bg-black/30 p-3.5 rounded-xl border border-white/5 space-y-1">
                                                <strong className="text-white block">Functional Requirements:</strong>
                                                <ul className="text-slate-300 space-y-1 list-disc pl-4">
                                                    {q.functional.map((func, i) => (
                                                        <li key={i}>{func}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div className="bg-black/30 p-3.5 rounded-xl border border-white/5 space-y-1">
                                                <strong className="text-white block">Required Scale:</strong>
                                                <p className="text-slate-300 leading-relaxed">{q.scale}</p>
                                            </div>
                                        </div>

                                        {/* Steps */}
                                        <div className="space-y-3">
                                            <strong className="text-xs font-bold text-slate-300 block">Proposed System Architecture Solution:</strong>
                                            {q.solutionSteps.map((step, sIdx) => (
                                                <div key={sIdx} className="bg-white/5 border border-white/5 rounded-xl p-3.5">
                                                    <span className="text-xs font-bold text-[#B58863] block">{step.name}</span>
                                                    <p className="text-[11px] text-slate-400 leading-relaxed mt-1">{step.detail}</p>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Pro tip */}
                                        <div className="flex gap-2.5 items-start bg-amber-500/5 p-3 rounded-xl border border-amber-500/10 text-[11px] text-[#B58863]">
                                            <Zap className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                            <span><strong>Interview Pro-Tip:</strong> {q.interviewTip}</span>
                                        </div>

                                    </div>
                                ))}
                                {filteredQuestions.length === 0 && (
                                    <div className="text-center py-12 text-slate-500 text-xs">
                                        No questions matched your search query.
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                </main>
            </div>

            {/* Footer */}
            <footer className="border-t border-white/[0.04] bg-[#0A1214]/60 py-6 mt-auto">
                <div className="max-w-7xl mx-auto px-6 text-center text-xs text-slate-500">
                    © 2026 Infralab Master System Design Inc. All rights reserved.
                </div>
            </footer>
        </div>
    );
};
