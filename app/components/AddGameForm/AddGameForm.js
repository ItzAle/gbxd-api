import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Typography,
  Box,
  Button,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Snackbar,
  Alert,
} from "@mui/material";
import BasicInfoForm from "../BasicInfoForm";
import GenrePlatformSelector from "../GenrePlatformSelector";
import ReviewInfo from "../ReviewInfo";
import StoreLinksForm from "../StoreLinksForm";
import DescriptionForm from "../DescriptionForm/DescriptionForm";

const steps = [
  "Basic Info",
  "Description",
  "Genres & Platforms",
  "Store Links",
  "Review",
];

const AddGameForm = ({
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
  const [activeStep, setActiveStep] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } else {
      setSnackbarOpen(true);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const validateStep = (step) => {
    switch (step) {
      case 0:
        return (
          formData.name &&
          formData.publisher &&
          formData.developer &&
          formData.releaseDate &&
          formData.coverImageUrl &&
          validateUrl(formData.coverImageUrl)
        );
      case 1:
        return formData.description.trim() !== "";
      case 2:
        return formData.genres.length > 0 && formData.platforms.length > 0;
      case 3:
        return true;
      default:
        return true;
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <BasicInfoForm
            formData={formData}
            setFormData={setFormData}
            validateUrl={validateUrl}
          />
        );
      case 1:
        return (
          <DescriptionForm formData={formData} setFormData={setFormData} />
        );
      case 2:
        return (
          <GenrePlatformSelector
            formData={formData}
            setFormData={setFormData}
            setShowGenresModal={setShowGenresModal}
            setShowPlatformsModal={setShowPlatformsModal}
          />
        );
      case 3:
        return <StoreLinksForm formData={formData} setFormData={setFormData} />;
      case 4:
        return <ReviewInfo formData={formData} />;
      default:
        return "Unknown step";
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Typography variant={isMobile ? "h4" : "h2"} gutterBottom>
        Add New Game
      </Typography>
      <Stepper
        activeStep={activeStep}
        orientation={isMobile ? "vertical" : "horizontal"}
      >
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Box sx={{ mt: 2, mb: 2 }}>{getStepContent(activeStep)}</Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          pt: 2,
        }}
      >
        <Button
          color="inherit"
          disabled={activeStep === 0}
          onClick={handleBack}
          sx={{ mr: isMobile ? 0 : 1, mb: isMobile ? 1 : 0 }}
        >
          Back
        </Button>
        <Box sx={{ flex: "1 1 auto" }} />
        <Button
          onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
          variant="contained"
          disabled={isSubmitting}
          sx={{ width: isMobile ? "100%" : "auto" }}
        >
          {activeStep === steps.length - 1 ? "Submit" : "Next"}
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
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="warning"
          sx={{ width: "100%" }}
        >
          Please fill in all required fields before proceeding.
        </Alert>
      </Snackbar>
    </form>
  );
};

export default AddGameForm;
