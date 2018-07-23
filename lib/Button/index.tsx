import * as React from 'react'
import { omit } from 'lodash'
import { getClassName } from '../utils'

interface IProps extends React.ButtonHTMLAttributes<any> {
    type?: 'circle'
    className?: string
}

export default class Button extends React.Component<IProps, any> {

    public render(): JSX.Element {
        const { children, className, type } = this.props
        const otherProps = omit(this.props, ['children', 'className', 'type'])
        return (
            <button
                className={getClassName(`btn ${type} flex_center`, className)}
                {...otherProps}
            >
                {children}
            </button>
        )
    }
}