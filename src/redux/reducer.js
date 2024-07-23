import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  age: '',
  weight: '',
  height: '',
  gender: '',
  activityLevel: '',
  numberOfMealsPerDay: '',
  bmi: '',
  tdee: '',
  bmiStatus: '',
  favoriteFoods: [],
  breakfast: [],
  lunch: [],
  dinner: [],
  breakfastCount: 0,
  lunchCount: 0,
  dinnerCount: 0,
  breakfastMinimumCalories: 0,
  lunchMinimumCalories: 0,
  dinnerMinimumCalories: 0,
  breakfastMaximumCalories: 0,
  lunchMaximumCalories: 0,
  dinnerMaximumCalories: 0,
  selectedDietFoods: [],
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserDetails: (state, action) => {
      state.age = action.payload.age;
      state.weight = action.payload.weight;
      state.height = action.payload.height;
      state.gender = action.payload.gender;
      state.activityLevel = action.payload.activityLevel;
      state.numberOfMealsPerDay = action.payload.numberOfMealsPerDay;
    },
    setBMIandTDEE: (state, action) => {
      state.bmi = action.payload.bmi;
      state.tdee = action.payload.tdee;
      state.bmiStatus = action.payload.bmiStatus;
    },
    setFavoriteFoods: (state, action) => {
      state.favoriteFoods = action.payload;
    },
    setBreakfast: (state, action) => {
      state.breakfast = action.payload;
    },
    setLunch: (state, action) => {
      state.lunch = action.payload;
    },
    setDinner: (state, action) => {
      state.dinner = action.payload;
    },
    setBreakfastCount: (state, action) => {
      state.breakfastCount = action.payload;
    },
    setLunchCount: (state, action) => {
      state.lunchCount = action.payload;
    },
    setDinnerCount: (state, action) => {
      state.dinnerCount = action.payload;
    },
    setBreakfastMinimumCalories: (state, action) => {
      state.breakfastMinimumCalories = action.payload;
    },
    setLunchMinimumCalories: (state, action) => {
      state.lunchMinimumCalories = action.payload;
    },
    setDinnerMinimumCalories: (state, action) => {
      state.dinnerMinimumCalories = action.payload;
    },
    setBreakfastMaximumCalories: (state, action) => {
      state.breakfastMaximumCalories = action.payload;
    },
    setLunchMaximumCalories: (state, action) => {
      state.lunchMaximumCalories = action.payload;
    },
    setDinnerMaximumCalories: (state, action) => {
      state.dinnerMaximumCalories = action.payload;
    },
    setSelectedDietFoods: (state, action) => {
      state.selectedDietFoods = action.payload;
    },
    resetUserState: () => initialState,
  },
});

export const {
  setUserDetails,
  setBMIandTDEE,
  setFavoriteFoods,
  setBreakfast,
  setLunch,
  setDinner,
  setBreakfastCount,
  setLunchCount,
  setDinnerCount,
  setBreakfastMinimumCalories,
  setLunchMinimumCalories,
  setDinnerMinimumCalories,
  setBreakfastMaximumCalories,
  setLunchMaximumCalories,
  setDinnerMaximumCalories,
  setSelectedDietFoods,
  resetUserState,
} = userSlice.actions;
export default userSlice.reducer;
