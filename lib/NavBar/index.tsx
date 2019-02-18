import * as React from 'react'
import { withRouter, RouteComponentProps } from 'react-router'
import { isNumber } from 'muka'
import { getClassName } from '../utils'
import Icon from '../Icon'

interface IProps extends RouteComponentProps<any> {
    className?: string
    left?: string | JSX.Element | JSX.ElementClass
    title?: string | JSX.Element | JSX.ElementClass
    right?: string | JSX.Element | JSX.ElementClass
    fixed?: boolean
    endVal?: number
    divider?: boolean
}

class NavBar extends React.Component<IProps, any> {

    public static defaultProps = {
        divider: true
    }

    public render() {
        const { className, left, divider, title, right, fixed } = this.props
        return (
            <div
                className={`${getClassName(`nav_bar${divider ? ' divider' : ''} flex_justify${fixed ? ' fixed' : ''}`, className)}`}
            >
                <div className="flex">
                    <div className={getClassName('nav_bar_left', 'flex_justify')}>
                        {left ? left : <Icon icon="ios-arrow-back-outline" onClick={this.handleBack} />}
                    </div>
                    <div className={getClassName('nav_bar_title flex_1', 'flex_justify')}> {title}</div>
                    <div className={getClassName('nav_bar_right', 'flex_justify')}> {right} </div>
                </div>
            </div>
        )
    }

    public componentDidMount() {
        const { fixed } = this.props
        if (fixed) {
            window.addEventListener('scroll', this.handleScroll)
        }
    }

    private handleScroll = () => {
        const { endVal } = this.props
        const top = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop
        if (isNumber(endVal)) {
            console.log(top)
        }

    }

    private handleBack = () => {
        const { history } = this.props
        history.goBack()
    }
}
export default withRouter(NavBar)