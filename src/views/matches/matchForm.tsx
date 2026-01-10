import React, { useEffect, useState, useCallback, SyntheticEvent, useRef } from 'react';
import {
  Box, Card, Grid, TextField, Typography, useTheme,
  MenuItem, Stack, CircularProgress, Alert, Autocomplete,
  Avatar,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import { Event as EventIcon } from '@mui/icons-material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

import { useAppForm } from '../../utils';
import { AppButton, AppForm } from '../../components';
import { MATCH_TYPE_OPTIONS, MatchRequest } from '../../api/match/matchRequest';
import { MatchResponse } from '../../api/match/matchResponse';
import { tournamentService } from '../../api/tournamnet/tournament.api';
import { ShortTournamentResponse } from '../../api/tournamnet/tournamentResponse';
import { useAppStore } from '../../store';
import { MatchService } from '../../api/match/matches.api';
import { VenueService } from '../../api/venue/api';

// Extend validation schema
const VALIDATE_MATCH_FORM = {
  tournamentId: {
    presence: { allowEmpty: false, message: '^Tournament is required' },
  },
  teamAId: {
    presence: { allowEmpty: false, message: '^Team A is required' },
  },
  teamBId: {
    presence: { allowEmpty: false, message: '^Team B is required' },
  },
  venueId: {
    presence: { allowEmpty: false, message: '^Venue is required' },
  },
  totalOvers: {
    presence: { allowEmpty: false, message: '^Match type is required' },
    numericality: {
      onlyInteger: true,
      greaterThan: 0,
      message: '^Total overs must be a positive number',
    },
  },
  startTime: {
    presence: { allowEmpty: false, message: '^Start time is required' },
  },
  endTime: {
    presence: { allowEmpty: false, message: '^End time is required' },
  },
  groundUmpire1: {
    presence: { allowEmpty: true },
  },
  groundUmpire2: {
    presence: { allowEmpty: true },
  },
  thirdUmpire: {
    presence: { allowEmpty: true },
  },
};

type CreateMatchPageProps = {
  matchInfo?: MatchResponse;
};

const CreateMatchPage: React.FC<CreateMatchPageProps> = ({ matchInfo }) => {
  const [searchParams] = useSearchParams();
  const tournamentIdFromQuery = searchParams.get('tournamentId');

  const theme = useTheme();
  const navigate = useNavigate();

  const [teams, setTeams] = useState<{ teamId: number; teamName: string; logUrl?: string }[]>([]);
  const [tournaments, setTournaments] = useState<ShortTournamentResponse[]>([]);
  const [venues, setVenues] = useState<{ id: number; name: string; city: string; country?: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isDataReady, setIsDataReady] = useState(false);

  // New states:
  const [availableHostingNations, setAvailableHostingNations] = useState<string[]>([]);
  const [selectedHostingNation, setSelectedHostingNation] = useState<string | null>(matchInfo?.hostingNation || null);
  const [loadingVenuesByCountry, setLoadingVenuesByCountry] = useState(false);
  const [venueFetchError, setVenueFetchError] = useState<string | null>(null);

  const [_, dispatch] = useAppStore();
  const matchService = useRef<MatchService>(new MatchService(dispatch)).current;
  const venueService = useRef(new VenueService()).current;

  const { formState, onFieldChange, fieldGetError, fieldHasError, isFormValid } = useAppForm({
    validationSchema: VALIDATE_MATCH_FORM,
    initialValues: {
      matchId: matchInfo?.id || 0,
      tournamentId: matchInfo?.tournamentId || 0,
      teamAId: matchInfo?.teamA?.teamId || 0,
      teamBId: matchInfo?.teamB?.teamId || 0,
      startTime: matchInfo?.startTime || Date.now(),
      endTime: matchInfo?.endTime || dayjs().add(3, 'hour').valueOf(),
      status: matchInfo?.matchStatus || 'UPCOMING',
      totalOvers: matchInfo?.totalOvers || '',
      venueId: matchInfo?.venueId || 0,
      groundUmpire1: matchInfo?.groundUmpire1 || '',
      groundUmpire2: matchInfo?.groundUmpire2 || '',
      thirdUmpire: matchInfo?.thirdUmpire || '',
      // new: hostingNation persisted in form values so it can be submitted if desired
      hostingNation: matchInfo?.hostingNation || null,
    } as MatchRequest,
  });

  const values = formState.values as MatchRequest;

  // initial load: get a small list of venues (will be replaced when a country is chosen)
  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const res = await venueService.searchVenues('', 0, 50);
        setVenues(res.data?.content ?? res.data ?? []);
      } catch (error) {
        console.error('Failed to fetch venues:', error);
      }
    };
    fetchVenues();
  }, [venueService]);

  /** Fetch tournaments */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const tourRes = await tournamentService.queryTournament();
        setTournaments(tourRes.data.data);
        if (tournamentIdFromQuery) {
          const defaultTournament = tourRes.data.data.find(t => t.id === Number(tournamentIdFromQuery));
          if (defaultTournament) {
            onFieldChange({
              target: { name: 'tournamentId', value: defaultTournament.id },
            } as any);
          }
        }
        setIsDataReady(true);
      } catch (error) {
        console.error('Failed to fetch initial data:', error);
      }
    };
    fetchData();
  }, [tournamentIdFromQuery, onFieldChange]);

  /** Fetch teams & hosting nations when tournament changes */
  useEffect(() => {
    if (!values.tournamentId) {
      setTeams([]);
      setAvailableHostingNations([]);
      // keep selectedHostingNation if it came from matchInfo and tournament still relevant
      return;
    }

    const fetchTournamentTeamsAndHosting = async () => {
      try {
        const res = await tournamentService.getTournamentInfo(values.tournamentId);
        const tournamentData = res.data.data;

        // extract teams (groups or participatingTeams)
        if (tournamentData.groups && tournamentData.groups.length > 0) {
          const allTeams = tournamentData.groups.flatMap(group => group.teams || []);
          setTeams(allTeams);
        } else {
          setTeams(tournamentData.participatingTeams ?? []);
        }

        // extract hosting nations (if available on tournament object)
        const hostingNations: string[] = Array.isArray(tournamentData.hostingNations)
          ? tournamentData.hostingNations
          : [];

        setAvailableHostingNations(hostingNations);

        // PREFILL logic:
        // 1) If matchInfo provided and has hostingNation that exists in tournament.hostingNations -> select it
        // 2) Else if tournament has exactly 1 hosting nation -> select it
        // 3) Else clear selection
        const matchHosting = matchInfo?.hostingNation;
        if (matchHosting && hostingNations.includes(matchHosting)) {
          setSelectedHostingNation(matchHosting);
          onFieldChange({ target: { name: 'hostingNation', value: matchHosting } } as any);
          await fetchVenuesByCountry(matchHosting);
        } else if (hostingNations.length === 1) {
          const single = hostingNations[0];
          setSelectedHostingNation(single);
          onFieldChange({ target: { name: 'hostingNation', value: single } } as any);
          await fetchVenuesByCountry(single);
        } else {
          // don't clobber a matchInfo selection that doesn't belong to this tournament; clear if not applicable
          setSelectedHostingNation(prev => {
            // if prev exists and is part of new hostingNations keep it; otherwise clear
            if (prev && hostingNations.includes(prev)) return prev;
            return null;
          });
          // keep hostingNation in form only if validated above, otherwise set null
          if (!matchHosting || !hostingNations.includes(matchHosting)) {
            onFieldChange({ target: { name: 'hostingNation', value: null } } as any);
          }
        }
      } catch (error) {
        console.error('Failed to fetch tournament info:', error);
        setTeams([]);
        setAvailableHostingNations([]);
      }
    };

    // run the fetch
    fetchTournamentTeamsAndHosting();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.tournamentId]);

  // function to fetch venues by country with fallbacks for method names
  const fetchVenuesByCountry = async (country: string) => {
    setVenueFetchError(null);
    setLoadingVenuesByCountry(true);
    try {
      // Prefer a direct method if available
      if (typeof (venueService as any).findByCountry === 'function') {
        const resp = await (venueService as any).findByCountry(country);
        const content = resp?.data?.content ?? resp?.data ?? resp;
        if (Array.isArray(content)) {
          setVenues(content);
        } else if (Array.isArray(content?.content)) {
          setVenues(content.content);
        } else {
          setVenues([]);
        }
        return;
      }

      // fallback: maybe searchVenues accepts country as query
      if (typeof (venueService as any).searchVenues === 'function') {
        try {
          const resp = await (venueService as any).searchVenues(country, 0, 200);
          const content = resp?.data?.content ?? resp?.data ?? resp;
          if (Array.isArray(content)) {
            setVenues(content);
            return;
          } else if (Array.isArray(content?.content)) {
            setVenues(content.content);
            return;
          }
        } catch (e) {
          console.warn('searchVenues(country) failed, attempting other patterns', e);
        }
      }

      // final fallback: load all venues and filter by city/country if available
      const allResp = await venueService.searchVenues('', 0, 500);
      const all = allResp?.data?.content ?? allResp?.data ?? [];
      const filtered = Array.isArray(all) ? all.filter((v: any) => {
        const cityOrCountry = `${v.city || ''} ${(v.country || '')}`.toLowerCase();
        return cityOrCountry.includes(country.toLowerCase());
      }) : [];
      setVenues(filtered.length ? filtered : all);
    } catch (err) {
      console.error('Failed to fetch venues for country', country, err);
      setVenueFetchError('Failed to load venues for selected country.');
      setVenues([]);
    } finally {
      setLoadingVenuesByCountry(false);
    }
  };

  const handleSubmit = useCallback(
    async (e: SyntheticEvent) => {
      e.preventDefault();
      setSubmitError(null);

      if (!isFormValid()) {
        setSubmitError('Please fix the errors before submitting.');
        return;
      }

      setLoading(true);
      try {
        const payload: MatchRequest = {
          ...values,
          startTime: typeof values.startTime === 'string' ? dayjs(values.startTime).valueOf() : values.startTime,
          endTime: typeof values.endTime === 'string' ? dayjs(values.endTime).valueOf() : values.endTime,
          totalOvers: Number(values.totalOvers),
        };

        await matchService.saveMatch(payload);
        navigate('/matches');
      } catch (error) {
        console.error('Error creating match:', error);
        setSubmitError('Failed to create match.');
      } finally {
        setLoading(false);
      }
    },
    [values, isFormValid, navigate, matchService]
  );

  if (!isDataReady) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  const availableTeamsForA = teams.filter((team) => team.teamId !== values.teamBId);
  const availableTeamsForB = teams.filter((team) => team.teamId !== values.teamAId);

  return (
    <Box sx={{ backgroundColor: theme.palette.background.default, minHeight: '100vh', p: { xs: 2, sm: 4 } }}>
      <Card sx={{ p: { xs: 2, sm: 4 }, borderRadius: 4, boxShadow: 6 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h5" fontWeight="bold" color="primary">
            {matchInfo ? 'Edit Match' : 'Create Match'}
          </Typography>
          <AppButton
            type="submit"
            form="create-match-form"
            variant="contained"
            color="primary"
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <EventIcon />}
            disabled={!isFormValid() || loading}
          >
            {loading ? 'Saving...' : matchInfo ? 'Update Match' : 'Create Match'}
          </AppButton>
        </Stack>

        <AppForm id="create-match-form" onSubmit={handleSubmit}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Grid container spacing={3}>
              {/* Tournament */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  select
                  fullWidth
                  label="Tournament"
                  name="tournamentId"
                  value={values.tournamentId}
                  onChange={onFieldChange}
                  error={fieldHasError('tournamentId')}
                  helperText={fieldGetError('tournamentId') || ' '}
                >
                  {tournaments.map((t) => (
                    <MenuItem key={t.id} value={t.id}>
                      {t.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {/* Team A */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  select
                  fullWidth
                  label="Team A"
                  name="teamAId"
                  value={values.teamAId}
                  onChange={onFieldChange}
                  error={fieldHasError('teamAId')}
                  helperText={fieldGetError('teamAId') || ' '}
                >
                  {availableTeamsForA.map((team) => (
                    <MenuItem key={team.teamId} value={team.teamId}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Avatar src={team.logUrl} sx={{ width: 24, height: 24 }} />
                        <Typography>{team.teamName}</Typography>
                      </Stack>
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {/* Team B */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  select
                  fullWidth
                  label="Team B"
                  name="teamBId"
                  value={values.teamBId}
                  onChange={onFieldChange}
                  error={fieldHasError('teamBId')}
                  helperText={fieldGetError('teamBId') || ' '}
                >
                  {availableTeamsForB.map((team) => (
                    <MenuItem key={team.teamId} value={team.teamId}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Avatar src={team.logUrl} sx={{ width: 24, height: 24 }} />
                        <Typography>{team.teamName}</Typography>
                      </Stack>
                    </MenuItem>

                  ))}
                </TextField>
              </Grid>

              {/* Hosting Nation (NEW) - show only if tournament provides hosting nations */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <Autocomplete
                  options={availableHostingNations}
                  value={selectedHostingNation}
                  onChange={async (_, newValue) => {
                    setSelectedHostingNation(newValue);
                    onFieldChange({ target: { name: 'hostingNation', value: newValue } } as any);

                    if (newValue) {
                      await fetchVenuesByCountry(newValue);
                      // if a venue was previously selected but not in the new list, clear it
                      const newVenue = venues.find(v => v.id === values.venueId);
                      if (!newVenue) {
                        onFieldChange({ target: { name: 'venueId', value: 0 } } as any);
                      }
                    } else {
                      // cleared selection: reset venues to empty or initial
                      setVenues([]);
                      onFieldChange({ target: { name: 'venueId', value: 0 } } as any);
                    }
                  }}
                  disabled={availableHostingNations.length === 0}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Hosting Nation"
                      helperText={availableHostingNations.length === 0 ? 'No hosting nations available for selected tournament' : ' '}
                    />
                  )}
                />
              </Grid>

              {/* Venue (depends on hosting nation) */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <Autocomplete
                  options={venues}
                  getOptionLabel={(option) => `${option.name} (${option.city})`}
                  value={venues.find((v) => v.id === values.venueId) || null}
                  onChange={(_, newValue) => {
                    onFieldChange({
                      target: { name: 'venueId', value: newValue ? newValue.id : 0 },
                    } as any);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Venue"
                      error={fieldHasError('venueId')}
                      helperText={fieldGetError('venueId') || (loadingVenuesByCountry ? 'Loading venues for selected country...' : ' ')}
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {loadingVenuesByCountry ? <CircularProgress size={20} /> : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                />
                {venueFetchError && <Typography variant="caption" color="error">{venueFetchError}</Typography>}
              </Grid>

              {/* Match Type */}
              <Grid size={{ xs: 12 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Match Type
                </Typography>
                <Stack direction="row" flexWrap="wrap" spacing={2}>
                  <ToggleButtonGroup
                    value={values.totalOvers}
                    exclusive
                    onChange={(_, val) => val && onFieldChange({ target: { name: 'totalOvers', value: val } } as any)}
                  >
                    {MATCH_TYPE_OPTIONS.map((option) => (
                      <ToggleButton key={option.label} value={Number(option.overs)}>
                        {option.label}
                      </ToggleButton>
                    ))}
                  </ToggleButtonGroup>
                </Stack>
                {fieldHasError('totalOvers') && (
                  <Typography variant="caption" color="error">
                    {fieldGetError('totalOvers')}
                  </Typography>
                )}
              </Grid>

              {/* Start Time */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <DateTimePicker
                  label="Start Time"
                  value={dayjs(values.startTime)}
                  onChange={(newValue) => {
                    if (newValue) {
                      onFieldChange({
                        target: { name: 'startTime', value: newValue.valueOf() },
                      } as any);
                    }
                  }}
                  disablePast
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: fieldHasError('startTime'),
                      helperText: fieldGetError('startTime') || ' ',
                    },
                  }}
                />
              </Grid>

              {/* End Time */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <DateTimePicker
                  label="End Time"
                  value={dayjs(values.endTime)}
                  onChange={(newValue) => {
                    if (newValue) {
                      onFieldChange({
                        target: { name: 'endTime', value: newValue.valueOf() },
                      } as any);
                    }
                  }}
                  disablePast
                  minDateTime={dayjs(values.startTime)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: fieldHasError('endTime'),
                      helperText: fieldGetError('endTime') || ' ',
                    },
                  }}
                />
              </Grid>

              {/* Ground Umpire 1 */}
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  label="Ground Umpire 1"
                  name="groundUmpire1"
                  value={values.groundUmpire1}
                  onChange={onFieldChange}
                  error={fieldHasError('groundUmpire1')}
                  helperText={fieldGetError('groundUmpire1') || ' '}
                />
              </Grid>

              {/* Ground Umpire 2 */}
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  label="Ground Umpire 2"
                  name="groundUmpire2"
                  value={values.groundUmpire2}
                  onChange={onFieldChange}
                  error={fieldHasError('groundUmpire2')}
                  helperText={fieldGetError('groundUmpire2') || ' '}
                />
              </Grid>

              {/* Third Umpire */}
              <Grid size={{ xs: 12,md:4 }}>
                <TextField
                  fullWidth
                  label="Third Umpire"
                  name="thirdUmpire"
                  value={values.thirdUmpire}
                  onChange={onFieldChange}
                  error={fieldHasError('thirdUmpire')}
                  helperText={fieldGetError('thirdUmpire') || ' '}
                />
              </Grid>

              {/* Error */}
              {submitError && (
                <Grid size={{ xs: 12 }}>
                  <Alert severity="error">{submitError}</Alert>
                </Grid>
              )}
            </Grid>
          </LocalizationProvider>
        </AppForm>
      </Card>
    </Box>
  );
};

export default CreateMatchPage;
