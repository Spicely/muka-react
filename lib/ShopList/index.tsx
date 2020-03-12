import React, { Component } from 'react'
import styled from 'styled-components'
import Card from '../Card'
import Icon from '../Icon'
import { getUnit } from '../utils'

interface IShopListDataProps {
    imgUrl?: string
    title?: string
    describe?: string
    price?: number
}

type IBtnType = ''

interface IShopListProps {
    data: IShopListDataProps[]
    columnNum?: number
    btnType?: IBtnType
}

const ShopListView = styled.div``

const ShopListTitle = styled.div`
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: ${getUnit(14)};
    line-height: ${getUnit(20)};
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    color: #000;
`

const ShopListDes = styled.div`
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height:  ${getUnit(16)};
    color: #999;
    word-break: break-all;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
`

const ShopListPriceInfo = styled.div`
    color: rgb(255, 68, 68);
    height: ${getUnit(30)};
`
const ShopListPriceTag = styled.span`
    position: relative;
`

const ShopListPrice = styled.span`
    font-size: ${getUnit(14)};
`

const ShopListBtn = styled.div`

`

export default class ShopList extends Component<IShopListProps, any> {

    public static defaultProps: IShopListProps = {
        data: [],
    }

    public render(): JSX.Element {
        const { data, columnNum } = this.props
        return (
            <ShopListView className="">
                {
                    data.map((i, index) => {
                        return (
                            <Card
                                source={i.imgUrl}
                                key={index}
                                style={{
                                    width: `${100 / (columnNum || 2)}%`,
                                    display: 'inline-block'
                                }}
                            >
                                <ShopListTitle>{i.title}</ShopListTitle>
                                <ShopListDes>{i.describe}</ShopListDes>
                                <ShopListPriceInfo className="flex_justify">
                                    <div className="flex">
                                        <div className="flex_1">
                                            <ShopListPriceTag>￥</ShopListPriceTag>
                                            <ShopListPrice>{i.price}</ShopListPrice>
                                        </div>
                                        <ShopListBtn>
                                            <Icon icon="ios-cart" />
                                        </ShopListBtn>
                                    </div>
                                </ShopListPriceInfo>
                            </Card>
                        )
                    })
                }
            </ShopListView>
        )
    }

}