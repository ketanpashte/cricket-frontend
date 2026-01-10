import React, { useState, useEffect } from "react";
import {
  Grid, Typography, Box, Card, CardContent, Stack, Paper, Button,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  List, ListItem, ListItemText, ListItemIcon, Checkbox, Avatar, Divider, Chip, Alert
} from "@mui/material";
import {
  DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent
} from "@dnd-kit/core";
import {
  useSortable, SortableContext, verticalListSortingStrategy
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Star, SportsHandball, PersonAdd, Search } from "@mui/icons-material";
import { TeamInfo } from "../../../api/teams/TeamRequest";
import playerApi from "../../../api/players/playerApi";
import { teamServcie } from "../../../api/teams/teams.api";

type Player = {
  id: number;
  name: string;
  role: string
};

interface ShortPlayer {
  id: number;
  name: string;
  nationality: string;
  role: string;
}

interface Props {
  teamA?: TeamInfo;
  teamB?: TeamInfo;
  selectedPlayersA: Player[];
  selectedPlayersB: Player[];
  benchA: Player[];
  benchB: Player[];
  captainA: number;
  viceCaptainA: number;
  wicketKeeperA: number;
  captainB: number;
  viceCaptainB: number;
  wicketKeeperB: number;
  setCaptain: (playerId: number, team: "A" | "B") => void;
  setViceCaptain: (playerId: number, team: "A" | "B") => void;
  setWicketKeeper: (playerId: number, team: "A" | "B") => void;
  setSelectedPlayersA: (players: Player[]) => void;
  setSelectedPlayersB: (players: Player[]) => void;
  setBenchA: (players: Player[]) => void;
  setBenchB: (players: Player[]) => void;
}

function SortableItem({
  player,
  isCaptain,
  isViceCaptain,
  isWicketKeeper,
  onSetCaptain,
  onSetViceCaptain,
  onSetWicketKeeper
}: {
  player: Player;
  isCaptain: boolean;
  isViceCaptain: boolean;
  isWicketKeeper: boolean;
  onSetCaptain: () => void;
  onSetViceCaptain: () => void;
  onSetWicketKeeper: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: player.id });

  return (
    <Paper
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      sx={{
        width: "100%",
        mb: 1,
        px: 1.5,
        py: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        cursor: "grab",
        border: (theme) => {
          if (isCaptain) return `2px solid ${theme.palette.primary.main}`;
          if (isViceCaptain) return `2px solid ${theme.palette.success.main}`;
          if (isWicketKeeper) return `2px solid ${theme.palette.secondary.main}`;
          return `1px solid ${theme.palette.divider}`;
        },
        borderRadius: 2,
        transform: CSS.Transform.toString(transform),
        transition
      }}
      elevation={isCaptain || isViceCaptain || isWicketKeeper ? 4 : 1}
    >
      <Box display="flex" alignItems="center" gap={1} flexGrow={1}>
        <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem', bgcolor: 'grey.300' }}>
          {player.name.charAt(0).toUpperCase()}
        </Avatar>
        <Typography variant="body2" noWrap sx={{ fontWeight: 500 }}>{player.name}</Typography>
        <Box display="flex" gap={0.5}>
          {isWicketKeeper && (
            <Chip label="WK" size="small" color="secondary" sx={{ height: 20, fontSize: "0.65rem" }} />
          )}
        </Box>
      </Box>

      <Box display="flex" gap={1} alignItems="center">
        <Chip
          label="C"
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            onSetCaptain();
          }}
          onPointerDown={(e) => e.stopPropagation()} // Prevent drag start
          color={isCaptain ? "primary" : "default"}
          variant={isCaptain ? "filled" : "outlined"}
          sx={{
            minWidth: 32,
            cursor: "pointer",
            fontWeight: 'bold',
            borderColor: isCaptain ? 'primary.main' : 'text.disabled'
          }}
        />
        <Chip
          label="VC"
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            onSetViceCaptain();
          }}
          onPointerDown={(e) => e.stopPropagation()}
          color={isViceCaptain ? "success" : "default"}
          variant={isViceCaptain ? "filled" : "outlined"}
          sx={{
            minWidth: 32,
            cursor: "pointer",
            fontWeight: 'bold',
            borderColor: isViceCaptain ? 'success.main' : 'text.disabled'
          }}
        />

        <Box
          onClick={(e) => {
            e.stopPropagation();
            onSetWicketKeeper();
          }}
          onPointerDown={(e) => e.stopPropagation()}
          sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
        >
          <SportsHandball
            fontSize="small"
            color={isWicketKeeper ? "secondary" : "disabled"}
          />
        </Box>
      </Box>
    </Paper>
  );
}

export default function TeamSelection(props: Props) {
  const {
    teamA, teamB,
    selectedPlayersA, setSelectedPlayersA,
    selectedPlayersB, setSelectedPlayersB,
    benchA, setBenchA,
    benchB, setBenchB,
    captainA, viceCaptainA, wicketKeeperA,
    captainB, viceCaptainB, wicketKeeperB,
    setCaptain, setViceCaptain, setWicketKeeper
  } = props;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Add Players Dialog State
  const [addPlayerOpen, setAddPlayerOpen] = useState(false);
  const [addPlayerTeam, setAddPlayerTeam] = useState<"A" | "B" | null>(null);
  const [allPlayers, setAllPlayers] = useState<ShortPlayer[]>([]);
  const [loadingPlayers, setLoadingPlayers] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedToAdd, setSelectedToAdd] = useState<number[]>([]);
  const [savingPlayers, setSavingPlayers] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  const handleOpenAddPlayers = async (team: "A" | "B") => {
    setAddPlayerTeam(team);
    setSearchQuery("");
    setSelectedToAdd([]);
    setAddError(null);
    setAddPlayerOpen(true);

    // Fetch available players
    setLoadingPlayers(true);
    try {
      const response = await playerApi.queryPlayers({});
      if (response.data.success) {
        // Filter out players already in the team (Selected or Bench)
        // Note: For now we fetch ALL and filter in UI to avoid complex backend filters
        setAllPlayers(response.data.data as any[]);
      }
    } catch (err) {
      console.error("Failed to fetch players", err);
      setAddError("Failed to load players list.");
    } finally {
      setLoadingPlayers(false);
    }
  };

  const handleCloseAddPlayers = () => {
    setAddPlayerOpen(false);
    setAddPlayerTeam(null);
  };

  const handleTogglePlayerSelection = (id: number) => {
    const currentIndex = selectedToAdd.indexOf(id);
    const newChecked = [...selectedToAdd];

    if (currentIndex === -1) {
      newChecked.push(id);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setSelectedToAdd(newChecked);
  };

  const handleAddPlayersSubmit = async () => {
    if (!addPlayerTeam) return;
    const isTeamA = addPlayerTeam === "A";
    const teamInfo = isTeamA ? teamA : teamB;
    if (!teamInfo) return;

    setSavingPlayers(true);
    setAddError(null);

    // Get current team composition
    const currentSelected = isTeamA ? selectedPlayersA : selectedPlayersB;
    const currentBench = isTeamA ? benchA : benchB;
    const setBench = isTeamA ? setBenchA : setBenchB;

    const currentCaptain = isTeamA ? captainA : captainB;
    const currentVice = isTeamA ? viceCaptainA : viceCaptainB;

    try {
      // API expects REPLACEMENT list of players. So we must combine existing + new.
      const existingIds = [...currentSelected, ...currentBench].map(p => p.id);
      const newIds = [...existingIds, ...selectedToAdd];

      // Pass safe captain params (undefined if 0/invalid)
      const capParam = currentCaptain > 0 ? currentCaptain : undefined;
      const vcParam = currentVice > 0 ? currentVice : undefined;

      // Note: Casting to 'any' for params to avoid strict number check if undefined passed
      await teamServcie.addPlayers(
        newIds,
        teamInfo.id,
        capParam as any,
        vcParam as any
      );

      // Update local state (Append to Bench)
      // Update local state: Fill Playing XI first, then Bench
      const addedPlayerObjects = allPlayers
        .filter(p => selectedToAdd.includes(p.id))
        .map(p => ({ id: p.id, name: p.name, role: p.role }));

      const openSlots = 11 - currentSelected.length;
      let newPlaying = [...currentSelected];
      let newBench = [...currentBench];

      if (openSlots > 0) {
        const toPlaying = addedPlayerObjects.slice(0, openSlots);
        const toBench = addedPlayerObjects.slice(openSlots);
        newPlaying = [...newPlaying, ...toPlaying];
        newBench = [...newBench, ...toBench];
      } else {
        newBench = [...newBench, ...addedPlayerObjects];
      }

      if (isTeamA) {
        setSelectedPlayersA(newPlaying);
        setBenchA(newBench);
      } else {
        setSelectedPlayersB(newPlaying);
        setBenchB(newBench);
      }

      handleCloseAddPlayers();

    } catch (err) {
      console.error("Failed to add players to team", err);
      setAddError("Failed to add players. Please try again.");
    } finally {
      setSavingPlayers(false);
    }
  };


  const handleDragEnd = (event: DragEndEvent, team: "A" | "B") => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const isTeamA = team === "A";
    const bench = isTeamA ? benchA : benchB;
    const selected = isTeamA ? selectedPlayersA : selectedPlayersB;
    const setBench = isTeamA ? setBenchA : setBenchB;
    const setSelected = isTeamA ? setSelectedPlayersA : setSelectedPlayersB;

    const activeInSelected = selected.find(p => p.id === active.id);
    const overInSelected = selected.find(p => p.id === over.id);
    const activeInBench = bench.find(p => p.id === active.id);
    const overInBench = bench.find(p => p.id === over.id);

    if (activeInSelected && overInSelected) {
      const oldIndex = selected.findIndex(p => p.id === active.id);
      const newIndex = selected.findIndex(p => p.id === over.id);
      const newSelected = [...selected];
      const [moved] = newSelected.splice(oldIndex, 1);
      newSelected.splice(newIndex, 0, moved);
      setSelected(newSelected);
      return;
    }

    if (activeInBench && overInBench) {
      const oldIndex = bench.findIndex(p => p.id === active.id);
      const newIndex = bench.findIndex(p => p.id === over.id);
      const newBench = [...bench];
      const [moved] = newBench.splice(oldIndex, 1);
      newBench.splice(newIndex, 0, moved);
      setBench(newBench);
      return;
    }

    if (activeInBench && overInSelected && selected.length < 11) {
      setBench(bench.filter(p => p.id !== active.id));
      setSelected([...selected, activeInBench]);
      return;
    }

    if (activeInSelected && overInBench) {
      setSelected(selected.filter(p => p.id !== active.id));
      setBench([...bench, activeInSelected]);
      return;
    }
  };

  const renderTeamCard = (
    team: "A" | "B",
    teamInfo: TeamInfo | undefined,
    selected: Player[],
    bench: Player[],
    setSelected: (players: Player[]) => void,
    setBench: (players: Player[]) => void,
    captain: number,
    viceCaptain: number,
    wk: number
  ) => (
    <Grid size={{ xs: 12, sm: 6 }}>
      <Card variant="outlined">
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" fontWeight="bold">
              {teamInfo?.name || `Team ${team}`}
            </Typography>
            <Button
              variant="outlined"
              size="small"
              startIcon={<PersonAdd />}
              disabled={!teamInfo}
              onClick={() => handleOpenAddPlayers(team)}
            >
              Add Players
            </Button>
          </Stack>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={(event) => handleDragEnd(event, team)}
          >
            <Box mt={2}>
              <Typography variant="subtitle2">Playing XI ({selected.length}/11)</Typography>
              <SortableContext items={selected.map(p => p.id)} strategy={verticalListSortingStrategy}>
                <Stack direction="column">
                  {selected.map((p) => (
                    <SortableItem
                      key={p.id}
                      player={p}
                      isCaptain={p.id === captain}
                      isViceCaptain={p.id === viceCaptain}
                      isWicketKeeper={p.id === wk}
                      onSetCaptain={() => setCaptain(p.id, team)}
                      onSetViceCaptain={() => setViceCaptain(p.id, team)}
                      onSetWicketKeeper={() => setWicketKeeper(p.id, team)}
                    />
                  ))}
                </Stack>
              </SortableContext>
            </Box>

            <Box mt={3}>
              <Typography variant="subtitle2">Bench ({bench.length})</Typography>
              <SortableContext items={bench.map(p => p.id)} strategy={verticalListSortingStrategy}>
                <Stack direction="column">
                  {bench.map((p) => (
                    <SortableItem
                      key={p.id}
                      player={p}
                      isCaptain={false}
                      isViceCaptain={false}
                      isWicketKeeper={false}
                      onSetCaptain={() => { }}
                      onSetViceCaptain={() => { }}
                      onSetWicketKeeper={() => { }}
                    />
                  ))}
                </Stack>
              </SortableContext>
            </Box>
          </DndContext>
        </CardContent>
      </Card>
    </Grid>
  );

  // Filter players for dialog
  const currentTeamInfo = addPlayerTeam === "A" ? teamA : teamB;
  const currentSelected = addPlayerTeam === "A" ? selectedPlayersA : selectedPlayersB;
  const currentBench = addPlayerTeam === "A" ? benchA : benchB;
  const existingIds = new Set([...currentSelected, ...currentBench].map(p => p.id));

  const filteredPlayers = allPlayers
    .filter(p => !existingIds.has(p.id)) // Remove players already in team
    .filter(p => {
      const query = searchQuery.toLowerCase();
      return !searchQuery ||
        p.name.toLowerCase().includes(query) ||
        (p.nationality && p.nationality.toLowerCase().includes(query));
    });

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Team Selection – Drag & Drop
      </Typography>
      <Grid container spacing={4}>
        {renderTeamCard("A", teamA, selectedPlayersA, benchA, setSelectedPlayersA, setBenchA, captainA, viceCaptainA, wicketKeeperA)}
        {renderTeamCard("B", teamB, selectedPlayersB, benchB, setSelectedPlayersB, setBenchB, captainB, viceCaptainB, wicketKeeperB)}
      </Grid>

      {/* Add Players Dialog */}
      <Dialog open={addPlayerOpen} onClose={handleCloseAddPlayers} fullWidth maxWidth="sm">
        <DialogTitle>Add Players to {currentTeamInfo?.name || `Team ${addPlayerTeam}`}</DialogTitle>
        <DialogContent dividers>
          <Box mb={2}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search players by name or nationality..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: <Search color="action" sx={{ mr: 1 }} />,
              }}
              size="small"
            />
          </Box>
          {addError && <Alert severity="error" sx={{ mb: 2 }}>{addError}</Alert>}
          {loadingPlayers ? (
            <Typography align="center" py={4}>Loading players...</Typography>
          ) : (
            <List dense>
              {filteredPlayers.length === 0 ? (
                <Typography align="center" color="text.secondary" py={2}>
                  No players found.
                </Typography>
              ) : (
                filteredPlayers.map((player) => {
                  const labelId = `checkbox-list-label-${player.id}`;
                  return (
                    <ListItem
                      key={player.id}
                      disablePadding
                      onClick={() => handleTogglePlayerSelection(player.id)}
                    >
                      <ListItemIcon>
                        <Checkbox
                          edge="start"
                          checked={selectedToAdd.indexOf(player.id) !== -1}
                          tabIndex={-1}
                          disableRipple
                          inputProps={{ 'aria-labelledby': labelId }}
                        />
                      </ListItemIcon>
                      <ListItemText
                        id={labelId}
                        primary={player.name}
                        secondary={`${player.nationality} • ${player.role}`}
                      />
                      <Chip label={player.role} size="small" variant="outlined" />
                    </ListItem>
                  );
                })
              )}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddPlayers}>Cancel</Button>
          <Button
            onClick={handleAddPlayersSubmit}
            variant="contained"
            disabled={selectedToAdd.length === 0 || savingPlayers}
          >
            {savingPlayers ? "Adding..." : `Add ${selectedToAdd.length} Players`}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
