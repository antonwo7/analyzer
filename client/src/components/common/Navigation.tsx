import React, {Component, FC, useEffect} from 'react';
import LogoutIcon from "./icons/LogoutIcon";
import {NavLink} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../../store/hooks";
import {removeCredentialsAction} from "../../store/auth/authSlice"
import {toggleOptionsModalAction, toggleReportModalAction} from "../../store/common/commonSlice"
import OptionsIcon from "./icons/OptionsIcon";
import OptionsModal from "../modals/OptionsModal";
import ReportModal from "../modals/ReportModal";
import ReportIcon from "./icons/ReportIcon";
import ExcelIcon from "./icons/ExcelIcon";
import {fileAPI} from "../../api/file";
import {fileDownload} from "../../utils/common";

const NavLinkClass = "nav-link block font-medium text-xs leading-tight uppercase border-x-0 border-t-0 border-b-2 border-transparent px-6 py-3 hover:border-transparent hover:bg-gray-100 focus:border-transparent"

const Navigation = () => {
    const dispatch = useAppDispatch()
    const optionsModal = useAppSelector(store => store.common.optionsModal)
    const reportModal = useAppSelector(store => store.common.reportModal)
    const [exportReport, {data: exportData}] = fileAPI.useExportReportMutation()

    useEffect(() => {
        if (exportData) {
            if (exportData.excel) fileDownload(exportData.excel)
            if (exportData.pdf) fileDownload(exportData.pdf)
        }
    }, [exportData])

    const logoutHandler = () => {
        dispatch(removeCredentialsAction())
    }

    const showOptionsHandler = () => {
        dispatch(toggleOptionsModalAction(true))
    }

    const hideOptionsHandler = () => {
        dispatch(toggleOptionsModalAction(false))
    }

    const showReportHandler = () => {
        dispatch(toggleReportModalAction(true))
    }

    const hideReportHandler = () => {
        dispatch(toggleReportModalAction(false))
    }

    const exportHandler = () => {
        exportReport()
    }

    return (
        <>
            <nav className="relative w-full flex flex-wrap items-center justify-between py-4 bg-gray-100 text-gray-500 hover:text-gray-700 focus:text-gray-700 shadow-lg navbar navbar-expand-lg navbar-light">
                <div className="container-fluid w-full flex flex-wrap items-center justify-between px-6 relative">
                    <div className="flex-grow items-center">
                        <ul className="nav nav-tabs flex flex-row md:flex-row flex-wrap list-none border-b-0 pl-0">
                            <li className="nav-item">
                                <NavLink to="/" className={NavLinkClass}>Ficheros</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to="/users" className={NavLinkClass}>Usarios</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to="/types" className={NavLinkClass}>Tipos</NavLink>
                            </li>
                        </ul>
                    </div>

                    <div className="flex items-center absolute right-0 px-2.5 py-2">
                        <a className="text-gray-500 hover:text-gray-700 focus:text-gray-700 mr-4" href="#" onClick={exportHandler}>
                            <ExcelIcon />
                        </a>
                        <a className="text-gray-500 hover:text-gray-700 focus:text-gray-700 mr-4" href="#" onClick={showReportHandler}>
                            <ReportIcon />
                        </a>
                        <a className="text-gray-500 hover:text-gray-700 focus:text-gray-700 mr-4" href="#" onClick={showOptionsHandler}>
                            <OptionsIcon />
                        </a>
                        <a className="text-gray-500 hover:text-gray-700 focus:text-gray-700 mr-4" href="#" onClick={logoutHandler}>
                            <LogoutIcon />
                        </a>
                    </div>
                </div>
            </nav>
            {optionsModal && <OptionsModal onClose={hideOptionsHandler} />}
            {reportModal && <ReportModal onClose={hideReportHandler} />}
        </>
    )
}

export default Navigation;