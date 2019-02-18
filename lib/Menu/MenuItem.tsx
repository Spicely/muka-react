import * as React from 'react'
import { Consumer, IProvider } from './index'
import { getClassName } from '../utils'

interface IProps {
    className?: string
    icon?: string | JSX.Element | JSX.ElementClass
    field?: string | number
}

export default class MenuItem extends React.Component<IProps, any> {

    public render(): JSX.Element {
        const { children, className, icon, field } = this.props
        return (
            <Consumer>
                {
                    (val: IProvider) => {
                        return (
                            <li className={getClassName(`menu_item${val.field === field ? ' active' : ''}`, className)} onClick={() => { val.onPress(field === undefined ? '' : field) }}>
                                <div className={getClassName('menu_item__label flex')}>
                                    <div className={getClassName('menu_item__label_icon')}>
                                        {icon}
                                    </div>
                                    <div className="flex_1">
                                        {children}
                                    </div>
                                </div>
                            </li>
                        )
                    }
                }
            </Consumer>
        )
    }
}