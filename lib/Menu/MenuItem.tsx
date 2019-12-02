import React, { Component, Fragment } from 'react'
import { isString } from 'lodash'
import { Tooltip } from 'antd'
import Link from 'next/link'
import { Consumer as ThemeConsumer } from '../ThemeProvider'
import styled, { css } from 'styled-components'
import { Consumer, IProvider } from './index'
import { IStyledProps, transition, MenuThemeData } from '../utils'
import Icon, { iconType } from '../Icon'
import Color from '../utils/Color'

export interface IMenuItem {
    className?: string
    icon?: iconType | JSX.Element
    field?: string | number
    iconHighlight?: string
    iconInitColor?: string
}

interface IStyleProps extends IStyledProps {
    active: boolean
    fontColor: Color
}

const Item = styled.li<IStyleProps>`
    height: ${({ theme }) => theme.menuGroupHeight * theme.ratio + theme.unit};
    line-height: ${({ theme }) => theme.menuGroupHeight * theme.ratio + theme.unit};
    position: relative;

    &::after {
        content: '';
        height: 100%;
        left: 0;
        width: 0;
        top: 0;
        position: absolute;
        background-color: ${({ theme }) => theme.primarySwatch};
    }

    &::before {
        content: '';
        height: 100%;
        width: 0%;
        transition: all 0.5s;
        position: absolute;
    }

    ${({ active, theme, fontColor }) => {
        if (active) return css`
            color: ${fontColor.toString()};

            &::after {
                width: ${2 * theme.ratio + theme.unit};
            }

            &::before {
                width: 100%;
                background: ${Color.setOpacity(theme.primarySwatch, 0.2).toString()};
            }
        `
    }}
`

interface IItemLabelProps extends IStyledProps {
    single: boolean
    active: boolean
    menuTheme: MenuThemeData
}

const IconLogo = styled(Icon) <IStyledProps>``

const ItemLabel = styled.div<IItemLabelProps>`
    height: 100%;
    padding: 0 ${({ theme }) => 9 * theme.ratio + theme.unit};
    cursor: pointer;
    color: ${({ menuTheme }) => Color.setOpacity(menuTheme.color, 0.7).toString()};
    position: relative;
    z-index: 1;
    width: 100%;
    white-space: nowrap;
    ${transition(0.5)};

    ${({ single, theme }) => {
        if (single) return css`padding-left: ${20 * theme.ratio + theme.unit};`
    }}

    ${({ active, menuTheme }) => {
        if (active) return css`color: ${menuTheme.color.toString()};${IconLogo} { fill: ${menuTheme.hoverIconColor ? menuTheme.hoverIconColor.toString() : menuTheme.color.toString()}}`
    }}
    
    &:hover {
        color: ${({ menuTheme }) => menuTheme.color.toString()};
        ${IconLogo} {
            ${({ menuTheme }) => css`fill: ${menuTheme.hoverIconColor ? menuTheme.hoverIconColor.toString() : menuTheme.color.toString()}}`};
        }
    }
`

const ItemIcon = styled.div<IStyledProps>`
    padding: ${({ theme }) => 6 * theme.ratio + theme.unit};
`

const ItemTitle = styled.div<IStyledProps>`
    padding-left: ${({ theme }) => 6 * theme.ratio + theme.unit};
`

export class MenuItem extends Component<IMenuItem, any> {
    public static defaultProps = {
        iconHighlight: '#FFFFFF',
        iconInitColor: '#A8AdAF'
    }
    public render(): JSX.Element {
        const { children, className, icon, field, iconHighlight, iconInitColor } = this.props
        return (
            <ThemeConsumer>
                {
                    (value) => (
                        <Consumer>
                            {
                                (val: IProvider) => {
                                    const url = field ? field.toString() : ''
                                    const nodeView = (child: JSX.Element) => {
                                        if (val.collapsed) {
                                            return (
                                                <Tooltip title={children} placement="right">
                                                    {child}
                                                </Tooltip>
                                            )
                                        } else {
                                            return (
                                                <Fragment>
                                                    {child}
                                                </Fragment>
                                            )
                                        }
                                    }
                                    const jsxNode = (
                                        <Item
                                            className={className}
                                            active={val.field === field}
                                            theme={value.theme}
                                            onClick={() => { val.onPress(field === undefined ? '' : field) }}
                                            fontColor={val.fontColor || value.theme.fontColor}
                                        >
                                            <Link href={val.fieldToUrl ? url : '#'}>
                                                <ItemLabel
                                                    className="flex"
                                                    single={!icon}
                                                    theme={value.theme}
                                                    active={val.field === field}
                                                    menuTheme={val.theme}
                                                >
                                                    {
                                                        icon && (
                                                            <ItemIcon
                                                                theme={value.theme}
                                                                className="flex_justify"
                                                            >
                                                                {isString(icon) ? (
                                                                    <IconLogo
                                                                        icon={icon}
                                                                        theme={value.theme.menuTheme.iconTheme}
                                                                        color={val.field === field ? iconHighlight : iconInitColor}
                                                                    />
                                                                ) : icon}
                                                            </ItemIcon>
                                                        )
                                                    }
                                                    {!val.collapsed && <ItemTitle className="flex_1" theme={value.theme}>{children}</ItemTitle>}
                                                </ItemLabel>
                                            </Link>
                                        </Item>
                                    )
                                    return nodeView(jsxNode)
                                }
                            }
                        </Consumer>
                    )
                }
            </ThemeConsumer>
        )
    }
}
