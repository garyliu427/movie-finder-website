// Provided by Hayden Smith in COMP6080
export const fileToDataUrl = (file) => {
  const validFileTypes = ["image/jpeg", "image/png", "image/jpg"];
  const valid = validFileTypes.find((type) => type === file.type);
  if (!valid) {
    throw Error("provided file is not a png, jpg or jpeg image.");
  }

  const reader = new FileReader();
  const dataUrlPromise = new Promise((resolve, reject) => {
    reader.onerror = reject;
    reader.onload = () => resolve(reader.result.split(",")[1]);
  });
  reader.readAsDataURL(file);
  return dataUrlPromise;
};

export const getBase64 = async (file) => {
  let base64Image;
  try {
    base64Image = await fileToDataUrl(file);
  } catch {
    base64Image = null;
  }
  return base64Image;
};

export const convertRuntime = (number) => {
  let time = number;
  let hours = Math.floor(time / 60);
  let minutes = time % 60;
  return hours + " h " + minutes + " m";
};

export const convertDate = (date) => {
  let newDate = new Date(date);
  let newDateLocale = newDate.toLocaleString();
  let formattedDate = newDateLocale.split(",")[0];
  return formattedDate;
};

export const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
};

export const deg2rad = (deg) => {
  return deg * (Math.PI / 180);
};
