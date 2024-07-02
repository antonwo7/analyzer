import React, {Component, FC, useState} from 'react'
import CloseIcon from "../common/icons/CloseIcon";
import Input from "../common/elements/Input";
import Button from "../common/elements/Button";
import {TUser} from "../../models/user";
import {userAPI} from "../../api/user";
import {TType} from "../../models/type";
import {typeAPI} from "../../api/type";

type TAddTypeModalProps = {
    closeHandler: () => void
}

const typeDefault: TType = {
    name: ''
}

const AddTypeModal: FC<TAddTypeModalProps> = ({closeHandler}) => {
    const [addType, {}] = typeAPI.useAddTypeMutation()
    const [typeData, setTypeData] = useState<TType>(typeDefault)

    const changeFieldHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.name || !e.target.value || !(e.target.name in typeData)) return;
        setTypeData({
            ...typeData,
            [e.target.name]: e.target.value
        })
    }

    const saveHandler = async () => {
        await addType(typeData)
        closeHandler()
    }

    return (
        <div id="authentication-modal" aria-hidden="true" className="flex items-center justify-center bg-white fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full">
            <div className="relative w-full max-w-md max-h-full">
                <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                    <button type="button" onClick={closeHandler} className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="authentication-modal">
                        <CloseIcon />
                    </button>
                    <div className="px-6 py-6 lg:px-8">
                        <form className="space-y-6" action="#">
                            <div className="mb-4 flex">
                                <Input type="text" value={typeData.name} name="name" title="Nombre" onChange={changeFieldHandler} />
                            </div>
                            <div className="">
                                <Button type="button" label="Guardar" onClick={saveHandler} />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddTypeModal