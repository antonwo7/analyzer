import React, {useMemo, useState} from 'react';
import SectionLoading from "../common/SectionLoading";
import {typeAPI} from "../../api/type";
import AddTypeModal from "../modals/AddTypeModal";
import {TType} from "../../models/type";
import LightCloseIcon from "../common/icons/LightCloseIcon";
import Navigation from "../common/Navigation";

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
const headerNames = ['Id', 'Nombre', '']

const Types = () => {
    const [openModal, setOpenModal] = useState<boolean>(false)
    const {data: types, isLoading, isError, isSuccess} = typeAPI.useGetTypesQuery()
    const [removeType, {}] = typeAPI.useRemoveTypeMutation()

    const closeModalHandler = () => {
        setOpenModal(false)
    }

    const removeTypeHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!e.currentTarget.dataset.typeid) return;
        removeType(+e.currentTarget.dataset.typeid)
    }

    const addTypeHandler = async () => {
        setOpenModal(true)
    }

    return (
        <>
            <Navigation/>
            <div className="bg-gray-200 h-full w-full inline-table hi">
                <section className="h-full gradient-form">
                    <div className="container-fluid px-10 h-full mx-auto mb-1 mt-10 pb-0">
                        <div className="flex justify-center flex-wrap h-full w-full g-6 text-gray-800 mx-auto">
                            <div className="block bg-white shadow-lg rounded-lg mb-4 w-full relative">
                                <div className="flex p-4 rounded-b dark:border-gray-600 flex-col justify-center w-full">
                                    {isLoading && <SectionLoading />}
                                    {openModal && <AddTypeModal closeHandler={closeModalHandler} />}
                                    <div className="flex flex-row justify-between">
                                        <table className={tableClassName}>
                                            <thead>
                                            <tr>
                                                {headerNames.map((name, i) => <th key={i} {...th}>{name}</th>)}
                                            </tr>
                                            </thead>
                                            <tbody className="bg-white dark:bg-slate-800">
                                            {types && types.map((type, index) => {
                                                const values = [type.id, type.name]
                                                return (
                                                    <tr className="hover:bg-blue-200" key={index}>
                                                        {values.map((value, i) => <td key={i} className={td.className}>{value}</td>)}
                                                        <td className={td.className}>
                                                            <button type="button" data-typeid={type.id} { ...closeButton } onClick={removeTypeHandler}>
                                                                <LightCloseIcon width={3} height={3}/>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="flex justify-between mt-3">
                                        <button type="button" className={addButtonClassName} onClick={addTypeHandler}>Agregar</button>
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

export default Types;