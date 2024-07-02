import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/dist/query/react";
import {IResponse} from "../models/response";
import {baseQuery} from "./errorHandling";
import {TOption} from "../models/option";
import {createEntityAdapter, EntityState} from "@reduxjs/toolkit";

interface IGetOptionsResponse extends IResponse {
    options: TOption[]
}

type IChangeOptionsRequest = Pick<TOption, 'id' | 'value'>

export const optionsAdapter = createEntityAdapter<TOption>()

export const optionAPI = createApi({
    reducerPath: 'optionAPI',
    baseQuery: baseQuery('/option'),
    tagTypes: ['options'],
    endpoints: (builder) => ({
        getOptions: builder.query<EntityState<TOption>, void>({
            query: () => {
                return {
                    url: '/get_options',
                    method: 'POST'
                }
            },
            transformResponse: (response: IGetOptionsResponse) => {
                if (!response.result || !response.options) {
                    return optionsAdapter.getInitialState();
                }

                return optionsAdapter.addMany(
                    optionsAdapter.getInitialState(),
                    response.options
                )
            },
            providesTags: ['options']
        }),

        changeOption: builder.mutation<IResponse, IChangeOptionsRequest>({
            query: (data) => {
                return {
                    url: '/change_option',
                    method: 'POST',
                    body: JSON.stringify(data)
                }
            },
            invalidatesTags: ['options']
        }),

    })
})