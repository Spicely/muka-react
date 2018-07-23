
import * as React from 'react'
import { PreLoad, browser } from 'muka'
import { getClassName } from '../utils'

interface IProps {
    className?: string
    src?: string | WindowBase64
    style?: React.CSSProperties
    offsetBottom?: number
}

interface IState {
    uri?: string | WindowBase64
    animation: boolean
}

export default class Image extends React.Component<IProps, IState> {

    public static defaultProps = {
        offsetBottom: 100
    }

    public state = {
        uri: '',
        animation: false
    }

    private imageNode: HTMLImageElement

    public render(): JSX.Element {
        const { className } = this.props
        const { animation, uri } = this.state
        return <img className={getClassName(`image ${animation ? 'an_fadeIn' : ''}`, className)} src={uri} ref={(e: HTMLImageElement) => { this.imageNode = e }} />
    }

    public componentWillReceiveProps(nextProps: any) {
        const { src } = this.props
        if (src !== nextProps.src) {
            const loading = new PreLoad([src])
            loading.success = this.handleSuccess.bind(this, nextProps.src)
        }
    }

    public componentDidMount() {
        this.calculation()
        window.addEventListener('scroll', this.handleScroll)
    }

    public componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll)
    }

    private handleSuccess(uri?: string | WindowBase64) {
        this.setState({
            uri,
            animation: true
        })
        window.removeEventListener('scroll', this.handleScroll)
    }

    private handleScroll = (e: any) => {
        this.calculation()
    }

    private calculation() {
        const { offsetBottom, src } = this.props
        const { animation } = this.state
        let top = (document.documentElement.scrollTop || document.body.scrollTop) + browser.GL_SC_HEIGHT
        if (!animation && this.imageNode.offsetTop - (offsetBottom || 0) - top <= 0) {
            const loading = new PreLoad([src])
            loading.success = this.handleSuccess.bind(this, src)
        }
    }
}