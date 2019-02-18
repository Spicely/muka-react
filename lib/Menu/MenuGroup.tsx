import * as React from 'react'
// import { Consumer, IProvider } from './index'
import MenuItem from './MenuItem'
import { Consumer, IProvider } from './index'
import { getClassName } from '../utils'
import Icon from '../Icon'

interface IProps {
    className?: string
    icon?: string | JSX.Element | JSX.ElementClass
    title?: string
    field?: string | number
}

export default class MenuGroup extends React.Component<IProps, any> {

    public state = {
        visible: false
    }

    private selected: boolean = false

    public render(): JSX.Element {
        const { children, className, title, icon, field } = this.props
        const { visible } = this.state
        return (
            <Consumer>
                {
                    (val: IProvider) => {
                        const node = React.Children.map(children, (item: any, index: number) => {
                            if (item.type === MenuItem) {
                                const fieldProps = item.props.field
                                if (fieldProps === val.field) {
                                    this.selected = true
                                } else {
                                    this.selected = false
                                }
                                return React.cloneElement(item, { field: fieldProps ? fieldProps : `${field}-${index}` })
                            }
                            return item
                        })
                        return (
                            <li className={getClassName('menu_group', className)}>
                                <ul className={getClassName('menu_group_title', className)}>
                                    <li className="flex" onClick={this.handleShowBox}>
                                        <div className={getClassName('menu_group_title__icon')}>
                                            {icon}
                                        </div>
                                        <div className={getClassName('menu_group_title__label flex_1')}>{title}</div>
                                        <div style={{ transform:  (this.selected || visible) ? 'scale(1, 1)' : 'scale(1, -1)', transition: '0.5s all' }}><Icon icon="ios-arrow-down-outline" /></div>
                                    </li>
                                    <li className={getClassName('menu_group_content flex_1', (this.selected || visible) ? 'active' : '')}>
                                        <ul>
                                            {node}
                                        </ul>
                                    </li>
                                </ul>
                            </li>
                        )
                    }
                }
            </Consumer>
        )
    }

    private handleShowBox = () => {
        const { visible } = this.state
        this.setState({
            visible: !visible
        })
    }
}