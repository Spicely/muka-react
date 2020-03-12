import Color from './Color'
import { isNil } from 'lodash'
import BorderRadius from './BorderRadius'

interface ICardThemeDataProps {
    cardColor?: Color
    height?: number
    borderRadius?: BorderRadius
}

export default class CardThemeData {

    constructor(data?: ICardThemeDataProps) {
        if (data) {
            if (data.cardColor) this.cardColor = data.cardColor
            if (!isNil(data.height)) this.height = data.height
            if (data.borderRadius) this.borderRadius = data.borderRadius
        }
    }

    public cardColor: Color = Color.fromRGB(255, 255, 255)

    public height: number = 180

    public borderRadius: BorderRadius = BorderRadius.all(0)
}