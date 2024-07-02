import {createApi} from "@reduxjs/toolkit/dist/query/react";
import {TFile} from "../models/file";
import {IResponse} from "../models/response";
import {baseQuery} from "./errorHandling";
import {createEntityAdapter, EntityState} from '@reduxjs/toolkit'

interface IGetFilesResponse extends IResponse {
    files: TFile[]
}

interface IGetReportResponse extends IResponse {
    report: {
        all_files: number
        determined: number
        determined_today: number
        not_determined: number
        not_determined_today: number
        canceled: number
    }
}

type TGetFilesRequest = {
    processed?: number
    filename?: string
    status?: number
}

interface TDetermineFileRequest extends Pick<TFile, 'id' | 'type_id'>{
    canceled?: number
}

export interface IExportResponse extends IResponse {
    excel?: string,
    pdf?: string
}

export const filesAdapter = createEntityAdapter<TFile>()

export const fileAPI = createApi({
    reducerPath: 'fileAPI',
    baseQuery: baseQuery('/file'),
    tagTypes: ['file', 'files'],
    endpoints: (builder) => ({
        getFiles: builder.query<EntityState<TFile>, TGetFilesRequest | void>({
            query: (data) => {
                return {
                    url: '/get_files',
                    method: 'POST',
                    body: JSON.stringify(data ? data : {})
                }
            },
            transformResponse: async (response: IGetFilesResponse) => {
                if (!response.result || !response.files) {
                    return filesAdapter.getInitialState();
                }

                return filesAdapter.addMany(
                    filesAdapter.getInitialState(),
                    response.files
                )
            },
            async onCacheEntryAdded(arg, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
                // console.log('onCacheEntryAdded');

                await cacheDataLoaded

                const ws = new WebSocket('ws://127.0.0.1:5011')
                ws.addEventListener("open", () => {})

                ws.addEventListener('message', (event: MessageEvent) => {
                    try {
                        const updatedFile = JSON.parse(event.data.toString())

                        if (!updatedFile || !updatedFile.id || !updatedFile.type_id || !updatedFile.filename) {
                            return;
                        }
                        updateCachedData((draft) => {
                            filesAdapter.updateOne(draft, { id: updatedFile.id, changes: {type_id: updatedFile.type_id, date: updatedFile.date, user: updatedFile.user } })
                            // filesAdapter.removeOne(draft, updatedFile.id)
                        })

                    } catch (e: any) {
                        if (!(e instanceof Error)) {
                            e = new Error(e)
                        }
                        console.error(e.message)
                    }
                    // if (!data || data.channel !== arg) return
                })


                try {
                    await cacheDataLoaded

                } catch(error) {
                    console.error(error);
                }

                await cacheEntryRemoved
                ws.close()
            },
            providesTags: ['files']
        }),

        determineFile: builder.mutation<IResponse, TDetermineFileRequest>({
            query: (data) => {
                return {
                    url: '/determine_file',
                    method: 'POST',
                    body: JSON.stringify(data)
                }
            },
            invalidatesTags: ['files']
        }),

        getReport: builder.query<IGetReportResponse, void>({
            query: (data) => {
                return {
                    url: '/get_report',
                    method: 'POST',
                    body: JSON.stringify(data)
                }
            }
        }),

        exportReport: builder.mutation<IExportResponse, void>({
            query: () => {
                return {
                    url: '/export',
                    method: 'POST'
                }
            },
        }),
    })
})