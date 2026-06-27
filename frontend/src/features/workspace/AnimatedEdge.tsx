import React from 'react';
import { BaseEdge, getBezierPath, type EdgeProps } from '@xyflow/react';

export const AnimatedEdge: React.FC<EdgeProps> = ({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style = {},
    markerEnd,
    data,
}) => {
    const [edgePath] = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });

    const isActive = data?.isActive || false;

    return (
        <>
            <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
            {isActive && (
                <>
                    {/* Animated particle traveling along edge */}
                    <circle r="5" fill="#3b82f6" className="animate-flow-particle">
                        <animateMotion
                            dur="2s"
                            repeatCount="indefinite"
                            path={edgePath}
                        />
                    </circle>
                    {/* Glowing effect on the edge */}
                    <path
                        d={edgePath}
                        stroke="url(#pulseGradient)"
                        strokeWidth="3"
                        fill="none"
                        opacity="0.6"
                        className="animate-pulse"
                    />
                </>
            )}
            {/* SVG gradient definition */}
            <defs>
                <linearGradient id="pulseGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
                    <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.2" />
                </linearGradient>
            </defs>
        </>
    );
};
