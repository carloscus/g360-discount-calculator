export function hapticFeedback(type: 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error' = 'light') {
  if (typeof window === 'undefined' || !navigator.vibrate) return;
  
  const patterns: Record<string, number[]> = {
    light: [10],
    medium: [20],
    heavy: [40],
    success: [10, 50, 10],
    warning: [20, 50, 20],
    error: [30, 100, 30]
  };
  
  navigator.vibrate(patterns[type] || patterns.light);
}

export function hapticSelect() {
  hapticFeedback('light');
}

export function hapticSuccess() {
  hapticFeedback('success');
}

export function hapticWarning() {
  hapticFeedback('warning');
}

export function hapticError() {
  hapticFeedback('error');
}
