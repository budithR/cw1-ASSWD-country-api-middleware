import { createSlice } from '@reduxjs/toolkit';

const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    value: localStorage.getItem('theme') || 'light',
  },
  reducers: {
    toggle: (state) => {
      const newTheme = state.value === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', newTheme);
      document.documentElement.setAttribute('data-theme', newTheme);
      state.value = newTheme;
    },
  },
});

export const { toggle } = themeSlice.actions;
export default themeSlice.reducer;