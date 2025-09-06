import React, { useState } from "react";
import { Paper, Box, TextField, Button } from "@mui/material";
import { createShortUrl } from "../urlShortenerService";
import { validateUrl, validateValidity, validateShortcode } from "../utils/validation";

const MAX_URLS = 5;

function ShortenerForm() {
  const [inputs, setInputs] = useState([
    { longUrl: "", validityMins: 30, preferredShortcode: "" }
  ]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (i, field, value) => {
    const clone = [...inputs];
    clone[i][field] = value;
    setInputs(clone);
  };

  const addInput = () => {
    if (inputs.length < MAX_URLS) {
      setInputs([...inputs, { longUrl: "", validityMins: 30, preferredShortcode: "" }]);
    }
  };

  const onShorten = () => {
    setError("");
    setSuccess("");
    try {
      inputs.forEach((inp) => {
        if (!validateUrl(inp.longUrl)) throw new Error("Invalid URL: " + inp.longUrl);
        if (!validateValidity(inp.validityMins)) throw new Error("Invalid validity minutes");
        if (!validateShortcode(inp.preferredShortcode)) throw new Error("Invalid shortcode: " + inp.preferredShortcode);
        createShortUrl(inp);
      });
      setSuccess("Shortened successfully!");
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Box display="flex" flexDirection="column" gap={2}>
        {inputs.map((inp, idx) => (
          <Box key={idx} display="flex" gap={2}>
            <TextField
              label="Long URL"
              required
              fullWidth
              value={inp.longUrl}
              onChange={(e) => handleChange(idx, "longUrl", e.target.value)}
              error={inp.longUrl.length > 0 && !validateUrl(inp.longUrl)}
            />
            <TextField
              label="Validity Minutes"
              type="number"
              value={inp.validityMins}
              onChange={(e) => handleChange(idx, "validityMins", e.target.value)}
              error={!validateValidity(inp.validityMins)}
            />
            <TextField
              label="Preferred Shortcode (optional)"
              value={inp.preferredShortcode}
              onChange={(e) => handleChange(idx, "preferredShortcode", e.target.value)}
              error={inp.preferredShortcode.length > 0 && !validateShortcode(inp.preferredShortcode)}
            />
          </Box>
        ))}
        <Box>
          <Button variant="outlined" onClick={addInput} disabled={inputs.length >= MAX_URLS}>
            Add URL
          </Button>
          <Button sx={{ ml: 2 }} variant="contained" onClick={onShorten}>
            Shorten
          </Button>
        </Box>
        {error && <Box color="error.main">{error}</Box>}
        {success && <Box color="success.main">{success}</Box>}
      </Box>
    </Paper>
  );
}

export default ShortenerForm;
