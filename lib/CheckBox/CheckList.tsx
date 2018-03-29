import { type } from 'muka'
import { React, Component } from '../utils'
import Icon from '../Icon'

interface CheckListProps {
    options: {label: string, value: string | number, status: boolean}[],
    width?: number | string,
    height?: number | string,
    vaule?: any[],
    multiselect?: boolean,
    onChange: (value: any[]) => {}
}

export default class CheckList extends Component<CheckListProps> {
    static defaultProps = {
        height: 150,
        onChange: (value: any[]) => {},
        vaule: [],
        options: [],
        multiselect: true
    }
    protected className = 'mk_checkList'
    public state = {
        options: this.props.options.map((item) => {
            item.status = false
            return item
        }),
        values: this.props.vaule || []
    }
    public render() {
        return (
            <div className={this.getClassName()} style={{height: this.props.height}}>
                {this.getCheckItems()}
            </div>
        )
    }
    public componentWillReceiveProps(nextProps: CheckListProps) {
        this.setState({
            values: nextProps.vaule
        })
    }
    private getCheckItems() {
        return this.state.options.map((item, index) => {
            let className = this.state.values.indexOf(item.value) !== -1 ? 'mk_selected' : ''
            return (
                <div
                    className={`${this.className}_item ${className} flex`}
                    onClick={this.handleClick.bind(this, item.value, this.props.onChange)}
                    style={{
                        width: this.props.width
                    }}
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
    private handleClick(value: string, callBack: (value: any[]) => {}) {
        const state = this.state
        let indexOf = state.values.indexOf(value)
        let data = state.values.concat()
        if (indexOf !== -1) {
            data.splice(indexOf, 1)
        } else {
            data.push(value)
        }
        this.setState({
            values: this.props.multiselect ? data : [data.pop()]
        }, () => {
           type.func(callBack) && callBack(this.state.values)
        })
    }
}

