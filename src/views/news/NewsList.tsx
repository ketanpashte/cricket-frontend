import {
    Box,
    Typography,
    Paper,
    IconButton,
    Stack,
    useTheme,
    CircularProgress,
    Alert,
    Tooltip,
    Divider,
    Button,
    Chip,
    TextField
} from '@mui/material';
import { Edit, Delete, Add, Publish, Newspaper, DragIndicator } from '@mui/icons-material';
import { AppLink } from '../../components';
import { useEffect, useState, useCallback } from 'react';
import { newsService, NewsDto } from '../../api/news/news.api';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const SortableNewsItem = ({ news, index, onDelete, onPublish, onOrderChange }: {
    news: NewsDto,
    index: number,
    onDelete: (id: number) => void,
    onPublish: (id: number) => void,
    onOrderChange: (id: number, newIndex: number) => void
}) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: news.id! });

    const [orderValue, setOrderValue] = useState((index + 1).toString());

    useEffect(() => {
        setOrderValue((index + 1).toString());
    }, [index]);

    const handleOrderCommit = () => {
        const val = parseInt(orderValue);
        if (!isNaN(val) && val > 0) {
            onOrderChange(news.id!, val - 1);
        } else {
            setOrderValue((index + 1).toString());
        }
    };

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        marginBottom: 8,
    };

    return (
        <Paper
            ref={setNodeRef}
            style={style}
            sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
        >
            {/* Drag Handle & Order Input */}
            <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                <Box {...attributes} {...listeners} sx={{ cursor: 'grab', display: 'flex', alignItems: 'center', mr: 1, color: 'text.secondary' }}>
                    <DragIndicator />
                </Box>
                <TextField
                    size="small"
                    value={orderValue}
                    onChange={(e) => setOrderValue(e.target.value)}
                    onBlur={handleOrderCommit}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleOrderCommit();
                            // blur to prevent multiple triggers if needed, or just keep focus
                            (e.target as HTMLElement).blur();
                        }
                    }}
                    type="number"
                    variant="outlined"
                    sx={{ width: 70 }}
                    onMouseDown={(e) => e.stopPropagation()} // Allow interaction without dragging
                    onClick={(e) => e.stopPropagation()}
                />
            </Box>

            <Stack direction="row" alignItems="center" spacing={2} sx={{ flex: 1 }}>
                <Newspaper color="action" />
                {news.imageUrl && <img src={news.imageUrl} alt={news.title} style={{ width: 60, height: 40, objectFit: 'cover', borderRadius: 4 }} />}
                <Box>
                    <Typography variant="subtitle1" fontWeight="bold">{news.title}</Typography>
                    <Chip
                        label={news.isPublished ? "Published" : "Draft"}
                        size="small"
                        color={news.isPublished ? "success" : "default"}
                        variant="outlined"
                    />
                </Box>
            </Stack>
            <Stack direction="row" spacing={1}>
                <Tooltip title={news.isPublished ? "Already Published" : "Publish to App"}>
                    <IconButton
                        color={news.isPublished ? "default" : "primary"}
                        disabled={news.isPublished}
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); onPublish(news.id!); }}
                        onMouseDown={(e) => e.stopPropagation()} // Prevent drag start
                    >
                        <Publish />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Edit">
                    <IconButton
                        component={AppLink}
                        to={`/news/edit/${news.id}`}
                        onClick={(e) => { e.stopPropagation(); }} // prevent drag
                        onMouseDown={(e) => e.stopPropagation()}
                    >
                        <Edit />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                    <IconButton
                        color="error"
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(news.id!); }}
                        onMouseDown={(e) => e.stopPropagation()}
                    >
                        <Delete />
                    </IconButton>
                </Tooltip>
            </Stack>
        </Paper>
    );
};


const NewsList = () => {
    const theme = useTheme();
    const [newsList, setNewsList] = useState<NewsDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchNews = useCallback(async () => {
        try {
            setLoading(true);
            const res = await newsService.getAllNews();
            setNewsList(res.data.data);
            setError(null);
        } catch (err) {
            setError("Failed to load News.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchNews();
    }, [fetchNews]);

    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this news?')) return;
        try {
            await newsService.deleteNews(id);
            fetchNews();
        } catch (e) {
            alert("Failed to delete news");
        }
    };

    const handlePublish = async (id: number) => {
        if (!window.confirm('Publish this news to mobile app?')) return;
        try {
            await newsService.publishNews(id);
            fetchNews();
        } catch (e) {
            alert("Failed to publish news");
        }
    }

    const handleDragEnd = async (event: any) => {
        const { active, over } = event;
        if (active.id !== over.id) {
            const oldIndex = newsList.findIndex(item => item.id === active.id);
            const newIndex = newsList.findIndex(item => item.id === over.id);

            const newOrder = arrayMove(newsList, oldIndex, newIndex);
            setNewsList(newOrder);

            // Call API to reorder
            const ids = newOrder.map(n => n.id!);
            try {
                await newsService.reorderNews(ids);
            } catch (e) {
                console.error("Failed to save order");
                fetchNews(); // Revert on error
            }
        }
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: theme.palette.background.default }}>
            <Typography variant="h4" fontWeight="bold" mb={4} color={theme.palette.primary.main}>
                Manage News
            </Typography>

            <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6">News List</Typography>
                    <Button variant="contained" startIcon={<Add />} component={AppLink} to="/news/new">
                        Create News
                    </Button>
                </Stack>
                <Divider sx={{ mb: 2 }} />

                {loading ? (
                    <Box display="flex" justifyContent="center" my={4}><CircularProgress /></Box>
                ) : error ? (
                    <Alert severity="error">{error}</Alert>
                ) : newsList.length === 0 ? (
                    <Alert severity="info">No News items found.</Alert>
                ) : (
                    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <SortableContext items={newsList.map(n => n.id!)} strategy={verticalListSortingStrategy}>
                            {newsList.map((news, index) => (
                                <SortableNewsItem
                                    key={news.id}
                                    news={news}
                                    index={index}
                                    onDelete={handleDelete}
                                    onPublish={handlePublish}
                                    onOrderChange={(id, newIndex) => {
                                        const oldIndex = newsList.findIndex(n => n.id === id);
                                        if (oldIndex >= 0 && newIndex >= 0 && newIndex < newsList.length && oldIndex !== newIndex) {
                                            const newOrder = arrayMove(newsList, oldIndex, newIndex);
                                            setNewsList(newOrder);
                                            // Call API to reorder
                                            const ids = newOrder.map(n => n.id!);
                                            newsService.reorderNews(ids).catch(() => {
                                                console.error("Failed to save order");
                                                fetchNews();
                                            });
                                        }
                                    }}
                                />
                            ))}
                        </SortableContext>
                    </DndContext>
                )}
            </Paper>
        </Box>
    );
};

export default NewsList;
