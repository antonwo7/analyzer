import {createSlice} from '@reduxjs/toolkit'
import type {PayloadAction} from '@reduxjs/toolkit'

export interface CommonState {
    isLoading: boolean
    error: string | null
    optionsModal: boolean
    reportModal: boolean
}

const initialState: CommonState = {
    isLoading: false,
    error: null,
    optionsModal: false,
    reportModal: false,
}

export const commonSlice = createSlice({
    name: 'common',
    initialState,
    reducers: {
        setLoadingAction: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload
        },
        setErrorAction: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload
        },
        toggleOptionsModalAction: (state, action: PayloadAction<boolean>) => {
            state.optionsModal = action.payload
        },
        toggleReportModalAction: (state, action: PayloadAction<boolean>) => {
            state.reportModal = action.payload
        },
    }
})

export const {setLoadingAction, setErrorAction, toggleOptionsModalAction, toggleReportModalAction} = commonSlice.actions
export default commonSlice.reducer