import {fetchBaseQuery} from "@reduxjs/toolkit/query";
import {RootState} from "../store/store";

export const baseQuery = (query: string) => async (args: any, api: any, extraOptions: any) => {
    const baseQueryOptions = {
        baseUrl: `${process.env['REACT_APP_API_URL']}${query}`,
        prepareHeaders: (headers: Headers, {getState}: {getState: any}) => {
            const state = getState() as RootState
            if (state.auth.token) {
                headers.set('Authorization', `Bearer ${state.auth.token}`)
            }
            headers.set("Content-Type", "application/json")
        }
    }
    const result = await fetchBaseQuery(baseQueryOptions)(args, api, extraOptions)
    const data = result.data as any
    if (('result' in data) && !data.result && data.unauthorized) {
        window.location.href = '/login'
    }

    return result;
}