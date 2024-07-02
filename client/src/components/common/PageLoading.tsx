import React from 'react'
import PageLoadingIcon from "./icons/PageLoadingIcon"

const PageLoading = () => {
    return (
        <div id="loading-screen" className="w-full h-full fixed block top-0 left-0 bg-white z-50 bg-opacity-70">
            <span className="text-green-500 opacity-75 top-1/2 my-0 mx-auto block relative w-0 h-0">
                <PageLoadingIcon />
            </span>
        </div>
    )
}

export default PageLoading