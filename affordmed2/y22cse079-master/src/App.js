// App.js
import React from "react";
import { Container, Typography } from "@mui/material";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import ShortenerForm from './components/ShortenerForm';
import ShortenedList from './components/ShortenedList';
import RedirectHandler from './components/RedirectHandler';

function App() {
  return (
    <BrowserRouter>
      <Container maxWidth="md" sx={{ mt: 5 }}>
        <Typography variant="h3" gutterBottom align="center">
          URL Shortener
        </Typography>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <ShortenerForm />
                <ShortenedList />
              </>
            }
          />
          <Route path="/short/:shortcode" element={<RedirectHandler />} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
}

export default App;