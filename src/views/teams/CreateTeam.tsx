import React, { SyntheticEvent, useCallback, useState } from "react";
import {
  Box,
  Grid,
  TextField,
  Typography,
  CircularProgress,
  Alert,
  Stack,
  Paper,
} from "@mui/material";
import { GroupAdd as GroupAddIcon, CloudUpload } from "@mui/icons-material";
import { fileService } from "../../api/common/file.api";
import { AppButton, AppForm } from "../../components";
import { SHARED_CONTROL_PROPS, useAppForm } from "../../utils";
import { useNavigate } from "react-router-dom";
import { teamServcie } from "../../api/teams/teams.api";
import { TeamInfo, TeamRequest } from "../../api/teams/TeamRequest";
import { MuiColorPicker } from "../../components/colorpicker";

const VALIDATE_TEAM_FORM: Record<string, any> = {
  name: {
    presence: { allowEmpty: false, message: "^Team name is required" },
    length: { minimum: 3, message: "^Team name must be at least 3 characters" },
  },
  shortCode: {
    presence: { allowEmpty: false, message: "^Short code is required" },
    length: {
      maximum: 5,
      message: "^Short code must be 5 characters or fewer",
    },
  },
  logoUrl: {
    format: {
      pattern: /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg|webp))?$/,
      message: "^Logo URL must be a valid image URL",
    },
  },
  bgImage: {
    format: {
      pattern: /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg|webp))?$/,
      message: "^Background image URL must be a valid image URL",
    },
  },
  coach: {
    length: {
      maximum: 50,
      message: "^Coach name must be 50 characters or fewer",
    },
  },
  colorCode: {
    presence: { allowEmpty: false, message: "^Team color is required" },
  },
};

type CreateTeamPageProps = { teamInfo?: TeamInfo };

const CreateTeamPage: React.FC<CreateTeamPageProps> = ({ teamInfo }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const isEditMode = Boolean(teamInfo);

  const { formState, onFieldChange, fieldGetError, fieldHasError, isFormValid } =
    useAppForm({
      validationSchema: VALIDATE_TEAM_FORM,
      initialValues: {
        name: teamInfo?.name || "",
        shortCode: teamInfo?.shortCode || "",
        logoUrl: teamInfo?.logoUrl || "",
        bgImage: teamInfo?.bgImage || "",
        coach: teamInfo?.coach || "",
        colorCode: teamInfo?.colorCode || "#1976D2",
      } as Partial<TeamRequest>,
    });

  const values = formState.values as TeamRequest;

  const handleSubmit = useCallback(
    async (event: SyntheticEvent) => {
      event.preventDefault();
      setLoading(true);
      setSubmitError(null);

      if (!isFormValid()) {
        setSubmitError("Please fix the errors in the form before submitting.");
        setLoading(false);
        return;
      }

      try {
        if (isEditMode) {
          await teamServcie.updateTeam(values, teamInfo!.id);
        } else {
          await teamServcie.creaetTeam(values);
        }
        navigate("/teams");
      } catch (error) {
        console.error("Error submitting team:", error);
        setSubmitError(
          `Failed to ${isEditMode ? "update" : "create"} team.`
        );
      } finally {
        setLoading(false);
      }
    },
    [values, isEditMode, teamInfo, isFormValid, navigate]
  );

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      alert("Please upload a valid JPG or PNG image.");
      return;
    }

    try {
      // Use a temporary loading indicator if needed, or just global loading
      setLoading(true);
      const response = await fileService.uploadFile(file);
      if (response.data && response.data.data) {
        onFieldChange({ target: { name: fieldName, value: response.data.data } } as any);
      }
    } catch (e) {
      console.error("Upload failed", e);
      alert("Failed to upload image");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <AppForm id="create-team-form" onSubmit={handleSubmit}>
        {submitError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {submitError}
          </Alert>
        )}

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography variant="h4" fontWeight="bold">
            {isEditMode ? "Edit Team Info" : "Create Team"}
          </Typography>

          <AppButton
            type="submit"
            variant="contained"
            color="primary"
            startIcon={loading ? <CircularProgress size={20} /> : <GroupAddIcon />}
            disabled={!isFormValid() || loading}
            sx={{ minWidth: 160 }}
          >
            {loading
              ? isEditMode
                ? "Updating..."
                : "Creating..."
              : isEditMode
                ? "Update Team"
                : "Create Team"}
          </AppButton>
        </Stack>

        {/* Basic Info Section */}
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" mb={2}>
            Basic Info
          </Typography>
          <Grid container spacing={2}>
            {/* Team Name */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Team Name"
                name="name"
                required
                value={values.name}
                error={fieldHasError("name")}
                helperText={fieldGetError("name") || " "}
                onChange={onFieldChange}
                {...SHARED_CONTROL_PROPS}
              />
            </Grid>

            {/* Short Code */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Short Code"
                name="shortCode"
                required
                value={values.shortCode}
                error={fieldHasError("shortCode")}
                helperText={fieldGetError("shortCode") || " "}
                onChange={onFieldChange}
                {...SHARED_CONTROL_PROPS}
              />
            </Grid>

            {/* Logo URL with preview and upload */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Stack direction="row" spacing={1} alignItems="flex-start">
                <TextField
                  label="Logo URL"
                  name="logoUrl"
                  value={values.logoUrl}
                  error={fieldHasError("logoUrl")}
                  helperText={fieldGetError("logoUrl") || " "}
                  onChange={onFieldChange}
                  fullWidth
                  {...SHARED_CONTROL_PROPS}
                />
                <AppButton
                  variant="outlined"
                  component="label"
                  startIcon={<CloudUpload />}
                  sx={{ minWidth: 100, height: 56, mb: 3 }} // align with input
                >
                  Upload
                  <input
                    type="file"
                    hidden
                    accept="image/png, image/jpeg, image/jpg"
                    onChange={(e) => handleFileUpload(e, 'logoUrl')}
                  />
                </AppButton>
              </Stack>
              {values.logoUrl && !fieldHasError("logoUrl") && (
                <Box mt={1}>
                  <img
                    src={values.logoUrl}
                    alt="Team Logo Preview"
                    style={{ maxWidth: "100px", maxHeight: "100px", borderRadius: 8 }}
                  />
                </Box>
              )}
            </Grid>

            {/* Background Image with preview and upload */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Stack direction="row" spacing={1} alignItems="flex-start">
                <TextField
                  label="Background Banner Image"
                  name="bgImage"
                  value={values.bgImage}
                  error={fieldHasError("bgImage")}
                  helperText={fieldGetError("bgImage") || " "}
                  onChange={onFieldChange}
                  fullWidth
                  {...SHARED_CONTROL_PROPS}
                />
                <AppButton
                  variant="outlined"
                  component="label"
                  startIcon={<CloudUpload />}
                  sx={{ minWidth: 100, height: 56, mb: 3 }}
                >
                  Upload
                  <input
                    type="file"
                    hidden
                    accept="image/png, image/jpeg, image/jpg"
                    onChange={(e) => handleFileUpload(e, 'bgImage')}
                  />
                </AppButton>
              </Stack>
              {values.bgImage && !fieldHasError("bgImage") && (
                <Box mt={1}>
                  <img
                    src={values.bgImage}
                    alt="Background Preview"
                    style={{ maxWidth: "100%", maxHeight: "120px", borderRadius: 8 }}
                  />
                </Box>
              )}
            </Grid>

            {/* Coach */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Coach"
                name="coach"
                value={values.coach}
                error={fieldHasError("coach")}
                helperText={fieldGetError("coach") || " "}
                onChange={onFieldChange}
                {...SHARED_CONTROL_PROPS}
              />
            </Grid>

            {/* Team Color Picker */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <MuiColorPicker
                value={values.colorCode}
                onChange={(hex) =>
                  onFieldChange({
                    target: { name: "colorCode", value: hex },
                  } as any)
                }
                label="Team Color"
              />
              <Typography variant="caption" color="text.secondary">
                Pick a primary color for your team
              </Typography>
              {fieldHasError("colorCode") && (
                <Typography variant="caption" color="error">
                  {fieldGetError("colorCode")}
                </Typography>
              )}
            </Grid>
          </Grid>
        </Paper>
      </AppForm>
    </Box>
  );
};

export default CreateTeamPage;
