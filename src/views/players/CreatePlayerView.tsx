import { SyntheticEvent, useCallback, useState } from 'react';
import {
  Box,
  Card,
  Grid,
  TextField,
  Typography,
  useTheme,
  CircularProgress,
  Alert,
  Stack,
  MenuItem,
  Divider,
} from '@mui/material';
import { PersonAdd as PersonAddIcon, UploadFile as UploadFileIcon } from '@mui/icons-material';

import {
  BattingStyle,
  BowlingStyle,
  Nationality,
  navigateTo,
  PlayerRole,
  SHARED_CONTROL_PROPS,
  useAppForm,
} from '../../utils';
import { AppButton, AppForm } from '../../components';
import playerApi from '../../api/players/playerApi';
import { PlayerInfoFull } from '../../api/players/res/players';
import { useNavigate } from 'react-router-dom';

const VALIDATE_PLAYER_FORM = {
  fullName: {
    presence: { allowEmpty: false, message: 'is required' },
    length: { minimum: 3, message: 'must be at least 3 characters' },
  },
  shortName: {
    presence: { allowEmpty: false, message: 'is required' },
    length: { maximum: 10, message: 'must be 10 characters or fewer' },
  },
  nationality: {
    presence: { allowEmpty: false, message: 'is required' },
  },
  battingStyle: {
    presence: { allowEmpty: false, message: 'is required' },
  },
  bowlingStyle: {
    presence: { allowEmpty: false, message: 'is required' },
  },
  role: {
    presence: { allowEmpty: false, message: 'is required' },
  },
};

type CreatePlayerPageProps = {
  playerInfo?: PlayerInfoFull;
};

const CreatePlayerPage: React.FC<CreatePlayerPageProps> = ({ playerInfo }) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const isEditMode = Boolean(playerInfo);
  const navigate = useNavigate();

  const {
    formState,
    onFieldChange,
    fieldGetError,
    fieldHasError,
    isFormValid,
  } = useAppForm({
    validationSchema: VALIDATE_PLAYER_FORM,
    initialValues: {
      fullName: playerInfo?.fullName || '',
      shortName: playerInfo?.shortName || '',
      nationality: playerInfo?.nationality || '',
      battingStyle: playerInfo?.battingStyle || '',
      bowlingStyle: playerInfo?.bowlingStyle || '',
      role: playerInfo?.role || '',
    } as CreatePlayerRequest,
  });

  const values = formState.values as CreatePlayerRequest;

  const handleSubmit = useCallback(
    async (event: SyntheticEvent) => {
      event.preventDefault();
      setLoading(true);
      setSubmitError(null);
      try {
        if (!isFormValid()) {
          setSubmitError('Please fix the errors in the form before submitting.');
          return;
        }
        if (isEditMode) {
          await playerApi.updatePlayer(values, playerInfo!.id);
        } else {
          await playerApi.createPlayer(values);
        }
        navigate('/players');
      } catch (error) {
        console.error('Error submitting player:', error);
        setSubmitError(`Failed to ${isEditMode ? 'update' : 'create'} player. Please try again.`);
      } finally {
        setLoading(false);
      }
    },
    [values, isEditMode, playerInfo]
  );

  const renderTextField = (name: keyof CreatePlayerRequest, label: string) => (
    <TextField
      required
      label={label}
      name={name}
      value={values[name]}
      error={fieldHasError(name)}
      helperText={fieldGetError(name) || ' '}
      onChange={onFieldChange}
      {...SHARED_CONTROL_PROPS}
      fullWidth
    />
  );

  const renderSelectField = (
    name: keyof CreatePlayerRequest,
    label: string,
    options: Record<string, string>
  ) => (
    <TextField
      select
      required
      label={label}
      name={name}
      value={values[name]}
      error={fieldHasError(name)}
      helperText={fieldGetError(name) || ' '}
      onChange={onFieldChange}
      {...SHARED_CONTROL_PROPS}
      fullWidth
    >
      {Object.entries(options).map(([key, value]) => (
        <MenuItem key={key} value={value}>
          {value}
        </MenuItem>
      ))}
    </TextField>
  );

  return (
    <Box sx={{ backgroundColor: theme.palette.background.default, minHeight: '100vh' }}>
      {/* Header Buttons */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'stretch', sm: 'center' }}
        spacing={2}
        mb={3}
      >
        <Typography variant="h4" fontWeight="bold" color="primary">
          {isEditMode ? 'Update Player' : 'Create New Player'}
        </Typography>

        <Stack direction="row" spacing={2}>
          <AppButton
            type="submit"
            form="create-player-form"
            variant="contained"
            color="primary"
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <PersonAddIcon />}
            disabled={!isFormValid()}
          >
            {loading
              ? isEditMode
                ? 'Updating...'
                : 'Creating...'
              : isEditMode
                ? 'Update Player'
                : 'Create Player'}
          </AppButton>
        </Stack>
      </Stack>

      <Card sx={{ p: { xs: 3, sm: 4 }, maxWidth: 960, mx: 'auto', borderRadius: 4, boxShadow: 6 }}>
        <AppForm id="create-player-form" onSubmit={handleSubmit}>
          <Grid container spacing={4}>
            {/* Basic Info */}
            <Grid size={{ xs: 12 }}>
              <Typography variant="h6" gutterBottom>
                Basic Info
              </Typography>
              <Divider />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }} >
              {renderTextField('fullName', 'Full Name')}
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }} >
              {renderTextField('shortName', 'Short Name')}
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }} >
              {renderSelectField('nationality', 'Nationality', Nationality)}
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }} >
              {renderSelectField('role', 'Role', PlayerRole)}
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Typography variant="h6" gutterBottom>
                Playing Style
              </Typography>
              <Divider />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }} >
              {renderSelectField('battingStyle', 'Batting Style', BattingStyle)}
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }} >
              {renderSelectField('bowlingStyle', 'Bowling Style', BowlingStyle)}
            </Grid>

            {submitError && (
              <Grid size={{ xs: 12, sm: 6 }} >
                <Alert severity="error">{submitError}</Alert>
              </Grid>
            )}
          </Grid>
        </AppForm>
      </Card>
    </Box>
  );
};

export default CreatePlayerPage;
