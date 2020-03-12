import { getUnit } from './index'
import { isNil } from 'lodash'

interface IBorderRadiusHor {
    left?: number | string
    right?: number | string
}

interface IBorderRadiusVer {
    top?: number | string
    bottom?: number | string
}

interface IBorderRadiusOnly {
    topLeft?: number | string
    topRight?: number | string
    bottomLeft?: number | string
    bottomRight?: number | string
}

export default class BorderRadius {

    public static all(value: number | string): BorderRadius {
        return `border-radius: ${getUnit(value)};`
    }

    public static horizontal(value: IBorderRadiusHor): BorderRadius {
        let val = ''
        if (!isNil(value.left)) {
            val += `border-top-left-radius: ${getUnit(value.left)};border-bottom-left-radius: ${getUnit(value.left)};`
        }
        if (!isNil(value.right)) {
            val += `border-top-right-radius: ${getUnit(value.left)};border-bottom-right-radius: ${getUnit(value.left)};`
        }
        return val
    }

    public static vertical(value: IBorderRadiusVer): BorderRadius {
        let val = ''
        if (!isNil(value.top)) {
            val += `border-top-left-radius: ${getUnit(value.top)};border-top-right-radius: ${getUnit(value.top)};`
        }
        if (!isNil(value.bottom)) {
            val += `border-bottom-left-radius: ${getUnit(value.bottom)};border-bottom-right-radius: ${getUnit(value.bottom)};`
        }
        return val
    }

    public static only(value: IBorderRadiusOnly): BorderRadius {
        let val = ''
        if (!isNil(value.topLeft)) {
            val += `border-top-left-radius: ${getUnit(value.topLeft)};`
        }
        if (!isNil(value.topRight)) {
            val += `border-top-right-radius: ${getUnit(value.topRight)};`
        }
        if (!isNil(value.bottomLeft)) {
            val += `border-bottom-left-radius: ${getUnit(value.bottomLeft)};`
        }
        if (!isNil(value.bottomRight)) {
            val += `border-bottom-right-radius: ${getUnit(value.bottomRight)};`
        }
        return val
    }
}