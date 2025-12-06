// Color palette
export const COLORS = {
    neonPink: '#ff00ff',
    neonPinkLight: '#ff1493',
    electricBlue: '#00d4ff',
    electricBlueLight: '#00e5ff',
    backgroundDark: '#030305',
    backgroundGlass: 'rgba(5, 5, 15, 0.8)',
    textPrimary: '#ffffff',
    textSecondary: '#a0a0b0',
} as const;

// Simplified section configuration
export const SECTIONS = [
    { id: 'home', name: 'Home', progress: 0 },
    { id: 'games', name: 'Games', progress: 0.3 },
    { id: 'pricing', name: 'Pricing', progress: 0.6 },
    { id: 'location', name: 'Visit', progress: 0.8 },
] as const;

// Games available
export const GAMES = [
    { id: 'fc26', name: 'FC 26', color: '#00ff88' },
    { id: 'fc25', name: 'FC 25', color: '#00cc66' },
    { id: 'wwe2k25', name: 'WWE 2K25', color: '#ff3333' },
    { id: 'gtav', name: 'GTA V', color: '#00ff00' },
    { id: 'rdr2', name: 'Red Dead 2', color: '#cc6600' },
    { id: 'cricket', name: 'Cricket', color: '#ffcc00' },
] as const;

// Performance settings
export const PERFORMANCE = {
    particleCount: {
        high: 5000,
        medium: 2000,
        low: 500,
    },
    bloomIntensity: {
        high: 1.5,
        medium: 0.8,
        low: 0.3,
    },
} as const;
