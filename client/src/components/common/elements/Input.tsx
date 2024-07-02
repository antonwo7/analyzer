import React, {ChangeEvent, Component, MouseEvent} from 'react';
import {connect} from "react-redux";
import {IInputProps, IInputState} from "../../../models/main";

class Input extends Component<IInputProps, IInputState> {

    constructor(props: IInputProps) {
        super(props)

        this.state = {
            value: this.props.value ? this.props.value : null
        }
    }

    changeHandle = (e: React.ChangeEvent<HTMLInputElement>): void => {
        this.props.onChange && this.props.onChange(e)
        this.setState({value: e.target.value})
    }

    blurHandle = (e: React.FocusEvent<HTMLInputElement>): void => {
        this.props.onBlur && this.props.onBlur(e)
    }

    componentDidUpdate(prevProps: IInputProps, prevState: IInputState) {
        if (this.props.value !== prevProps.value) {
            this.setState({value: this.props.value})
        }
    }

    render() {
        const inputClassName = 'block w-full flex-1 rounded-none rounded-r-md border border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3' + (this.props.inputClassName ? ' ' + this.props.inputClassName : '') + (!this.props.title ? ' ' + 'rounded-l-md' : '')
        const labelClassName = 'inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500' + (this.props.labelClassName ? ' ' + this.props.labelClassName : '')

        return (
            <div className="flex rounded-md shadow-sm">
                {this.props.title &&
                <label htmlFor={this.props.id} className={labelClassName}>{this.props.title}</label>}
                <input
                    type={this.props.type}
                    name={this.props.name}
                    id={this.props.id}
                    className={inputClassName}
                    required={this.props.required}
                    value={this.state.value ? this.state.value : ''}
                    onChange={this.changeHandle}
                    onBlur={this.blurHandle}
                    ref={this.props.innerRef ?? undefined}
                    disabled={!!this.props.disabled}
                />
            </div>
        )
    }
}

export default Input;