import { createGlobalStyle } from 'styled-components'
import ThemeData from '../utils/ThemeData'
import Color from '../utils/Color'

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

    * {
        box-sizing: border-box;
        font-size: ${({ theme }) => 12 * theme.ratio + theme.unit};
    }

    svg {
        font-size: inherit;
    }

    @media screen and (min-width: 750px) {
        ::-webkit-scrollbar {
            width: ${({ theme }) => 4 * theme.ratio + theme.unit};
            height: ${({ theme }) => 4 * theme.ratio + theme.unit};
        }

        ::-webkit-scrollbar-button {
            display: none;
        }

        ::-webkit-scrollbar-thumb {
            border-radius: ${({ theme }) => theme.dividerColor.toString()};
            background: ${({ theme }) => Color.setOpacity(theme.primarySwatch, 0.8).toString()};
        }

        ::-webkit-scrollbar-track {
            width: ${({ theme }) => 6 * theme.ratio + theme.unit};
            height: ${({ theme }) => 6 * theme.ratio + theme.unit};
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
            height: ${({ theme }) => 1 * theme.ratio + theme.unit};
            width: 100%;
            background: ${({ theme }): any => theme.dividerColor};
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
            width: ${props => 1 * props.theme.ratio + props.theme.unit};
            background: ${props => props.theme.dividerColor.toString()};
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
            height: ${props => 1 * props.theme.ratio + props.theme.unit};
            width: 100%;
            background: ${props => props.theme.dividerColor.toString()};
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

export default GlobalStyle