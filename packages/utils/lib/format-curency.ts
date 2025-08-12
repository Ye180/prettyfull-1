export const formatMoney = (money: number, currency: string = 'S') => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency
    }).format(money);
};


export function formatCurrency_FR(
    value: number,
    currency: string = 'FCFA'
): string {
    return (
        new Intl.NumberFormat('fr-FR', {
            style: 'decimal',
            maximumFractionDigits: 0
        }).format(value) +
        ' ' +
        currency
    );
}