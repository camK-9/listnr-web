'use client';

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AppBar, Toolbar, Typography, Button, Stack, BottomNavigation, BottomNavigationAction, useMediaQuery, useTheme, Container, TextField, InputAdornment } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faMagnifyingGlass, faUser, faFeather, faHeadphones } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '@/context/AuthContext';

export const Navigation = () => {
    const pathname = usePathname();
    const router = useRouter();
    const theme = useTheme();
    const { user, isLoading } = useAuth();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const [searchQuery, setSearchQuery] = useState('');

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        } else {
            router.push('/search');
        }
    };

    const hiddenRoutes = ['/login', '/register'];

    const DESKTOP_NAV_ITEMS = [
        { label: 'Social feed', path: '/feed', icon: faFeather },
        { label: 'À écouter', path: '/queue', icon: faHeadphones },
        { label: user?.username || 'Profil', path: '/profile', icon: faUser },
    ];

    const MOBILE_NAV_ITEMS = [
        { label: 'Accueil', path: '/', icon: faHouse },
        { label: 'Social feed', path: '/feed', icon: faFeather },
        { label: 'À écouter', path: '/queue', icon: faHeadphones },
        { label: 'Recherche', path: '/search', icon: faMagnifyingGlass },
        { label: user?.username || 'Profil', path: '/profile', icon: faUser },
    ];

    if (isLoading || hiddenRoutes.includes(pathname)) {
        return null;
    }

    return (
        <>
            <AppBar
                position="sticky"
                sx={{
                    bgcolor: 'background.paper',
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    zIndex: (t) => t.zIndex.drawer + 1,
                }}
            >
                <Container maxWidth="lg">
                    <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
                        <Typography
                            variant="h2"
                            fontWeight="bold"
                            onClick={() => router.push('/')}
                            sx={{
                                cursor: 'pointer',
                                letterSpacing: 1.5,
                            }}
                        >
                            LISTNR
                        </Typography>

                        {!isMobile && <Stack spacing={1} direction="row" alignItems="center">
                            <Stack component="form" onSubmit={handleSearchSubmit}>
                                <TextField
                                    variant="outlined"
                                    size="small"
                                    placeholder="Rechercher"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    slotProps={{
                                        input: {
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <FontAwesomeIcon
                                                        className="search-icon"
                                                        icon={faMagnifyingGlass}
                                                    />
                                                </InputAdornment>
                                            ),
                                        },
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '20px',
                                            bgcolor: 'transparant',
                                            fontSize: '14px',
                                            '& .search-icon': {
                                                color: 'text.secondary',
                                                transition: 'color 0.2s ease-in-out',
                                            },
                                            '& input::placeholder': {
                                                color: 'text.secondary',
                                                opacity: 1,
                                                transition: 'color 0.2s ease-in-out',
                                            },
                                            '&:hover': {
                                                '& .search-icon': {
                                                    color: 'text.primary',
                                                },
                                                '& input::placeholder': {
                                                    color: 'text.primary',
                                                },
                                            },
                                            '&.Mui-focused': {
                                                bgcolor: 'background.paper',
                                                boxShadow: `0 0 0 2px ${theme.palette.primary.main}`,
                                            },
                                        },
                                    }}
                                />
                            </Stack>
                            {DESKTOP_NAV_ITEMS.map((item) => {
                                const isActive = pathname === item.path;
                                return <Button
                                    key={item.path}
                                    onClick={() => router.push(item.path)}
                                    startIcon={<FontAwesomeIcon icon={item.icon} style={{ fontSize: '15px' }} />}
                                    sx={{
                                        padding: '8px 20px',
                                        borderRadius: '20px',
                                        color: isActive
                                            ? 'primary.main'
                                            : 'text.secondary',
                                        fontWeight: isActive ? 'bold' : 'normal',
                                        bgcolor: isActive ? 'action.selected' : 'transparent',
                                        '&:hover': {
                                            bgcolor: 'action.selected',
                                            color: 'text.primary',
                                        },
                                    }}
                                >
                                    {item.label}
                                </Button>
                            })}
                        </Stack>}
                    </Toolbar>
                </Container>
            </AppBar>

            {isMobile && <Stack
                sx={{
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    zIndex: (t) => t.zIndex.drawer + 1,
                }}
            >
                <BottomNavigation
                    value={pathname}
                    onChange={(_, newPath) => router.push(newPath)}
                    sx={{
                        bgcolor: 'background.paper',
                        '& .MuiBottomNavigationAction-root': {
                            color: 'text.secondary',
                        },
                        '& .Mui-selected': {
                            color: 'primary.main',
                            fontWeight: 'bold',
                        },
                    }}
                >
                    {MOBILE_NAV_ITEMS.map((item) => {
                        const isActive = pathname === item.path;
                        return <BottomNavigationAction
                            key={item.path}
                            value={item.path}
                            icon={
                                <FontAwesomeIcon
                                    icon={item.icon}
                                    style={{ fontSize: '18px', marginBottom: '2px' }}
                                />
                            }
                            sx={{
                                borderTop: `1px solid ${isActive ? theme.palette.primary.main : theme.palette.divider}`,
                            }}
                        />
                    })}
                </BottomNavigation>
            </Stack>}
        </>
    );
};