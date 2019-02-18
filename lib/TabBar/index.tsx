import * as React from 'react'
import { getClassName } from '../utils'
import TabItem from './TabItem'

const defaultValue = {
    selectIndex: 0,
    setSelected: (index?: any) => { return },
    onChange: (field?: string | number) => { return }
}
export const { Consumer, Provider } = React.createContext(defaultValue)

interface IProps {
    className?: string
    style?: React.CSSProperties
    fixed?: boolean
    onChange?: (field?: string | number) => void
}

export default class LTabBar extends React.Component<IProps, any> {

    public static Item = TabItem

    public static defaultProps: IProps = {
        fixed: false
    }

    public state = {
        selectIndex: 0
    }

    public render(): JSX.Element {
        const { className, children, style, fixed, onChange } = this.props
        return (
            <div className={getClassName(`tab_bar flex${fixed ? ' fixed' : ''}`, className)} style={style}>
                <Provider
                    value={{
                        ...this.state,
                        setSelected: this.handleSelected,
                        onChange: onChange ? onChange : (field?: string | number) => { return }
                    }}
                >
                    {
                        React.Children.map(children, (item: any, index: number) => {
                            if (item.type === TabItem) {
                                const field = item.props.field
                                return React.cloneElement(item, { field: field ? field : index + 1, onChange })
                            }
                            return item
                        })
                    }
                </Provider>
            </div>
        )
    }

    private handleSelected = (index?: number) => {
        this.setState({
            selectIndex: index
        })
    }
}