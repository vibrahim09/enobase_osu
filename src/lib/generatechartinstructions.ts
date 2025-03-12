export const generateInstructions = ( data: { labels: string, values: number }[] ) => {
    const chartData = data.map(item => ({
        label: item.label,
        value: item.value
    }));

    return `
    Create a line chart with the following data:
    ${JSON.stringify(chartData)}
    Create a bar chart with the following data:
    ${JSON.stringify(chartData)}
    Create a pie chart with the following data:
    ${JSON.stringify(chartData)}
    `

}