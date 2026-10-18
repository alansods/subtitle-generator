import { useSyncExternalStore } from 'react';

import { getThemeState, subscribeTheme, toggleTheme } from './theme';

export function useTheme() {
  const state = useSyncExternalStore(subscribeTheme, getThemeState);
  return { ...state, toggle: toggleTheme };
}
