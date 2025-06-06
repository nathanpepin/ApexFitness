import React from 'react';
import type { MuscleGroup } from '@/types';
import { muscleColors } from '@/constants';

interface MuscleGroupIconProps {
    muscle: MuscleGroup;
    size?: number;
    className?: string;
    contribution?: number; // 0.1 to 1.0, where 1.0 is full activation
    style?: 'filled' | 'outlined'; // 'filled' for backwards compatibility, 'outlined' for new design
    showTooltip?: boolean; // Whether to show tooltip on hover
    magnitude?: number; // 0.1 to 1.0, indicates intensity/fatigue level (affects visual intensity)
}

// Emoji map to visually represent each muscle group
const emojiMap: Record<MuscleGroup, string> = {
    Chest: '🛡️',
    'Front Delts': '⬆️',
    'Side Delts': '↔️',
    'Rear Delts': '⬇️',
    Biceps: '💪',
    Triceps: '🏹',
    Forearms: '✊',
    Traps: '🏔️',
    'Upper Back': '🦅',
    'Lower Back': '🐪',
    Core: '🎯',
    Glutes: '🍑',
    Quads: '🦵',
    Hamstrings: '🐖',
    Calves: '🦶'
};

export const MuscleGroupIcon: React.FC<MuscleGroupIconProps> = ({ 
    muscle, 
    size = 24, 
    className = '', 
    contribution = 1.0,
    style = 'outlined',
    showTooltip = true,
    magnitude = 1.0
}) => {
    const baseColor = muscleColors[muscle] || '#ccc';
    const emoji = emojiMap[muscle] || '❓';
    
    // Ensure contribution is between 0.1 and 1.0
    const normalizedContribution = Math.max(0.1, Math.min(1.0, contribution));
    const normalizedMagnitude = Math.max(0.1, Math.min(1.0, magnitude));
    
    // Create tooltip text based on the provided props
    const tooltipText = showTooltip 
        ? `${muscle} (${(normalizedContribution * 100).toFixed(0)}% activation${magnitude !== 1.0 ? `, ${(normalizedMagnitude * 100).toFixed(0)}% intensity` : ''})`
        : muscle;
    
    if (style === 'filled') {
        // Legacy filled style for backwards compatibility
        return (
            <div
                className={`flex items-center justify-center rounded-full cursor-help ${className}`}
                style={{
                    width: size,
                    height: size,
                    backgroundColor: baseColor,
                    fontSize: size * 0.6,
                    opacity: 0.6 + (normalizedMagnitude * 0.4) // Magnitude affects overall opacity
                }}
                title={tooltipText}
            >
                <span role="img" aria-label={muscle}>
                    {emoji}
                </span>
            </div>
        );
    }
    
    // New outlined style with alpha transparency and magnitude effects
    const borderWidth = Math.max(1, Math.round(size * 0.08)); // Border width scales with size
    const alpha = normalizedContribution; // Use contribution directly for alpha
    
    // Parse hex color to RGB for alpha calculation
    const hex = baseColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    // Magnitude affects border intensity and glow
    const borderIntensity = 0.4 + (normalizedMagnitude * 0.6);
    const borderColor = `rgba(${r}, ${g}, ${b}, ${borderIntensity})`;
    const backgroundColor = `rgba(${r}, ${g}, ${b}, ${alpha * 0.3})`; // Background is more transparent
    
    // Add subtle glow effect for high magnitude
    const glowIntensity = normalizedMagnitude > 0.7 ? (normalizedMagnitude - 0.7) * 0.3 : 0;
    const boxShadow = glowIntensity > 0 
        ? `0 0 ${Math.round(size * 0.2)}px rgba(${r}, ${g}, ${b}, ${glowIntensity})`
        : 'none';
    
    return (
        <div
            className={`flex items-center justify-center rounded-full cursor-help transition-all duration-200 hover:scale-105 ${className}`}
            style={{
                width: size,
                height: size,
                backgroundColor: backgroundColor,
                border: `${borderWidth}px solid ${borderColor}`,
                fontSize: size * 0.5, // Slightly smaller emoji for outlined style
                opacity: 0.4 + (normalizedContribution * 0.6), // Opacity ranges from 0.4 to 1.0
                boxShadow: boxShadow
            }}
            title={tooltipText}
        >
            <span 
                role="img" 
                aria-label={muscle} 
                style={{ 
                    opacity: 0.8 + (normalizedContribution * 0.2),
                    transform: `scale(${0.9 + (normalizedMagnitude * 0.1)})` // Magnitude slightly affects emoji size
                }}
            >
                {emoji}
            </span>
        </div>
    );
};
