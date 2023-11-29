import { formatNumber } from "react-native-currency-input";


export const formattedCurrencyBRL = (r: number) => {
    const formattedValue = formatNumber(r, {
        separator: ',',
        prefix: 'R$ ',
        precision: 2,
        delimiter: '.',
        signPosition: 'beforePrefix',
    });

    return formattedValue;
}