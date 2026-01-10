import React, { useEffect, useState, SyntheticEvent, useCallback, useRef } from 'react';
import {
  Box,
  Card,
  Grid,
  TextField,
  Typography,
  Stack,
  Chip,
  MenuItem,
  CircularProgress,
  Switch,
  FormControlLabel,
  IconButton,
  Autocomplete,
} from '@mui/material';
import { Event as EventIcon, AddCircle, Delete } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

import { useAppForm, SHARED_CONTROL_PROPS } from '../../utils';
import { AppButton, AppForm } from '../../components';
import { teamServcie } from '../../api/teams/teams.api';
import { TeamInfo } from '../../api/teams/TeamRequest';
import { TournamnetInfoResponse } from '../../api/tournamnet/tournamentResponse';
import { tournamentService } from '../../api/tournamnet/tournament.api';
import TournamentFields from './components/TournamentFields';
import { TournamentRequest } from '../../api/tournamnet/tournamentRequest';
import { VenueService } from '../../api/venue/api';

const VALIDATE_TOURNAMENT_FORM: Record<string, any> = {
  name: {
    presence: { allowEmpty: false, message: '^Series name is required' },
    length: { minimum: 3, message: '^Series name must be at least 3 characters' },
  },
  startDate: {
    presence: { allowEmpty: false, message: '^Start date is required' },
  },
  endDate: {
    presence: { allowEmpty: false, message: '^End date is required' },
  },
  location: {
    presence: { allowEmpty: false, message: '^Location is required' },
  },
  tournamentStatus: {
    presence: { allowEmpty: false, message: '^Status is required' },
  },
  hostingNations: {
    presence: { allowEmpty: false, message: '^Hosting Nations is required' },
  },
  type: {
    presence: { allowEmpty: false, message: '^Type is required' },
  },
};

const STATUS_OPTIONS = ['UP_COMING', 'LIVE', 'FINISHED'];
const TYPE_OPTIONS = ['INTERNATIONAL', 'DOMESTIC', 'LEAGUE'];

type Props = {
  tournamentInfo?: TournamnetInfoResponse;
};

const CreateTournamentPage: React.FC<Props> = ({ tournamentInfo }) => {
  const navigate = useNavigate();
  const isEditMode = Boolean(tournamentInfo);
  const venueService = useRef(new VenueService()).current;

  const [availableCountries, setAvailableCountries] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [teams, setTeams] = useState<TeamInfo[]>([]);

  const {
    formState,
    onFieldChange,
    fieldGetError,
    fieldHasError,
    isFormValid,
  } = useAppForm({
    validationSchema: VALIDATE_TOURNAMENT_FORM,
    initialValues: {
      name: tournamentInfo?.name || '',
      description: tournamentInfo?.description || '',
      startDate: tournamentInfo?.startDate
        ? new Date(tournamentInfo.startDate).getTime()
        : new Date().getTime(),
      endDate: tournamentInfo?.endDate
        ? new Date(tournamentInfo.endDate).getTime()
        : dayjs().add(1, 'day').toDate().getTime(),
      location: tournamentInfo?.location || '',
      logoUrl: tournamentInfo?.logoUrl || '',
      hostingNations: tournamentInfo?.hostingNations || [],
      tournamentStatus: tournamentInfo?.tournamentStatus || STATUS_OPTIONS[0],
      type: tournamentInfo?.type || TYPE_OPTIONS[0],
      participatingTeamIds: tournamentInfo?.participatingTeams?.map((team) => team.teamId) || [],
      maxParticipants: tournamentInfo?.maxParticipants || 2,
      tags: tournamentInfo?.tags || [],
      isGroup: tournamentInfo?.group || false,
      groups: tournamentInfo?.groups?.map((group) => ({ name: group.name, teamIds: group.teams.map((team) => team.teamId) })) || [],
    } as unknown as TournamentRequest,
  });

  const values = formState.values as TournamentRequest;

  useEffect(() => {
    async function fetchTeams() {
      try {
        const res = await teamServcie.queryTeams();
        setTeams(res.data.data);
      } catch (err) {
        console.error('Failed to fetch teams', err);
      }
    }
    fetchTeams();
  }, []);

  // Try to populate available countries for hostingNations
  useEffect(() => {
    async function fetchCountries() {
      try {
        // If VenueService exposes a method to fetch countries, prefer that.
        if (typeof (venueService as any).getCountries === 'function') {
          const resp = await (venueService as any).getCountries();
          // assume resp.data or resp
          const list = Array.isArray(resp?.data) ? resp.data : Array.isArray(resp) ? resp : [];
          setAvailableCountries(list.map(String));
          return;
        }

        // Fallback: derive from teams if they have a `country` field
        const derived = Array.from(new Set(teams.map((t: any) => t.country).filter(Boolean)));
        if (derived.length) {
          setAvailableCountries(derived);
          return;
        }

        // Final fallback: a small default list
        setAvailableCountries(['India', 'Australia', 'England', 'South Africa', 'New Zealand', 'Pakistan', 'Sri Lanka', 'Bangladesh']);
      } catch (err) {
        console.warn('Could not fetch countries for hostingNations, using fallback list', err);
        setAvailableCountries(['India', 'Australia', 'England', 'South Africa', 'New Zealand', 'Pakistan', 'Sri Lanka', 'Bangladesh']);
      }
    }

    fetchCountries();
  }, [venueService, teams]);

  const handleSubmit = useCallback(
    async (e: SyntheticEvent) => {
      e.preventDefault();
      setLoading(true);
      setSubmitError(null);
      if (!isFormValid()) {
        console.log(formState.errors);
        setSubmitError('Please fix the errors before submitting.');
        setLoading(false);
        return;
      }

      // Validate date logic
      if (values.endDate < values.startDate) {
        setSubmitError('End Date cannot be before Start Date.');
        setLoading(false);
        return;
      }

      try {
        if (isEditMode) {
          await tournamentService.updateTournament(tournamentInfo!.id, values);
        } else {
          await tournamentService.createTournament(values);
        }
        navigate('/tournaments');
      } catch (err) {
        console.error('Error saving tournament:', err);
        setSubmitError(`Failed to ${isEditMode ? 'update' : 'create'} tournament.`);
      } finally {
        setLoading(false);
      }
    },
    [values, isEditMode, isFormValid, navigate]
  );

  const toggleTeam = (teamId: number) => {
    const current = values.participatingTeamIds;
    const next = current.includes(teamId)
      ? current.filter((id) => id !== teamId)
      : [...current, teamId];
    onFieldChange({ target: { name: 'participatingTeamIds', value: next } } as any);
  };

  const handleAddGroup = () => {
    const newGroups = [...(values.groups || []), { name: '', teamIds: [] }];
    onFieldChange({ target: { name: 'groups', value: newGroups } } as any);
  };

  const handleRemoveGroup = (index: number) => {
    const newGroups = [...(values.groups || [])];
    newGroups.splice(index, 1);
    onFieldChange({ target: { name: 'groups', value: newGroups } } as any);
  };

  const handleGroupChange = (index: number, field: string, value: any) => {
    const newGroups = [...(values.groups || [])];
    newGroups[index] = { ...newGroups[index], [field]: value };
    onFieldChange({ target: { name: 'groups', value: newGroups } } as any);
  };

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <Card sx={{ p: { xs: 3, sm: 4 }, borderRadius: 4, boxShadow: 6 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h5" fontWeight="bold" color="primary">
                {isEditMode ? 'Update Series' : 'Create New Series'}
              </Typography>
            </Stack>
            <AppForm id="create-tournament-form" onSubmit={handleSubmit}>
              <TournamentFields
                values={values}
                onFieldChange={onFieldChange}
                fieldHasError={fieldHasError}
                fieldGetError={fieldGetError}
                submitError={submitError}
                STATUS_OPTIONS={STATUS_OPTIONS}
                TYPE_OPTIONS={TYPE_OPTIONS}
              />

              {/* Hosting Nations multi-select (Autocomplete) */}
              <Autocomplete
                multiple
                options={availableCountries}
                value={values.hostingNations || []}
                onChange={(e, newValue) =>
                  onFieldChange({ target: { name: 'hostingNations', value: newValue } } as any)
                }
                freeSolo={false}
                disableCloseOnSelect
                renderTags={(value: string[], getTagProps) =>
                  value.map((option: string, index: number) => (
                    <Chip variant="outlined" label={option} {...getTagProps({ index })} key={option} />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Hosting Nations"
                    placeholder="Select hosting nations"
                    helperText={fieldHasError('hostingNations') ? fieldGetError('hostingNations') : ''}
                    error={fieldHasError('hostingNations')}
                    {...SHARED_CONTROL_PROPS}
                    sx={{ mb: 2 }}
                  />
                )}
                sx={{ mb: 2 }}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={values.isGroup}
                    onChange={(e) =>
                      onFieldChange({ target: { name: 'isGroup', value: e.target.checked } } as any)
                    }
                  />
                }
                label="Enable Grouping"
                sx={{ mb: 2 }}
              />

              {/* ✅ Group Section */}
              {values.isGroup && (
                <Box>
                  <Typography variant="h6" fontWeight="medium" mb={1}>
                    Series Groups
                  </Typography>
                  {(values.groups || []).map((group, index) => (
                    <Box
                      key={index}
                      sx={{ border: '1px solid #ccc', borderRadius: 2, p: 2, mb: 2 }}
                    >
                      <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                        <TextField
                          label="Group Name"
                          value={group.name}
                          onChange={(e) => handleGroupChange(index, 'name', e.target.value)}
                          {...SHARED_CONTROL_PROPS}
                        />
                        <IconButton color="error" onClick={() => handleRemoveGroup(index)}>
                          <Delete />
                        </IconButton>
                      </Stack>

                      {/* Team Selection for Group */}
                      <TextField
                        select
                        label="Add Team to Group"
                        value=""
                        onChange={(e) => {
                          const teamId = Number(e.target.value);
                          const currentTeamIds = group.teamIds || [];
                          if (!currentTeamIds.includes(teamId)) {
                            handleGroupChange(index, 'teamIds', [...currentTeamIds, teamId]);
                          }
                        }}
                        fullWidth
                      >
                        {teams
                          .filter((t) => !(group.teamIds || []).includes(t.id))
                          .map((team) => (
                            <MenuItem key={team.id} value={team.id}>
                              {team.name}
                            </MenuItem>
                          ))}
                      </TextField>

                      <Stack direction="row" flexWrap="wrap" mt={2}>
                        {(group.teamIds || []).map((id) => {
                          const team = teams.find((t) => t.id === id);
                          console.log(`Rendering team: ${team ? team.name : 'Unknown'}`);

                          return (
                            <Chip
                              key={id}
                              label={team ? team.name : `Team #${id}`}
                              onDelete={() =>
                                handleGroupChange(
                                  index,
                                  'teamIds',
                                  (group.teamIds || []).filter((tid) => tid !== id)
                                )
                              }
                              color="primary"
                              sx={{ mb: 1, mr: 1 }}
                            />
                          );
                        })}
                      </Stack>
                    </Box>
                  ))}
                  <AppButton
                    variant="outlined"
                    color="secondary"
                    startIcon={<AddCircle />}
                    onClick={handleAddGroup}
                    sx={{ mb: 2 }}
                  >
                    Add Group
                  </AppButton>
                </Box>
              )}
            </AppForm>
          </Card>
        </Grid>

        {/* ✅ Participating Teams Section (still available for normal mode) */}
        {!values.isGroup && (
          <Grid size={{ xs: 12 }}>
            <Card sx={{ p: { xs: 3, sm: 4 }, borderRadius: 4, boxShadow: 6 }}>
              <Typography variant="h6" fontWeight="medium" gutterBottom>
                Participating Teams
              </Typography>
              <Stack direction="row" flexWrap="wrap" mb={2}>
                {values.participatingTeamIds.length === 0 && (
                  <Typography variant="body2" color="textSecondary">
                    No teams selected.
                  </Typography>
                )}
                {values.participatingTeamIds.map((id) => {
                  const team = teams.find((t) => t.id === id);
                  return (
                    <Chip
                      key={id}
                      label={team ? team.name : `Team #${id}`}
                      onDelete={() => toggleTeam(id)}
                      color="primary"
                      sx={{ mb: 1, mr: 1 }}
                    />
                  );
                })}
              </Stack>
              <TextField
                select
                label="Add Team"
                value=""
                onChange={(e) => {
                  const teamId = Number(e.target.value);
                  if (values.participatingTeamIds.length >= values.maxParticipants) {
                    alert(`You can select a maximum of ${values.maxParticipants} teams`);
                    return;
                  }
                  toggleTeam(teamId);
                }}
                {...SHARED_CONTROL_PROPS}
              >
                {teams
                  .filter((team) => !values.participatingTeamIds.includes(team.id))
                  .map((team) => (
                    <MenuItem key={team.id} value={team.id}>
                      {team.name}
                    </MenuItem>
                  ))}
              </TextField>
            </Card>
          </Grid>
        )}

        <Grid size={{ xs: 12 }} mt={2}>
          <AppButton
            type="submit"
            form="create-tournament-form"
            variant="contained"
            color="primary"
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <EventIcon />}
            disabled={loading}
            sx={{ minWidth: 160 }}
          >
            {loading
              ? isEditMode
                ? 'Updating...'
                : 'Creating...'
              : isEditMode
                ? 'Update Series'
                : 'Create Series'}
          </AppButton>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CreateTournamentPage;
