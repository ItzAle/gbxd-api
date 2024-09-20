import React from "react";
import {
  Typography,
  Box,
  Button,
  Paper,
  Grid,
  Alert,
} from "@mui/material";
import BasicInfoForm from "../BasicInfoForm";
import GenrePlatformSelector from "../GenrePlatformSelector";
import StoreLinksForm from "../StoreLinksForm";
import DescriptionForm from "../DescriptionForm/DescriptionForm";
import AliasesFranchisesForm from "../AliasesFranchisesForm/AliasesFranchisesForm";

const AddGameFormV2 = ({
  formData,
  setFormData,
  handleSubmit,
  isSubmitting,
  errors,
  validateUrl,
  setShowGenresModal,
  setShowPlatformsModal,
  isMobile,
}) => {
  return (
    <form onSubmit={handleSubmit}>
      <Typography variant={isMobile ? "h4" : "h2"} gutterBottom>
        Añadir Nuevo Juego
      </Typography>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <BasicInfoForm
              formData={formData}
              setFormData={setFormData}
              validateUrl={validateUrl}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <DescriptionForm formData={formData} setFormData={setFormData} />
          </Grid>
          <Grid item xs={12}>
            <GenrePlatformSelector
              formData={formData}
              setFormData={setFormData}
              setShowGenresModal={setShowGenresModal}
              setShowPlatformsModal={setShowPlatformsModal}
            />
          </Grid>
          <Grid item xs={12}>
            <StoreLinksForm formData={formData} setFormData={setFormData} />
          </Grid>
          <Grid item xs={12}>
            <AliasesFranchisesForm
              aliases={formData.aliases}
              setAliases={(newAliases) => setFormData({ ...formData, aliases: newAliases })}
              franchises={formData.franchises}
              setFranchises={(newFranchises) => setFormData({ ...formData, franchises: newFranchises })}
            />
          </Grid>
        </Grid>
      </Paper>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isSubmitting}
          sx={{ mt: 2 }}
        >
          {isSubmitting ? "Enviando..." : "Enviar"}
        </Button>
      </Box>
      {errors.length > 0 && (
        <Box sx={{ mt: 2 }}>
          {errors.map((error, index) => (
            <Alert key={index} severity="error" sx={{ mb: 1 }}>
              {error}
            </Alert>
          ))}
        </Box>
      )}
    </form>
  );
};

export default AddGameFormV2;
