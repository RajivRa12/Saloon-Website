export interface UserPreferences {
  savedFilters: any[];
  recentSearches: string[];
  favoriteServices: string[];
  favoriteSalons: string[];
  bookingHistory: any[];
  chatHistory: any[];
}

const STORAGE_KEY = "beautybook_preferences";

export const storage = {
  get: <K extends keyof UserPreferences>(key: K): UserPreferences[K] | null => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return null;
      const preferences: UserPreferences = JSON.parse(data);
      return preferences[key] || null;
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return null;
    }
  },

  set: <K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K],
  ): void => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      const preferences: UserPreferences = data
        ? JSON.parse(data)
        : {
            savedFilters: [],
            recentSearches: [],
            favoriteServices: [],
            favoriteSalons: [],
            bookingHistory: [],
            chatHistory: [],
          };

      preferences[key] = value;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    } catch (error) {
      console.error("Error writing to localStorage:", error);
    }
  },

  addToArray: <K extends keyof UserPreferences>(
    key: K,
    item: UserPreferences[K] extends Array<infer T> ? T : never,
    maxItems = 10,
  ): void => {
    const currentArray = (storage.get(key) as any[]) || [];
    const newArray = [
      item,
      ...currentArray.filter(
        (existing: any) => JSON.stringify(existing) !== JSON.stringify(item),
      ),
    ].slice(0, maxItems);
    storage.set(key, newArray as UserPreferences[K]);
  },

  removeFromArray: <K extends keyof UserPreferences>(
    key: K,
    item: UserPreferences[K] extends Array<infer T> ? T : never,
  ): void => {
    const currentArray = (storage.get(key) as any[]) || [];
    const newArray = currentArray.filter(
      (existing: any) => JSON.stringify(existing) !== JSON.stringify(item),
    );
    storage.set(key, newArray as UserPreferences[K]);
  },

  clear: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Error clearing localStorage:", error);
    }
  },
};

export default storage;
