import { Stack, Typography } from "@mui/material"

export const TitleStat = ({ number, title }: { number: number, title: string }) => {
    return (
        <Stack alignItems="center">
            <Typography variant="h2">
                {number}
            </Typography>

            <Typography variant="caption" color="text.secondary">
                {title}
            </Typography>
        </Stack>
    )
}