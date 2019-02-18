
import * as React from 'react'
import { PreLoad, browser } from 'muka'
import { getClassName } from '../utils'

interface IProps {
    className?: string
    src?: string
    style?: React.CSSProperties
    offsetBottom?: number
    controller?: Element
    loadingIndicatorSource?: string
}

interface IState {
    uri?: string
    animation: boolean
    show: boolean
}

const imgObj: { src: string } = {
    src: ''
}

export const setImageLoadingSource = (uri: string) => {
    imgObj.src = uri
}

export default class Image extends React.Component<IProps, IState> {

    public static defaultProps = {
        offsetBottom: 100
    }

    public state = {
        uri: '',
        animation: false,
        show: false
    }

    private imageNode: HTMLImageElement | null = null

    private controller: any

    public render(): JSX.Element {
        const { className, style, loadingIndicatorSource } = this.props
        const { animation, uri, show } = this.state
        const opacity = uri || loadingIndicatorSource
        return <img className={getClassName(`image${opacity ? '' : ' opacity'}${animation && !show ? ' an_fadeIn' : ''}${show ? ' show' : ''}`, className)} src={uri || loadingIndicatorSource || imgObj.src} ref={(e: HTMLImageElement) => { this.imageNode = e }} style={style} />
    }

    public componentWillReceiveProps(nextProps: any) {
        const { src } = this.props
        if (src !== nextProps.src) {
            const loading = new PreLoad([src])
            loading.success = this.handleSuccess.bind(this, nextProps.src, loading)
            loading.completeLoad = this.completeURI.bind(this, nextProps.src)
        } else {
            this.handleSuccess.bind(this, src)
            this.completeURI.bind(this, src)
        }
    }

    public componentDidMount() {
        const { controller } = this.props
        this.controller = controller ? controller : window
        this.handleScroll()
        this.controller.addEventListener('scroll', this.handleScroll)
    }

    public componentWillUnmount() {
        this.controller.removeEventListener('scroll', this.handleScroll)
    }

    private completeURI(uri?: string) {
        this.setState({
            uri,
            show: true
        })
    }

    private handleSuccess(url?: string, loading?: PreLoad) {
        const { uri } = this.state
        if (uri) {
            this.controller.removeEventListener('scroll', this.handleScroll)
            return
        }
        this.setState({
            uri: url,
            animation: true
        })
        if (loading) {
            loading.clearAsync()
        }
        this.controller.removeEventListener('scroll', this.handleScroll)
    }

    private handleScroll = () => {
        const { offsetBottom, src, controller } = this.props
        const { animation } = this.state
        let top: number = 0
        if (controller) {
            top = this.controller.scrollTop + browser.GL_SC_HEIGHT
        } else {
            top = (document.documentElement && document.documentElement.scrollTop || document.body.scrollTop) + browser.GL_SC_HEIGHT
        }
        if (!animation && this.imageNode && this.imageNode.offsetTop - (offsetBottom || 0) - top <= 0) {
            const loading = new PreLoad([src])
            loading.completeLoad = this.completeURI.bind(this, src)
            loading.success = this.handleSuccess.bind(this, src, loading)
        }
    }
}