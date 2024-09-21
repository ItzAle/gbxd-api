const JsonUploader = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorDetails, setErrorDetails] = useState([]);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Por favor, selecciona un archivo JSON");
      return;
    }

    setUploading(true);
    setMessage("");
    setErrorDetails([]);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload-json", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setMessage(result.message);
        if (result.errorDetails && result.errorDetails.length > 0) {
          setErrorDetails(result.errorDetails);
        }
      } else {
        throw new Error(result.error || "Error al subir el archivo");
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Subir archivo JSON
      </Typography>
      <input
        accept=".json"
        style={{ display: "none" }}
        id="raised-button-file"
        type="file"
        onChange={handleFileChange}
      />
      <label htmlFor="raised-button-file">
        <Button variant="contained" component="span">
          Seleccionar archivo JSON
        </Button>
      </label>
      {file && <Typography sx={{ mt: 2 }}>{file.name}</Typography>}
      <Button
        variant="contained"
        color="primary"
        onClick={handleUpload}
        disabled={!file || uploading}
        sx={{ mt: 2, ml: 2 }}
      >
        {uploading ? <CircularProgress size={24} /> : "Subir"}
      </Button>
      {message && (
        <Typography
          sx={{ mt: 2 }}
          color={message.startsWith("Error") ? "error" : "success"}
        >
          {message}
        </Typography>
      )}
      {errorDetails.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6">Errores detallados:</Typography>
          <List>
            {errorDetails.map((error, index) => (
              <ListItem key={index}>
                <ListItemText primary={error.name} secondary={error.error} />
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </Box>
  );
};
