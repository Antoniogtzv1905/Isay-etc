import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = '@tonyapp_token';
const USER_KEY = '@tonyapp_user';

export const saveToken = async (token) => {
  try {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  } catch (e) {}
};

export const getToken = async () => {
  try {
    return await AsyncStorage.getItem(TOKEN_KEY);
  } catch (e) {
    return null;
  }
};

export const removeToken = async () => {
  try {
    await AsyncStorage.removeItem(TOKEN_KEY);
  } catch (e) {}
};

export const saveUser = async (user) => {
  try {
    const s = typeof user === 'string' ? user : JSON.stringify(user);
    await AsyncStorage.setItem(USER_KEY, s);
  } catch (e) {}
};

export const getUser = async () => {
  try {
    const s = await AsyncStorage.getItem(USER_KEY);
    return s ? JSON.parse(s) : null;
  } catch (e) {
    return null;
  }
};

export const removeUser = async () => {
  try {
    await AsyncStorage.removeItem(USER_KEY);
  } catch (e) {}
};

// Theme preference
const THEME_KEY = '@tonyapp_theme';

export const saveThemePreference = async (theme) => {
  try {
    await AsyncStorage.setItem(THEME_KEY, theme);
  } catch (e) {
    console.error('Error guardando tema:', e);
  }
};

export const getThemePreference = async () => {
  try {
    return await AsyncStorage.getItem(THEME_KEY);
  } catch (e) {
    console.error('Error obteniendo tema:', e);
    return null;
  }
};
