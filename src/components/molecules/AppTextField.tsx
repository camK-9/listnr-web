import React from 'react';
import { TextField, TextFieldProps, InputAdornment } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import theme from '@/theme/theme';

type AppTextFieldProps = TextFieldProps & {
    icon?: IconDefinition;
};

export const AppTextField = ({ icon, ...props }: AppTextFieldProps) => {
    return (
        <TextField
            fullWidth
            slotProps={{
                input: {
                    startAdornment: (
                        icon ? <InputAdornment position="start">
                            <FontAwesomeIcon
                                icon={icon}
                                color={theme.palette.text.secondary}
                            />
                        </InputAdornment> : null
                    ),
                }
            }}
            sx={{
                '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                        borderRadius: '30px',
                    },
                },
                ...props.sx,
            }}
            {...props}
        />
    );
};