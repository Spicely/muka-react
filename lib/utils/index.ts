import ThemeData from './ThemeData'
import { isNumber, isNil } from 'lodash'
export { default as Border, BorderStyle } from './Border'
export { default as BorderRadius } from './BorderRadius'
export { default as Color } from './Color'
export { default as Padding } from './Padding'
export { default as ThemeData } from './ThemeData'
export { default as AlertThemeData } from './AlertThemeData'
export { default as CardThemeData } from './CardThemeData'
export { default as ColorsThemeData } from './ColorsThemeData'
export { default as CarouselThemeData } from './CarouselThemeData'
export { default as IconThemeData } from './IconThemeData'
export { default as InputThemeData } from './InputThemeData'
export { default as ButtonThemeData } from './ButtonThemeData'
export { default as MenuThemeData } from './MenuThemeData'
export { default as RadioThemeData } from './RadioThemeData'
export { default as ProgressThemeData } from './ProgressThemeData'
export { default as TabBarThemeData } from './TabBarThemeData'
export { default as NavBarThemeData } from './NavBarThemeData'
export { default as DialogThemeData } from './DialogThemeData'
export { default as TagThemeData } from './TagThemeData'
export { default as UploadThemeData } from './UploadThemeData'
export { default as TextareaThemeData } from './TextareaThemeData'
export { default as ItemThemeData } from './ItemThemeData'
export { default as ToastThemeData } from './ToastThemeData'
export { default as SelectThemeData } from './SelectThemeData'
export { default as TreeThemeData } from './TreeThemeData'
export { default as NoticeThemeData } from './NoticeThemeData'
export { default as GridThemeData } from './GridThemeData'
export { default as RangePickerThemeData } from './RangePickerThemeData'
export { default as TableThemeData } from './TableThemeData'

export const prefix: string = 'mk_'

/**
 * @param {string} name 类名会和prefix结合
 * @param {string} extendClass  扩展类名-字符串拼接
 */
export function getClassName(name: string = '', extendClass?: string) {
    const arr = [extendClass]
    if (name) arr.unshift(name)
    return arr.join(' ')
}

export interface IValue {
    [name: string]: any
}

export interface IStyledProps {
    theme: ThemeData
}


export const transition = function (time: number, tag?: string[]): string {
    if (tag) {
        return `transition: ${tag.map((i) => `${i} ${time}s`).toString()};`
    }
    return `transition: all ${time}s;`
}

export const getRatioUnit = function (num: number) {
    return num * ThemeData.ratio + ThemeData.unit
}

export const getUnit = function (value?: number | string, themeValue?: number | string) {
    return !isNil(value) ? isNumber(value) ? getRatioUnit(value) : value : isNumber(themeValue) ? getRatioUnit(themeValue) : themeValue
}