
import React, { Component } from 'react'
import { DatePicker } from 'antd'
import { omit } from 'muka'
import { getClassName } from '../utils'

export interface ILDatePicker {
    className?: string
}

export default class LDatePicker extends Component<ILDatePicker, any> {
    public render(): JSX.Element {
        const { className } = this.props
        const props = omit(this.props, ['className'])
        return (
            <DatePicker
                className={getClassName('date_picker', className)}
                {...props}
            />
        )
    }
}
