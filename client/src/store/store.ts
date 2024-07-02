import {configureStore} from "@reduxjs/toolkit"
import authReducer from "./auth/authSlice";
import commonReducer from "./common/commonSlice";
import {authAPI} from "../api/auth";
import {setupListeners} from "@reduxjs/toolkit/query";
import {userAPI} from "../api/user";
import {typeAPI} from "../api/type";
import {fileAPI} from "../api/file";
import {optionAPI} from "../api/option";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        common: commonReducer,
        [authAPI.reducerPath]: authAPI.reducer,
        [userAPI.reducerPath]: userAPI.reducer,
        [typeAPI.reducerPath]: typeAPI.reducer,
        [fileAPI.reducerPath]: fileAPI.reducer,
        [optionAPI.reducerPath]: optionAPI.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(
        authAPI.middleware,
        userAPI.middleware,
        typeAPI.middleware,
        fileAPI.middleware,
        optionAPI.middleware,
    )
})


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

setupListeners(store.dispatch)