import * as React from 'react'
import { omit } from 'muka'
import Icon from '../Icon'
import { getClassName } from '../utils'

interface IProps extends React.ButtonHTMLAttributes<any> {
    tick?: boolean
    type?: 'circle' | 'error' | 'primary'
    className?: string
    fixed?: boolean
    disabled?: boolean
    loading?: boolean
}

export default class Button extends React.Component<IProps, any> {

    public static defaultProps = {
        type: 'default',
        tick: true
    }

    public render(): JSX.Element {
        const { children, className, fixed, type, disabled, loading } = this.props
        const otherProps = omit(this.props, ['children', 'className', 'fixed', 'type', 'tick'])
        return (
            <button
                className={getClassName(`btn btn_${type}${fixed ? ' fixed' : ''}${disabled ? ' disabled' : ''}`, className)}
                {...otherProps}
            >
                {loading ? <Icon icon="md-refresh" className={getClassName(`btn_loading`)} color="#fff" rotate={true} /> : ''}{children}
            </button>
        )
    }
}