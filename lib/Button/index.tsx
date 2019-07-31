import React, { ButtonHTMLAttributes, Component } from 'react'
import { omit } from 'muka'
import Icon from '../Icon'
import { getClassName } from '../utils'

export type buttonMold = 'circle' | 'error' | 'primary'

const prefixClass = 'btn'

export interface IButtonProps extends ButtonHTMLAttributes<any> {
    tick?: boolean
    mold?: buttonMold
    className?: string
    fixed?: boolean
    disabled?: boolean
    loading?: boolean
}

export default class Button extends Component<IButtonProps, any> {

    public static defaultProps = {
        mold: 'default',
        tick: true
    }

    public render(): JSX.Element {
        const { children, className, fixed, mold, disabled, loading } = this.props
        const otherProps = omit(this.props, ['children', 'className', 'fixed', 'mold', 'tick', 'loading'])
        return (
            <button
                className={getClassName(`${prefixClass} ${prefixClass}_${mold}${fixed ? ' fixed' : ''}${disabled ? ' disabled' : ''}`, className)}
                {...otherProps}
            >
                {loading ? <Icon icon="md-refresh" className={getClassName(`${prefixClass}_loading`)} rotate /> : ''}{children}
            </button>
        )
    }
}
