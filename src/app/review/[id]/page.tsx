'use client';

import React, { useEffect, useState } from 'react';
import { Stack, Typography, Avatar, Rating, Divider, TextField, IconButton, Menu, MenuItem, useMediaQuery } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faComment, faShare, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { useParams, useRouter } from 'next/navigation';
import { reviewService } from '@/lib/reviewService';
import IReview from '@/interfaces/IReview';
import ILike from '@/interfaces/ILike';
import IComment from '@/interfaces/IComment';
import ICommentLike from '@/interfaces/ICommentLike';
import theme from '@/theme/theme';
import { MusicLoader } from '@/components/atoms/MusicLoader';

export default function ReviewPage() {
    const router = useRouter();
    const { user } = useAuth()
    const params = useParams();
    const id = params.id as string;

    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const [loading, setLoading] = useState(false);
    const [review, setReview] = useState<IReview>();
    const [likes, setLikes] = useState<ILike[]>();
    const [comments, setComments] = useState<IComment[]>();
    const [commentText, setCommentText] = useState('');
    const [expandedReplies, setExpandedReplies] = useState<string[]>([]);
    const [replyingToId, setReplyingToId] = useState<string | null>(null);
    const [replyText, setReplyText] = useState('');
    const [shareAnchorEl, setShareAnchorEl] = useState<null | HTMLElement>(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                const data = await reviewService.getReview(id)

                setReview(data)
                setLikes(data.likes)
                setComments(data.comments)
            } catch (error) {
                console.error('Erreur lors de la récupération des données de la release', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleToggleLike = async () => {
        if (!review || !likes) return;

        try {
            await reviewService.toggleLike(review.id);

            if (!user) return

            const hasLiked = likes.some((like) => like.userId === user.id);

            if (hasLiked) {
                setLikes(likes.filter((like) => like.userId !== user.id));
            } else {
                setLikes([...likes, { userId: user.id, reviewId: review.id } as any]);
            }
        } catch (error) {
            console.error("Erreur lors du like :", error);
        }
    };

    const handleToggleCommentLike = async (commentId: string) => {
        if (!review || !comments) return;

        try {
            await reviewService.toggleCommentLike(commentId);
            if (!user) return;

            setComments(comments.map((comment: IComment) => {
                if (comment.id === commentId) {
                    const likesArray = comment.likes || [];
                    const hasLiked = likesArray.some((like) => like.userId === user.id);

                    let updatedLikes;
                    if (hasLiked) {
                        updatedLikes = likesArray.filter((like) => like.userId !== user.id);
                    } else {
                        updatedLikes = [
                            ...likesArray,
                            {
                                id: Date.now().toString(),
                                userId: user.id,
                                commentId: commentId
                            } as ICommentLike
                        ];
                    }

                    return { ...comment, likes: updatedLikes };
                }
                return comment;
            }));
        } catch (error) {
            console.error("Erreur lors du like du commentaire :", error);
        }
    };

    const handleAddComment = async (e: React.FormEvent) => {
        if (!review || !comments) return;

        e.preventDefault();
        if (!commentText.trim() || !user) return;

        try {
            const res = await reviewService.addComment(review.id, commentText);

            setComments([...comments, res]);
            setCommentText('');
        } catch (error) {
            console.error("Erreur lors de la publication du commentaire :", error);
        }
    };

    const handleReplyComment = async (e: React.FormEvent, commentId: string) => {
        if (!review || !comments) return;

        e.preventDefault();
        if (!replyText.trim() || !user) return;

        try {
            const res = await reviewService.replyComment(review.id, commentId, replyText);

            setComments([...comments, res]);
            setReplyText('');
            setReplyingToId(null);
        } catch (error) {
            console.error("Erreur lors de la publication du commentaire :", error);
        }
    };

    const handleKeyDownAddComment = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleAddComment(e);
        }
    };

    const handleKeyDownReplyComment = (e: React.KeyboardEvent<HTMLDivElement>, commentId: string) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleReplyComment(e, commentId);
        }
    };

    const toggleReplies = (commentId: string) => {
        if (expandedReplies.includes(commentId)) {
            setExpandedReplies(expandedReplies.filter(id => id !== commentId));
        } else {
            setExpandedReplies([...expandedReplies, commentId]);
        }
    };

    const handleOpenShare = (event: React.MouseEvent<HTMLElement>) => {
        setShareAnchorEl(event.currentTarget);
    };

    const handleCloseShare = () => {
        setShareAnchorEl(null);
        setTimeout(() => setCopied(false), 300);
    };

    const handleCopyLink = async () => {
        try {
            const reviewUrl = window.location.href;
            await navigator.clipboard.writeText(reviewUrl);
            setCopied(true);
            setTimeout(() => {
                handleCloseShare();
            }, 1000);
        } catch (error) {
            console.error("Erreur lors de la copie du lien :", error);
        }
    };

    const handleNativeShare = async () => {
        if (!review) return;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: `Review de ${review.user.username}`,
                    text: `Découvre cette review sur ${review.release.title} - ${review.release.artist.name}`,
                    url: window.location.href,
                });
                handleCloseShare();
            } catch (error) {
                const isAbortError = error instanceof Error && error.name === 'AbortError';

                if (!isAbortError) {
                    console.error("Erreur de partage natif :", error);
                }
                handleCloseShare();
            }
        } else {
            handleCopyLink();
        }
    };

    const formatCount = (count: number) => {
        if (count >= 1000) {
            return (count / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
        }
        return count.toString();
    };

    const formatTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (seconds < 60) return "à l'instant";
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `il y a ${minutes}m`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `il y a ${hours}h`;
        const days = Math.floor(hours / 24);
        if (days < 30) return `il y a ${days}j`;
        const months = Math.floor(days / 30);
        if (months < 12) return `il y a ${months} mois`;
        const years = Math.floor(months / 12);
        return `il y a ${years} an${years > 1 ? 's' : ''}`;
    };

    const isLiked = user ? likes && likes.some((like) => like.userId === user.id) : false;

    return (
        <Stack position="relative" p="20px" bgcolor="background.paper" borderRadius="20px">
            {loading ? <MusicLoader /> : review && likes && comments && <Stack spacing={4}>
                <Stack
                    spacing={1}
                    direction="row"
                    alignItems="center"
                    width="fit-content"
                    onClick={() => router.push(`/user/${review.userId}`)}
                    sx={{ cursor: 'pointer' }}
                >
                    <Avatar
                        src={review.user.avatarUrl}
                        alt={review.user.username}
                        sx={{ width: 40, height: 40, fontWeight: 600 }}
                    >
                        {review.user.username?.charAt(0).toUpperCase()}
                    </Avatar>

                    <Typography variant='body1'>
                        {review.user.username}
                    </Typography>
                </Stack>

                <Stack spacing={2}>
                    <Stack spacing={1} direction="row" alignItems="center" justifyContent="space-between">
                        <Typography
                            variant='h2'
                            noWrap
                            onClick={() => router.push(`/release/${review.release.spotifyId}`)}
                            sx={{ cursor: 'pointer' }}
                        >
                            {review.release.title} - {review.release.artist.name}
                        </Typography>

                        <Typography variant='body1' color="text.secondary">
                            {review.release.releaseDate.slice(0, 4)}
                        </Typography>
                    </Stack>

                    <Rating
                        readOnly
                        value={review.rating}
                        precision={0.5}
                        size="large"
                        sx={{ color: 'primary.main' }}
                    />
                </Stack>

                <Stack spacing={2} direction="row">
                    {review.release.imageUrl &&
                        <Image
                            src={review.release.imageUrl}
                            alt={review.release.title}
                            width={isMobile ? 150 : 200}
                            height={isMobile ? 150 : 200}
                        />
                    }

                    <Typography
                        variant='body1'
                        whiteSpace="pre-line"
                        sx={{ wordBreak: 'break-word' }}
                    >
                        {review.comment}
                    </Typography>
                </Stack>

                <Divider />

                <Stack spacing={4} direction="row" alignItems="center">
                    <Stack
                        spacing={1}
                        direction="row"
                        alignItems="center"
                        sx={{
                            color: isLiked ? 'action.hover' : 'text.secondary',
                            cursor: 'pointer',
                            transition: 'transform 0.2s ease',
                            '&:hover': { color: 'action.hover', transform: 'translateY(-4px)' }
                        }}
                        onClick={handleToggleLike}
                    >
                        <FontAwesomeIcon icon={faHeart} size="lg" />

                        <Typography variant='body2' width="50px">
                            {formatCount(likes.length)}
                        </Typography>
                    </Stack>

                    <Stack
                        spacing={1}
                        direction="row"
                        alignItems="center"
                        color="secondary.main"
                    >
                        <FontAwesomeIcon icon={faComment} size="lg" />

                        <Typography variant='body2' width="50px">
                            {formatCount(comments.length)}
                        </Typography>
                    </Stack>

                    <Stack
                        spacing={1}
                        direction="row"
                        alignItems="center"
                        onClick={handleOpenShare}
                        sx={{
                            cursor: 'pointer',
                            color: 'text.secondary',
                            transition: 'transform 0.2s ease',
                            '&:hover': { color: 'text.primary', transform: 'translateY(-4px)' }
                        }}
                    >
                        <FontAwesomeIcon icon={faShare} size="lg" />
                    </Stack>

                    <Menu
                        anchorEl={shareAnchorEl}
                        open={Boolean(shareAnchorEl)}
                        onClose={handleCloseShare}
                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                        sx={{
                            '& .MuiPaper-root': {
                                borderRadius: '15px',
                                minWidth: '180px',
                            }
                        }}
                    >
                        {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
                            <MenuItem
                                onClick={handleNativeShare}
                                sx={{
                                    fontSize: '15px',
                                    p: '15px',
                                    '&:hover': { bgcolor: 'primary.main' }
                                }}
                            >
                                Partager...
                            </MenuItem>
                        )}
                        <MenuItem
                            onClick={handleCopyLink}
                            sx={{
                                fontSize: '15px',
                                p: '15px',
                                color: copied ? 'success.main' : 'inherit',
                                '&:hover': { bgcolor: 'primary.main' }
                            }}
                        >
                            {copied ? "Lien copié !" : "Copier le lien"}
                        </MenuItem>
                    </Menu>
                </Stack>

                <Stack spacing={3}>
                    <Typography variant='body2' fontWeight={600}>
                        Commentaires ({comments.length})
                    </Typography>

                    <TextField
                        fullWidth
                        size="medium"
                        placeholder="Écrire un commentaire..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        onKeyDown={(e) => handleKeyDownAddComment(e)}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                        slotProps={{
                            input: {
                                endAdornment: (
                                    <IconButton
                                        color="primary"
                                        disabled={!commentText.trim()}
                                        onClick={handleAddComment}
                                        sx={{ width: '30px', height: '30px' }}
                                    >
                                        <FontAwesomeIcon icon={faPaperPlane} style={{ width: '15px', height: '15px' }} />
                                    </IconButton>
                                ),
                            }
                        }}
                    />

                    <Stack spacing={2}>
                        {comments.length === 0 ? (
                            <Typography variant='body2' color="text.secondary" align="center">
                                Aucun commentaire pour le moment. Soyez le premier !
                            </Typography>
                        ) : (
                            comments.filter((c) => !c.parentId).map((comment) => (
                                <Stack
                                    key={comment.id}
                                    direction="row"
                                    spacing={1}
                                    p="10px"
                                >
                                    <Avatar
                                        src={comment.user?.avatarUrl}
                                        alt={comment.user?.username}
                                        onClick={() => router.push(`/user/${review.userId}`)}
                                        sx={{ width: 30, height: 30, fontWeight: 600, fontSize: '15px', cursor: 'pointer' }}
                                    >
                                        {comment.user?.username?.charAt(0).toUpperCase()}
                                    </Avatar>

                                    <Stack spacing={1} width="100%">
                                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                                            <Typography
                                                variant='body1'
                                                onClick={() => router.push(`/user/${review.userId}`)}
                                                sx={{ cursor: 'pointer' }}
                                            >
                                                {comment.user?.username}
                                            </Typography>

                                            <Typography variant='caption' color="text.secondary">
                                                {formatTimeAgo(comment.createdAt)}
                                            </Typography>
                                        </Stack>

                                        <Typography variant='body1'>
                                            {comment.content}
                                        </Typography>

                                        <Stack direction="row" spacing={2} alignItems="center">
                                            <Typography
                                                variant='caption'
                                                onClick={() => handleToggleCommentLike(comment.id)}
                                                sx={{
                                                    cursor: 'pointer',
                                                    color: user && comment.likes?.some((like) => like.userId === user.id) ?
                                                        'action.hover' : 'text.secondary',
                                                    fontWeight: 600,
                                                    '&:hover': { color: 'primary.main' }
                                                }}
                                            >
                                                {comment.likes?.length > 0 ? `(${comment.likes.length})` : ''} J'aime
                                            </Typography>

                                            <Typography
                                                variant='caption'
                                                onClick={() => setReplyingToId(replyingToId === comment.id ? null : comment.id)}
                                                sx={{
                                                    cursor: 'pointer',
                                                    color: replyingToId === comment.id ? 'secondary.main' : 'text.secondary',
                                                    fontWeight: 600,
                                                    '&:hover': { color: 'primary.main' }
                                                }}
                                            >
                                                Répondre
                                            </Typography>
                                        </Stack>

                                        {replyingToId === comment.id && user && (
                                            <Stack direction="row" spacing={1}>
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    placeholder={`Répondre à ${comment.user?.username}...`}
                                                    value={replyText}
                                                    onChange={(e) => setReplyText(e.target.value)}
                                                    onKeyDown={(e) => handleKeyDownReplyComment(e, comment.id)}
                                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                                                    slotProps={{
                                                        input: {
                                                            endAdornment: (
                                                                <IconButton
                                                                    color="primary"
                                                                    disabled={!replyText.trim()}
                                                                    onClick={(e) => handleReplyComment(e, comment.id)}
                                                                    sx={{ width: '30px', height: '30px' }}
                                                                >
                                                                    <FontAwesomeIcon
                                                                        icon={faPaperPlane}
                                                                        style={{ width: '15px', height: '15px' }}
                                                                    />
                                                                </IconButton>
                                                            ),
                                                        }
                                                    }}
                                                />
                                            </Stack>
                                        )}

                                        {comments.filter((c) => c.parentId === comment.id).length > 0 && (
                                            <Typography
                                                variant='caption'
                                                onClick={() => toggleReplies(comment.id)}
                                                sx={{
                                                    cursor: 'pointer',
                                                    color: 'text.secondary',
                                                    fontWeight: 500,
                                                    '&:hover': { color: 'primary.main' }
                                                }}
                                            >
                                                {expandedReplies.includes(comment.id)
                                                    ? "Masquer les réponses"
                                                    : `Voir ${comments.filter((c) => c.parentId === comment.id).length} réponse(s)`}
                                            </Typography>
                                        )}

                                        {expandedReplies.includes(comment.id) && (
                                            <Stack
                                                spacing={1}
                                                borderLeft="2px solid"
                                                borderColor="text.secondary"
                                            >
                                                {comments.filter((c) => c.parentId === comment.id).map((reply) => (
                                                    <Stack key={reply.id} direction="row" spacing={1} p="10px">
                                                        <Avatar
                                                            src={reply.user?.avatarUrl}
                                                            alt={reply.user?.username}
                                                            onClick={() => router.push(`/user/${review.userId}`)}
                                                            sx={{
                                                                width: 22,
                                                                height: 22,
                                                                fontWeight: 600,
                                                                fontSize: '10px',
                                                                cursor: 'pointer'
                                                            }}
                                                        >
                                                            {reply.user?.username?.charAt(0).toUpperCase()}
                                                        </Avatar>

                                                        <Stack spacing={0.5} width="100%">
                                                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                                <Typography
                                                                    variant='caption'
                                                                    onClick={() => router.push(`/user/${review.userId}`)}
                                                                    sx={{ cursor: 'pointer' }}
                                                                >
                                                                    {reply.user?.username}
                                                                </Typography>

                                                                <Typography variant='caption' color="text.secondary">
                                                                    {formatTimeAgo(reply.createdAt)}
                                                                </Typography>
                                                            </Stack>

                                                            <Typography variant='caption'>
                                                                {reply.content}
                                                            </Typography>

                                                            <Typography
                                                                variant='caption'
                                                                onClick={() => handleToggleCommentLike(reply.id)}
                                                                sx={{
                                                                    cursor: 'pointer',
                                                                    color: user && reply.likes?.some((l) => l.userId === user.id) ?
                                                                        'action.hover' : 'text.secondary',
                                                                    fontWeight: 600,
                                                                    '&:hover': { color: 'primary.main' }
                                                                }}
                                                            >
                                                                {reply.likes?.length > 0 ? `(${reply.likes.length})` : ''} J'aime
                                                            </Typography>
                                                        </Stack>
                                                    </Stack>
                                                ))}
                                            </Stack>
                                        )}
                                    </Stack>
                                </Stack>
                            ))
                        )}
                    </Stack>
                </Stack>
            </Stack>}
        </Stack>
    );
}