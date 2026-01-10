
import React, { useEffect, useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    CardHeader,
    Grid,
    TextField,
    MenuItem,
    Button,
    Typography,
    List,
    ListItem,
    ListItemText,
    Divider,
    FormControl,
    InputLabel,
    Select,
    CircularProgress,
    Alert
} from '@mui/material';
import { notificationService, NotificationEntity, NotificationRequest } from '../../api/notification/notification.api';
import { format } from 'date-fns';

const TARGET_TYPES = [
    { value: 'ALL', label: 'All Users' },
    { value: 'MATCH', label: 'Match Specific' },
    { value: 'SEGMENT', label: 'Custom Segment' }
];

const NotificationView = () => {
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState<NotificationEntity[]>([]);
    const [formData, setFormData] = useState<NotificationRequest>({
        title: '',
        message: '',
        targetType: 'ALL',
        targetValue: ''
    });
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const fetchHistory = async () => {
        try {
            const response = await notificationService.getNotificationHistory();
            // response.data is ApiResponse<NotificationEntity[]>, accessing .data property of ApiResponse
            if (response.data && response.data.success) {
                setHistory(response.data.data || []);
            }
        } catch (err) {
            console.error("Failed to fetch history", err);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            await notificationService.sendNotification(formData);
            setSuccess("Notification sent successfully!");
            setFormData({
                title: '',
                message: '',
                targetType: 'ALL',
                targetValue: ''
            });
            fetchHistory();
        } catch (err: any) {
            setError(err.message || "Failed to send notification");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Push Notifications
            </Typography>

            <Grid container spacing={3}>
                {/* Send Notification Form */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card>
                        <CardHeader title="Send New Notification" />
                        <CardContent>
                            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

                            <form onSubmit={handleSubmit}>
                                <Grid container spacing={2}>
                                    <Grid size={{ xs: 12 }}>
                                        <TextField
                                            fullWidth
                                            label="Title"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12 }}>
                                        <TextField
                                            fullWidth
                                            label="Message Body"
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                            multiline
                                            rows={4}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12 }}>
                                        <FormControl fullWidth>
                                            <InputLabel>Target Audience</InputLabel>
                                            <Select
                                                name="targetType"
                                                value={formData.targetType}
                                                label="Target Audience"
                                                onChange={handleChange}
                                            >
                                                {TARGET_TYPES.map(type => (
                                                    <MenuItem key={type.value} value={type.value}>
                                                        {type.label}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    {formData.targetType !== 'ALL' && (
                                        <Grid size={{ xs: 12 }}>
                                            <TextField
                                                fullWidth
                                                label={formData.targetType === 'MATCH' ? "Match ID" : "Segment Info"}
                                                name="targetValue"
                                                value={formData.targetValue}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Grid>
                                    )}

                                    <Grid size={{ xs: 12 }}>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            size="large"
                                            fullWidth
                                            disabled={loading}
                                        >
                                            {loading ? <CircularProgress size={24} /> : "Send Notification"}
                                        </Button>
                                    </Grid>
                                </Grid>
                            </form>
                        </CardContent>
                    </Card>
                </Grid>

                {/* History List */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card sx={{ height: '100%' }}>
                        <CardHeader title="Notification History" />
                        <CardContent sx={{ maxHeight: 600, overflow: 'auto' }}>
                            {history.length === 0 ? (
                                <Typography color="textSecondary" align="center">
                                    No notifications sent yet.
                                </Typography>
                            ) : (
                                <List>
                                    {history.map((item) => (
                                        <React.Fragment key={item.id}>
                                            <ListItem alignItems="flex-start">
                                                <ListItemText
                                                    primary={
                                                        <Box display="flex" justifyContent="space-between">
                                                            <Typography variant="subtitle1" fontWeight="bold">
                                                                {item.title}
                                                            </Typography>
                                                            <Typography variant="caption" color="textSecondary">
                                                                {item.sentAt ? format(new Date(item.sentAt), 'PP p') : ''}
                                                            </Typography>
                                                        </Box>
                                                    }
                                                    secondary={
                                                        <>
                                                            <Typography variant="body2" color="textPrimary" component="span">
                                                                {item.message}
                                                            </Typography>
                                                            <br />
                                                            <Typography variant="caption" color="textSecondary">
                                                                Target: {item.targetType} {item.targetValue ? `(${item.targetValue})` : ''}
                                                            </Typography>
                                                        </>
                                                    }
                                                />
                                            </ListItem>
                                            <Divider component="li" />
                                        </React.Fragment>
                                    ))}
                                </List>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default NotificationView;
