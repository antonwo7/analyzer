import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/dist/query/react";
import {TType} from "../models/type";
import {IResponse} from "../models/response";
import {baseQuery} from "./errorHandling";

interface IGetTypesResponse extends IResponse {
    types: TType[]
}

export const typeAPI = createApi({
    reducerPath: 'typeAPI',
    baseQuery: baseQuery('/type'),
    tagTypes: ['type', 'types'],
    endpoints: (builder) => ({
        getTypes: builder.query<TType[], void>({
            query: () => {
                return {
                    url: '/get_types',
                    method: 'POST'
                }
            },
            transformResponse: (response: IGetTypesResponse) => {
                if (!response.result || !response.types) {
                    return [];
                }

                return response.types
            },
            providesTags: ['types']
        }),

        addType: builder.mutation<IResponse, Partial<TType>>({
            query: (data) => {
                return {
                    url: '/add_type',
                    method: 'POST',
                    body: JSON.stringify(data)
                }
            },
            invalidatesTags: ['types']
        }),

        removeType: builder.mutation<IResponse, number>({
            query: (typeId) => {
                return {
                    url: '/remove_type',
                    method: 'POST',
                    body: JSON.stringify({type_id: typeId})
                }
            },
            invalidatesTags: ['types']
        }),

    })
})