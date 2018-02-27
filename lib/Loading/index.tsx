import { Component, React }  from '../utils'
// import { Motion, spring } from 'react-motion'
import './index.scss'
// console.log(Animated)
interface PropsType {
    status?: 'wait' | 'loading' | 'success' | 'error',
    colors?: [string, string, string]
}
export default class Loading extends Component {
    static defaultProps = {
        type: '',
        errorColor: '#f5222d'
    }

    protected className: string = 'mk_loading'
    constructor(props: PropsType) {
        super(props)
    }
    render(): JSX.Element {
        return this.getRootNode(this.viewNode())
    }
    private viewNode(): JSX.Element {
        const style = this.getStyle()
        return (
            <div
                className={this.props.status === 'loading' ? 'mk_loading_c mk_loading_loop' : 'mk_loading_c'}
                style={style}
            />
        )
    }
    private getStyle(): object {
        let style = {}
        if (this.props.status === 'wait') {
            return style = {
                background: this.props.colors[0]
            }
        }
        if (this.props.status === 'loading') {
            return style = {
                background: this.props.colors[1]
            }
        }
        if (this.props.status === 'success') {
            return style = {
                background: this.props.colors[2]
            }
        }
        if (this.props.status === 'error') {
            return style = {
                background: this.props.errorColor
            }
        }
        return style
    }
}
