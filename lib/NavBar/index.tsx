import React, { Component, CSSProperties } from 'react'
import Router from 'next/router'
import { isArray, isNumber, isNull, isFunction } from 'muka'
import { getClassName, prefix } from '../utils'
import Icon, { iconType } from '../Icon'
import Image from '../Image'

export interface INavBarRightIcon {
    type: 'icon'
    url: iconType
    link?: string
    color?: string
    onClick?: () => boolean
}

export interface INavBarRightImage {
    type: 'image'
    url: string
    link?: string
    onClick?: () => boolean
}

export interface INavBarProps {
    className?: string
    leftClassName?: string
    titleClassName?: string
    rightClassName?: string
    titleCenter?: boolean
    style?: CSSProperties
    left?: string | JSX.Element | null
    title?: string | JSX.Element
    right?: string | JSX.Element | null | (INavBarRightIcon | INavBarRightImage)[]
    fixed?: boolean
    endVal?: number
    divider?: boolean
    animate?: boolean
    goBack?: () => void
    onRightClick?: () => void
}

export default class NavBar extends Component<INavBarProps, any> {

    public static defaultProps: INavBarProps = {
        divider: true
    }

    public render(): JSX.Element {
        const { className, left, divider, title, right, fixed, goBack, leftClassName, titleCenter, titleClassName, rightClassName, style, onRightClick } = this.props
        let rightValue: any
        if (isArray(right)) {
            rightValue = right.map((item: INavBarRightIcon | INavBarRightImage, index: number) => {
                if (item.type === 'icon') {
                    return (
                        <Icon icon={item.url} color={item.color} onClick={this.handleClick.bind(this, item.link, item.onClick)} key={index} />
                    )
                } else if (item.type === "image") {
                    return (
                        <Image className={getClassName('nav_bar_right__img')} src={item.url} onClick={this.handleClick.bind(this, item.link, item.onClick)} key={index} />
                    )
                }
            })
        } else {
            rightValue = right
        }
        return (
            <div
                className={`${getClassName(`nav_bar ${divider ? prefix + 'divider' : ''} flex_justify${fixed ? ' fixed' : ''}`, className)}`}
                style={style}
            >
                <div className="flex">
                    {
                        !isNull(left) && (
                            <div className={getClassName('nav_bar_left flex_justify', leftClassName)} onClick={goBack}>
                                {left ? left : <Icon icon="ios-arrow-back" />}
                            </div>
                        )
                    }
                    <div className={getClassName(`nav_bar_title flex_1 ${titleCenter ? 'flex_center' : 'flex_justify'}`, titleClassName)}> {title}</div>
                    {
                        !isNull(rightValue) && (
                            <div className={getClassName('nav_bar_right flex_justify', rightClassName)} onClick={onRightClick}> {rightValue} </div>
                        )
                    }
                </div>
            </div>
        )
    }

    public componentDidMount() {
        const { fixed, animate } = this.props
        if (fixed && animate) {
            window.addEventListener('scroll', this.handleScroll)
        }
    }

    private handleScroll = () => {
        const { endVal } = this.props
        const top = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop
        if (isNumber(endVal)) {
            console.log(top)
        }
    }

    private handleClick = (link?: string, onClick?: () => boolean) => {
        let status = true
        if (isFunction(onClick)) {
            status = onClick()
        }
        if (status && link) {
            Router.push(link)
        }
    }
}
