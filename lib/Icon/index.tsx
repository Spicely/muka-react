import { React, Component } from '../utils'
import { json } from 'muka'
import '../style/font-awesome/font-awesome.scss'

interface IconProps {
    color?: string,
    type?: string
}

let allocation: object = {
    fontClass: 'fa',
    fontSize: 14,
    color: '#FFFFFF',
    prefixClass: 'fa-'
}
export default class Icon extends Component<IconProps> {
    static setConfig (config: object = {}) {
        allocation = json.assign(allocation, config)
    }
    protected className: string = 'mk_icon'
    render(): JSX.Element {
        return (
            <i
                className={`${this.className} ${allocation['fontClass']} ${allocation['prefixClass'] + (this.props.type || '')}`}
                style={{fontSize: allocation['fontSize'], color: this.props.color || allocation['color']}}
            />
        )
    }
}
