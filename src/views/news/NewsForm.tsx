import React, { useEffect, useState, useCallback } from 'react';
import {
    Box,
    Card,
    Grid,
    TextField,
    Typography,
    Stack,
    CircularProgress,
    Button
} from '@mui/material';
import { Event as EventIcon, CloudUpload } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppForm, SHARED_CONTROL_PROPS } from '../../utils';
import { AppForm, AppButton } from '../../components';
import { newsService, NewsDto } from '../../api/news/news.api';
import { fileService } from '../../api/common/file.api';

const VALIDATE_NEWS_FORM: Record<string, any> = {
    title: {
        presence: { allowEmpty: false, message: '^Title is required' },
        length: { minimum: 3, message: '^Title must be at least 3 characters' },
    },
    content: {
        presence: { allowEmpty: false, message: '^Content is required' },
    },
};

const NewsForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = Boolean(id);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(isEditMode);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const {
        formState,
        onFieldChange,
        fieldGetError,
        fieldHasError,
        isFormValid,
        setFormState // <--- Use this instead of setForm
    } = useAppForm({
        validationSchema: VALIDATE_NEWS_FORM,
        initialValues: {
            title: '',
            content: '',
            imageUrl: '',
            isPublished: false
        } as NewsDto
    });

    const values = formState.values as NewsDto;

    useEffect(() => {
        if (isEditMode && id) {
            const fetchNews = async () => {
                try {
                    const res = await newsService.getNews(Number(id));
                    // Update form state with fetched data
                    (setFormState as any)((prev: any) => ({
                        ...prev,
                        values: res.data.data
                    }));
                } catch (e) {
                    console.error("Failed to load news", e);
                    navigate('/news');
                } finally {
                    setInitialLoading(false);
                }
            };
            fetchNews();
        }
    }, [isEditMode, id, navigate, setFormState]);

    const handleSubmit = useCallback(async (e: React.SyntheticEvent) => {
        e.preventDefault();
        setLoading(true);
        setSubmitError(null);

        if (!isFormValid()) {
            setLoading(false);
            return;
        }

        try {
            if (isEditMode && id) {
                await newsService.updateNews(Number(id), values);
            } else {
                await newsService.createNews(values);
            }
            navigate('/news');
        } catch (err: any) {
            setSubmitError(err.message || "Failed to save news.");
        } finally {
            setLoading(false);
        }
    }, [values, isEditMode, id, navigate, isFormValid]);

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (!validTypes.includes(file.type)) {
            alert("Please upload a valid JPG or PNG image.");
            return;
        }

        try {
            setLoading(true);
            const response = await fileService.uploadFile(file);
            if (response.data && response.data.data) {
                onFieldChange({ target: { name: fieldName, value: response.data.data } } as any);
            }
        } catch (e: any) {
            console.error("Upload failed", e);
            alert("Failed to upload image");
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) {
        return <Box display="flex" justifyContent="center" mt={5}><CircularProgress /></Box>;
    }

    return (
        <Box>
            <Grid container spacing={3} justifyContent="center">
                {/* Fixed Grid syntax: In newer MUI versions or TS, 'item' might be implied or need type assertion if strictly typed, 
                    but often 'xs' implies item. We keep it simple. */}
                <Grid size={{ xs: 12, md: 8 }}>
                    <Card sx={{ p: 4, borderRadius: 4 }}>
                        <Typography variant="h5" fontWeight="bold" mb={3} color="primary">
                            {isEditMode ? "Edit News" : "Create News"}
                        </Typography>

                        <AppForm onSubmit={handleSubmit}>
                            <TextField
                                label="Title"
                                name="title"
                                value={values.title || ''}
                                onChange={(e) => onFieldChange(e as any)}
                                error={fieldHasError('title')}
                                helperText={fieldGetError('title')}
                                {...SHARED_CONTROL_PROPS}
                                sx={{ mb: 2 }}
                            />

                            <Stack direction="row" spacing={1} alignItems="flex-start" mb={2}>
                                <TextField
                                    label="Image URL"
                                    name="imageUrl"
                                    value={values.imageUrl || ''}
                                    onChange={(e) => onFieldChange(e as any)}
                                    {...SHARED_CONTROL_PROPS}
                                    fullWidth
                                    placeholder="https://example.com/image.jpg"
                                />
                                <AppButton
                                    variant="outlined"
                                    component="label"
                                    startIcon={<CloudUpload />}
                                    sx={{ minWidth: 100, height: 56 }}
                                >
                                    Upload
                                    <input
                                        type="file"
                                        hidden
                                        accept="image/png, image/jpeg, image/jpg"
                                        onChange={(e) => handleFileUpload(e, 'imageUrl')}
                                    />
                                </AppButton>
                            </Stack>
                            {values.imageUrl && (
                                <Box mt={1} mb={2}>
                                    <img
                                        src={values.imageUrl}
                                        alt="News Preview"
                                        style={{ maxWidth: "100%", maxHeight: "200px", borderRadius: 8 }}
                                    />
                                </Box>
                            )}

                            <TextField
                                label="Content"
                                name="content"
                                value={values.content || ''}
                                onChange={(e) => onFieldChange(e as any)}
                                error={fieldHasError('content')}
                                helperText={fieldGetError('content')}
                                {...SHARED_CONTROL_PROPS}
                                multiline
                                rows={6}
                                sx={{ mb: 3 }}
                            />

                            {submitError && <Typography color="error" mb={2}>{submitError}</Typography>}

                            <Stack direction="row" spacing={2}>
                                <AppButton
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    disabled={loading}
                                    startIcon={loading ? <CircularProgress size={20} /> : <EventIcon />}
                                >
                                    {isEditMode ? "Update" : "Create"}
                                </AppButton>
                                <Button variant="outlined" onClick={() => navigate('/news')}>Cancel</Button>
                            </Stack>
                        </AppForm>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default NewsForm;
