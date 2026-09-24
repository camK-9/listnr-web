import IArtist from "@/interfaces/IArtist";
import { artistService } from "@/lib/artistService";
import { faUserMinus, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Avatar, IconButton, Skeleton, Stack, Tooltip, Typography, Zoom } from "@mui/material"
import { useEffect, useState } from "react";

export const PopularArtists = (item: IArtist) => {
    const [profile, setProfile] = useState<IArtist>();
    const [isFollowing, setIsFollowing] = useState<Boolean>(false);
    const [followersCount, setFollowersCount] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            const data = await artistService.getProfile(item.spotifyId);
            setProfile(data);
            setIsFollowing(data.isFollowing);
            setFollowersCount(data.stats.followersCount);
        };

        fetchProfile();
    }, [item.id]);

    const handleFollowClick = async () => {
        setLoading(true);
        try {
            const data = await artistService.toggleFollow(item.spotifyId)
            setIsFollowing(data.isFollowing);
            setFollowersCount((prev) => (data.isFollowing === true ? prev + 1 : prev - 1));
        } catch (error) {
            console.error("Erreur lors de l'action follow/unfollow", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Stack>
            {!profile ? <PopularArtistsSkeleton /> : <Stack direction="row" justifyContent="space-between">
                <Stack spacing={1}>
                    <Stack spacing={1} direction='row' alignItems="center">
                        <Avatar
                            src={profile.imageUrl}
                            alt={profile.name}
                            sx={{ width: 30, height: 30, fontWeight: 600 }}
                        >
                            {profile.name?.charAt(0).toUpperCase()}
                        </Avatar>

                        <Typography variant="body1">
                            {profile.name}
                        </Typography>
                    </Stack>

                    {profile.stats && <Typography variant="caption" color="text.secondary">
                        {followersCount} {followersCount > 1 ?
                            "followers" : "follower"} • {profile.stats.releasesCount} {profile.stats.releasesCount > 1 ?
                                "titres" : "titre"}
                    </Typography>}
                </Stack>

                <Tooltip
                    title={isFollowing ? "Ne plus suivre" : "Suivre l'utilisateur"}
                    slots={{
                        transition: Zoom,
                    }}
                >
                    <IconButton
                        disabled={loading}
                        onClick={handleFollowClick}
                        sx={{
                            color: "text.primary",
                            width: '50px',
                            height: '50px',
                            borderRadius: '50px',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                                color: isFollowing ? 'error.main' : 'primary.main',
                            }
                        }}>
                        <FontAwesomeIcon
                            icon={isFollowing ? faUserMinus : faUserPlus}
                            style={{
                                width: '20px',
                                height: '20px'
                            }} />
                    </IconButton>
                </Tooltip>
            </Stack>}
        </Stack>
    );
};

const PopularArtistsSkeleton = () => {
    return (
        <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack spacing={1}>
                <Stack spacing={1} direction="row" alignItems="center">
                    <Skeleton variant="circular" width={30} height={30} />
                    <Skeleton variant="text" width={100} height={24} />
                </Stack>

                <Skeleton variant="text" width={140} height={16} />
            </Stack>

            <Skeleton variant="circular" width={50} height={50} />
        </Stack>
    )
}