import * as React from 'react'
import { isBool, isFunction } from 'muka'
import Icon from '../Icon'
import { getClassName } from '../utils'

export interface IItemProps {
    activeClass?: string
    className?: string
    title?: string | JSX.Element | JSX.ElementClass
    link?: boolean
    value?: string | JSX.Element | JSX.ElementClass
    extend?: string | JSX.Element | JSX.ElementClass
    icon?: string | JSX.Element | JSX.ElementClass
    onPress?: () => void
    lineType?: 'solid' | 'dashed'
}

interface IState {
    active: boolean
}

export default class Item extends React.Component<IItemProps, IState> {

    public static defaultProps = {
        activeClass: 'active',
        title: '',
    }

    public state = {
        active: false
    }

    private link: boolean = false

    private moveNum: number = 0

    private node: HTMLDivElement | null = null

    public render(): JSX.Element {
        const { activeClass, lineType, className, extend, title, value, link } = this.props
        const { active } = this.state
        const activeClassName = active ? activeClass : ''
        return (
            <div
                className={getClassName(`item flex_justify${link ? ` ${activeClassName}` : ''} line_${lineType || 'solid'}`, className)}
                ref={(event: HTMLDivElement) => { this.node = event }}
                onClick={this.handlePress}
                onTouchStart={this.handleAddActive}
                onTouchMove={this.handleMove}
                onTouchEnd={this.handleRemoveActive}
            >
                <div className="flex">
                    <div className={getClassName('item_title flex_1 flex_justify')}>{title}</div>
                    <div className={getClassName('item_right flex_justify')}>
                        {value}
                    </div>
                    {this.getLinkNode()}
                </div>
                {extend}
            </div>
        )
    }

    public componentDidMount() {
        if (this.node) {
            this.node.addEventListener('transitionend', this.closeAnimation)
        }
    }

    public componentWillUnmount() {
        if (this.node) {
            this.node.removeEventListener('transitionend', this.closeAnimation)
        }
    }

    private getLinkNode(): JSX.Element | void {
        const { link, icon } = this.props
        if (link) {
            return (
                <div className={getClassName('item_link flex_justify')}>
                    {icon || <Icon className={getClassName('item_link__icon')} icon="ios-arrow-forward"  color="#B6B6B6"/>}
                </div>
            )
        }
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
        if (isBool(link) && link) {
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
        const { onPress } = this.props
        if (isFunction(onPress)) {
            onPress()
        }
    }
}
