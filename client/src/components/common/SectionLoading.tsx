import React from "react";
import PageLoadingIcon from "./icons/PageLoadingIcon";

const SectionLoading = () => {
    return (
        <div id="loading-screen" className="w-full h-full absolute block top-0 left-0 bg-white z-50 bg-opacity-50">
            <span className="text-green-500 opacity-75 my-0 mx-auto block relative w-full h-full flex justify-center items-center">
                <PageLoadingIcon />
            </span>
        </div>
    )
}

export default SectionLoading