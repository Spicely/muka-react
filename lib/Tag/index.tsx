import React, { PureComponent, CSSProperties } from 'react'
import { Consumer } from '../ThemeProvider'
import { transition, getRatioUnit, TagThemeData, getUnit, Color } from '../utils'
import styled, { css } from 'styled-components'

type ITagType = 'presets' | 'custom'

interface ITagProps {
    className?: string
    color?: string
    theme?: any
    type?: ITagType
    style?: CSSProperties
}

interface ITagViewProps {
    tagTheme: TagThemeData,
    color?: string
    type?: ITagType
}

const TagView = styled.span<ITagViewProps>`
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-variant: tabular-nums;
    line-height: 1.5;
    list-style: none;
    display: inline-block;
    height: auto;
    margin-right: ${getRatioUnit(8)};
    ${({ tagTheme }) => tagTheme.border.toString()};
    padding: 0 ${getRatioUnit(7)};
    font-size: ${getRatioUnit(12)};
    white-space: nowrap;
    ${({ type, color, tagTheme, theme }) => {
        let str = ''
        str += `border-color: ${Color.setOpacity(color || tagTheme.tagColor || theme.primarySwatch, 1)};`
        if (type === 'presets') {
            str += `background: ${Color.setOpacity(color || tagTheme.tagColor || theme.primarySwatch, 0.2)};color: ${Color.setOpacity(color || tagTheme.tagColor || theme.primarySwatch, 1)};`
        } else {
            str += `background: ${Color.setOpacity(color || tagTheme.tagColor || theme.primarySwatch, 1)};color: ${Color.fromRGB(255, 255, 255)};`
        }
        return css`${str}`
    }}
    border-radius: ${({ tagTheme, theme }) => getUnit(tagTheme.borderRadius, theme.borderRadius)};
    cursor: default;
    opacity: 1;
    ${transition(0.3)};
    &:last-child {
        margin-right: 0;
    }
`

export default class Tag extends PureComponent<ITagProps> {

    public static defaultProps: ITagProps = {
        type: 'presets'
    }

    public render(): JSX.Element {
        const { children, className, theme, color, type, style } = this.props
        return (
            <Consumer>
                {
                    (value) => (
                        <TagView
                            type={type}
                            color={color}
                            tagTheme={theme || value.theme.tagTheme}
                            className={className}
                            style={style}
                        >
                            {children}
                        </TagView>
                    )
                }
            </Consumer>
        )
    }
}