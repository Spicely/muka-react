import * as React from 'react'
import MenuGroup from './MenuGroup'
import MenuItem from './MenuItem'
import { getClassName } from '../utils'
import { isFunc } from 'muka'

interface IProps {
    className?: string
    width?: number | string
    style?: React.CSSProperties
    defaultSelected?: number | string
    onChange?: (index: number | string) => void
}

interface IState {
    field: number | string
}

export interface IProvider extends IState {
    onPress: (index: number | string) => void
}

const defaultValue: IProvider = {
    field: '',
    onPress: (index: number | string) => { return }
}
export const { Consumer, Provider } = React.createContext(defaultValue)

export default class Menu extends React.Component<IProps, IState> {

    public static Group = MenuGroup

    public static Item = MenuItem

    public state = {
        field: this.props.defaultSelected === undefined ? '' : this.props.defaultSelected
    }

    public render(): JSX.Element {
        const { className, children, style, width } = this.props
        let styles: React.CSSProperties = { ...style, width }
        return (
            <ul className={getClassName('menu', className)} style={styles}>
                <Provider
                    value={{ ...this.state, onPress: this.handlePress }}
                >
                    {
                        React.Children.map(children, (item: any, index: number) => {
                            if (item.type === MenuItem || item.type === MenuGroup) {
                                const field = item.props.field
                                return React.cloneElement(item, { field: field ? field : index })
                            }
                            return item
                        })
                    }
                </Provider>
            </ul>
        )
    }

    private handlePress = (field: number | string) => {
        const { onChange } = this.props
        this.setState({ field }, () => { if (isFunc(onChange)) { onChange(field) } })
    }
}