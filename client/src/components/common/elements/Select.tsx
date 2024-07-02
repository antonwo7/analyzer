import React, {Component} from 'react';
import {connect} from "react-redux";
import {ISelectProps, ISelectState} from "../../../models/main";

class Select extends Component<ISelectProps, ISelectState> {

    constructor(props: ISelectProps) {
        super(props);

        this.state = {
            value: this.props.value ? this.props.value : ''
        }
    }

    changeHandle = (e: React.ChangeEvent<HTMLSelectElement>): void => {
        this.props.onChange && this.props.onChange(e)
        this.setState({ value: e.target.value })
    }

    componentDidUpdate(prevProps: ISelectProps, prevState: ISelectProps) {
        if (this.props.value !== prevProps.value) {
            this.setState({ value: this.props.value })
        }
    }

    render() {
        const selectClassName = 'block w-full flex-1 rounded-none rounded-r-md border border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3' + (this.props.inputClassName ? ' ' + this.props.inputClassName : '') + (!this.props.title ? ' ' + 'rounded-l-md' : '')
        const labelClassName = 'inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500' + (this.props.labelClassName ? ' ' + this.props.labelClassName : '')

        return (
            <div className="flex rounded-md shadow-sm">
                {this.props.title && <label htmlFor={this.props.id} className={labelClassName}>{this.props.title}</label>}
                <select
                    className={selectClassName}
                    value={this.state.value}
                    onChange={this.changeHandle}
                >
                    {this.props.emptyOption && <option value={0}></option>}
                    {this.props.options && Object.keys(this.props.options).map((key) => (
                        <option value={key} key={key}>{(this.props.options as any)[key]}</option>
                    ))}
                </select>
            </div>
        )
    }
}

export default Select;