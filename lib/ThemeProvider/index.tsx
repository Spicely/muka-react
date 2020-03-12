import React, { Component, createContext } from 'react'
import { ThemeProvider as StyledThemeProvider, createGlobalStyle } from 'styled-components'
import { Color, ThemeData, getUnit } from '../utils'

const globalTheme = new ThemeData()

export const { Provider, Consumer } = createContext({
    theme: globalTheme
})

interface IThemeProviderProps {
    theme?: ThemeData
}

interface IStyledProps {
    theme: ThemeData
}

const GlobalStyle = createGlobalStyle<IStyledProps>`
    html {
        font-size: 20px;
    }

    body {
        padding: 0;
        margin: 0;
    }

    ul,
    li,
    dl {
        padding: 0;
        margin: 0;
        list-style: none;
    }
    
    a {
        text-decoration: none;
        color: initial;
    }

    * {
        box-sizing: border-box;
        font-size: ${({theme}) => getUnit(theme.fontSize)};
    }

    svg {
        font-size: inherit;
    }

    @media screen and (min-width: 750px) {
        ::-webkit-scrollbar {
            width: ${() => getUnit(4)};
            height: ${() => getUnit(4)};
        }

        ::-webkit-scrollbar-button {
            display: none;
        }

        ::-webkit-scrollbar-thumb {
            border-radius: ${({ theme }) => theme.dividerColor.toString()};
            background: ${({ theme }) => Color.setOpacity(theme.primarySwatch, 0.8).toString()};
        }

        ::-webkit-scrollbar-track {
            width: ${() => getUnit(6)};
            height: ${() => getUnit(6)};
        }
    }

    .transition {
        transition: all 0.5s;
    }

    .flex {
        display: flex;
    }

    .flex_justify {
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .flex_column {
        display: flex;
        flex-direction: column;
    }

    .flex_center {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .flex_right {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-end;
    }

    .flex_bottom {
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
    }

    .flex_1 {
        flex: 1;
    }

    .mk_divider {
        position: relative;

        &::after {
            content: "";
            position: absolute;
            height: ${() => getUnit(1)};
            width: 100%;
            background: ${({ theme }) => theme.dividerColor.toString()};
            transform: scaleY(0.5);
            bottom: 0;
            left: 0;
        }
    }

    .mk_divider_right {
        position: relative;

        &::after {
            content: "";
            position: absolute;
            height: 100%;
            width: ${() => getUnit(1)};
            background: ${({ theme }) => theme.dividerColor.toString()};
            transform: scaleX(0.5);
            top: 0;
            right: 0;
        }
    }

    .mk_divider_top {
        position: relative;

        &::after {
            content: "";
            position: absolute;
            height: ${() => getUnit(1)};
            width: 100%;
            background: ${({ theme }) => theme.dividerColor.toString()};
            transform: scaleY(0.5);
            top: 0;
            left: 0;
        }
    }

    .mk_fixed {
        position: -webkit-sticky;
        position: fixed;
        width: 100%;
    }
`

export default class ThemeProvider extends Component<IThemeProviderProps, any> {
    public render(): JSX.Element {
        const { children, theme } = this.props
        const thmeData = theme || globalTheme
        return (
            <Provider
                value={{
                    theme: thmeData
                }}
            >
                <StyledThemeProvider theme={thmeData}>
                    <GlobalStyle />
                    {children}
                </StyledThemeProvider>
            </Provider>
        )
    }
}