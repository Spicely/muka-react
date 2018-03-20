import { Component, React }  from '../utils'
import { json, type } from 'muka'
import './index.scss'

export default class Input extends Component {
    public state = {
        value: ''
    }
    protected className: string = 'mk_input'
    render(): JSX.Element {
        return this.getRootNode(this.viewNode())
    }
    private viewNode(): JSX.Element {
        this.createSlots()
        const otherProps = json.omit(this.props, ['style', 'className', 'children'])
        return (
            <div className={this.getClassName()}>
                <div className="flex">
                    <input
                        className="mk_input_view"
                        {...otherProps}
                        value={this.state.value}
                        onChange={this.handleChange}
                    />
                </div>
                {this.slotsNode.default}
            </div>
        )
    }
    private handleChange = (e: any): void => {
        const value = e.target.value
        this.setState({
            value: value
        }, () => {
            type.func(this.props.onChange) && this.props.onChange(value)
        })
    }
}
