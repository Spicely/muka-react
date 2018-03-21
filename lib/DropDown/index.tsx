import { React, Component } from '../utils'
import * as ReactDom from 'react-dom'

interface DropDownProps {
    trigger: string[],
    overlay?: JSX.Element,
    overlayWidth?: number,
    overlayHeight?: number
}
export default class SoDropDown extends Component<DropDownProps> {
    static defaultProps = {
        trigger: ['click']
    }
    protected className = 'mk_dropdown'
    public state = {
        status: false,
        left: 0,
        top: 0
    }
    private node: HTMLDivElement
    private popup: HTMLDivElement
    public componentDidMount() {
        this.popup = document.createElement('div')
        this.popup.className = 'mk_dropdown_placement'
        document.body.appendChild(this.popup)
        this.renderLayer()
        window.onload = () => {
            const node = this.node
            const height: number = node.offsetHeight
            const left: number  = node.offsetLeft
            const top: number = node.offsetTop
            this.setState({
                left: left,
                top: top + height
            })
        }
    }
    public componentDidUpdate() {
        this.renderLayer()
    }
    public componentWillUnmount() {
        document.body.removeChild(this.popup)
    }

    public render() {
        const event: object = {}
        this.props.trigger.map((item: string) => {
            event[this.replaceStr(item)] = this.showPlacement.bind(this)
        })
        return (
            <div className={this.getClassName()} {...event} ref={this.rootNode.bind(this)}>
                {this.props.children}
            </div>
        )
    }
    private rootNode(node: HTMLDivElement) {
        if (node) {
            this.node = node
        }
    }
    private replaceStr(str: string) {
        str = str.toLowerCase()
        var reg = /\b(\w)|\s(\w)/g
        return 'on' + str.replace(reg, function(m) {
            return m.toUpperCase()
        })
    }
    private renderLayer() {
        ReactDom.render(this.getPlacementNode(), this.popup)
    }
    private showPlacement() {
        this.setState({
            status: !this.state.status
        })
    }
    private getPlacementNode(): JSX.Element {
        if (this.state.status) {
            return (
                <div
                    className={`${this.className}_placement_view`}
                    style={{width: this.props.overlayWidth,
                        height: this.props.overlayHeight,
                        top: this.state.top,
                        left: this.state.left}}
                >
                    {this.props.overlay}
                </div>
            )
        }
        return (
            <div/>
        )
    }
}
