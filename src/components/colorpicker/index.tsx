import * as React from "react";
import {
  Box,
  Button,
  Popover,
  Slider,
  TextField,
  Typography,
  Grid,
  Stack,
  Paper,
  IconButton,
} from "@mui/material";
import PaletteIcon from "@mui/icons-material/Palette";

// ---- helpers
function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function hexToRgb(hex: string) {
  const h = hex.replace("#", "");
  if (!/^([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(h)) return null;
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const num = parseInt(full, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

function rgbToHex(r: number, g: number, b: number) {
  const toHex = (v: number) => clamp(v, 0, 255).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

const PRESET_SWATCHES = [
  "#000000", "#FFFFFF", "#F44336", "#E91E63", "#9C27B0", "#673AB7",
  "#3F51B5", "#2196F3", "#03A9F4", "#00BCD4", "#009688", "#4CAF50",
  "#8BC34A", "#CDDC39", "#FFEB3B", "#FFC107", "#FF9800", "#FF5722",
  "#795548", "#607D8B",
];

export type ColorValue = string; // hex like #RRGGBB

export function MuiColorPicker({
  value,
  onChange,
  label = "Color",
  swatches = PRESET_SWATCHES,
}: {
  value: ColorValue;
  onChange: (hex: ColorValue) => void;
  label?: string;
  swatches?: string[];
}) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);
  const id = open ? "mui-color-popover" : undefined;

  const rgb = React.useMemo(() => hexToRgb(value) ?? { r: 0, g: 0, b: 0 }, [value]);
  const [r, setR] = React.useState(rgb.r);
  const [g, setG] = React.useState(rgb.g);
  const [b, setB] = React.useState(rgb.b);
  const [hexInput, setHexInput] = React.useState(value);

  React.useEffect(() => {
    // sync internal state when external value changes
    const h2r = hexToRgb(value);
    if (h2r) {
      setR(h2r.r); setG(h2r.g); setB(h2r.b); setHexInput(value);
    }
  }, [value]);

  const commitRgb = (nr: number, ng: number, nb: number) => {
    const hex = rgbToHex(nr, ng, nb);
    onChange(hex);
  };

  const handleHexBlur = () => {
    const parsed = hexToRgb(hexInput);
    if (parsed) onChange(rgbToHex(parsed.r, parsed.g, parsed.b));
    else setHexInput(value); // revert invalid
  };

  return (
    <>
      <Stack direction="row" spacing={1} alignItems="center">
        <Button
          aria-describedby={id}
          variant="outlined"
          startIcon={<PaletteIcon />}
          onClick={(e) => setAnchorEl(e.currentTarget)}
          sx={{ textTransform: "none" }}
        >
          <Box
            sx={{
              width: 18,
              height: 18,
              borderRadius: 0.5,
              bgcolor: value,
              border: "1px solid",
              borderColor: "divider",
              mr: 1,
            }}
          />
          {label}
        </Button>
        <TextField
          size="small"
          label="HEX"
          value={hexInput}
          onChange={(e) => setHexInput(e.target.value.startsWith('#') ? e.target.value : `#${e.target.value}`)}
          onBlur={handleHexBlur}
          inputProps={{ maxLength: 7 }}
        />
      </Stack>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        PaperProps={{ sx: { p: 2, width: 360 } }}
      >
        <Stack spacing={2}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Paper variant="outlined" sx={{ p: 1 }}>
              <Box sx={{ width: 72, height: 72, borderRadius: 1, bgcolor: value, border: "1px solid", borderColor: "divider" }} />
            </Paper>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" color="text.secondary">RGB</Typography>
              <Stack spacing={1}>
                <Slider
                  value={r}
                  min={0}
                  max={255}
                  onChange={(_, val) => setR(val as number)}
                  onChangeCommitted={(_, val) => commitRgb(val as number, g, b)}
                  valueLabelDisplay="auto"
                />
                <Slider
                  value={g}
                  min={0}
                  max={255}
                  onChange={(_, val) => setG(val as number)}
                  onChangeCommitted={(_, val) => commitRgb(r, val as number, b)}
                  valueLabelDisplay="auto"
                />
                <Slider
                  value={b}
                  min={0}
                  max={255}
                  onChange={(_, val) => setB(val as number)}
                  onChangeCommitted={(_, val) => commitRgb(r, g, val as number)}
                  valueLabelDisplay="auto"
                />
              </Stack>
            </Box>
          </Stack>

          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Swatches</Typography>
            <Grid container spacing={1} columns={20}>
              {swatches.map((c) => (
                <Grid size={{ xs: 4, sm: 2 }} key={c}>
                  <IconButton
                    size="small"
                    onClick={() => onChange(c)}
                    sx={{
                      width: 28,
                      height: 28,
                      p: 0,
                      borderRadius: 1,
                      border: value === c ? "2px solid" : "1px solid",
                      borderColor: value === c ? "primary.main" : "divider",
                      bgcolor: c,
                    }}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>

          <Stack direction="row" spacing={1} alignItems="center">
            <Button
              variant="outlined"
              component="label"
              fullWidth
            >
              Native picker
              <input
                type="color"
                value={value}
                onChange={(e) => onChange(e.target.value.toUpperCase())}
                style={{ display: "none" }}
              />
            </Button>
            <Button variant="contained" onClick={() => setAnchorEl(null)}>Done</Button>
          </Stack>
        </Stack>
      </Popover>
    </>
  );
}

export default function ColorPickerDemo() {
  const [color, setColor] = React.useState<string>("#1976D2");

  return (
    <Box sx={{ p: 3, maxWidth: 640 }}>
      <Typography variant="h5" gutterBottom>
        MUI Color Picker (Custom)
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        A lightweight color picker built with @mui/material. Adjust RGB sliders, pick from swatches, type a HEX code, or open the native browser color picker.
      </Typography>

      <Stack spacing={2} sx={{ mt: 2 }}>
        <MuiColorPicker value={color} onChange={setColor} label="Pick color" />

        <Paper variant="outlined" sx={{ p: 2 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Box sx={{ width: 48, height: 48, borderRadius: 1, bgcolor: color, border: "1px solid", borderColor: "divider" }} />
            <Box>
              <Typography variant="body2">Selected:</Typography>
              <Typography variant="subtitle1" sx={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace' }}>
                {color}
              </Typography>
            </Box>
          </Stack>
        </Paper>

        <Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Usage
          </Typography>
          <Paper variant="outlined" sx={{ p: 2, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace', fontSize: 13, overflowX: 'auto' }}>
            {`import { MuiColorPicker } from "./MuiColorPicker";

function MyForm() {
  const [color, setColor] = React.useState("#FF5722");
  return (
    <MuiColorPicker value={color} onChange={setColor} label="Brand color" />
  );
}`}
          </Paper>
        </Box>
      </Stack>
    </Box>
  );
}
