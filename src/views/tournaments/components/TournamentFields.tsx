import React, { useState, useEffect } from 'react';
import {
  Grid,
  TextField,
  MenuItem,
  Alert,
  Typography,
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import Autocomplete from '@mui/material/Autocomplete';
import { TournamentRequest } from '../../../api/tournamnet/tournamentRequest';
import { CloudUpload } from '@mui/icons-material';
import { AppButton } from '../../../components';
import { Stack, Box, CircularProgress } from '@mui/material';
import { fileService } from '../../../api/common/file.api';

type Props = {
  values: TournamentRequest;
  onFieldChange: (e: any) => void;
  fieldHasError: (field: string) => boolean;
  fieldGetError: (field: string) => string | undefined;
  submitError?: string | null;
  STATUS_OPTIONS: string[];
  TYPE_OPTIONS: string[];
  TAG_OPTIONS?: string[];
};

const TournamentFields: React.FC<Props> = ({
  values,
  onFieldChange,
  fieldHasError,
  fieldGetError,
  submitError,
  STATUS_OPTIONS,
  TYPE_OPTIONS,
  TAG_OPTIONS = ['Cricket', 'Football', 'T20', 'Knockout', 'Friendly'],
}) => {
  const [endDateError, setEndDateError] = useState<string | null>(null);

  useEffect(() => {
    if (values.endDate && values.startDate) {
      if (dayjs(values.endDate).isBefore(dayjs(values.startDate))) {
        setEndDateError('End date cannot be before start date');
      } else {
        setEndDateError(null);
      }
    }
  }, [values.startDate, values.endDate]);

  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      alert("Please upload a valid JPG or PNG image.");
      return;
    }

    try {
      setUploading(true);
      const response = await fileService.uploadFile(file);
      if (response.data && response.data.data) {
        onFieldChange({ target: { name: 'logoUrl', value: response.data.data } } as any);
      }
    } catch (e) {
      console.error("Upload failed", e);
      alert("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Grid container spacing={3}>
        {/* Group 1: Basic Info */}
        <Grid size={12}>
          <Typography variant="h6" gutterBottom>
            Basic Information
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Series Name"
            name="name"
            value={values.name}
            onChange={onFieldChange}
            error={fieldHasError('name')}
            required
            helperText={fieldGetError('name') || ' '}
            fullWidth
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Location"
            name="location"
            value={values.location}
            onChange={onFieldChange}
            error={fieldHasError('location')}
            helperText={fieldGetError('location') || ' '}
            fullWidth
          />
        </Grid>
        <Grid size={12}>
          <TextField
            label="Description"
            name="description"
            value={values.description}
            onChange={onFieldChange}
            error={fieldHasError('description')}
            helperText={fieldGetError('description') || ' '}
            multiline
            rows={3}
            fullWidth
          />
        </Grid>

        <Grid size={12}>
          <Typography variant="h6" gutterBottom>
            Schedule
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <DatePicker
            label="Start Date"
            value={values.startDate ? dayjs(values.startDate) : null}
            onChange={(newValue) => {
              if (newValue) {
                onFieldChange({
                  target: { name: 'startDate', value: newValue.valueOf() },
                } as any);
              }
            }}
            slotProps={{
              textField: {
                fullWidth: true,
                error: fieldHasError('startDate'),
                helperText: fieldGetError('startDate') || ' ',
              },
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <DatePicker
            label="End Date"
            value={values.endDate ? dayjs(values.endDate) : null}
            minDate={values.startDate ? dayjs(values.startDate) : undefined}
            onChange={(newValue) => {
              if (newValue) {
                onFieldChange({
                  target: { name: 'endDate', value: newValue.valueOf() },
                } as any);
              }
            }}
            slotProps={{
              textField: {
                fullWidth: true,
                error: !!endDateError || fieldHasError('endDate'),
                helperText: endDateError || fieldGetError('endDate') || ' ',
              },
            }}
          />
        </Grid>

        <Grid size={12}>
          <Typography variant="h6" gutterBottom>
            Additional Details
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Stack direction="row" spacing={1} alignItems="flex-start">
            <TextField
              label="Logo URL"
              name="logoUrl"
              value={values.logoUrl}
              onChange={onFieldChange}
              error={fieldHasError('logoUrl')}
              helperText={fieldGetError('logoUrl') || ' '}
              fullWidth
            />
            <AppButton
              variant="outlined"
              component="label"
              startIcon={uploading ? <CircularProgress size={20} /> : <CloudUpload />}
              disabled={uploading}
              sx={{ minWidth: 100, height: 56, mb: 3 }}
            >
              {uploading ? "..." : "Upload"}
              <input
                type="file"
                hidden
                accept="image/png, image/jpeg, image/jpg"
                onChange={handleFileUpload}
              />
            </AppButton>
          </Stack>
          {values.logoUrl && (
            <Box mt={1}>
              <img
                src={values.logoUrl}
                alt="Logo Preview"
                style={{ maxWidth: "100px", maxHeight: "100px", borderRadius: 8 }}
              />
            </Box>
          )}
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Max Participants"
            name="maxParticipants"
            type="number"
            value={values.maxParticipants}
            onChange={onFieldChange}
            error={fieldHasError('maxParticipants')}
            helperText={fieldGetError('maxParticipants') || ' '}
            fullWidth
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            select
            label="Series Status"
            name="tournamentStatus"
            value={values.tournamentStatus}
            onChange={onFieldChange}
            error={fieldHasError('tournamentStatus')}
            helperText={fieldGetError('tournamentStatus') || ' '}
            fullWidth
          >
            {STATUS_OPTIONS.map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            select
            label="Series Type"
            name="type"
            value={values.type}
            onChange={onFieldChange}
            error={fieldHasError('type')}
            helperText={fieldGetError('type') || ' '}
            fullWidth
          >
            {TYPE_OPTIONS.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            select
            label="Series Format"
            name="seriesFormat"
            value={values.seriesFormat || ''}
            onChange={onFieldChange}
            error={fieldHasError('seriesFormat')}
            helperText={fieldGetError('seriesFormat') || ' '}
            fullWidth
          >
            {['T10', 'T20', 'ODI', 'Test', 'Hundred'].map((format) => (
              <MenuItem key={format} value={format}>
                {format}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/* Tags Autocomplete */}
        <Grid size={12}>
          <Autocomplete
            multiple
            options={TAG_OPTIONS}
            value={values.tags || []}
            onChange={(_, newValue) => {
              onFieldChange({ target: { name: 'tags', value: newValue } });
            }}
            renderInput={(params) => (
              <TextField {...params} label="Tags" placeholder="Add tags" />
            )}
          />
        </Grid>

        {submitError && (
          <Grid size={12}>
            <Alert severity="error">{submitError}</Alert>
          </Grid>
        )}
      </Grid>
    </LocalizationProvider>
  );
};

export default TournamentFields;
