import { Component, React }  from '../utils'
// import { ChangeEventHandler } from 'react'
import omit from 'omit.js'
import * as PropTypes from 'prop-types'
import './index.scss'

export default class Input extends Component {
    static defaultProps = {
        onFocus: function() { return },
        onBlur: function() { return }
    }
    static propTypes = {
        onPressEnter: PropTypes.func,
        onKeyDown: PropTypes.func,
        onKeyUp: PropTypes.func,
        onFocus: PropTypes.func,
        onBlur: PropTypes.func
    }
    public state = {
        value: ''
    }
    protected className: string = 'mk_input'
    render(): JSX.Element {
        return this.getRootNode(this.viewNode())
    }
    private viewNode(): JSX.Element {
       // console.log(...arg)
        this.createSlots()
        const otherProps = omit(this.props, ['style', 'className', 'children'])
        return (
            <div>
                <div className="flex">
                    <input
                        className="mk_input_view"
                        {...otherProps}
                        onBlur={this.props.onBlur}
                        value={this.state.value}
                        onFocus={this.props.onFocus}
                        onChange={this.handleChange}
                    />
                </div>
                {this.slotsNode.default}
            </div>
        )
    }
    private handleChange = (e: any): void => {
        console.log(e)
        this.setState({
            value: e.target.value
        })
    }
}
