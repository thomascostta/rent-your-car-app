import styled from 'styled-components/native';
import theme from './theme';
import { DefaultTheme } from "styled-components";

type CustomTheme = typeof theme;

declare module 'styled-components/native' {
    export interface DefaultTheme extends CustomTheme {}
}