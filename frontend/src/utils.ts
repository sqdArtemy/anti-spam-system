import {SxProps} from "@mui/material";

function stringToColor(string: string) {
    let hash = 0;
    let i;
    for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = '#';
    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
    }
    return color;
}

export function stringAvatar(name: string, sx: SxProps = {})  {


    let initials: string | string[] = name
        .split(' ')
        .map((word) => word[0])
        .join('');

    if (name.length > 1) {
        initials = initials
            .split('')
            .slice(0, 2)
            .map((letter) => letter.toUpperCase())
            .join('');
    } else {
        initials = initials
            .split('')
            .map((letter) => letter.toUpperCase())
            .join('');
    }
    return {
        sx: {
            bgcolor: stringToColor(name),
            width: '3.5rem',
            height: '3.5rem',
            ...sx
        },
        children: initials,
    };
}