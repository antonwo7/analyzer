import React, {FC, useEffect, useState} from 'react';
import CloseIcon from "../common/icons/CloseIcon";
import Input from "../common/elements/Input";
import Button from "../common/elements/Button";
import {optionAPI} from "../../api/option";
import {TOption} from "../../models/option";
import EditIcon from "../common/icons/EditIcon";
import DownloadIcon from "../common/icons/DownloadIcon";

type TOptionsModalProps = {
    onClose: () => void
}

const OptionsModal: FC<TOptionsModalProps> = ({onClose}) => {
    const {data: options} = optionAPI.useGetOptionsQuery()
    const [changeOption, {}] = optionAPI.useChangeOptionMutation()
    const [changingOption, setChangingOption] = useState<TOption | null>(null)

    const changeFieldHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!changingOption) return;

        setChangingOption({
            ...changingOption,
            value: e.target.value
        })
    }

    const successHandler = async () => {
        if (!changingOption) return;
        await changeOption({
            id: changingOption.id,
            value: changingOption.value
        })

        setChangingOption(null)
    }

    const cancelOptionChanging = () => {
        setChangingOption(null)
    }

    return (
        <div id="authentication-modal" aria-hidden="true" className="flex items-center justify-center bg-white fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full">
            <div className="relative w-full max-w-md max-h-full">
                <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                    <button type="button" onClick={onClose} className="absolute top-0 right-0 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="authentication-modal">
                        <CloseIcon />
                    </button>
                    <div className="px-6 py-8 lg:px-8">
                        {options && options.ids && <div className="space-y-6" >
                            {options.ids.map(id => {
                                const option = options.entities[id]
                                if (!option) return <></>

                                const changing = !!changingOption && changingOption.id === id

                                return <div key={id} className="mb-4 flex">
                                    <Input disabled={!changing} type="number" value={changingOption ? changingOption.value : option.value} name={option.name} data-optionid={option.id} title={option.title} onChange={changeFieldHandler} />
                                    {!changing && <button className="w-8 h-8 rounded ml-2 bg-gray-200 hover:bg-blue-300 inline-flex justify-center items-center " onClick={() => setChangingOption(option)}><EditIcon /></button>}
                                    {changing && <>
                                        <button className="w-8 h-8 rounded mr-2 ml-2 bg-gray-200 hover:bg-blue-300 inline-flex justify-center items-center " onClick={successHandler}><DownloadIcon /></button>
                                        <button className="w-8 h-8 rounded bg-gray-200 hover:bg-blue-300 inline-flex justify-center items-center " onClick={cancelOptionChanging}><CloseIcon /></button>
                                    </>}
                                </div>
                            })}
                        </div>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OptionsModal;