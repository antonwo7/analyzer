import React, { Component } from 'react';
import {connect} from "react-redux";
import {IButtonLinkProps} from "../../../models/main";

class ButtonLink extends Component<IButtonLinkProps> {

    render() {
        return (
            <div className="mb-4 text-center">
                <button
                    onClick={this.props.onClick ? this.props.onClick : (() => {}) }
                    className="w-full inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md focus:outline-none focus:ring-0 transition duration-150 ease-in-out"
                    type="button"
                >{this.props.title}</button>
            </div>
        )
    }
}

export default ButtonLink;