import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '../../components/Button';
import { cn } from '../../utils/cn';

import { WorkspaceHeader } from './WorkspaceHeader';

interface WorkspaceLayoutProps {
    left: React.ReactNode;
    center: React.ReactNode;
    right: React.ReactNode;
    bottom?: React.ReactNode;
}

export const WorkspaceLayout: React.FC<WorkspaceLayoutProps> = ({
    left,
    center,
    right,
    bottom,
}) => {
    const [leftOpen, setLeftOpen] = useState(true);
    const [rightOpen, setRightOpen] = useState(true);
    const [bottomOpen, setBottomOpen] = useState(true);
    const [bottomHeight, setBottomHeight] = useState(384); // Default 96 * 4 = 384px (h-96)
    const isResizingRef = React.useRef(false);

    const startResizing = React.useCallback(() => {
        isResizingRef.current = true;
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', stopResizing);
        document.body.style.cursor = 'ns-resize';
        document.body.style.userSelect = 'none';
    }, []);

    const stopResizing = React.useCallback(() => {
        isResizingRef.current = false;
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', stopResizing);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
    }, []);

    const handleMouseMove = React.useCallback((e: MouseEvent) => {
        if (!isResizingRef.current) return;
        const newHeight = window.innerHeight - e.clientY;
        // Min height 100px, Max height 80% of screen
        if (newHeight >= 100 && newHeight <= window.innerHeight * 0.8) {
            setBottomHeight(newHeight);
        }
    }, []);

    return (
        <div className="h-full flex flex-col overflow-hidden">
            <WorkspaceHeader />
            {/* Top: Three-column layout */}
            <div className="flex-1 flex overflow-hidden relative">
                {/* Left Panel - Requirements */}
                <div
                    className={cn(
                        "transition-all duration-300 ease-in-out border-r border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))]",
                        leftOpen ? "w-80" : "w-0 border-r-0"
                    )}
                >
                    <div className="w-80 h-full overflow-hidden">
                        {left}
                    </div>
                </div>

                {/* Center - Canvas */}
                <div className="flex-1 relative flex flex-col min-w-0 bg-[rgb(var(--color-bg))]">
                    {/* Left Toggle Button */}
                    <Button
                        size="icon"
                        variant="secondary"
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-30 rounded-l-none border-l-0 shadow-md w-5 h-12 p-0 flex items-center justify-center bg-[rgb(var(--color-card))] opacity-70 hover:opacity-100 hover:w-6 transition-all"
                        onClick={() => setLeftOpen(!leftOpen)}
                        title={leftOpen ? "Collapse Sidebar" : "Expand Sidebar"}
                    >
                        {leftOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </Button>

                    {center}

                    {/* Right Toggle Button */}
                    <Button
                        size="icon"
                        variant="secondary"
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-30 rounded-r-none border-r-0 shadow-md w-5 h-12 p-0 flex items-center justify-center bg-[rgb(var(--color-card))] opacity-70 hover:opacity-100 hover:w-6 transition-all"
                        onClick={() => setRightOpen(!rightOpen)}
                        title={rightOpen ? "Collapse Sidebar" : "Expand Sidebar"}
                    >
                        {rightOpen ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                    </Button>

                    {/* Bottom Toggle Button */}
                    {bottom && (
                        <div className="absolute left-1/2 -translate-x-1/2 bottom-0 z-30 flex items-center justify-center translate-y-1/2">
                            <Button
                                size="icon"
                                variant="secondary"
                                className="rounded-full w-8 h-6 p-0 flex items-center justify-center shadow-md border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-primary))]"
                                onClick={() => setBottomOpen(!bottomOpen)}
                                title={bottomOpen ? "Collapse Panel" : "Expand Panel"}
                            >
                                {bottomOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                            </Button>
                        </div>
                    )}
                </div>

                {/* Right Panel - Configuration */}
                <div
                    className={cn(
                        "transition-all duration-300 ease-in-out border-l border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))]",
                        rightOpen ? "w-80" : "w-0 border-l-0"
                    )}
                >
                    <div className="w-80 h-full overflow-hidden">
                        {right}
                    </div>
                </div>
            </div>

            {/* Bottom - Feedback */}
            {bottom && (
                <div
                    className={cn(
                        "transition-all duration-300 ease-in-out border-t border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] relative flex flex-col",
                        bottomOpen ? "" : "h-0 border-t-0"
                    )}
                    style={{ height: bottomOpen ? bottomHeight : 0 }}
                >
                    {/* Resize Handle */}
                    <div
                        className="absolute top-0 left-0 right-0 h-1 cursor-ns-resize z-50 hover:bg-[rgb(var(--color-primary))]/50 transition-colors"
                        onMouseDown={startResizing}
                    />
                    <div className="h-full overflow-hidden">
                        {bottom}
                    </div>
                </div>
            )}
        </div>
    );
};
