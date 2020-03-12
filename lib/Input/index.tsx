import React, { InputHTMLAttributes, Component, ChangeEvent, FocusEvent, CSSProperties } from 'react'
import styled, { css } from 'styled-components'
import { omit, isFunction, isEmpty, isNil, isNumber } from 'lodash'
import InputSearch from './search'
import { getClassName, prefix, IStyledProps, transition, InputThemeData, Color, getUnit } from '../utils'
import { Consumer } from '../ThemeProvider'
import Icon from '../Icon'

export interface IInputProps extends InputHTMLAttributes<any> {
    className?: string
    placeholder?: string
    placeAnimate?: boolean
    onClose?: (val: string) => void
    closeIconShow?: boolean
    disabled?: boolean
    type?: string
    preIcon?: JSX.Element
    label?: string | JSX.Element
    labelStyle?: CSSProperties
    labelClassName?: string
    showMaxLength?: boolean
    extend?: string | JSX.Element
    extendClassName?: string
    extendStyle?: CSSProperties
    theme?: InputThemeData
}

interface IState {
    moveToTop: boolean
    val: string,
    focus: boolean
}

const prefixClass = 'input'

interface IStyleProps extends IStyledProps {
    inputTheme: InputThemeData
}

const Int = styled.input<IStyleProps>`
    padding: 0 ${() => getUnit(10)};
    outline: none;
    height: 100%;
    background: inherit;
    width: 100% ;
    color: inherit;
    position: relative;
    font-size: ${({ inputTheme, theme }) => getUnit(inputTheme.fontSize || theme.fontSize)};
    ${transition(0.5)};
    -moz-appearance: textfield;
    border: none;

    &::-webkit-inner-spin-button,
    &::-webkit-outer-spin-button {
        -webkit-appearance: none;
        appearance: none;
        margin: 0;
    }

    &::-webkit-input-placeholder {
        font-size: ${({ inputTheme, theme }) => getUnit(inputTheme.fontSize || theme.fontSize)};
    }

    &:-moz-placeholder {
        font-size: ${({ inputTheme, theme }) => getUnit(inputTheme.fontSize || theme.fontSize)};
    }

    &::-moz-placeholder {
        font-size: ${({ inputTheme, theme }) => getUnit(inputTheme.fontSize || theme.fontSize)};
    }

    &:-ms-input-placeholder {
        font-size: ${({ inputTheme, theme }) => getUnit(inputTheme.fontSize || theme.fontSize)};
    }

    &:disabled {
        background: ${({ inputTheme }) => inputTheme.disabledColor.toString()};

        &:hover {
            border-color: ${({ theme, inputTheme }) => inputTheme.hoverColor || theme.primarySwatch};
            cursor: not-allowed;
        }
    }
`

interface IInitProps {
    inputTheme: InputThemeData
}

const IntBox = styled.div<IInitProps>`
    height: ${({ inputTheme }) => getUnit(inputTheme.height)};
    ${({ inputTheme }) => {
        if (!isNil(inputTheme.width)) return css`width: ${getUnit(inputTheme.width)};`
    }}
    color: ${({ inputTheme }) => inputTheme.color.toString()};
    font-size: ${({ inputTheme }) => getUnit(inputTheme.fontSize)};
    position: relative;
    ${transition(0.5)};
    overflow: hidden;
    background: ${({ inputTheme }) => inputTheme.inputColor.toString()};
`

interface IIntViewProps extends IStyleProps {
    inputTheme: InputThemeData
    focus: boolean
}

const IntView = styled.div<IIntViewProps>`
    position: relative;
    ${transition(0.5)};
    ${({ inputTheme }) => {
        if (inputTheme.border) return css`${inputTheme.border.toString()}`
    }}

    ${({ focus, inputTheme, theme }) => {
        if (focus) return css`border-color: ${inputTheme.hoverColor || theme.primarySwatch};`
    }}

    &:hover {
        border-color: ${({ theme, inputTheme }) => inputTheme.hoverColor || theme.primarySwatch};
    }
`

const PreIcon = styled.div`
    width: ${() => getUnit(35)};
`

const IntLabel = styled.div`
     width: ${() => getUnit(60)};
`
const CloseIcon = styled(Icon)`
    ${transition(0.5)};
    position: absolute;
    right: ${() => getUnit(5)};
    top: 50%;
    transform: translate(0, -50%);
    background: ${({ theme }) => Color.setOpacity(theme.color, 0.25).toString()};
    border-radius: 50%;
    cursor: pointer;

    &:hover {
        background: ${({ theme }) => Color.setOpacity(theme.color, 0.5).toString()};
    }
`

export default class Input extends Component<IInputProps, IState> {

    public static defaultProps = {
        closeIconShow: true,
        showMaxLength: false
    }

    public static Search = InputSearch

    public state = {
        moveToTop: false,
        val: '',
        focus: false
    }

    public render(): JSX.Element {
        const { className, placeholder, placeAnimate, value, closeIconShow, disabled, label, labelClassName, labelStyle, showMaxLength, maxLength, extend, extendClassName, extendStyle, preIcon, style, theme } = this.props
        const { moveToTop, val, focus } = this.state
        const otherProps = omit(this.props, ['className', 'placeholder', 'placeAnimate', 'onFocus', 'onBlur', 'preIcon', 'onClose', 'value', 'closeIconShow', 'labelStyle', 'label', 'labelClassName', 'showMaxLength', 'extend', 'extendStyle', 'extendClassName', 'style'])
        const status = val.length > 0 || (value || '').toString().length > 0
        return (
            <Consumer>
                {(data) => (
                    <IntBox
                        className={`flex ${className || ''} ${placeAnimate ? ' active' : ''}`}
                        style={style}
                        inputTheme={theme || data.theme.inputTheme}
                    >
                        {label ? (
                            <IntLabel
                                className={`flex_justify ${labelClassName || ''}`}
                                style={labelStyle}>
                                {label}
                            </IntLabel>
                        ) : null}
                        {placeAnimate && <div className={getClassName(`${prefixClass}_text flex_justify`, moveToTop ? 'active' : '')}>{placeholder}</div>}
                        <IntView
                            className={`flex flex_1 ${disabled ? prefix + 'disabled' : ''}`}
                            focus={focus}
                            inputTheme={theme || data.theme.inputTheme}
                        >
                            {
                                preIcon ? (
                                    <PreIcon className="flex_center">
                                        {preIcon}
                                    </PreIcon>
                                ) : null
                            }
                            <Int
                                {...otherProps}
                                className="flex_1"
                                placeholder={placeAnimate ? '' : placeholder}
                                onFocus={this.handleFocus}
                                onBlur={this.handleBlur}
                                value={isNil(value) ? val : value}
                                onChange={this.handleChange}
                                inputTheme={theme || data.theme.inputTheme}
                                style={{
                                    paddingRight: (closeIconShow && showMaxLength) ? 63 : (closeIconShow || showMaxLength) ? 24 : '',
                                    paddingLeft: preIcon ? 0 : ''
                                }}
                            />
                            {(showMaxLength && maxLength) ? <div className={getClassName(`${prefixClass}_max_length flex_justify`)} style={{
                                right: closeIconShow ? 26 : 5
                            }}>{val.length || (value || '').toString().length}/{maxLength}</div> : null}
                            {status && closeIconShow && !disabled && (
                                <CloseIcon
                                    onClick={this.handleClose}
                                    icon="ios-close"
                                    theme={theme ? theme.iconCloseTheme : data.theme.inputTheme.iconCloseTheme}
                                />
                            )}
                        </IntView>
                        {extend && <div className={getClassName(`${prefixClass}_extend flex_justify`, extendClassName)} style={{ ...extendStyle, margin: 0 }}>{extend}</div>}
                    </IntBox>
                )}
            </Consumer>

        )
    }

    private handleFocus = (event: FocusEvent<HTMLInputElement>) => {
        const { placeAnimate, onFocus } = this.props
        if (placeAnimate) {
            this.setState({
                moveToTop: true
            })
        }
        this.setState({
            focus: true
        })
        if (isFunction(onFocus)) {
            onFocus(event)
        }
    }

    private handleBlur = (event: FocusEvent<HTMLInputElement>) => {
        const { placeAnimate, onBlur, value } = this.props
        if (placeAnimate && isEmpty(value || this.state.val)) {
            this.setState({
                moveToTop: false
            })
        }
        this.setState({
            focus: false
        })
        if (isFunction(onBlur)) {
            onBlur(event)
        }
    }

    private handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { onChange } = this.props
        const val = event.target.value
        if (isFunction(onChange)) {
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
            if (isFunction(onClose)) {
                onClose('')
            }
        } else {
            this.setState({
                val: ''
            })
        }
    }
}
