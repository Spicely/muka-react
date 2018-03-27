import { React, Component } from '../utils'
import CheckList from './CheckList'

interface CheckBoxProps {

}

export default class CheckBox extends Component<CheckBoxProps> {
    static list = CheckList
    protected className: string = 'mk_checkbox'
    public render() {
        return (
            <div className={this.getClassName()}></div>
        )
    }
}
