import api from "../api/api";

export async function search(query: string) {
  const response = await api.post("/search", {
    query,
  });

  return response.data;
}

export async function getScreenshot(filename: string) {
  const response = await api.get(`/screenshot/${filename}`);
  return response.data;
}
export async function getAllScreenshots() {
    const response = await api.get("/screenshots");
    return response.data;
}

export async function quickSync() {
    const response = await api.post("/sync");
    return response.data;
}

export async function getSettings() {
    const response = await api.get("/settings");
    return response.data;
}

export async function browseFolder() {
    const response = await api.get("/browse-folder");
    return response.data;
}

export async function saveFolder(folder: string) {
  const response = await api.post("/settings/folder", {
    folder,
  });

  return response.data;
}