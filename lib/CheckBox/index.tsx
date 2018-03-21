import { React, Component } from '../utils'
import CheckView from './CheckView'

interface CheckBoxProps {

}

export default class CheckBox extends Component<CheckBoxProps> {
    static CheckView: CheckView
    protected className: string = 'mk_checkbox'
    public render() {
        return (
            <div className={this.getClassName()}></div>
        )
    }
}