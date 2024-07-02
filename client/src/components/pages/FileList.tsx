import React, {FC, useEffect, useMemo, useRef, useState} from 'react';
import SectionLoading from "../common/SectionLoading";
import {fileAPI, filesAdapter} from "../../api/file";
import AddUserModal from "../modals/AddUserModal";
import {TFile} from "../../models/file";
import LightCloseIcon from "../common/icons/LightCloseIcon";
import EditIcon from "../common/icons/EditIcon";
import Navigation from "../common/Navigation";
import Select from "../common/elements/Select";
import {typeAPI} from "../../api/type";
import classNames from "classnames";
import {useAppDispatch} from "../../store/hooks";
import Input from "../common/elements/Input";
import { Document, Page } from 'react-pdf';

import { pdfjs } from 'react-pdf';
import {useSearchParams} from "react-router-dom";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.js',
    import.meta.url,
).toString();

const addButtonClassName = 'text-white hover:bg-blue-400 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-sm px-5 py-1.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 bg-blue-500';

const closeButton = {
    className: "text-sm focus:outline-none text-white bg-red-500 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-xl text-sm px-1 py-1 mr-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900",
    style: { width: '20px' }
}
const editButton = {
    className: "text-sm focus:outline-none text-white bg-green-500 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-xl text-sm px-1 py-1 mr-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900",
    style: { width: '20px' }
}
const th = {
    className: "border-b dark:border-slate-600 font-medium px-2 pt-3 pb-3 text-slate-800 dark:text-slate-200 text-left bg-gray-300"
}
const td = {
    className: "border-b border-slate-300 dark:border-slate-700 px-2 pt-2 pb-2 text-slate-500 dark:text-slate-400"
}
const tableClassName = "border-collapse table-fixed w-full text-sm mt-3"
const headerNames = ['Fichero', 'Tipo', 'Usario y Fecha', '']

const APIFliesUrl = process.env['REACT_APP_API_URL'] + '/file/get_file/'

const FileList = () => {
    const [filterFilename, setFilterFilename] = useState<string>('')
    const [searchParams] = useSearchParams()
    const [status, setStatus] = useState(searchParams.get('status') === null
        ? 4
        : parseInt(searchParams.get('status') as string))

    const {data: files, isLoading, isError, isSuccess, refetch: refetchFiles} = fileAPI.useGetFilesQuery({status: status, filename: filterFilename})
    const {data: types} = typeAPI.useGetTypesQuery()
    const documentWrapper = useRef<HTMLDivElement>(null)
    const [determineFile, {}] = fileAPI.useDetermineFileMutation()


    const typeOptions = useMemo(() => {
        const options = {} as {[key: number]: string}
        if (!types) return options;
        types.map(type => {
            if (type.id) {
                options[type.id] = type.name
            }
        })
        return options
    }, [types])

    const statusOptions = useMemo(() => {
        return {
            4: 'Descartados',
            0: 'No determinados',
            1: 'Planeados',
            3: 'Determinados'
        }
    }, [])

    const filterStatusChangeHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (!e.target.value) return;
        setStatus(+e.target.value)
    }

    const filterFilenameChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilterFilename(e.target.value)
    }

    const filterFilenameSubmitHandler = () => {
        refetchFiles()
    }

    const filterTypeOptions = useMemo(() => {
        return {
            1: 'Determinados',
            0: 'No determinados',
        }
    }, [])

    const determineFileHandler = async (id: number, value: number) => {
        await determineFile({id: id, type_id: value})
    }

    return (
        <>
            <Navigation/>
            <div className="bg-gray-200 w-full inline-table">
                <section className="gradient-form">
                    <div className="container-fluid px-10 mx-auto mb-1 mt-10 pb-0">
                        <div className="flex justify-center flex-wrap w-full g-6 text-gray-800 mx-auto">
                            <div className="block bg-white shadow-lg rounded-lg mb-4 w-full relative">
                                <div className="flex flex-row">
                                    <div className="flex p-4 rounded-b dark:border-gray-600 flex-col justify-center w-full" ref={documentWrapper}>

                                        {isLoading && <SectionLoading />}

                                        <div className="flex flex-row justify-between">
                                            <div className="flex">
                                                <Select title="Estado" options={statusOptions} onChange={filterStatusChangeHandler} value={status} inputClassName="mr-2" />
                                                <Input type="text" value={filterFilename} title="Nombre de fichero"
                                                       onChange={filterFilenameChangeHandler}
                                                       onBlur={filterFilenameSubmitHandler}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex flex-row justify-between">
                                            <table className={tableClassName}>
                                                <thead>
                                                <tr>
                                                    {headerNames.map((name, i) => <th key={i} {...th}>{name}</th>)}
                                                </tr>
                                                </thead>
                                                <tbody className="bg-white dark:bg-slate-800">
                                                {files && files.entities && Object.keys(files.entities).map((key) => {
                                                    const file = files.entities[key] as TFile
                                                    const userDate = file.user ? `${file.user} ${file.date}` : ''
                                                    return (
                                                        <tr className={classNames('hover:bg-blue-200', {'bg-red-100': !!file.type_id})} key={key}>
                                                            <td className={td.className}>{file.filename}</td>
                                                            <td className={td.className}>
                                                                <Select
                                                                    emptyOption={true}
                                                                    options={typeOptions}
                                                                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => determineFileHandler(file.id, +e.target.value)}
                                                                    value={file.type_id ?? undefined}
                                                                />
                                                            </td>
                                                            <td className={td.className}>{userDate}</td>
                                                            <td className={td.className}>
                                                                <a type="button" { ...editButton } target="_blank" href={file.url}>
                                                                    <EditIcon width={3} height={3}/>
                                                                </a>
                                                            </td>
                                                        </tr>
                                                    )
                                                })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>

    )
}

type TPDFDocumentProps = {
    width?: number,
    url: string
}

const PDFDocument: FC<TPDFDocumentProps> = ({width, url}) => {
    return (
        <Document file={url}>
            <Page pageNumber={1} width={width} />
        </Document>
    )
}

export default FileList;