import React, {Component, MouseEvent} from 'react';
import {connect} from "react-redux";
import LoadingIcon from "../../common/icons/LoadingIcon";
import {IButtonProps} from "../../../models/main";

class Button extends Component<IButtonProps> {

    clickHandle = (e: MouseEvent<HTMLButtonElement>): void => {
        this.props.onClick && this.props.onClick(e)
    }

    render() {
        const buttonClassName = 'text-white hover:bg-blue-400 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-sm px-5 py-1.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800' + (!!this.props.disabled ? ' bg-blue-300' : ' bg-blue-500');
        return (
            <button
                type={this.props.type ? this.props.type : 'submit'}
                name={this.props.name}
                id={this.props.id}
                className={buttonClassName}
                onClick={this.clickHandle}
                disabled={!!this.props.disabled}
            >
                {this.props.loading && <LoadingIcon/>}
                {this.props.label ? this.props.label : "Enviar"}
            </button>
        )
    }
}

export default connect(
    () => {
        return {}
    },
    {}
)(Button);