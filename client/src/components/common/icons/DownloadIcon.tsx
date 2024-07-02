import React, { Component } from 'react';
import {IIconProps} from "../../../models/main";

class DownloadIcon extends Component<IIconProps> {
    constructor(props: IIconProps){
        super(props)
    }

    render() {
        const width = this.props.width ? this.props.width : 4
        const height = this.props.height ? this.props.height : 4
        return (
            <svg className={`w-${width} h-${height} fill-current`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z"/>
            </svg>
        );
    }
}
export default DownloadIcon;