import { createSlice } from '@reduxjs/toolkit'
const userSlice = createSlice({
    name: "userSlice",
    initialState: {},
    reducers: {
      updateUser: (state, action) => {
        console.log("action.payload", action.payload,state);
        if(state.userType!==action.payload.userType || state.token!==action.payload.token){
            state = [...action.payload]
        }
      },
      
      deleteName: (state, action) => {
        return "";
      },
    },
  });
  
  export const { updateUser, deleteName } = userSlice.actions;
  export default userSlice.reducer;