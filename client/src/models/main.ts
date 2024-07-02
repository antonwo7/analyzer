import React, {LegacyRef, MouseEventHandler} from "react";

export interface IButtonProps {
    type?: 'button' | 'submit' | 'reset'
    id?: string
    name?: string
    disabled?: boolean
    loading?: boolean
    label?: string
    onClick: MouseEventHandler<HTMLButtonElement>
}
export interface IButtonLinkProps {
    id?: string
    name?: string
    disabled?: boolean
    loading?: boolean
    title: string
    onClick?: MouseEventHandler<HTMLButtonElement>
}
export interface IFileProps {
    id?: string
    name: string
    title: string
}

export interface ISelectProps {
    value?: string | number;
    inputClassName?: string
    labelClassName?: string
    title?: string
    onChange: Function
    id?: string
    emptyOption?: boolean
    options: object
}

export interface IInputProps {
    value?: string | number;
    inputClassName?: string
    labelClassName?: string
    title?: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
    id?: string
    type: string
    name?: string
    innerRef?: LegacyRef<HTMLInputElement>
    required?: boolean
    disabled?: boolean
}
export interface IUploadFormState {
    loading: boolean,
    file: File | null,
    type: string | null,
    date: string | null
}

export interface IInputState {
    value?: string | number | null
}

export interface ISelectState {
    value?: string | number;
}

export interface IIconProps {
    width?: number
    height?: number
}

export interface IAnyObject {[key: string | number] : string}