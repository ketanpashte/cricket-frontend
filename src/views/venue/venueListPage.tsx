import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Paper,
  Pagination,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Edit, Delete, CloudUpload, CloudDownload } from "@mui/icons-material";
import { VenueResponse } from "../../api/venue/types";
import { VenueService } from "../../api/venue/api";
import { useNavigate } from "react-router-dom";
import VenueScoringForm from "./ScoringPtternFrom";

const VenueListPage: React.FC = () => {
  const [venues, setVenues] = useState<VenueResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(0);
  const [size, setSize] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [keyword, setKeyword] = useState<string>("");

  const [openScoringModal, setOpenScoringModal] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState<VenueResponse | null>(null);

  const navigate = useNavigate();
  const venueService = new VenueService();

  const fetchVenues = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await venueService.searchVenues(keyword, page, size);
      if (response && response.data) {
        setVenues(response.data.content);
        setTotalPages(response.data.totalPages);
      } else {
        setError("Failed to load venues");
      }
    } catch (err) {
      setError("Error fetching venues");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVenues();
  }, [page, size, keyword]);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this venue?")) return;
    try {
      const res = await venueService.deleteVenue(id);
      if (res.status === 200) {
        fetchVenues();
      } else {
        alert("Failed to delete venue");
      }
    } catch {
      alert("Error deleting venue");
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;
    const file = event.target.files[0];
    try {
      await venueService.importVenues(file);
      alert("Venues imported successfully!");
      fetchVenues();
    } catch (error) {
      alert("Failed to import venues");
    }
  };

  const handleExport = async () => {
    try {
      const response = await venueService.exportVenues();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "venues.csv");
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      alert("Failed to export venues");
    }
  };



  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Venue Management
      </Typography>

      {/* Toolbar: Search + Actions */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        justifyContent="space-between"
        mb={2}
      >
        <TextField
          placeholder="Search by name, city, or country"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          size="small"
          sx={{ width: { xs: "100%", sm: "40%" } }}
        />

        <Stack direction="row" spacing={1}>
          {/* Import */}
          <Button
            variant="outlined"
            component="label"
            startIcon={<CloudUpload />}
          >
            Import
            <input
              type="file"
              accept=".csv"
              hidden
              onChange={handleImport}
            />
          </Button>

          {/* Export */}
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<CloudDownload />}
            onClick={handleExport}
          >
            Export
          </Button>

          {/* Add Venue */}
          <Button
            variant="contained"
            color="primary"
            onClick={() =>
              navigate("/venues/add", {
                state: { modal: true, title: "Add Venue" },
              })
            }
          >
            Add Venue
          </Button>
        </Stack>
      </Stack>

      {/* Table */}
      <Card>
        <CardContent>
          {loading ? (
            <Box display="flex" justifyContent="center" my={4}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : venues.length === 0 ? (
            <Typography>No venues found.</Typography>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>City</TableCell>
                    <TableCell>Country</TableCell>
                    <TableCell>Capacity</TableCell>
                    <TableCell>Pitch Type</TableCell>
                    <TableCell>Actions</TableCell>
                    <TableCell>Scoring</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {venues.map((venue) => (
                    <TableRow key={venue.id}>
                      <TableCell>{venue.name}</TableCell>
                      <TableCell>{venue.city}</TableCell>
                      <TableCell>{venue.country}</TableCell>
                      <TableCell>{venue.capacity || "N/A"}</TableCell>
                      <TableCell>{venue.pitchType || "N/A"}</TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() =>
                            navigate(`/venues/edit/${venue.id}`, {
                              state: { modal: true, title: "Edit Venue" },
                            })
                          }
                          color="primary"
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(venue.id)}
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => {
                            setSelectedVenue(venue);
                            setOpenScoringModal(true);
                          }}
                        >
                          Scoring
                        </Button>
                      </TableCell>

                    </TableRow>

                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <Box display="flex" justifyContent="center" mt={2}>
              <Pagination
                count={totalPages}
                page={page + 1}
                onChange={(e, value) => setPage(value - 1)}
                color="primary"
              />
            </Box>
          )}

          <Dialog
            open={openScoringModal}
            onClose={() => setOpenScoringModal(false)}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle>Venue Scoring</DialogTitle>
            <DialogContent>
              {selectedVenue ? (
                <VenueScoringForm venueId={selectedVenue.id} onClose={() => setOpenScoringModal(false)} />
              ) : (
                <Typography>Select a venue to edit scoring</Typography>
              )}
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </Box>
  );
};

export default VenueListPage;
