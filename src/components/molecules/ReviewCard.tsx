import React, { useState } from 'react';
import { Avatar, Button, Divider, IconButton, Menu, MenuItem, Rating, Stack, TextField, Typography } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faHeart, faPaperPlane, faShare } from '@fortawesome/free-solid-svg-icons';
import IReview from '@/interfaces/IReview';
import Image from 'next/image';
import { reviewService } from '@/lib/reviewService';
import { useAuth } from '@/context/AuthContext';
import IComment from '@/interfaces/IComment';
import ICommentLike from '@/interfaces/ICommentLike';
import { useRouter } from 'next/navigation';

export const ReviewCard = (item: IReview) => {
    const { user } = useAuth();
    const router = useRouter();

    const [likes, setLikes] = useState(item.likes || []);
    const [comments, setComments] = useState(item.comments || []);
    const [commentText, setCommentText] = useState('');
    const [showComments, setShowComments] = useState(false);
    const [expandedReplies, setExpandedReplies] = useState<string[]>([]);
    const [replyingToId, setReplyingToId] = useState<string | null>(null);
    const [replyText, setReplyText] = useState('');
    const [shareAnchorEl, setShareAnchorEl] = useState<null | HTMLElement>(null);
    const [copied, setCopied] = useState(false);

    const handleToggleLike = async () => {
        try {
            await reviewService.toggleLike(item.id);

            if (!user) return

            const hasLiked = likes.some((like) => like.userId === user.id);

            if (hasLiked) {
                setLikes(likes.filter((like) => like.userId !== user.id));
            } else {
                setLikes([...likes, { userId: user.id, reviewId: item.id } as any]);
            }
        } catch (error) {
            console.error("Erreur lors du like :", error);
        }
    };

    const handleToggleCommentLike = async (commentId: string) => {
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
        e.preventDefault();
        if (!commentText.trim() || !user) return;

        try {
            const res = await reviewService.addComment(item.id, commentText);

            setComments([...comments, res]);
            setCommentText('');
        } catch (error) {
            console.error("Erreur lors de la publication du commentaire :", error);
        }
    };

    const handleReplyComment = async (e: React.FormEvent, commentId: string) => {
        e.preventDefault();
        if (!replyText.trim() || !user) return;

        try {
            const res = await reviewService.replyComment(item.id, commentId, replyText);

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
            const reviewUrl = `${window.location.origin}/review/${item.id}`;
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
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `Review de ${item.user.username}`,
                    text: `Découvre cette review sur ${item.release.title} - ${item.release.artist.name}`,
                    url: `${window.location.origin}/review/${item.id}`,
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

    const isLiked = user ? likes.some((like) => like.userId === user.id) : false;

    return (
        <Stack
            spacing={2}
            position="relative"
            p="20px"
            bgcolor="background.paper"
            borderRadius="15px"
        >
            <Stack
                spacing={1}
                direction="row"
                alignItems="center"
                width="fit-content"
                onClick={() => router.push(`/user/${item.userId}`)}
                sx={{ cursor: 'pointer' }}
            >
                <Avatar
                    src={item.user.avatarUrl}
                    alt={item.user.username}
                    sx={{ width: 30, height: 30, fontWeight: 600 }}
                >
                    {item.user.username?.charAt(0).toUpperCase()}
                </Avatar>

                <Typography variant='caption' color="text.secondary">
                    {item.user.username}
                </Typography>
            </Stack>

            <Stack
                spacing={1}
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                onClick={() => router.push(`/release/${item.release.spotifyId}`)}
                sx={{ cursor: 'pointer' }}
            >
                <Typography variant='body1' noWrap>
                    {item.release.title} - {item.release.artist.name}
                </Typography>

                <Typography variant='caption' color="text.secondary">
                    {item.release.releaseDate.slice(0, 4)}
                </Typography>
            </Stack>

            <Rating
                readOnly
                defaultValue={item.rating}
                precision={0.5}
                size="small"
                sx={{ color: 'primary.main' }}
            />

            <Stack spacing={1} direction="row" onClick={() => router.push(`/review/${item.id}`)} sx={{ cursor: 'pointer' }}>
                {item.release.imageUrl &&
                    <Image src={item.release.imageUrl} alt={item.release.title} width={100} height={100} />
                }

                <Typography
                    variant='caption'
                    whiteSpace="pre-line"
                    sx={{ wordBreak: 'break-word' }}
                >
                    {item.comment}
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
                        transition: 'transform 0.2s ease, background-color 0.2s ease',
                        '&:hover': {
                            color: 'action.hover',
                            transform: 'translateY(-4px)',
                        }
                    }}
                    onClick={handleToggleLike}
                >
                    <FontAwesomeIcon icon={faHeart} />

                    <Typography variant='caption' width="50px">
                        {formatCount(likes.length)}
                    </Typography>
                </Stack>

                <Stack
                    spacing={1}
                    direction="row"
                    alignItems="center"
                    sx={{
                        color: showComments ? 'secondary.main' : 'text.secondary',
                        cursor: 'pointer',
                        transition: 'transform 0.2s ease, background-color 0.2s ease',
                        '&:hover': {
                            color: 'secondary.main',
                            transform: 'translateY(-4px)',
                        }
                    }}
                    onClick={() => setShowComments(!showComments)}
                >
                    <FontAwesomeIcon icon={faComment} />

                    <Typography variant='caption' width="50px">
                        {formatCount(comments.length)}
                    </Typography>
                </Stack>

                <Stack
                    spacing={1}
                    direction="row"
                    alignItems="center"
                    onClick={handleOpenShare}
                    sx={{
                        color: 'text.secondary',
                        cursor: 'pointer',
                        transition: 'transform 0.2s ease, background-color 0.2s ease',
                        '&:hover': {
                            color: 'text.primary',
                            transform: 'translateY(-4px)',
                        }
                    }}
                >
                    <FontAwesomeIcon icon={faShare} />
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

            {showComments && <Stack spacing={2}>
                <TextField
                    fullWidth
                    size="small"
                    placeholder="Écrire un commentaire..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onKeyDown={handleKeyDownAddComment}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                    slotProps={{
                        input: {
                            endAdornment: (
                                <IconButton
                                    color="primary"
                                    disabled={!commentText.trim()}
                                    onClick={handleAddComment}
                                    sx={{
                                        width: '30px',
                                        height: '30px',
                                    }}
                                >
                                    <FontAwesomeIcon icon={faPaperPlane} style={{ width: '15px', height: '15px' }} />
                                </IconButton>
                            ),
                        }
                    }}
                />

                <Stack spacing={1}>
                    {comments.length === 0 ? <Typography variant='caption' color="text.secondary" align="center">
                        Aucun commentaire pour le moment. Soyez le premier !
                    </Typography> : comments.filter((c: IComment) => !c.parentId).map((comment: IComment) => (
                        <Stack
                            key={comment.id}
                            direction="row"
                            spacing={1}
                            p="10px"
                        >
                            <Avatar
                                src={comment.user?.avatarUrl}
                                alt={comment.user?.username}
                                sx={{ width: 20, height: 20, fontWeight: 600, fontSize: '12px' }}
                            >
                                {comment.user?.username?.charAt(0).toUpperCase()}
                            </Avatar>

                            <Stack spacing={1} width="100%">
                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                    <Typography variant='caption' fontWeight={600}>
                                        {comment.user?.username}
                                    </Typography>

                                    <Typography variant='caption' color="text.secondary">
                                        {formatTimeAgo(comment.createdAt)}
                                    </Typography>
                                </Stack>
                                <Typography variant='caption'>
                                    {comment.content}
                                </Typography>

                                <Stack direction="row" spacing={1} alignItems="center">
                                    <Typography
                                        variant='caption'
                                        onClick={() => handleToggleCommentLike(comment.id)}
                                        sx={{
                                            cursor: 'pointer',
                                            color: user && comment.likes.some((like) => like.userId === user.id) ?
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
                                            color: replyingToId ? 'secondary.main' : 'text.secondary',
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
                                                            sx={{
                                                                width: '30px',
                                                                height: '30px',
                                                            }}
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

                                {comments.filter((c: IComment) => c.parentId === comment.id).length > 0 && <Typography
                                    variant='caption'
                                    onClick={() => toggleReplies(comment.id)}
                                    sx={{
                                        cursor: 'pointer',
                                        color: 'text.secondary',
                                        '&:hover': { color: 'primary.main' }
                                    }}
                                >
                                    {expandedReplies.includes(comment.id)
                                        ? "Masquer les réponses"
                                        : `Voir ${comments.filter((c: IComment) => c.parentId === comment.id).length}
                                        réponse${comments.filter((c: IComment) => c.parentId === comment.id).length > 1 ? 's' : ''}`}
                                </Typography>
                                }

                                {expandedReplies.includes(comment.id) &&
                                    comments.filter((c: IComment) => c.parentId === comment.id).length > 0 && <Stack
                                        spacing={1}
                                        borderLeft="2px solid"
                                        borderColor="text.secondary"
                                    >
                                        {comments.filter((c: IComment) => c.parentId === comment.id).map((reply: IComment) => <Stack
                                            key={reply.id}
                                            direction="row"
                                            spacing={1}
                                            p="10px"
                                        >
                                            <Avatar
                                                src={reply.user?.avatarUrl}
                                                alt={reply.user?.username}
                                                sx={{ width: 15, height: 15, fontWeight: 600, fontSize: '8px' }}
                                            >
                                                {reply.user?.username?.charAt(0).toUpperCase()}
                                            </Avatar>

                                            <Stack spacing={1} width="100%">
                                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                    <Typography variant='caption' fontWeight={600}>
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
                                                        color: user && reply.likes.some((like) => like.userId === user.id) ?
                                                            'action.hover' : 'text.secondary',
                                                        fontWeight: 600,
                                                        fontSize: '10px',
                                                        '&:hover': { color: 'primary.main' }
                                                    }}
                                                >
                                                    {reply.likes?.length > 0 ? `(${reply.likes.length})` : ''} J'aime
                                                </Typography>
                                            </Stack>
                                        </Stack>
                                        )}
                                    </Stack>}
                            </Stack>
                        </Stack>
                    ))}
                </Stack>
            </Stack>}
        </Stack>
    );
};