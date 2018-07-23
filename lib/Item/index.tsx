import * as React from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { getClassName } from '../utils'

interface IProps extends RouteComponentProps<any> {
    activeClass?: string
    className?: string
    title: string | JSX.Element | JSX.ElementClass
    link?: string
    value?: string | JSX.Element | JSX.ElementClass
}

interface IState {
    active: boolean
}

class Item extends React.Component<IProps, IState> {

    public static defaultProps = {
        activeClass: 'active',
        title: ''
    }

    public state = {
        active: false
    }

    private link: boolean = false

    private node: HTMLDivElement

    public render(): JSX.Element {
        const { activeClass, className, title, value } = this.props
        const { active } = this.state
        const activeClassName = active ? activeClass : ''
        return (
            <div
                className={getClassName(`item flex_justify ${activeClassName}`, className)}
                ref={(event: HTMLDivElement) => { this.node = event }}
                // onClick={this.handleActive}
                onTouchStart={this.handleAddActive}
                onTouchEnd={this.handleRemoveActive}
            >
                <div className="flex">
                    <div className={getClassName('item_title flex_1')}>{title}</div>
                    <div className={getClassName('item_right')}>
                        {value}
                    </div>
                </div>
            </div>
        )
    }

    public componentDidMount() {
        this.node.addEventListener('transitionend', this.closeAnimation)
    }

    public componentWillUnmount() {
        this.node.removeEventListener('transitionend', this.closeAnimation)
    }

    private closeAnimation = () => {
        if (!this.link) {
            return
        }
        this.setState({
            active: false
        })
        if (this.link) {
            this.moveToView()
        }
    }

    private handleAddActive = () => {
        this.link = false
        this.setState({
            active: true
        })
    }

    private handleRemoveActive = () => {
        this.link = true
        this.setState({
            active: false
        })
    }

    private moveToView() {
        const { link, history } = this.props
        if (link) {
            history.push(link)
        }
    }
}

export default withRouter(Item)