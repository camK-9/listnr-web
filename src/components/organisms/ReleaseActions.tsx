import { Stack, Typography, IconButton, useMediaQuery } from '@mui/material';
import { faCircleCheck, faCircleMinus, faCirclePlus, faCircleXmark, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReviewForm } from '../molecules/ReviewForm';
import IRelease from '@/interfaces/IRelease';
import theme from '@/theme/theme';
import IReview from '@/interfaces/IReview';

export const ReleaseActions = ({ release, review, onToggleQueue, onToggleHistory }:
    {
        release: IRelease,
        review: IReview
        onToggleQueue: (release: IRelease) => void,
        onToggleHistory: (release: IRelease, type: string) => void
    }) => {
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));


    return (
        <Stack spacing={4} width="100%">
            <Stack spacing={2} direction="row">
                {!release.isInHistory && <Stack spacing={1} alignItems="center">
                    <IconButton
                        onClick={() => onToggleQueue(release)}
                        sx={{
                            color: release.isInQueue ? 'primary.main' : 'text.secondary',
                            width: isMobile ? '50px' : '80px',
                            height: isMobile ? '50px' : '80px',
                            borderRadius: '50px',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                                color: 'primary.main'
                            }
                        }}
                    >
                        <FontAwesomeIcon
                            icon={release.isInQueue ? faCircleMinus : faCirclePlus}
                            style={{
                                width: isMobile ? '30px' : '50px',
                                height: isMobile ? '30px' : '50px',
                            }}
                        />
                    </IconButton>

                    <Typography variant={isMobile ? 'caption' : 'body1'}>
                        File d'attente
                    </Typography>
                </Stack>}

                <Stack spacing={1} alignItems="center">
                    <IconButton
                        onClick={() => onToggleHistory(release, 'album')}
                        sx={{
                            color: release.isInHistory ? 'primary.main' : 'text.secondary',
                            width: isMobile ? '50px' : '80px',
                            height: isMobile ? '50px' : '80px',
                            borderRadius: '50px',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                                color: 'primary.main'
                            }
                        }}
                    >
                        <FontAwesomeIcon
                            icon={release.isInHistory ? faCircleXmark : faCircleCheck}
                            style={{
                                width: isMobile ? '30px' : '50px',
                                height: isMobile ? '30px' : '50px',
                            }}
                        />
                    </IconButton>

                    <Typography variant={isMobile ? 'caption' : 'body1'}>
                        Écouté
                    </Typography>
                </Stack>
            </Stack>

            <ReviewForm releaseId={release.spotifyId} review={review} />
        </Stack>
    );
};