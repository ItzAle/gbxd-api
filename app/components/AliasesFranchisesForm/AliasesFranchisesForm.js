import { TextField, Button, Box, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

const AliasesFranchisesForm = ({ aliases, setAliases, franchises, setFranchises }) => {
  // Asegurarse de que aliases y franchises sean siempre arrays
  const aliasesArray = Array.isArray(aliases) ? aliases : [aliases].filter(Boolean);
  const franchisesArray = Array.isArray(franchises) ? franchises : [franchises].filter(Boolean);

  const handleAddField = (setter, currentArray) => {
    setter([...currentArray, ""]);
  };

  const handleRemoveField = (index, setter, currentArray) => {
    setter(currentArray.filter((_, i) => i !== index));
  };

  const handleChange = (index, value, setter, currentArray) => {
    const newArray = [...currentArray];
    newArray[index] = value;
    setter(newArray);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Aliases
      </Typography>
      {aliasesArray.map((alias, index) => (
        <Box key={index} sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <TextField
            fullWidth
            value={alias}
            onChange={(e) => handleChange(index, e.target.value, setAliases, aliasesArray)}
            label={`Alias ${index + 1}`}
          />
          {index > 0 && (
            <Button
              onClick={() => handleRemoveField(index, setAliases, aliasesArray)}
              startIcon={<DeleteIcon />}
            >
              Remove
            </Button>
          )}
        </Box>
      ))}
      <Button
        onClick={() => handleAddField(setAliases, aliasesArray)}
        startIcon={<AddIcon />}
        sx={{ mb: 4 }}
      >
        Add Alias
      </Button>

      <Typography variant="h6" gutterBottom>
        Franchises
      </Typography>
      {franchisesArray.map((franchise, index) => (
        <Box key={index} sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <TextField
            fullWidth
            value={franchise}
            onChange={(e) => handleChange(index, e.target.value, setFranchises, franchisesArray)}
            label={`Franchise ${index + 1}`}
          />
          {index > 0 && (
            <Button
              onClick={() => handleRemoveField(index, setFranchises, franchisesArray)}
              startIcon={<DeleteIcon />}
            >
              Remove
            </Button>
          )}
        </Box>
      ))}
      <Button
        onClick={() => handleAddField(setFranchises, franchisesArray)}
        startIcon={<AddIcon />}
      >
        Add Franchise
      </Button>
    </Box>
  );
};

export default AliasesFranchisesForm;
