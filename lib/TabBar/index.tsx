import { TabBar } from 'antd-mobile'
import React, { Component } from 'react'
import './index.less'

const TabItem = TabBar.Item

export interface ITabBarList {
    // 默认图片
    bgImg: any
    // 选中后图片
    bgSelectImg?: any
    label: string
    key: string
    component?: JSX.ElementClass | JSX.Element
}

interface IProps {
    lists: ITabBarList[]
    defaultSelect?: string
}

interface IState {
    selectedTab: string
}

export default class LTabBar extends Component<IProps, IState> {

    public static defaultProps = {
        lists: []
    }

    public constructor(props: IProps) {
        super(props)
        this.state = {
            selectedTab: props.defaultSelect || ''
        }
    }

    public render(): JSX.Element {
        const { selectedTab } = this.state
        const { lists } = this.props
        return (
            <div className="L_tabbar">
                <TabBar
                    className="L_tabbar_tab"
                >
                    {
                        lists.map((item: ITabBarList, index: number) => {
                            return <TabItem
                                title={item.label}
                                key={item.key}
                                icon={<div
                                    className="L_tabbar_icon"
                                    style={{
                                        background: `url(${item.bgImg}) center center /  1.1rem 1.1rem no-repeat`,
                                    }}
                                />}
                                onPress={this.handlePress.bind(this, item.key)}
                                selected={selectedTab === item.key}
                                selectedIcon={<div
                                    className="L_tabbar_icon"
                                    style={{
                                        background: `url(${item.bgSelectImg}) center center /  1.1rem 1.1rem no-repeat`,
                                    }}
                                />}
                            >
                                <div className="L_tabbar_content">
                                    {item.component}
                                </div>

                            </TabItem>
                        })
                    }
                </TabBar>
            </div>
        )
    }

    private handlePress(key: string) {
        this.setState({
            selectedTab: key
        })
    }
}