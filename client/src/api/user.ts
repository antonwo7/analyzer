import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/dist/query/react";
import {TUser} from "../models/user";
import {setErrorAction} from "../store/common/commonSlice"
import {objectToFormData} from "../utils/request";
import {RootState} from "../store/store";
import {IResponse} from "../models/response";
import {removeCredentialsAction, setAuthUserAction} from "../store/auth/authSlice";
import {baseQuery} from "./errorHandling";

interface IGetOwnerUsersResponse extends IResponse {
    users: TUser[]
}

export const userAPI = createApi({
    reducerPath: 'userAPI',
    baseQuery: baseQuery('/user'),
    tagTypes: ['user', 'users'],
    endpoints: (builder) => ({
        getUsers: builder.query<TUser[], void>({
            query: () => {
                return {
                    url: '/get_users',
                    method: 'POST'
                }
            },
            transformResponse: (response: IGetOwnerUsersResponse) => {
                if (!response.result || !response.users) {
                    return [];
                }

                return response.users
            },
            providesTags: ['users']
        }),

        addUser: builder.mutation<IResponse, Partial<TUser>>({
            query: (data) => {
                return {
                    url: '/add_user',
                    method: 'POST',
                    body: JSON.stringify(data)
                }
            },
            invalidatesTags: ['users']
        }),

        editUser: builder.mutation<IResponse, Partial<TUser>>({
            query: (data) => {
                return {
                    url: '/edit_user',
                    method: 'POST',
                    body: JSON.stringify(data)
                }
            },
            invalidatesTags: ['users']
        }),

        removeUser: builder.mutation<IResponse, number>({
            query: (userId) => {
                return {
                    url: '/remove_user',
                    method: 'POST',
                    body: JSON.stringify({user_id: userId})
                }
            },
            invalidatesTags: ['users']
        }),

    })
})