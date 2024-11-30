export function _formatDate(date, local, options)
{
    const localDate = new Date(date)

    const formattedDate = localDate.toLocaleDateString(local, options)

    return formattedDate
}