import * as React from 'react'
import { omit, isFunc, isEmpty } from 'muka'
import { getClassName } from '../utils'
import Icon from '../Icon'

export interface IProps extends React.InputHTMLAttributes<any> {
    className?: string
    placeholder?: string
    placeAnimate?: boolean
    onClose?: (val: string) => void
    iconShow?: boolean
}

interface IState {
    moveToTop: boolean
    val: string
}

export default class Input extends React.Component<IProps, IState> {

    public static defaultProps = {
        iconShow: true
    }

    public state = {
        moveToTop: false,
        val: ''
    }

    public render(): JSX.Element {
        const { className, placeholder, placeAnimate, value, iconShow } = this.props
        const { moveToTop, val } = this.state
        const otherProps = omit(this.props, ['className', 'placeholder', 'placeAnimate', 'onFocus', 'onBlur', 'onClose', 'value', 'iconShow'])
        return (
            <div className={getClassName(`input${placeAnimate ? ' active' : ''}`, className)}>
                {placeAnimate && <div className={getClassName('input_text flex_justify', moveToTop ? 'active' : '')}>{placeholder}</div>}
                <input
                    className={getClassName(`input_value`)}
                    placeholder={placeAnimate ? '' : placeholder}
                    onFocus={this.handleFocus}
                    onBlur={this.handleBlur}
                    value={value || val}
                    onChange={this.handleChange}
                    {...otherProps}
                />
                {(value || val) && iconShow && <Icon className={getClassName('input_close_icon')} onClick={this.handleClose} icon="md-close-circle" />}

            </div>
        )
    }

    private handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
        const { placeAnimate, onFocus } = this.props
        if (placeAnimate) {
            this.setState({
                moveToTop: true
            })
        }
        if (isFunc(onFocus)) {
            onFocus(event)
        }
    }

    private handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
        const { placeAnimate, onBlur, value } = this.props
        if (placeAnimate && isEmpty(value || this.state.val)) {
            this.setState({
                moveToTop: false
            })
        }
        if (isFunc(onBlur)) {
            onBlur(event)
        }
    }

    private handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { onChange, value } = this.props
        const val = event.target.value
        if (isFunc(onChange) && value) {
            onChange(event)
        } else {
            this.setState({
                val
            })
        }
    }

    private handleClose = () => {
        const { onClose, value } = this.props
        if (value !== undefined) {
            if (isFunc(onClose)) {
                onClose('')
            }
        } else {
            this.setState({
                val: ''
            })
        }
    }
}