import { Icon, Modal, NavBar, Popover } from 'antd-mobile'
import { isArray, isFunction } from 'lodash'
import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Link, RouteComponentProps } from 'react-router-dom'
import share from '../../assets/share.png'
import './index.less'

export interface ILNavBarPopover {
    label: string
    icon?: JSX.Element
    onPress?: () => void
    link?: string
}

export interface IShareData {
    url: string
    title: string
    onPress?: () => void
}

interface ILNavBarProps extends RouteComponentProps<any> {
    rightMenus?: Array<'menu' | 'share'>
    rightContent?: JSX.Element | JSX.ElementClass | JSX.Element[]
    menuOverlay?: ILNavBarPopover[]
    icon?: JSX.Element
    title?: string | JSX.Element | JSX.ElementClass
    shareData?: IShareData[]
    className?: string
    style?: React.CSSProperties
}

interface ILNavBarState {
    visible: boolean
    visibleShare: boolean
}

const Item = Popover.Item

class LNavBar extends Component<ILNavBarProps, ILNavBarState> {
    public static defaultProps = {
        className: '',
        menuOverlay: [],
        rightMenus: [],
        shareData: [
            { url: 'OpHiXAcYzmPQHcdlLFrc', title: '发送给朋友' },
            { url: 'wvEzCMiDZjthhAOcwTOu', title: '新浪微博' },
            { url: 'cTTayShKtEIdQVEMuiWt', title: '生活圈' },
            { url: 'umnHwvEgSyQtXlZjNJTt', title: '微信好友' },
            { url: 'SxpunpETIwdxNjcJamwB', title: 'QQ' }
        ],
        title: ''
    }

    public state: ILNavBarState = {
        visible: false,
        visibleShare: false
    }

    public render(): JSX.Element {
        const { className, title, shareData, rightContent, style } = this.props
        const { visibleShare } = this.state
        return (
            <NavBar
                className={`navbar ${className}`}
                mode="light"
                icon={this.getIcon()}
                rightContent={rightContent || this.getRightContent()}
                style={style}
            >{title}
                <Modal
                    popup={true}
                    visible={visibleShare}
                    animationType="slide-up"
                    maskClosable={true}
                    onClose={this.handleShareCancel}
                >
                    <div className="navbar_share_title">分享到</div>
                    <div className="navbar_share">
                        {isArray(shareData) && shareData.map((item: IShareData, index: number) => {
                            return (<div className="navbar_share_item" key={index} onClick={this.handleShareItem.bind(this, item.onPress)}>
                                <img src={`https://gw.alipayobjects.com/zos/rmsportal/${item.url}.png`} alt={item.title} style={{ width: 36 }} />
                                <div className="navbar_share_item_label">{item.title}</div>
                            </div>
                            )
                        })}
                    </div>
                    <div className="navbar_share_cancel" onClick={this.handleShareCancel}>取消</div>
                </Modal>
            </NavBar>
        )
    }

    private getIcon = (): JSX.Element => {
        const { icon } = this.props
        if (icon) {
            return icon
        }
        return <Icon type="left" onClick={this.handleBack} />
    }

    private getRightContent(): JSX.Element[] | undefined {
        const { rightMenus } = this.props
        const { visible } = this.state
        if (isArray(rightMenus)) {
            return rightMenus.map((item: string) => {
                switch (item) {
                    case 'menu': return (
                        <Popover
                            key="menu"
                            visible={visible}
                            overlay={this.getPopover()}
                            onSelect={this.handleSelect}
                        >
                            <Icon type="ellipsis" />
                        </Popover>
                    )
                    case 'share': return <img className="navbar_img" key="share" src={share} onClick={this.handleShare} />
                    default: return <div />
                }
            })
        }
        return undefined
    }

    private getPopover() {
        const { menuOverlay } = this.props
        if (!menuOverlay) {
            return undefined
        }
        return menuOverlay.map((item: ILNavBarPopover, index: number): JSX.Element => {
            return (
                <Link to={item.link || ''} key={index} replace={true}>
                    <Item
                        icon={item.icon}
                    >
                        {item.label}
                    </Item>
                </Link>
            )

        })
    }

    private handleBack = () => {
        const { history } = this.props
        history.goBack()
    }

    private handleSelect = (node: any, index: number): void => {
        const { menuOverlay } = this.props
        this.setState({
            visible: false
        })
        console.log(this.props)
        if (menuOverlay && menuOverlay[index]) {
            if (isFunction(menuOverlay[index].onPress)) {
                // menuOverlay[index].onPress()
            }
        }
    }

    private handleShare = () => {
        this.setState({
            visibleShare: true
        })
    }

    private handleShareItem(callback: () => void) {
        if (isFunction(callback)) {
            callback()
        }
        this.setState({
            visibleShare: false
        })
    }

    private handleShareCancel = () => {
        this.setState({
            visibleShare: false
        })
    }
}

export default withRouter(LNavBar)