import { type } from 'muka'
import { React, Component } from '../utils'
import Icon from '../Icon'

interface CheckListProps {
    options: {label: string, value: string | number, status: boolean}[],
    width?: number | string,
    defaultVaule?: any[]
    onChange: (value: any[]) => {}
}

export default class CheckList extends Component<CheckListProps> {
    static defaultProps = {
        width: 160,
        defaultVaule: [],
        options: []
    }
    protected className: string = 'mk_checklist'
    public state = {
        options: this.props.options.map((item) => {
            item.status = false
            return item
        }),
        values: this.props.defaultVaule || []
    }
    public render() {
        return (
            <div className={this.getClassName()} style={{
                width: this.props.width
            }}>
                {this.getCheckItems()}
            </div>
        )
    }
    private getCheckItems(): JSX.Element[] {
        return this.state.options.map((item, index) => {
            return (
                <div
                    className={`${this.className}_item ${this.state.values.indexOf(item.value) !== -1 ? 'mk_selected' : ''} flex`}
                    onClick={this.handleClick.bind(this, item.value, this.props.onChange)}
                    key={index}
                >
                    <div className={`${this.className}_item_label flex_1`}>
                        {item.label}
                    </div>
                    <div className={`${this.className}_item_icon`}>
                        {this.getIconNode(this.state.values.indexOf(item.value) !== -1)}
                    </div>
                </div>
            )
        })
    }
    private getIconNode(status: boolean): JSX.Element | undefined {
        if (status) {
            return <Icon type='check'/>
        }
        return
    }
    private handleClick(value: any, callBack: (value: any[]) => {}) {
        let indexOf: number = this.state.values.indexOf(value)
        let data: any[] = this.state.values.concat()
        if (indexOf !== -1) {
            data.splice(indexOf, 1)
        } else {
            data.push(value)
        }
        this.setState({
            values: data
        }, () => {
            type.func(callBack) && callBack(this.state.values)
        })
    }
}
