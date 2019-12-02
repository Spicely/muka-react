import { isNumber } from 'lodash'

interface ITabBarThemeDataProps {
    height?: number
    width?: number
}

export default class TabBarThemeData {
    constructor(data?: ITabBarThemeDataProps) {
        if (data) {
            if (isNumber(data.height)) this.height = data.height
            if (isNumber(data.width)) this.width = data.width
        }
    }

    public height?: number

    public width?: number
}