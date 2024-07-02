import React, {useEffect} from 'react';
import Login from "./components/pages/Login";
import {Routes, Route} from 'react-router-dom';
import {PrivateRoute} from "./components/ProtectedRoute";
import Users from "./components/pages/Users";
import Types from "./components/pages/Types";
import Files from "./components/pages/Files";
import FileList from "./components/pages/FileList";

function App() {

    return (
        <>
            <Routes>
                <Route path='/' element={<PrivateRoute />}>
                    <Route path='/' element={<Files />} />
                </Route>
                <Route path='/users' element={<PrivateRoute />}>
                    <Route path='/users' element={<Users />} />
                </Route>
                <Route path='/types' element={<PrivateRoute />}>
                    <Route path='/types' element={<Types />} />
                </Route>
                <Route path='/file_list' element={<PrivateRoute />}>
                    <Route path='/file_list' element={<FileList />} />
                </Route>
                <Route path='/login' element={<Login />} />
            </Routes>
        </>
    )
}

export default App