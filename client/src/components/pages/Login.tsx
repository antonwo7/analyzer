import React, {useEffect, useState} from 'react'
import Logo from "../common/Logo"
import LoadingIcon from "../common/icons/LoadingIcon"
import classNames from "classnames"
import {authAPI} from "../../api/auth";
import {useAppSelector} from "../../store/hooks";
import {NavLink, useNavigate} from "react-router-dom";

type TLoginData = {
    username: string
    password: string
}

const Login = () => {
    const navigate = useNavigate()
    const authUser = useAppSelector(state => state.auth.authUser)
    const [login, {isLoading}] = authAPI.useLoginMutation()

    const [loginData, setLoginData] = useState<TLoginData>({
        username: '',
        password: ''
    })

    useEffect(() => {
        if (authUser) {
            navigate('/')
        }
    }, [authUser])

    const changeField = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.name) return;
        setLoginData({
            ...loginData,
            [e.target.name]: e.target.value
        })
    }

    const loginHandler = async () => {
        await login(loginData)
    }

    const submitEnable = !!loginData.password && !!loginData.username

    return (
        <section className="h-full gradient-form bg-gray-200">
            <div className="container p-10 h-full mx-auto">
                <div className="flex justify-center items-center flex-wrap h-full g-6 text-gray-800 mx-auto">
                    <div className="w-full">
                        <div className="block bg-white shadow-lg rounded-lg">
                            <div className="lg:flex lg:flex-wrap g-0 justify-center">
                                <div className="lg:w-6/12 px-4 md:px-0">
                                    <div className="md:p-12 md:mx-6">
                                        <div className="text-center">
                                            <Logo/>
                                            <h4 className="text-xl font-semibold mt-1 mb-12 pb-1">ILusiaK</h4>
                                        </div>
                                        <div>
                                            <p className="mb-4">Please login to your account</p>
                                            <div className="mb-4">
                                                <input
                                                    type="text"
                                                    className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                                    name="username"
                                                    placeholder="Username"
                                                    value={loginData.username}
                                                    onChange={changeField}
                                                />
                                            </div>
                                            <div className="mb-4">
                                                <input
                                                    type="password"
                                                    className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                                    name="password"
                                                    placeholder="Password"
                                                    value={loginData.password}
                                                    onChange={changeField}
                                                />
                                            </div>
                                            <div className="text-center pt-1 mb-4 pb-1">
                                                <button
                                                    className={classNames('inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md focus:outline-none focus:ring-0 transition duration-150 ease-in-out', {'opacity-60': !submitEnable})}
                                                    type="button"
                                                    onClick={loginHandler}
                                                    disabled={!submitEnable}
                                                >
                                                    {isLoading && <LoadingIcon/>}
                                                    Log in
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Login;