'use client';

import { MusicLoader } from "@/components/atoms/MusicLoader";
import { TitleStat } from "@/components/atoms/TitleStat";
import FavTab from "@/components/organisms/FavTab";
import { useAuth } from "@/context/AuthContext";
import IUser from "@/interfaces/IUser";
import { userService } from "@/lib/userService";
import { Avatar, Button, Stack, Typography } from "@mui/material";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function UserPage() {
    const { user } = useAuth();
    const params = useParams();
    const id = params.id as string;

    const [loading, setLoading] = useState(false)
    const [profile, setProfile] = useState<IUser>()
    const [isFollowing, setIsFollowing] = useState<Boolean>(false);
    const [followersCount, setFollowersCount] = useState(0);

    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                if (user && user.id === id) {
                    const data = await userService.getProfile()

                    setProfile(data);
                    setIsFollowing(data.isFollowing)
                    setFollowersCount(data.stats.followersCount)
                } else {
                    const data = await userService.getUserProfile(id)

                    setProfile(data);
                    setIsFollowing(data.isFollowing)
                    setFollowersCount(data.stats.followersCount)
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des données de l'utilisateur", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, user]);

    const handleFollowClick = async () => {
        try {
            if (profile) {
                const data = await userService.toggleFollow(profile.id)
                setIsFollowing(data.isFollowing);
                setFollowersCount((prev) => (data.isFollowing === true ? prev + 1 : prev - 1));
            }
        } catch (error) {
            console.error("Erreur lors de l'action follow/unfollow", error);
        }
    };

    return (
        <Stack spacing={4} mt="50px">
            {loading ? <MusicLoader /> : profile && profile.stats && <Stack spacing={4} width="100%">
                <Stack spacing={4} direction="row" justifyContent="space-between" alignItems="flex-start">
                    <Stack spacing={4} direction="row" alignItems="center">
                        <Avatar
                            src={profile.avatarUrl}
                            alt={profile.username}
                            sx={{ width: 150, height: 150, fontWeight: 600 }}
                        >
                            {profile.username.charAt(0).toUpperCase()}
                        </Avatar>


                        <Stack spacing={1}>
                            <Typography variant='h2'>
                                {profile.username}
                            </Typography>

                            <Typography variant="caption">
                                {profile.bio}
                            </Typography>

                            <Typography variant='caption' color="text.secondary">
                                {followersCount} {followersCount <= 1 ? "suit" :
                                    "suivent"} • {profile.stats.reviewsCount} {profile.stats.reviewsCount <= 1 ?
                                        "review" : "reviews"}
                            </Typography>
                        </Stack>
                    </Stack>

                    {user && user.id === id ? <Button
                        variant="contained"
                        onClick={handleFollowClick}
                        sx={{
                            minWidth: '120px',
                            borderRadius: '30px',
                            bgcolor: 'primary.main'
                        }}
                    >
                        Modifier le profil
                    </Button> : <Button
                        variant="contained"
                        onClick={handleFollowClick}
                        sx={{
                            minWidth: '120px',
                            borderRadius: '30px',
                            bgcolor: isFollowing ? "error.main" : "primary.main"
                        }}
                    >
                        {isFollowing ? "Ne plus suivre" : "Suivre"}
                    </Button>}
                </Stack>

                <Stack spacing={4} direction="row">
                    <TitleStat
                        number={profile.stats.releasesListenedCount}
                        title={profile.stats.releasesListenedCount <= 1 ? "écoute" : "écoutes"}
                    />

                    <TitleStat
                        number={profile.stats.artistsListenedCount}
                        title={profile.stats.artistsListenedCount <= 1 ? "artiste" : "artistes"}
                    />

                    <TitleStat
                        number={profile.stats.albumsListenedCount}
                        title={profile.stats.albumsListenedCount <= 1 ? "album" : "albums"}
                    />

                    <TitleStat
                        number={profile.stats.streakCount}
                        title={profile.stats.streakCount <= 1 ? "jour de suite" : "jours de suite"}
                    />
                </Stack>

                <FavTab profile={profile} id={id} />
            </Stack>}
        </Stack>
    )
}