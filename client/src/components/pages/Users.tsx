import React, {useMemo, useState} from 'react';
import SectionLoading from "../common/SectionLoading";
import {userAPI} from "../../api/user";
import AddUserModal from "../modals/AddUserModal";
import {TUser} from "../../models/user";
import LightCloseIcon from "../common/icons/LightCloseIcon";
import EditIcon from "../common/icons/EditIcon";
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
const headerNames = ['Usario', 'Nombre', 'Apellidos', '']

type TUsersState = {
    isUserModifying: boolean,
    editingUser: null | TUser
}

const UsersDefaultState = {isUserModifying: false, editingUser: null}

const Users = () => {
    const [openModal, setOpenModal] = useState<TUsersState>(UsersDefaultState)
    const {data: users, isLoading, isError, isSuccess} = userAPI.useGetUsersQuery()
    const [removeUser, {}] = userAPI.useRemoveUserMutation()

    const getUserById = (userId: number) => {
        if (!users) return null;
        const found = users.filter(user => user.id === userId)
        if (!found.length) return null;

        return found[0];
    }

    const closeModalHandler = () => {
        setOpenModal(UsersDefaultState)
    }

    const removeUserHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!e.currentTarget.dataset.userid) return;
        removeUser(+e.currentTarget.dataset.userid)
    }

    const editUserHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!e.currentTarget.dataset.userid) return;

        const userId = +e.currentTarget.dataset.userid
        const editingUser = getUserById(userId)
        if (!editingUser) return;

        setOpenModal({
            isUserModifying: true,
            editingUser: editingUser
        })
    }

    const addUserHandler = async () => {
        setOpenModal({
            isUserModifying: true,
            editingUser: null
        })
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
                                    {openModal.isUserModifying && <AddUserModal closeHandler={closeModalHandler} user={openModal.editingUser} />}
                                    <div className="flex flex-row justify-between">
                                        <table className={tableClassName}>
                                            <thead>
                                            <tr>
                                                {headerNames.map((name, i) => <th key={i} {...th}>{name}</th>)}
                                            </tr>
                                            </thead>
                                            <tbody className="bg-white dark:bg-slate-800">
                                            {users && users.map((user, index) => {
                                                const values = [user.username, user.name, user.surname]
                                                return (
                                                    <tr className="hover:bg-blue-200" key={index}>
                                                        {values.map((value, i) => <td key={i} className={td.className}>{value}</td>)}
                                                        <td className={td.className}>
                                                            <button type="button" { ...editButton } data-userid={user.id} onClick={editUserHandler}>
                                                                <EditIcon width={3} height={3}/>
                                                            </button>
                                                            <button type="button" data-userid={user.id} { ...closeButton } onClick={removeUserHandler}>
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
                                        <button type="button" className={addButtonClassName} onClick={addUserHandler}>Agregar</button>
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

export default Users;