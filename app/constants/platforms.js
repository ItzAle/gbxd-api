export const platformsByBrand = {
  Popular: [
    "PlayStation 5",
    "PlayStation 4",
    "Xbox Series X/S",
    "Xbox One",
    "Nintendo Switch",
    "PC",
    "Android",
    "iOS",
  ],
  PlayStation: [
    "PlayStation 5",
    "PlayStation 4",
    "PlayStation 3",
    "PlayStation 2",
    "PlayStation",
    "PlayStation Vita",
    "PlayStation Portable",
  ],
  Xbox: ["Xbox Series X/S", "Xbox One", "Xbox", "Xbox 360"],
  Nintendo: [
    "Nintendo Switch",
    "Nintendo Wii U",
    "Nintendo Wii",
    "Nintendo 3DS",
    "Nintendo DS",
  ],
  PC: ["PC", "Mac"],
  Mobile: ["Android", "iOS"],
  Other: ["Amazon Luna", "Oculus Quest", "HTC Vive", "Sega Dreamcast"],
};

export const getAllPlatforms = () => {
  return Object.values(platformsByBrand).flat();
};
