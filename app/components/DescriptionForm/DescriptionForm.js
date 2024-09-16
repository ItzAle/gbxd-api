import { TextField } from "@mui/material";
import AliasesFranchisesForm from "../AliasesFranchisesForm/AliasesFranchisesForm";

const DescriptionForm = ({ formData, setFormData }) => {
  return (
    <>
      <TextField
        fullWidth
        label="Description"
        value={formData.description}
        onChange={(e) =>
          setFormData({ ...formData, description: e.target.value })
        }
        margin="normal"
        multiline
        rows={4}
        required
      />
      <AliasesFranchisesForm
        aliases={formData.aliases}
        setAliases={(newAliases) =>
          setFormData({ ...formData, aliases: newAliases })
        }
        franchises={formData.franchises}
        setFranchises={(newFranchises) =>
          setFormData({ ...formData, franchises: newFranchises })
        }
      />
    </>
  );
};

export default DescriptionForm;
