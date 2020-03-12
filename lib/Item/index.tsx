import React, { Component, CSSProperties } from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { isBoolean, isFunction, isNil, isString, isNull } from 'lodash'
import styled, { css } from 'styled-components'
import { Consumer } from '../ThemeProvider'
import Icon from '../Icon'
import { getClassName, ItemThemeData, getUnit, Color } from '../utils'

type ILineType = 'solid' | 'dashed' | 'none'

export interface IItemProps {
    activeClassName?: string
    titleClassName?: string
    labelClassName?: string
    className?: string
    style?: CSSProperties
    title?: string | JSX.Element | JSX.ElementClass
    link?: boolean | string | null
    value?: string | JSX.Element | JSX.ElementClass
    extend?: string | JSX.Element | JSX.ElementClass
    icon?: string | JSX.Element | JSX.ElementClass
    onPress?: (link?: string) => void
    lineType?: ILineType
    theme?: ItemThemeData
    flexType?: 'title' | 'value'
}

interface IItemInitProps {
    itemTheme: ItemThemeData
}

interface IItemViewProps extends IItemInitProps {
    lineType?: ILineType
}

const ItemView = styled.div<IItemViewProps>`
    min-height: ${({ itemTheme }) => getUnit(itemTheme.minHeight)};
    ${({ itemTheme }) => {
        if (isNil(itemTheme.height)) {
            return css`height: ${getUnit(itemTheme.height)};`
        }
    }}
    background: ${({ itemTheme, theme }) => itemTheme.itemColor ? itemTheme.itemColor.toString() : theme.primarySwatch};
    ${({ itemTheme }) => css`${itemTheme.padding.toString()};`}
    transition: all .1s cubic-bezier(0.65, 0.05, 0.36, 1);
    position: relative;
    overflow: hidden;
    &.active {
        background-color: ${({ itemTheme, theme }) => Color.setOpacity(itemTheme.itemColor || theme.primarySwatch, 0.9).toString()};
    }
    ::after {
        content: "";
        position: absolute;
        height: ${getUnit(1)};
        width: 100%;
        bottom: 0;
        transform: scaleY(0.5);
        ${({ lineType, itemTheme, theme }) => {
        return css`border-bottom: ${getUnit(1)} ${lineType} ${itemTheme.dividerColor || theme.dividerColor};`
    }}
    }
    :last-child::after {
        border-bottom: 0;
    }
`

const ItemTitile = styled.div<IItemInitProps>`
    color: ${({ itemTheme }) => itemTheme.titleColor.toString()};
    min-width: ${getUnit(60)};
    text-align: left;
`

const ItemRight = styled.div<IItemInitProps>`
    color: ${({ itemTheme }) => itemTheme.rightColor.toString()};
    height: 100%;
    font-size: ${getUnit(10)};
`

const ItemLink = styled.div<IItemInitProps>`
    margin-left: ${getUnit(6)};
    width: ${getUnit(24)};
`

interface IState {
    active: boolean
}

export default class Item extends Component<IItemProps, IState> {

    public static defaultProps = {
        activeClass: 'active',
        title: '',
        lineType: 'solid',
        flexType: 'title'
    }

    public state = {
        active: false
    }

    private link: boolean = false

    private moveNum: number = 0

    public render(): JSX.Element {
        const { activeClassName, lineType, className, extend, title, value, link, titleClassName, labelClassName, style, theme, flexType } = this.props
        const { active } = this.state
        const activeClass = active ? activeClassName : ''
        return (
            <Consumer>
                {
                    (init) => (
                        <ItemView
                            className={getClassName(`flex_justify${link ? ` ${activeClass}` : ''}`, className)}
                            lineType={lineType}
                            style={style}
                            itemTheme={theme || init.theme.itemTheme}
                            onClick={this.handlePress}
                            onTouchStart={this.handleAddActive}
                            onTouchMove={this.handleMove}
                            onTouchEnd={this.handleRemoveActive}
                            onTransitionEnd={this.closeAnimation}
                        >
                            <div className="flex">
                                <ItemTitile
                                    className={getClassName(`${flexType === 'title' ? 'flex_1 ' : ''}flex_justify`, titleClassName)}
                                    itemTheme={theme || init.theme.itemTheme}
                                >
                                    {title}
                                </ItemTitile>
                                <ItemRight
                                    className={getClassName(`${flexType === 'value' ? 'flex_1 ' : ''}flex_justify`, labelClassName)}
                                    itemTheme={theme || init.theme.itemTheme}
                                >
                                    {value}
                                </ItemRight>
                                {this.getLinkNode(theme || init.theme.itemTheme)}
                            </div>
                            {extend}
                        </ItemView>
                    )
                }
            </Consumer>
        )
    }
    private getLinkNode(theme: ItemThemeData): JSX.Element | void {
        const { link, icon } = this.props
        if (isNull(link)) {
            return <div style={{ width: getUnit(10) }} />
        }
        return (
            <ItemLink
                className={getClassName('flex_center')}
                itemTheme={theme}
            >
                {link ? (icon || <Icon icon="ios-arrow-forward" theme={theme.iconTheme} />) : null}
            </ItemLink>
        )
    }

    private closeAnimation = () => {
        if (!this.link) {
            return
        }
        this.setState({
            active: false
        })
    }

    private handleAddActive = () => {
        const { link } = this.props
        if (isBoolean(link) && link) {
            return
        }
        this.moveNum = 0
        this.link = false
        this.setState({
            active: true
        })
    }

    private handleRemoveActive = () => {
        this.link = true
        this.setState({
            active: false
        })
    }

    private handleMove = (e: any) => {
        this.moveNum = e.targetTouches[0].clientY
    }

    private handlePress = () => {
        const { onPress, link } = this.props
        if (isString(link) && isFunction(onPress)) {
            onPress(link)
            return
        }
        if (isFunction(onPress)) {
            onPress()
        }
    }
}

