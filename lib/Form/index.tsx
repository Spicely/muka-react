import React, { Component, ChangeEvent, CSSProperties, Fragment } from 'react'
import Loadable from 'react-loadable'
import moment from 'moment'
import { get } from 'lodash'
import { omit, isFunction, isUndefined, hash, isBool, isNil, isArray, isString } from 'muka'
import { getClassName, getRatioUnit, InputThemeData, Border, getUnit } from '../utils'
import { IButtonProps } from '../Button'
import { RadioGroupProps } from 'antd/lib/radio'
import { TimePickerProps } from 'antd/lib/time-picker'
import Input, { IInputProps } from '../Input'
import { IUploadProps } from '../Upload'
import { ILDatePicker } from '../DatePicker'
import { IMapProps } from '../Map'
import { ITextareaProps } from '../Textarea'
import { IColorsProps } from '../Colors'
import { ICarouselProps } from '../Carousel'
import { ISelectProps } from '../Select'
import { ICheckBoxProps } from '../CheckBox'
import { IEditorProps } from '../Editor'
import { IItemProps } from '../Item'
import { ColorResult } from 'react-color'
import styled from 'styled-components'

interface IFormUpload extends IUploadProps {
    label?: string | JSX.Element
}

type component = 'Colors' | 'Input' | 'Button' | 'Radio' | 'DatePicker' | 'Upload' | 'RangePicker' | 'NULL' | 'Label' | 'RadioGroup' | 'Select' | 'AsyncSelect' | 'Map' | 'Textarea' | 'Carousel' | 'Slider' | 'CheckBox' | 'Editor' | 'TimePicker' | 'Upload' | 'Item' | 'ItemInput' | 'Dragger'
type props = RadioGroupProps | IInputProps | IButtonProps | ILDatePicker | IFormUpload | IMapProps | ICarouselProps | ITextareaProps | IColorsProps | ISelectProps | ICheckBoxProps | IEditorProps | TimePickerProps | IItemProps | undefined

export interface IFormItem {
    component: component
    props?: props
    field?: string
    label?: string | JSX.Element
    additional?: string | JSX.Element
    className?: string
    render?: (val: any) => JSX.Element
    visible?: boolean
    extend?: string | JSX.Element
}

export interface IFormProps {
    getItems: (exFun: IFormFun) => IFormItem[]
    showType?: 'column' | 'row'
    className?: string
    style?: CSSProperties
}

export interface IFormFun {
    getFieldValue: (field?: string[]) => IValue
    cleanFieldValue: () => void
    setFieldValue: (params: IValue) => void
    showFieldElement: (params: string[]) => void
    hideFieldElement: (params: string[]) => void
    updateFieldProps: (parsms: IValue) => void
}

interface IValue {
    [name: string]: any
}

interface IFormChild {
    type: component
    field: string
    label?: string | JSX.Element
    className?: string
    props: IValue
    additional?: string | JSX.Element
    view: any
    render?: (val: any) => JSX.Element
    visible: boolean
    extend?: string | JSX.Element
}

// tslint:disable-next-line: only-arrow-functions tslint:disable-next-line: no-shadowed-variable
const loadableComponent = function (component: Promise<any>) {
    return Loadable({
        loader: () => component,
        loading() {
            return null
        },
        // tslint:disable-next-line: no-shadowed-variable
        render(loaded, props) {
            let View
            if (loaded.Group) {
                View = loaded.Group
            } else {
                View = loaded.default
            }

            if (View) {
                return <View {...props} />
            }
            return null
        }
    })
}

interface IState {
    childs: IFormChild[]
    vals: IValue
}

const prefixClass = 'l_form'

const FormItem = styled.div`
    min-height: ${getRatioUnit(50)};
`

const FormItemLabel = styled.div`
    min-height: ${getRatioUnit(50)};
    margin-right: ${getRatioUnit(8)};
`

const ItemExtend = styled.div`
    padding: 0 ${getUnit(10)};
`

const itemInputTheme = new InputThemeData({
    border: Border.none
})
export default class Form extends Component<IFormProps, IState> {

    public static defaultProps: IFormProps = {
        // tslint:disable-next-line: object-literal-shorthand tslint:disable-next-line: only-arrow-functions
        getItems: function (exFun: IFormFun) {
            return []
        },
        showType: 'column'
    }

    public state: any = {}

    private items: IFormItem[] = []

    private lref: IFormFun = {
        getFieldValue: this.getFieldValue.bind(this),
        cleanFieldValue: this.cleanFieldValue.bind(this),
        setFieldValue: this.setFieldValue.bind(this),
        showFieldElement: this.setFieldElement.bind(this, true),
        hideFieldElement: this.setFieldElement.bind(this, false),
        updateFieldProps: this.updateFieldProps.bind(this)
    }

    // tslint:disable-next-line: no-shadowed-variable
    public constructor(props: IFormProps) {
        super(props)
        const { getItems } = this.props
        const vals: any = {}
        const childs: IFormChild[] = []
        this.items = getItems(this.lref)
        this.items.forEach((item: IFormItem, index: number) => {
            const field = item.field || `${item.component}_${index}`
            const _porps: any = item.props || {}
            switch (item.component) {
                // eslint-disable-next-line no-lone-blocks
                case 'Radio': vals[field] = _porps.value; break
                case 'Slider':
                    vals[field] = _porps.value || _porps.defaultValue || 0; break
                case 'Colors':
                    vals[field] = _porps.initColor || ''; break
                case 'CheckBox': vals[field] = _porps.value || []; break
                case 'Input': vals[field] = isNil(_porps.value) ? '' : _porps.value; break
                case 'Dragger': vals[field] = _porps.fileList || (_porps.maxLength > 1 ? [] : ''); break
                case 'RadioGroup': vals[field] = isUndefined(_porps.value) ? '' : _porps.value; break
                case 'Upload': vals[field] = _porps.value ? _porps.value : []; break
                case 'Carousel': vals[field] = _porps.value || []; break
                case 'Map': vals[field] = _porps.value || {}; break
                default: vals[field] = _porps.value || ''
            }

            childs.push({
                type: item.component,
                view: null,
                field,
                additional: item.additional,
                label: item.label,
                props: item.props || {},
                className: item.className,
                visible: isUndefined(item.visible) ? true : item.visible,
                render: item.render,
                extend: item.extend
            })
        })
        this.state = {
            vals,
            childs
        }
    }

    public UNSAFE_componentWillReceiveProps(nextProps: IFormProps) {
        const { getItems } = nextProps
        const { childs, vals } = this.state
        const items = getItems(this.lref)
        this.items = items
        const newChild: IFormChild[] = [...childs]
        let newVals: IValue = {}
        const keys = Object.keys(vals)
        items.map((i) => {
            if (i.field && keys.includes(i.field)) {
                newVals[i.field] = vals[i.field]
            }
            return i
        }).forEach((item: IFormItem, index: number) => {
            // 如果组件不存在 则创建
            const field = item.field || `${item.component}_${index}`
            if (!newChild[index]) {
                const _porps: IValue = item.props || {}
                newChild[index] = {
                    type: item.component,
                    view: null,
                    field,
                    label: item.label,
                    props: _porps,
                    additional: item.additional,
                    className: item.className,
                    render: item.render,
                    visible: isBool(item.visible) ? item.visible : true,
                    extend: item.extend
                }
                switch (item.component) {
                    case 'Radio': newVals[field] = _porps.value; break
                    case 'Slider': newVals[field] = _porps.value || _porps.defaultValue || 0; break
                    case 'Colors': newVals[field] = _porps.initColor || ''; break
                    case 'Dragger': newVals[field] = _porps.fileList || (_porps.maxLength > 1 ? [] : ''); break
                    case 'Upload': newVals[field] = _porps.value ? isString(_porps.value) ? [{ url: _porps.value }] : _porps.value : []; break
                    case 'Carousel': newVals[field] = _porps.value || []; break
                    case 'RadioGroup': newVals[field] = isUndefined(_porps.value) ? '' : _porps.value; break
                    case 'CheckBox': newVals[field] = _porps.value || []; break
                    case 'RangePicker': newVals[field] = _porps.value || []; break
                    case 'Map': newVals[field] = _porps.value || {}; break
                    default: newVals[field] = _porps.value || ''
                }
                return
            }
            if (item.field === newChild[index].field) {
                const newProps = omit(item.props || {}, ['value'])
                newChild[index].props = {
                    ...newChild[index].props,
                    ...newProps
                }
                newChild[index].additional = item.additional
                newChild[index].visible = isBool(item.visible) ? item.visible : true
                newChild[index].extend = item.extend
                newChild[index].render = item.render
                newChild[index].label = item.label
            } else if (item.field !== newChild[index].field && item.field) {
                newChild[index].props = {
                    ...item.props,
                    ...newChild[index].props,
                }
                newChild[index].field = item.field
                newChild[index].additional = item.additional
                newChild[index].visible = isBool(item.visible) ? item.visible : true
                newChild[index].extend = item.extend
                newChild[index].render = item.render
                newChild[index].label = item.label
            }
        })
        this.setState({
            childs: newChild,
            vals: { ...newVals }
        }, () => {
            this.getTypeChild()
        })
    }

    public render(): JSX.Element {
        const { className, showType, style } = this.props
        const { childs } = this.state
        try {
            return (
                <div className={getClassName(`l_form ${showType}`, className)} style={style}>
                    {childs.map((item: IFormChild, index: number) => {
                        if (item.view && item.visible) {
                            return this.setTypeCom(this.items[index].component, item.view, item.props, item.field, index, item.className, item.label, item.additional, item.render, item.extend)
                        }
                        return undefined
                    })}
                </div>
            )
        } catch (e) {
            return <Fragment />
        }
    }

    public componentDidMount() {
        this.getTypeChild()
    }

    private getTypeChild() {
        const { childs } = this.state
        let newChilds
        try {
            newChilds = childs.map((item: IFormChild, index: number) => {
                if (item.view) {
                    if (item.type !== this.items[index].component) {
                        const Com = this.typeChild(this.items[index].component)
                        if (Com) {
                            item.view = Com
                        }
                    }
                } else {
                    const Com = this.typeChild(this.items[index].component)
                    const field = item.field || `${item.type}_${index}`
                    if (Com) {
                        item = {
                            ...item,
                            view: Com,
                            type: item.type,
                            field,
                            label: item.label,
                            props: item.props || {},
                            visible: isUndefined(item.visible) ? true : item.visible,
                            render: item.render
                        }
                    }
                }
                return item
            })
        } catch (e) {
            newChilds = []
        }
        this.setState({
            childs: newChilds
        })
    }

    public componentWillUnmount() {
        this.setState = (state, callback) => {
            return;
        }
    }

    // tslint:disable-next-line: no-shadowed-variable
    private typeChild(component: component) {
        switch (component) {
            case 'Editor': return loadableComponent(import('../Editor'))
            case 'Input': return loadableComponent(import('../Input'))
            case 'Button': return loadableComponent(import('../Button'))
            case 'Radio': return loadableComponent(import('../Radio'))
            case 'DatePicker': return loadableComponent(import('../DatePicker'))
            case 'Upload': return loadableComponent(import('../Upload'))
            case 'Dragger': return loadableComponent(import('../Upload/dragger'))
            case 'Label': return loadableComponent(import('../Label'))
            case 'RadioGroup': return loadableComponent(import('../RadioGroup'))
            case 'Select': return loadableComponent(import('../Select'))
            case 'AsyncSelect': return loadableComponent(import('../Select/async'))
            case 'Map': return loadableComponent(import('../Map'))
            case 'Textarea': return loadableComponent(import('../Textarea'))
            case 'Colors': return loadableComponent(import('../Colors'))
            case 'Carousel': return loadableComponent(import('../Carousel'))
            case 'RangePicker': return loadableComponent(import('../RangePicker'))
            case 'CheckBox': return loadableComponent(import('../CheckBox'))
            case 'Slider': return loadableComponent(import('antd/lib/slider'))
            case 'TimePicker': return loadableComponent(import('antd/lib/time-picker'))
            case 'Item': return loadableComponent(import('../Item'))
            case 'ItemInput': return loadableComponent(import('../Item'))
            default: return null
        }
    }

    // tslint:disable-next-line: no-shadowed-variable
    private setTypeCom(component: component, View: any, props: props, field: string | undefined, key: number | string, className?: string, label?: string | JSX.Element, additional?: string | JSX.Element, render?: (val: any) => JSX.Element, extend?: string | JSX.Element): JSX.Element | null {
        const { vals } = this.state
        /// 得到field
        field = field ? field : `${component}_${key}`
        props = props || {}
        switch (component) {
            case 'Input': {
                const _porps: any = props
                const vProps = omit(props, ['value', 'onChange', 'onClose'])
                // tslint:disable-next-line: only-arrow-functions
                const onChange: any = _porps.onChange || function (e: ChangeEvent<HTMLButtonElement>) { }
                // tslint:disable-next-line: only-arrow-functions
                const onClose: any = _porps.onClose || function (val: string) { }
                return (
                    <FormItem className={`flex_justify ${className || ''}`} key={field}>
                        <div className="flex">
                            {label && <FormItemLabel className="flex_justify">{label}</FormItemLabel>}
                            <div className="flex_1 flex_justify">
                                <View
                                    {...vProps}
                                    value={vals[field]}
                                    onChange={this.setVal.bind(this, field, onChange)}
                                    onClose={this.cleanInputVal.bind(this, field, onClose)}
                                    key={field}
                                />
                            </div>
                            <div className="flex_center">{extend}</div>
                        </div>
                        {additional && <div className={getClassName(`${prefixClass}__additional flex_justify`)}>{additional}</div>}
                    </FormItem>
                )
            }
            case 'Textarea': {
                const _porps: any = props
                const vProps = omit(props, ['value', 'onChange'])
                // tslint:disable-next-line: only-arrow-functions
                const onChange: any = _porps.onChange || function (e: ChangeEvent<HTMLButtonElement>) { }
                return (
                    <div className={getClassName(`${prefixClass}__list`, className)} key={field}>
                        <div className="flex" >
                            {label && <FormItemLabel style={{ paddingTop: getRatioUnit(16) }}>{label}</FormItemLabel>}
                            <div className="flex_1">
                                <View
                                    {...vProps}
                                    value={vals[field]}
                                    onChange={this.setVal.bind(this, field, onChange)}
                                    key={field}
                                />
                            </div>
                        </div>
                        {additional && <div className={getClassName(`${prefixClass}__additional flex_justify`)}>{additional}</div>}
                    </div>
                )
            }
            case 'Colors': {
                const _porps: any = props
                const vProps: any = omit(props, ['onChange'])
                // tslint:disable-next-line: only-arrow-functions
                const onChange: any = _porps.onChange || function (e: ChangeEvent<HTMLButtonElement>) { }
                return (
                    <div className={getClassName(`${prefixClass}__list  flex`, className)} key={field}>
                        {label && <FormItemLabel className="flex_justify">{label}</FormItemLabel>}
                        <div className="flex_1 flex_justify">
                            <View
                                {...vProps}
                                initColor={vals[field]}
                                onChange={this.setColors.bind(this, field, onChange)}
                                key={field}
                            />
                        </div>
                    </div>
                )
            }
            case 'Carousel': {
                const vProps = omit(props, ['onChange'])
                return (
                    <div className={getClassName(`${prefixClass}__list`, className)} key={field}>
                        <div className="flex" >
                            {label && <FormItemLabel style={{ paddingTop: getRatioUnit(16) }}>{label}</FormItemLabel>}
                            <div className="flex_1">
                                <View
                                    {...vProps}
                                    value={vals[field]}
                                    key={field}
                                />
                            </div>
                        </div>
                        {additional && <div className={getClassName(`${prefixClass}__additional flex_justify`)}>{additional}</div>}
                    </div>
                )
            }
            case 'Slider': {
                const vProps = omit(props, ['onChange', 'value'])
                const _porps: any = props
                const onChange: any = _porps.onChange
                return (
                    <div className={getClassName(`${prefixClass}__list flex_justify`, className)} key={field}>
                        <div className="flex">
                            {label && <FormItemLabel className="flex_justify">{label}</FormItemLabel>}
                            <div className="flex_1 flex_justify">
                                <View
                                    {...vProps}
                                    key={field}
                                    value={vals[field]}
                                    onChange={this.setRVal.bind(this, field, onChange)}
                                />
                            </div>
                        </div>
                    </div>
                )
            }
            case 'Button': {
                const vProps = omit(props, ['className'])
                const _porps: any = props
                return (
                    <FormItem className={`flex_justify ${className || ''}`} key={field}>
                        <div className="flex">
                            {label && <FormItemLabel className="flex_justify">{label}</FormItemLabel>}
                            <View {...vProps} key={field} className={`flex_1 ${_porps.className || ''}`} />
                        </div>
                        {additional && <div className={getClassName(`${prefixClass}__additional flex_justify`)}>{additional}</div>}
                    </FormItem>
                )
            }
            case 'Editor': {
                const vProps = omit(props, ['onChange', 'value'])
                const _porps: any = props
                const onChange: any = _porps.onChange
                return (
                    <FormItem className={`flex_justify ${className || ''}`} key={field}>
                        <div className="flex">
                            {label && <FormItemLabel style={{ paddingTop: getRatioUnit(16) }}>{label}</FormItemLabel>}
                            <div className="flex_1">
                                <View
                                    {...vProps}
                                    key={field}
                                    value={vals[field]}
                                    onChange={this.setRVal.bind(this, field, onChange)}
                                />
                            </div>
                        </div>
                        {additional && <div className={getClassName(`${prefixClass}__additional flex_justify`)}>{additional}</div>}
                    </FormItem>
                )
            }
            case 'CheckBox': {
                const vProps = omit(props, ['onChange', 'value'])
                const _porps: any = props
                const onChange: any = _porps.onChange
                return (
                    <FormItem className={`flex_justify ${className || ''}`} key={field}>
                        <div className="flex">
                            {label && <FormItemLabel className="flex_justify">{label}</FormItemLabel>}
                            <div className="flex_1">
                                <View
                                    {...vProps}
                                    key={field}
                                    value={vals[field]}
                                    onChange={this.setRVal.bind(this, field, onChange)}
                                />
                            </div>
                        </div>
                        {additional && <div className={getClassName(`${prefixClass}__additional flex_justify`)}>{additional}</div>}
                    </FormItem>
                )
            }
            case 'Item': {
                const vProps = omit(props, ['onChange', 'value'])
                const _porps: any = props
                const onChange: any = _porps.onChange
                return (
                    <View
                        {...vProps}
                        key={field}
                        value={vals[field]}
                        onChange={this.setRVal.bind(this, field, onChange)}
                    />
                )
            }
            case 'ItemInput': {
                const vProps = omit(props, ['onChange', 'value'])
                const _porps: any = props
                const onChange: any = _porps.onChange
                const onClose: any = _porps.onClose || function (val: string) { }
                return (
                    <div className="flex mk_divider" key={field}>
                        <div className="flex_1">
                            <View
                                {...vProps}
                                key={field}
                                flexType="value"
                                value={
                                    <Input
                                        theme={itemInputTheme}
                                        placeholder={vProps.placeholder}
                                        type={vProps.type}
                                        value={vals[field]}
                                        maxLength={vProps.maxLength}
                                        onChange={this.setVal.bind(this, field, onChange)}
                                        onClose={this.cleanInputVal.bind(this, field, onClose)}
                                    />
                                }
                                onChange={this.setRVal.bind(this, field, onChange)}
                            />
                        </div>
                        {extend && <ItemExtend className="flex_justify">{extend}</ItemExtend>}
                    </div>
                )
            }
            case 'Radio': {
                const vProps = omit(props, ['onChange'])
                const _porps: any = props
                const onChange: any = _porps.onChange
                return (
                    <FormItem className={`flex_justify ${className || ''}`} key={field}>
                        <div className="flex">
                            {label && <FormItemLabel className="flex_justify">{label}</FormItemLabel>}
                            <div className="flex_1">
                                <View
                                    {...vProps}
                                    value={vals[field]}
                                    onChange={this.setRVal.bind(this, field, onChange)}
                                />
                            </div>
                        </div>
                        {additional && <div className={getClassName(`${prefixClass}__additional flex_justify`)}>{additional}</div>}
                    </FormItem>
                )
            }
            case 'Map': {
                const vProps = omit(props, ['onLocationAddr'])
                const _porps: any = props
                return (
                    <FormItem className={`flex_justify ${className || ''}`} key={field}>
                        {label && <FormItemLabel style={{ paddingTop: getRatioUnit(16) }}>{label}</FormItemLabel>}
                        <div className="flex_1">
                            <View
                                onLocationAddr={this.steArrVal.bind(this, field, _porps.onLocationAddr)}
                                {...vProps}
                            />
                        </div>
                    </FormItem>
                )
            }
            case 'DatePicker': {
                const vProps = omit(props, ['onChange', 'className'])
                const _porps: any = props
                const onChange: any = _porps.onChange
                return (
                    <FormItem className={`flex_justify ${className || ''}`} key={field}>
                        <div className="flex">
                            {label && <FormItemLabel className="flex_justify">{label}</FormItemLabel>}
                            <div className="flex_1 flex">
                                <View
                                    {...vProps}
                                    key={field}
                                    className={`flex_1 ${_porps.className || ''}`}
                                    value={vals[field] ? moment(vals[field]) : null}
                                    onChange={this.setDatePickerVal.bind(this, field, onChange)}
                                />
                            </div>
                        </div>
                        {additional && <div className={getClassName(`${prefixClass}__additional flex_justify`)}>{additional}</div>}
                    </FormItem>
                )
            }
            case 'TimePicker': {
                const vProps = omit(props, ['onChange', 'className'])
                const _porps: any = props
                const onChange: any = _porps.onChange
                return (
                    <FormItem className={`flex_justify ${className || ''}`} key={field}>
                        <div className="flex">
                            {label && <FormItemLabel className="flex_justify">{label}</FormItemLabel>}
                            <div className="flex_1 flex">
                                <View
                                    {...vProps}
                                    key={field}
                                    className={`flex_1 ${_porps.className || ''}`}
                                    value={vals[field] ? moment(vals[field], _porps.format || 'HH:mm:ss') : null}
                                    onChange={this.setTimePickerVal.bind(this, field, onChange)}
                                />
                            </div>
                            <div className="flex_center">{extend}</div>
                        </div>
                        {additional && <div className={getClassName(`${prefixClass}__additional flex_justify`)}>{additional}</div>}
                    </FormItem>
                )
            }
            case 'RangePicker': {
                const vProps = omit(props, ['onChange', 'className'])
                const _porps: any = props
                const onChange: any = _porps.onChange
                return (
                    <FormItem className={`flex_justify ${className || ''}`} key={field}>
                        <div className="flex">
                            {label && <FormItemLabel className="flex_justify">{label}</FormItemLabel>}
                            <div className="flex_1 flex_justify">
                                <View
                                    {...vProps}
                                    key={field}
                                    className={_porps.className}
                                    value={vals[field] ? vals[field].map((i: string) => moment(i)) : null}
                                    onChange={this.setDatePickerVal.bind(this, field, onChange)}
                                />
                            </div>
                        </div>
                        {additional && <div className={getClassName(`${prefixClass}__additional flex_justify`)}>{additional}</div>}
                    </FormItem>
                )
            }
            // case 'ImagePicker': {
            //     const vProps = omit(props, ['value', 'onChange'])
            //     const _porps: any = props
            //     return (
            //         <FormItem className={`flex_justify ${className || ''}`} key={field}>
            //             {label && <FormItemLabel style={{ paddingTop: getRatioUnit(16) }}>{label}</FormItemLabel>}
            //             <div className="flex_1">
            //                 <View
            //                     value={vals[field]}
            //                     onChange={this.steArrVal.bind(this, field, _porps.onChange)}
            //                     {...vProps}
            //                 />
            //             </div>
            //         </FormItem>
            //     )
            // }
            case 'Upload': {
                const vProps = omit(props, ['fileList', 'onChange'])
                const _porps: any = props
                return (
                    <FormItem className={`flex_justify ${className || ''}`} key={field}>
                        <div className="flex">
                            {label && <FormItemLabel style={{ paddingTop: getRatioUnit(16) }}>{label}</FormItemLabel>}
                            <div className="flex_1">
                                {isFunction(render) ? render(vals[field]) : (
                                    <View
                                        {...vProps}
                                        fileList={vals[field]}
                                        onChange={this.steArrVal.bind(this, field, _porps.onChange)}
                                    />
                                )}
                            </div>
                        </div>
                    </FormItem>
                )
            }
            case 'RadioGroup': {
                const vProps = omit(props, ['value', 'onChange'])
                const _porps: any = props
                const onChange: any = _porps.onChange
                return (
                    <FormItem className={`flex_justify ${className || ''}`} key={field}>
                        <div className="flex">
                            {label && <FormItemLabel className="flex_justify">{label}</FormItemLabel>}
                            <div className="flex_1 flex_justify">
                                <View
                                    {...vProps}
                                    value={vals[field]}
                                    onChange={this.setRadioGroupVal.bind(this, field, onChange)}
                                />
                            </div>
                        </div>
                        {additional && <div className={getClassName(`${prefixClass}__additional flex_justify`)}>{additional}</div>}
                    </FormItem>
                )
            }
            case 'Select': {
                const vProps = omit(props, ['value', 'onChange'])
                const _porps: any = props
                const onChange: any = _porps.onChange
                return (
                    <FormItem className={`flex_justify ${className || ''}`} key={field}>
                        <div className="flex">
                            {label && <FormItemLabel className="flex_justify">{label}</FormItemLabel>}
                            <div className="flex_1 flex_justify">
                                <View
                                    {...vProps}
                                    value={vals[field]}
                                    className={_porps.className}
                                    onChange={this.setRVal.bind(this, field, onChange)}
                                />
                            </div>
                        </div>
                        {additional && <div className={getClassName(`${prefixClass}__additional flex_justify`)}>{additional}</div>}
                    </FormItem>
                )
            }
            case 'AsyncSelect': {
                const vProps = omit(props, ['value', 'onChange'])
                const _porps: any = props
                const onChange: any = _porps.onChange
                return (
                    <FormItem className={`flex_justify ${className || ''}`} key={field}>
                        <div className="flex">
                            {label && <FormItemLabel className="flex_justify">{label}</FormItemLabel>}
                            <div className="flex_1 flex_justify">
                                <View
                                    {...vProps}
                                    value={vals[field]}
                                    className={_porps.className}
                                    onChange={this.setRVal.bind(this, field, onChange)}
                                />
                            </div>
                        </div>
                        {additional && <div className={getClassName(`${prefixClass}__additional flex_justify`)}>{additional}</div>}
                    </FormItem>
                )
            }
            case 'Dragger': {
                const vProps = omit(props, ['value'])
                const _porps: any = props
                // const onChange: any = _porps.onChange
                return (
                    <FormItem className={`flex_justify ${className || ''}`} key={field}>
                        <div className="flex">
                            {label && <FormItemLabel style={{ paddingTop: getRatioUnit(16) }}>{label}</FormItemLabel>}
                            <div className="flex_1 flex_justify">
                                <View
                                    {...vProps}
                                    value={vals[field]}
                                    className={`flex_1 ${_porps.className || ''}`}
                                />
                            </div>
                        </div>
                        {additional && <div className={getClassName(`${prefixClass}__additional flex_justify`)}>{additional}</div>}
                    </FormItem>
                )
            }
            case 'Label': {
                const vProps = omit(props, ['value', 'onChange', 'className'])
                const _porps: any = props
                return (
                    <FormItem className={`flex_justify ${className || ''}`} key={field}>
                        <div className="flex">
                            {label && <FormItemLabel style={{ paddingTop: getRatioUnit(16) }}>{label}</FormItemLabel>}
                            <div className="flex_1 flex_justify">
                                {
                                    isFunction(render) ? render(vals[field]) : (
                                        <View
                                            {...vProps}
                                            style={{ paddingTop: '0', paddingBottom: '0' }}
                                            key={field}
                                        >
                                            {_porps.value}
                                        </View>
                                    )
                                }
                                {extend}
                            </div>
                        </div>
                        {additional && <div className={getClassName(`${prefixClass}__additional flex_justify`)}>{additional}</div>}
                    </FormItem>
                )
            }
            default: return null
        }
    }

    private setUploadVal(field: string, cb: (file: any) => void, file: any) {
        const { vals } = this.state
        vals[field] = file.fileList
        if (isFunction(cb)) {
            cb(file)
        }
        this.setState({
            vals
        })
    }

    private steArrVal(field: string, cb: () => void, val: any) {
        const { vals } = this.state
        vals[field] = val
        if (isFunction(cb)) {
            cb(val)
        }
        this.setState({
            vals
        })
    }

    private setColors(field: string, cb: (color: ColorResult, e: ChangeEvent<HTMLButtonElement>) => {}, color: ColorResult, e: ChangeEvent<HTMLButtonElement>) {
        const { vals } = this.state
        vals[field] = `rgba(${color.rgb.r},${color.rgb.g},${color.rgb.b},${color.rgb.a})`
        if (isFunction(cb)) {
            cb(color, e)
        }
        this.setState({
            vals
        })
    }

    private setVal(field: string, cb: (e: ChangeEvent<HTMLButtonElement>) => {}, e: ChangeEvent<HTMLButtonElement>) {
        const { vals } = this.state
        vals[field] = e.target.value
        if (isFunction(cb)) {
            cb(e)
        }
        this.setState({
            vals
        })
    }

    private setDatePickerVal(field: string, cb: (date: any, dateString: string) => void, val: any, dateString: string) {
        const { vals } = this.state
        if (isArray(dateString)) {
            let newVal: any = []
            dateString.map((i) => i ? newVal.push(i) : null)
            vals[field] = newVal
        } else {
            vals[field] = dateString
        }
        if (isFunction(cb)) {
            cb(val, dateString)
        }
        this.setState({
            vals
        })
    }

    private setTimePickerVal(field: string, cb: (date: any, dateString: string) => void, val: any, dateString: string) {
        const { vals } = this.state
        vals[field] = dateString
        if (isFunction(cb)) {
            cb(val, dateString)
        }
        this.setState({
            vals
        })
    }
    private setRVal(field: string, cb: (val?: any) => void, val: any) {
        const { vals } = this.state
        vals[field] = val
        if (isFunction(cb)) {
            cb(val)
        }
        this.setState({
            vals
        })
    }
    private setRadioGroupVal(field: string, cb: (val?: any) => void, val: any) {
        const { vals } = this.state
        vals[field] = val
        if (isFunction(cb)) {
            cb(val)
        }
        this.setState({
            vals
        })
    }

    private cleanInputVal(field: string, cb: (val: string) => {}) {
        const { vals } = this.state
        vals[field] = ''
        if (isFunction(cb)) {
            cb('')
        }
        this.setState({
            vals
        })
    }

    private getComVal(item: IFormChild, field: string) {
        const { vals } = this.state
        switch (item.type) {
            case 'Dragger': {
                const _props: any = item.props || {}
                const baseUrl: string = _props.baseUrl || ''
                if (_props.maxLength === 1) {
                    // tslint:disable-next-line: no-string-literal
                    const url: string = (vals[field][0] && (vals[field][0]['url'] || vals[field][0]['response']['data'])) || ''
                    if (baseUrl && hash(url, baseUrl)) {
                        return url.substring(baseUrl.length)
                    } else {
                        return url
                    }
                } else {
                    return vals[field].map((i: any) => {
                        // tslint:disable-next-line: no-string-literal
                        const url = i['url'] || i['response']['data']
                        if (baseUrl && hash(url, baseUrl)) {
                            return url.substring(baseUrl.length)
                        } else {
                            return url
                        }
                    })
                }
            }
            default: return vals[field]
        }
    }

    private getFieldValue(params?: string[]): IValue {
        const { childs } = this.state
        const val: IValue = {}
        childs.forEach((item: IFormChild, index: number) => {
            if (params) {
                params.forEach((i: string) => {
                    if (item.field === i) {
                        val[i] = this.getComVal(item, i)
                    }
                })
            } else {
                val[item.field] = this.getComVal(item, item.field)
            }
        })
        return val
    }

    private cleanFieldValue() {
        const { vals } = this.state
        this.items.forEach((item: IFormItem, index: number) => {
            const field = item.field || `${item.component}_${index}`
            // tslint:disable-next-line: no-shadowed-variable
            const props: any = item.props || {}
            switch (item.component) {
                case 'Radio': vals[field] = props.value; break
                case 'Upload': vals[field] = props.value ? props.value : []; break
                case 'CheckBox': vals[field] = []; break
                case 'RangePicker': vals[field] = []; break
                case 'Carousel': vals[field] = []; break
                default: vals[field] = props.value ? props.value : ''
            }
        })
        this.setState({
            vals
        })
    }

    private setFieldValue(params: IValue) {
        const { vals } = this.state
        this.items.forEach((item: IFormItem, index: number) => {
            const field = item.field || `${item.component}_${index}`
            if (!isNil(params[field] || get(params, field))) {
                switch (item.component) {
                    case 'Upload': {
                        const _props: any = item.props || {}
                        const baseUrl = _props.baseUrl || ''
                        if (_props.maxLength === 1) {
                            vals[field] = [{
                                uid: '-1',
                                name: 'xxx.png',
                                status: 'done',
                                url: baseUrl + (params[field] || get(params, field)),
                            }]
                        } else {
                            // tslint:disable-next-line: no-shadowed-variable
                            vals[field] = (params[field] || get(params, field)).map((i: string, index: number) => {
                                return {
                                    uid: `${index}`,
                                    name: `reload_${index}.png`,
                                    status: 'done',
                                    url: baseUrl + i,
                                }
                            })
                        }
                        // tslint:disable-next-line: align
                    } break
                    default: {
                        vals[field] = params[field] || get(params, field)
                    }
                }
            }
        })
        this.setState({
            vals
        })
    }

    private updateFieldProps(params: IValue = {}) {
        const { childs, vals } = this.state
        const newChilds = childs.map((i: IFormChild) => {
            if (hash(params, i.field)) {
                if (i.type === 'Select' && params[i.field].value) {
                    vals[i.field] = params[i.field].value
                }
                i.props = {
                    ...i.props,
                    ...params[i.field]
                }
            }
            return i
        })
        this.setState({
            childs: newChilds,
            vals: { ...vals }
        })
    }

    private setFieldElement(status: boolean, params: string[]) {
        const { childs } = this.state
        const newChilds = childs.map((i: IFormChild) => {
            if (hash(params, i.field)) {
                i.visible = status
            }
            return i
        })
        this.setState({
            childs: newChilds
        })
    }
}
