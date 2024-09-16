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
}) => {
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } else {
      console.error(
        "Por favor, complete todos los campos requeridos antes de continuar."
      );
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
        return true; // No hay validación específica para los enlaces de la tienda
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
    <Paper
      elevation={3}
      sx={{
        p: 4,
        background: "linear-gradient(145deg, #202020 0%, #2a2a2a 100%)",
        borderRadius: "12px",
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{ color: "primary.main", fontWeight: "bold" }}
      >
        Add a New Game
      </Typography>

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <form onSubmit={(e) => e.preventDefault()}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {getStepContent(activeStep)}
          </motion.div>
        </AnimatePresence>

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
          <Button
            onClick={handleBack}
            sx={{ mr: 1 }}
            disabled={activeStep === 0}
          >
            Back
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
            disabled={isSubmitting}
          >
            {activeStep === steps.length - 1 ? "Submit" : "Next"}
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default AddGameForm;
