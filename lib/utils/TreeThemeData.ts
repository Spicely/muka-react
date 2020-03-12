import Color from './Color'
import Padding from './Padding'
import BorderRadius from './BorderRadius'
import { IconThemeData } from '.'

interface ITreeThemeDataProps {
    treeColor?: Color
    borderRadius?: BorderRadius
}

export default class TreeThemeData {
    constructor(data?: ITreeThemeDataProps) {
        if (data) {
            if (data.treeColor) this.treeColor = data.treeColor
            if (data.borderRadius) this.borderRadius = data.borderRadius
        }
    }

    public treeColor?: Color

    public borderRadius?: BorderRadius

}