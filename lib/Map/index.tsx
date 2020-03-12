import React, { Component } from 'react'
import load from 'load-script'
import { isFunction, browser } from 'muka'
import { getClassName, prefix } from '../utils'

declare const qq: any
declare const AMap: any

export interface IMapProps {
    type: 'tMap' | 'bMap' | 'aMap'
    width?: string | number
    height?: string | number
    apiKey: string
    // 地址参数追加
    urlParams?: string
    // 是否定位
    location?: boolean
    // 应用名称
    appName?: string
    // 初始定位
    initLatLng?: {
        lat: number
        lng: number
    }
    extendUrls?: string[]
    onInit?: (params: any) => void
    onLocationError?: () => void
    onLocationAddr?: (position: any) => void
    onLoadUrlError?: () => void
}

interface ILocation {
    latitude: number
    longitude: number
}

// tslint:disable-next-line: no-empty-interface
interface IState {
}

const mapUrl: any = {
    tMap: 'https://map.qq.com/api/js?v=2.exp&key=',
    bMap: '',
    aMap: ''
}

export const setMapUrlSource = (params: any) => {
    const keys = Object.keys(mapUrl)
    keys.map((i: any) => {
        mapUrl[i] = params[i]
    })
}

export default class Map extends Component<IMapProps, IState> {

    public static defaultProps: IMapProps = {
        type: 'aMap',
        height: 600,
        width: 800,
        apiKey: '',
        extendUrls: []
    }

    public state: IState = {}

    private node: Element | null = null

    private location?: ILocation = undefined

    private geolocation: any = null

    private geocoder: any = null

    private events: any[] = []

    public UNSAFE_componentWillMount() {

    }

    public componentDidMount() {
        const { type } = this.props
        const win: any = window
        switch (type) {
            case 'tMap': {
                if (!isFunction(win.tMapInit)) {
                    this.initTMap()
                    this.getScriptFile().catch(() => {
                        const { onLoadUrlError } = this.props
                        if (isFunction(onLoadUrlError)) {
                            onLoadUrlError()
                        }
                    })
                } else {
                    win.tMapInit()
                }
            }; break;
            case 'bMap': ; break;
            default: {
                if (!isFunction(win.aMapInit)) {
                    this.initAMap()
                    this.getScriptFile().catch(() => {
                        const { onLoadUrlError } = this.props
                        if (isFunction(onLoadUrlError)) {
                            onLoadUrlError()
                        }
                    })
                } else {
                    win.aMapInit()
                }
            };
        }

    }

    public render(): JSX.Element {
        const { width, height } = this.props
        return (
            <div className={`${prefix}map`} id={`${prefix}map`} style={{ height, width }} ref={(e) => this.node = e} />
        )
    }

    private initAMap = () => {
        const { onInit, initLatLng, onLocationAddr } = this.props
        const win: any = window
        win.aMapInit = () => {
            const map = new AMap.Map(`${prefix}map`, {
                center: initLatLng ? [initLatLng.lat, initLatLng.lng] : undefined,
                zoom: 12
            })
            if (isFunction(onInit)) {
                onInit(map)
            }
        }
    }

    private initTMap = () => {
        const { onLocationError, initLatLng, onLocationAddr, onInit } = this.props
        const win: any = window
        let dragendEventStatus = true
        win.tMapInit = async () => {
            const posLatLng = initLatLng ? new qq.maps.LatLng(initLatLng.lat, initLatLng.lng) : undefined
            const map = new qq.maps.Map(this.node, {
                zoom: 12,
                center: posLatLng
            })
            const geocoder = new qq.maps.Geocoder()
            geocoder.setComplete((result: any) => {
                if (isFunction(onLocationAddr)) {
                    onLocationAddr(result.detail)
                }
                if (dragendEventStatus) {
                    map.setCenter(result.detail.location)
                    const marker = new qq.maps.Marker({
                        map,
                        draggable: true,
                        position: result.detail.location
                    })
                    qq.maps.event.addListener(marker, 'dragend', (event: any) => {
                        const latLng = new qq.maps.LatLng(event.latLng.lat, event.latLng.lng)
                        geocoder.getAddress(latLng)
                    })
                    dragendEventStatus = false
                }
            })
            // tslint:disable-next-line: only-arrow-functions
            geocoder.setError(function () {
                alert('出错了，请输入正确的经纬度！！！')
            })
            if (window.location) {
                this.getLocation().then((data) => {
                    let lat = data.lat
                    let lng = data.lng
                    if (!browser.isMobile) {
                        lat = lat + 0.008081
                        lng = lng - 0.005184
                    }
                    const latLng = new qq.maps.LatLng(lat, lng)
                    geocoder.getAddress(latLng)
                }).catch(() => {
                    if (isFunction(onLocationError)) {
                        onLocationError()
                    }
                })
            } else {
                if (isFunction(onLocationAddr)) {
                    onLocationAddr({
                        lat: initLatLng ? initLatLng.lat : 39.916527,
                        lng: initLatLng ? initLatLng.lng : 116.397128
                    })
                }
            }
            if (isFunction(onInit)) {
                onInit(map)
            }
        }
    }

    private getScriptFile() {
        const { extendUrls, type, apiKey, urlParams } = this.props
        const urls = [mapUrl[type] + apiKey + (urlParams ? '&libraries=' + urlParams : '') + '&callback=tMapInit', ...(extendUrls || [])]
        switch (type) {
            case 'tMap': urls.push('https://3gimg.qq.com/lightmap/components/geolocation/geolocation.min.js'); break;
            case 'bMap': urls.push(''); break;
            default: urls.push(`https://webapi.amap.com/maps?v=1.4.15&key=${apiKey}&callback=aMapInit`);
        }
        const promiseAll = urls.map((i) => {
            return new Promise((resolve, reject) => {
                load(i, (err: any) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve()
                    }
                })
            })
        })
        return Promise.all(promiseAll)
    }

    /**
     *
     * 使用地图插件获得精准位置
     *
     */

    private getLocation(): Promise<any> {
        return new Promise((resolve, reject) => {
            const { apiKey, type, appName } = this.props
            if (type === 'tMap') {
                this.geolocation = new qq.maps.Geolocation(apiKey, appName || 'mukaMap')
                this.geolocation.getLocation((position: any) => {
                    resolve(position)
                }, (e: any) => {
                    reject(e)
                }, {
                    timeout: 8000
                })
                return
            }
        })
    }
}
