import { faClockRotateLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Stack, Typography } from '@mui/material';

export const EmptyHistory = () => {
    return (
        <Stack
            spacing={2}
            alignItems="center"
            sx={{
                padding: '50px',
                textAlign: 'center',
                borderRadius: '16px',
                border: '1px dashed',
                borderColor: 'divider',
            }}
        >
            <Stack
                sx={{
                    width: '70px',
                    height: '70px',
                    borderRadius: '60px',
                    bgcolor: 'background.paper',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'primary.main',
                }}
            >
                <FontAwesomeIcon icon={faClockRotateLeft} size="2x" />
            </Stack>

            <Typography variant="h2" fontWeight="bold">
                Aucun historique
            </Typography>

            <Typography variant="body2" color="text.secondary" maxWidth="400px">
                Tes morceaux et albums marqués comme écoutés apparaîtront ici.
            </Typography>
        </Stack>
    );
};