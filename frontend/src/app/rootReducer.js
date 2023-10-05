import { combineReducers } from "redux";
import authReducer from "./authSlice";
import usersReducer from "./userSlice";
const rootReducer = combineReducers({
  auth: authReducer,
  users: usersReducer,
});

export default rootReducer;
