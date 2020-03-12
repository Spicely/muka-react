import React, { Component, TextareaHTMLAttributes, ChangeEvent } from 'react'
import styled, { css } from 'styled-components'
import { isFunction, omit } from 'lodash'
import { Consumer } from '../ThemeProvider'
import { TextareaThemeData, getUnit, transition } from '../utils'

interface ITextareaViewProps {
    textareaTheme: TextareaThemeData
}

const TextareaBox = styled.div<ITextareaViewProps>`
    position: relative;
    height: ${({ textareaTheme }) => getUnit(textareaTheme.height)};
    background: ${({ textareaTheme }) => textareaTheme.textareaColor.toString()};
    ${({ textareaTheme, theme }) => textareaTheme.borderRadius || theme.borderRadius};
`

const TextView = styled.textarea<ITextareaViewProps>`
    padding: ${getUnit(5)};
    width: ${({ textareaTheme }) => getUnit(textareaTheme.width)};
    border: none;
    outline: none;
    height: 100%;
    font-size: ${({ textareaTheme, theme }) => getUnit(textareaTheme.fontSize, theme.fontSize)};
    resize: none;
    background: inherit;
    ${({ textareaTheme }) => css`${textareaTheme.border.toString()}`}
    border-radius: inherit;
    ${transition(0.3)}

    :focus {
        border-color: ${({ textareaTheme, theme }) => textareaTheme.hoverColor || theme.primarySwatch};
    }

    :hover {
        border-color: ${({ textareaTheme, theme }) => textareaTheme.hoverColor || theme.primarySwatch};
    }

    :disabled {
        background: transparent;

        :hover {
             border-color: ${({ textareaTheme, theme }) => textareaTheme.disabledBorderColor || theme.disabledBorderColor};
        }
    }
`

const TextMax = styled.div`
    position: absolute;
    right: ${getUnit(10)};
    bottom: ${getUnit(10)};
`

export interface ITextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    className?: string
    showMaxLength?: boolean
    theme?: TextareaThemeData
}

interface IState {
    val: string
}

export default class Textarea extends Component<ITextareaProps, IState> {

    public state: IState = {
        val: ''
    }

    public render(): JSX.Element {
        const { className, maxLength, showMaxLength, theme, style } = this.props
        const { val } = this.state
        const props = omit(this.props, ['className', 'onChange', 'showMaxLength', 'theme', 'style'])
        return (
            <Consumer>
                {
                    (init) => (
                        <TextareaBox
                            className={className}
                            textareaTheme={theme || init.theme.textareaTheme}
                            style={style}
                        >
                            <TextView
                                {...props}
                                onChange={this.handleChange}
                                textareaTheme={theme || init.theme.textareaTheme}
                            />
                            {(showMaxLength && maxLength) ? <TextMax className='flex_justify'>{val.length}/{maxLength}</TextMax> : null}
                        </TextareaBox>
                    )
                }
            </Consumer>
        )
    }

    private handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        const { onChange } = this.props
        this.setState({
            val: e.target.value
        })
        if (isFunction(onChange)) {
            onChange(e)
        }
    }
}
