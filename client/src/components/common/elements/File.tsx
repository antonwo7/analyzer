import React, { Component } from 'react';
import {connect} from "react-redux";
import {IFileProps} from "../../../models/main";

class File extends Component<IFileProps> {

    render() {
        return (
            <div className="mb-4 text-center">
                {this.props.title && <label htmlFor={this.props.id} className="text-left block mb-2 text-sm font-medium text-gray-900 dark:text-white">{this.props.title}</label>}
                <input
                    className="block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                    type="file"
                    id={this.props.id}
                    name={this.props.name}
                />

            </div>
        )
    }
}

export default File;