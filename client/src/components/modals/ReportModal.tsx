import React, {FC, useEffect, useState} from 'react';
import CloseIcon from "../common/icons/CloseIcon";
import Input from "../common/elements/Input";
import Button from "../common/elements/Button";
import {optionAPI} from "../../api/option";
import {TOption} from "../../models/option";
import EditIcon from "../common/icons/EditIcon";
import DownloadIcon from "../common/icons/DownloadIcon";
import {fileAPI} from "../../api/file";
import {useNavigate, useSearchParams} from "react-router-dom";

type TReportModalProps = {
    onClose: () => void
}

const ReportModal: FC<TReportModalProps> = ({onClose}) => {
    const {data, refetch} = fileAPI.useGetReportQuery()
    const navigate = useNavigate()

    useEffect(() => {
        refetch()
    }, [])

    const navigateHandler = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!e.currentTarget.dataset.statusid) return;
        onClose()
        navigate(`/file_list?status=${e.currentTarget.dataset.statusid}`)
    }

    return (
        <div id="authentication-modal" aria-hidden="true" className="flex items-center justify-center bg-white fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full">
            <div className="relative w-full max-w-md max-h-full">
                <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                    <button type="button" onClick={onClose} className="absolute top-0 right-0 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="authentication-modal">
                        <CloseIcon />
                    </button>
                    <div className="px-6 py-8 lg:px-8">
                        {data && data.report && <>
                            <div className="mb-4 flex justify-between bg-gray-200 mb-2 rounded p-3">
                                <span>Todos ficheros</span>
                                <span><b>{data.report.all_files}</b></span>
                            </div>
                            <div className="mb-4 flex justify-between bg-gray-200 mb-2 rounded p-3">
                                <span>No determinados</span>
                                <span><b>{data.report.not_determined}</b></span>
                            </div>
                            <div className="mb-4 flex justify-between bg-gray-200 mb-2 rounded p-3">
                                <span>No determinados (para hoy)</span>
                                <span><b>{data.report.not_determined_today}</b></span>
                            </div>
                            <div className="mb-4 flex justify-between bg-gray-200 mb-2 rounded p-3">
                                <span>Determinados</span>
                                <span><b>{data.report.determined}</b></span>
                            </div>
                            <div className="mb-4 flex justify-between bg-gray-200 mb-2 rounded p-3">
                                <span>Determinados (para hoy)</span>
                                <span><b>{data.report.determined_today}</b></span>
                            </div>
                            <div className="mb-4 flex justify-between bg-gray-200 rounded p-3 cursor-pointer" data-statusid={4} onClick={navigateHandler}>
                                <span>Descartados</span>
                                <span><b>{data.report.canceled}</b></span>
                            </div>
                        </>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportModal;