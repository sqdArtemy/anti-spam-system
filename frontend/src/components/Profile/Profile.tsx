import {useEffect, useState} from 'react';
import {observer} from 'mobx-react';
import {autorun} from 'mobx';
import {
    Avatar,
    Box,
    Typography,
    Paper,
    TextField,
    IconButton,
    Button,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import userStore from '../../stores/UserStore.ts';
import {stringAvatar} from '../../utils';

const Profile = observer(() => {
    const [formData, setFormData] = useState({
        name: userStore.storeData.name || '',
        email: userStore.storeData.email || '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        userStore.fetchCurrentUser();
        const dispose = autorun(() => {
            if (userStore.state === 'error') {
                setError(userStore.errorMsg);
                setLoading(false);
                userStore.currentState = 'pending';
            } else if (userStore.state === 'success') {
                setFormData({
                    name: userStore.data.name,
                    email: userStore.data.email,
                    password: '',
                });
                setLoading(false);
                userStore.currentState = 'pending';
            } else if (userStore.state === 'loading') {
                setError('');
                setLoading(true);
                userStore.currentState = 'pending';
            }
        });

        return () => dispose();
    }, []);

    // const handleUpdate = () => {
    //     if (!formData.name || !formData.email) {
    //         setError('All fields are required.');
    //         return;
    //     }
    //
    //     userStore.updateUser(userStore.storeData.id, {
    //         name: formData.name,
    //         email: formData.email,
    //         password: formData.password,
    //     });
    // };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                p: 4,
                minHeight: '100%',
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    mb: 4,
                }}
            >
                <Avatar
                    alt="User Avatar"
                    {...stringAvatar(formData.name || '', {
                        width: 100,
                        height: 100,
                        mb: 2,
                    })}
                />
                <Typography variant="h5" fontWeight="bold">
                    {formData.name || 'User Name'}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    {formData.email || 'example@gmail.com'}
                </Typography>
            </Box>

            <Paper
                elevation={3}
                sx={{
                    width: '100%',
                    maxWidth: 600,
                    p: 5,
                    borderRadius: 3,
                }}
            >
                <Typography
                    variant="h6"
                    fontWeight="bold"
                    sx={{mb: 3, textAlign: 'center'}}
                >
                    Account Data
                </Typography>

                <Box sx={{display: 'flex', flexDirection: 'column', mb: 3}}>
                    <Typography variant="body2" color="text.secondary">
                        Name
                    </Typography>
                    <TextField
                        variant="standard"
                        fullWidth
                        value={formData.name || ''}
                        onChange={(e) =>
                            setFormData({...formData, name: e.target.value})
                        }
                    />
                </Box>

                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        mb: 3,
                    }}
                >
                    <Box sx={{flex: 1}}>
                        <Typography variant="body2" color="text.secondary">
                            Email
                        </Typography>
                        <TextField
                            variant="standard"
                            fullWidth
                            value={formData.email || ''}
                            onChange={(e) =>
                                setFormData({...formData, email: e.target.value})
                            }
                        />
                    </Box>
                </Box>

                <Box sx={{display: 'flex', flexDirection: 'column', mb: 3}}>
                    <Typography variant="body2" color="text.secondary">
                        Password
                    </Typography>
                    <TextField
                        variant="standard"
                        fullWidth
                        value={formData.password || ''}
                        onChange={(e) =>
                            setFormData({...formData, password: e.target.value})
                        }
                        type="password"
                    />
                </Box>

                {error && (
                    <Typography color="error" sx={{mb: 2}}>
                        {error}
                    </Typography>
                )}

                <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
                >

                    <Button
                        variant="contained"
                        color="primary"
                        // onClick={handleUpdate}
                        disabled={loading}
                        // fullWidth
                        sx={{width: "100%"}}

                    >
                        {loading ? 'Updating...' : 'Update'}
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
});

export default Profile;
