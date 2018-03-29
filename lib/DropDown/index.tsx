import { React, Component } from '../utils'
import * as ReactDom from 'react-dom'

export default class DropDown extends Component<any> {
    static defaultProps = {
        trigger: ['click']
    }
    private popup: HTMLDivElement
    private node: HTMLDivElement
    protected className = 'mk_dropdown'
    public state = {
        status: false,
        left: 0,
        top: 0,
        loop: true
    }
    public componentDidMount() {
        this.popup = document.createElement('div')
        this.popup.className = 'mk_dropdown_placement'
        document.body.appendChild(this.popup)
        this.renderLayer()
    }
    public componentDidUpdate() {
        this.renderLayer()
    }
    public handelPopupClick = (e: any) => {
        if (e.target.className === 'mk_dropdown_placement') {
            this.setState({
                status: !this.state.status,
                loop: true
            }, () => {
                this.popup.style['pointer-events'] = 'none'
                this.popup.removeEventListener('click', this.handelPopupClick)
            })
        }
    }
    public componentWillUnmount() {
        document.body.removeChild(this.popup)
    }
    public renderLayer() {
        const a = ReactDom.render(this.getPlacementNode(), this.popup)
    }
    public render() {
        const event = {}
        this.props.trigger.map((item: string) => {
            event[this.replaceStr(item)] = this.showPlacement
        })
        return (
            <div className={this.getClassName()} {...event} ref={this.rootNode}>
                {this.props.children}
            </div>
        )
    }
    private rootNode = (node: HTMLDivElement) => {
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
    private showPlacement = () => {
        this.setState({
            status: !this.state.status
        }, () => {
            if (this.state.status) {
                this.popup.style['pointer-events'] = 'all'
                this.popup.addEventListener('click', this.handelPopupClick)
            } else {
                this.popup.style['pointer-events'] = 'none'
                this.popup.removeEventListener('click', this.handelPopupClick)
            }
        })
    }
    private getPlacementNode(): JSX.Element {
        if (this.state.status) {
            return (
                <div
                    className={`${this.className}_placement_view`}
                    style={{
                        width: this.props.overlayWidth,
                        height: this.props.overlayHeight,
                        top: this.state.top,
                        left: this.state.left
                    }}
                    ref={this.placementNode.bind(this)}
                >
                    {this.props.overlay}
                </div>
            )
        }
        return (<div/>)
    }
    placementNode(placement: HTMLDivElement) {
        if (placement && this.state.loop) {
            const node = this.node
            const width = placement.offsetWidth
            const height = node.offsetHeight
            const bodyWidth = document.body.offsetWidth
            let top = node.offsetTop + height
            let left = 0
            if (bodyWidth < node.offsetLeft + width / 2) {
                left  = bodyWidth - width - 20
            } else {
                left = node.offsetLeft - width / 2
            }
            this.setState({
                left: left,
                top: top,
                loop: false
            })
        }
    }
}
