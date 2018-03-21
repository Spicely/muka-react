import { React, Component } from '../utils'
import Icon from '../Icon'

interface CheckBoxProps {
    options: {label: string, status: boolean}[],
    width?: number | string
}

export default class CheckView extends Component<CheckBoxProps> {
    static defaultProps = {
        width: 160
    }
    protected className: string = 'mk_checkview'
    public state = {
        options: this.props.options.map((item) => {
            item.status = false
            return item
        })
    }
    public render() {
        return (
            <div className={this.getClassName()}>
                {this.getCheckItems()}
            </div>
        )
    }
    private getCheckItems(): JSX.Element[] {
        return this.state.options.map((item, index) => {
            return (
                <div 
                    className={`${this.className}_item ${item.status ? 'mk_selected' : ''} flex`}
                    onClick={this.handleClick.bind(this, index)}
                    style={{
                        width: this.props.width
                    }}
                    key={index}
                >
                    <div className={`${this.className}_item_label flex_1`}>
                        {item.label}
                    </div>
                    <div className={`${this.className}_item_icon`}>
                        {this.getIconNode(item.status)}
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
    private handleClick(index: number) {
        let data: {label: string, status: boolean}[] = this.state.options.concat()
        data[index].status = !data[index].status
        this.setState({
            options: data
        })
    }
}