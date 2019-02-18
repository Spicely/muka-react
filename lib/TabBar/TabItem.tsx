import * as React from 'react'
import { getClassName } from '../utils'
import { Consumer } from './index'

interface IProps {
    className?: string
    label?: string | JSX.Element | JSX.ElementClass
    selected?: boolean
    icon?: string | JSX.Element | JSX.ElementClass
    selectedIcon?: string | JSX.Element | JSX.ElementClass
    field?: number | string
}

export default class TabItem extends React.Component<IProps, any> {

    public static defaultProps = {
        selected: false
    }

    private setSelected: any

    public render(): JSX.Element {
        const { className, label } = this.props
        return (
            <Consumer>
                {
                    (val) => {
                        this.setSelected = val.setSelected
                        return (
                            <div className={getClassName('tab_item flex_1', className)} onClick={this.handleSelected.bind(this, val.setSelected, val.onChange)}>
                                <div className={getClassName('tab_item_icon flex_center')}>
                                    {this.getSelectNode(val.selectIndex)}
                                </div>
                                <div className={getClassName('tab_item_label flex_center')}>{label}</div>
                            </div>
                        )
                    }
                }
            </Consumer>
        )
    }

    public componentWillReceiveProps(nextProps: IProps) {
        const { field, selected } = this.props
        if (selected !== nextProps.selected && nextProps.selected) {
            this.setSelected(field)
        }
    }

    public componentDidMount() {
        const { field, selected } = this.props
        if (selected) {
            this.setSelected(field)
        }
    }

    private getSelectNode(selectIndex: number): string | JSX.Element | JSX.ElementClass | undefined {
        const { icon, selectedIcon, field } = this.props
        if (!selectedIcon) {
            return icon
        }
        return selectIndex === field ? selectedIcon : icon
    }

    private handleSelected(setSelected: (index?: any) => void, onChange: (field?: string | number) => void) {
        const { field } = this.props
        setSelected(field)
        onChange(field)
    }
}