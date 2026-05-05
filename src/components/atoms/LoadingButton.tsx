import { Button, ButtonProps, CircularProgress } from '@mui/material';

interface LoadingButtonProps extends ButtonProps {
    isLoading?: boolean;
}

export const LoadingButton = ({
    isLoading,
    children,
    ...props
}: LoadingButtonProps) => {
    return (
        <Button
            {...props}
            loading={isLoading}
            loadingIndicator="Loading…"
            sx={{
                borderRadius: '30px',
                ...props.sx,
            }}
        >
            {children}
        </Button>
    );
};