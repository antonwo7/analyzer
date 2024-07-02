import {createApi} from "@reduxjs/toolkit/dist/query/react";
import {TUser} from "../models/user";
import {setCredentialsAction, removeCredentialsAction, setAuthUserAction} from "../store/auth/authSlice"
import {objectToFormData} from "../utils/request";
import {IResponse} from "../models/response";
import {baseQuery} from "./errorHandling";

interface ILoginRequest {
    username: string
    password: string
}

interface IAuth {
    authUser: TUser | null
    token: string | null
}

interface ILoginResponse extends IResponse {
    user: TUser
    token: string
}

export const authAPI = createApi({
    reducerPath: 'authAPI',
    baseQuery: baseQuery('/auth'),
    tagTypes: ['authUser'],
    endpoints: (builder) => ({
        login: builder.mutation<IAuth, ILoginRequest>({
            query: (loginData) => {
                return {
                    url: '/login',
                    method: 'POST',
                    body: JSON.stringify(loginData)
                }
            },
            transformResponse: (response: ILoginResponse) => {
                if (!response.result || !response.user) {
                    return {authUser: null, token: null};
                }

                return {
                    authUser: response.user,
                    token: response.token
                }
            },
            async onQueryStarted(id, {dispatch, queryFulfilled}) {
                const {data, meta} = await queryFulfilled

                dispatch(setCredentialsAction({
                    authUser: data.authUser,
                    token: data.token
                }))
            }
        }),
        validate: builder.query<ILoginResponse, string>({
            query: (token) => {
                return {
                    url: '/validation',
                    method: 'POST',
                    body: JSON.stringify({token}),
                }
            },
            transformResponse: (response: ILoginResponse) => {
                if (response.user && response.user.id) {
                    response.user.id = +response.user.id
                }

                return response
            },
            async onQueryStarted(token, {dispatch, queryFulfilled}) {
                const {data, meta} = await queryFulfilled

                if (!data.user) {
                    dispatch(removeCredentialsAction())
                    return;
                }

                dispatch(setCredentialsAction({
                    authUser: data.user,
                    token: token
                }))
            }
        }),
        changeUser: builder.mutation<ILoginResponse, Partial<TUser>>({
            query: (data) => {
                return {
                    url: '/change_user',
                    method: 'POST',
                    body: objectToFormData(data)
                }
            },
            async onQueryStarted(token, {dispatch, queryFulfilled}) {
                const {data, meta} = await queryFulfilled

                if (!meta?.response?.ok || !data || !data.result || !data.user) {
                    dispatch(removeCredentialsAction())
                    return;
                }

                dispatch(setAuthUserAction(data.user))
            }
        }),

        // registration: builder.mutation<IResponse, IRegistrationRequest>({
        //     query: (data) => {
        //         return {
        //             url: '/registration',
        //             method: 'POST',
        //             body: objectToFormData(data)
        //         }
        //     }
        // })

    })
})